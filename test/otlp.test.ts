import { describe, expect, it } from "vitest";
import protobuf from "protobufjs/light";
import descriptor from "../src/worker/otlp-proto.json";
import { decodeOtlp, normalizeOtlp, type OtlpSignal } from "../src/worker/otlp";

const traceId = "00112233445566778899aabbccddeeff";
const spanId = "0123456789abcdef";
const attributes = [
  { key: "service.name", value: { stringValue: "checkout" } },
];
const time = "1791676800123456789";
const trace = {
  resourceSpans: [
    {
      resource: { attributes },
      scopeSpans: [
        {
          scope: { name: "test" },
          spans: [
            {
              traceId,
              spanId,
              name: "POST /checkout",
              kind: 2,
              startTimeUnixNano: time,
              endTimeUnixNano: "1791676800123456912",
              status: { code: 2, message: "unavailable" },
              events: [
                {
                  timeUnixNano: "1791676800123456800",
                  name: "retry",
                  attributes: [{ key: "attempt", value: { intValue: "2" } }],
                },
              ],
              links: [{ traceId, spanId }],
            },
          ],
        },
      ],
    },
  ],
};
const logs = {
  resourceLogs: [
    {
      resource: { attributes },
      schemaUrl: "resource",
      scopeLogs: [
        {
          schemaUrl: "scope",
          scope: {
            name: "test",
            attributes: [{ key: "scope", value: { boolValue: true } }],
          },
          logRecords: [
            {
              observedTimeUnixNano: time,
              severityNumber: 17,
              severityText: "ERROR",
              flags: 257,
              traceId,
              spanId,
              body: {
                kvlistValue: {
                  values: [
                    {
                      key: "large",
                      value: { intValue: "9223372036854775807" },
                    },
                    {
                      key: "detail",
                      value: { arrayValue: { values: [{ boolValue: false }] } },
                    },
                  ],
                },
              },
              eventName: "checkout.failed",
            },
          ],
        },
      ],
    },
  ],
};

function metrics(entries: unknown[]) {
  return {
    resourceMetrics: [
      {
        resource: { attributes },
        scopeMetrics: [{ scope: { name: "meter" }, metrics: entries }],
      },
    ],
  };
}

describe("ClickStack OTLP mapping", () => {
  it("preserves nanosecond trace timestamps, durations, events, IDs, and enums", () => {
    const row = normalizeOtlp("traces", trace).otel_traces[0];
    expect(row).toMatchObject({
      Timestamp: "2026-10-11 00:00:00.123456789",
      Duration: "123",
      TraceId: traceId,
      SpanId: spanId,
      ParentSpanId: "",
      SpanKind: "Server",
      StatusCode: "Error",
      ServiceName: "checkout",
      ScopeName: "test",
      "Events.Timestamp": ["2026-10-11 00:00:00.123456800"],
      "Events.Attributes": [{ attempt: "2" }],
      "Links.TraceId": [traceId],
    });
  });

  it("uses observed log time, preserves structured bodies and scope attrs, and masks trace flags", () => {
    expect(normalizeOtlp("logs", logs).otel_logs[0]).toMatchObject({
      Timestamp: "2026-10-11 00:00:00.123456789",
      Body: '{"large":9223372036854775807,"detail":[false]}',
      ScopeAttributes: { scope: "true" },
      ResourceSchemaUrl: "resource",
      ScopeSchemaUrl: "scope",
      EventName: "checkout.failed",
      TraceFlags: 1,
      SeverityNumber: 17,
    });
  });

  it("writes all five ClickStack metrics tables with exemplars and correct UInt64 values", () => {
    const p = {
      timeUnixNano: time,
      startTimeUnixNano: "1791676799000000000",
      attributes: [{ key: "region", value: { stringValue: "iad" } }],
    };
    const rows = normalizeOtlp(
      "metrics",
      metrics([
        {
          name: "g",
          gauge: {
            dataPoints: [
              {
                ...p,
                asDouble: 42,
                exemplars: [
                  { timeUnixNano: time, asDouble: 41, traceId, spanId },
                ],
              },
            ],
          },
        },
        {
          name: "s",
          sum: {
            aggregationTemporality: 2,
            isMonotonic: true,
            dataPoints: [{ ...p, asInt: "9007199254740993" }],
          },
        },
        {
          name: "h",
          histogram: {
            aggregationTemporality: 1,
            dataPoints: [
              {
                ...p,
                count: "3",
                sum: 12,
                bucketCounts: ["1", "2"],
                explicitBounds: [5],
              },
            ],
          },
        },
        {
          name: "e",
          exponentialHistogram: {
            aggregationTemporality: 2,
            dataPoints: [
              {
                ...p,
                count: "9007199254740993",
                scale: -2,
                zeroCount: "1",
                positive: { offset: -1, bucketCounts: ["9007199254740992"] },
                negative: { offset: 1, bucketCounts: [] },
              },
            ],
          },
        },
        {
          name: "q",
          summary: {
            dataPoints: [
              {
                ...p,
                count: "2",
                sum: 6,
                quantileValues: [{ quantile: 0.5, value: 3 }],
              },
            ],
          },
        },
      ]),
    );
    expect(Object.keys(rows)).toEqual([
      "otel_metrics_gauge",
      "otel_metrics_sum",
      "otel_metrics_histogram",
      "otel_metrics_exponential_histogram",
      "otel_metrics_summary",
    ]);
    expect(rows.otel_metrics_gauge[0]).toMatchObject({
      TimeUnix: "2026-10-11 00:00:00",
      "Exemplars.TraceId": [traceId],
      Value: 42,
    });
    expect(rows.otel_metrics_sum[0]).toMatchObject({
      Value: "9007199254740993",
      AggregationTemporality: 2,
      IsMonotonic: true,
    });
    expect(rows.otel_metrics_histogram[0]).toMatchObject({
      Count: "3",
      BucketCounts: ["1", "2"],
      ExplicitBounds: [5],
      Min: 0,
      Max: 0,
    });
    expect(rows.otel_metrics_exponential_histogram[0]).toMatchObject({
      Count: "9007199254740993",
      Scale: -2,
      PositiveOffset: -1,
      PositiveBucketCounts: ["9007199254740992"],
    });
    expect(rows.otel_metrics_summary[0]).toMatchObject({
      "ValueAtQuantiles.Quantile": [0.5],
      "ValueAtQuantiles.Value": [3],
    });
  });

  it("does not silently accept malformed or unsupported metric types", () => {
    expect(() =>
      normalizeOtlp("metrics", metrics([{ name: "missing" }])),
    ).toThrow("exactly one");
    expect(() =>
      normalizeOtlp("metrics", metrics([{ gauge: {}, sum: {} }])),
    ).toThrow("exactly one");
    expect(() =>
      normalizeOtlp(
        "metrics",
        metrics([
          {
            histogram: {
              dataPoints: [
                { count: "4", bucketCounts: ["1", "2"], explicitBounds: [2] },
              ],
            },
          },
        ]),
      ),
    ).toThrow("sum to count");
    expect(() => normalizeOtlp("logs", { resourceLogs: "invalid" })).toThrow(
      "array",
    );
    expect(() => normalizeOtlp("traces", logs)).toThrow("resourceSpans");
    expect(() =>
      normalizeOtlp(
        "metrics",
        metrics([
          {
            exponentialHistogram: {
              dataPoints: [
                {
                  count: "4",
                  zeroCount: "1",
                  positive: { bucketCounts: ["2"] },
                },
              ],
            },
          },
        ]),
      ),
    ).toThrow("sum to count");
  });

  it("rejects unsupported profile envelopes and unresolved profile attribute references", () => {
    expect(() => normalizeOtlp("traces", { resourceProfiles: [{}] })).toThrow(
      "resourceSpans",
    );
    const withBody = (body: unknown) => ({
      resourceLogs: [{ scopeLogs: [{ logRecords: [{ body }] }] }],
    });
    expect(() =>
      normalizeOtlp("logs", withBody({ stringValueStrindex: 1 })),
    ).toThrow("OTLP profiles");
    expect(() =>
      normalizeOtlp(
        "logs",
        withBody({
          kvlistValue: {
            values: [{ keyStrindex: 1, value: { stringValue: "data" } }],
          },
        }),
      ),
    ).toThrow("OTLP profiles");
  });

  it("rejects invalid IDs, imprecise integer numbers, reversed spans and dates outside ClickHouse range", () => {
    const bad = structuredClone(trace);
    bad.resourceSpans[0].scopeSpans[0].spans[0].traceId = "invalid";
    expect(() => normalizeOtlp("traces", bad)).toThrow("hexadecimal");
    expect(() =>
      normalizeOtlp(
        "metrics",
        metrics([{ gauge: { dataPoints: [{ asInt: 9007199254740992 }] } }]),
      ),
    ).toThrow("decimal string");
    const reversed = structuredClone(trace);
    reversed.resourceSpans[0].scopeSpans[0].spans[0].endTimeUnixNano = "1";
    expect(() => normalizeOtlp("traces", reversed)).toThrow("precedes");
    expect(() =>
      normalizeOtlp("logs", {
        resourceLogs: [
          {
            scopeLogs: [
              { logRecords: [{ timeUnixNano: "18446744073709551615" }] },
            ],
          },
        ],
      }),
    ).toThrow("DateTime64");
  });

  it("accepts empty requests and produces deterministic missing-field defaults", () => {
    for (const signal of ["traces", "logs", "metrics"] as OtlpSignal[])
      expect(normalizeOtlp(signal, {})).toEqual({});
    const emptyLog = { resourceLogs: [{ scopeLogs: [{ logRecords: [{}] }] }] };
    expect(normalizeOtlp("logs", emptyLog).otel_logs[0].Timestamp).toBe(
      "1970-01-01 00:00:00.000000000",
    );
    expect(normalizeOtlp("logs", emptyLog)).toEqual(
      normalizeOtlp("logs", emptyLog),
    );
  });

  it("keeps attribute keys such as __proto__ as data", () => {
    const data = {
      resourceLogs: [
        {
          resource: {
            attributes: [{ key: "__proto__", value: { stringValue: "safe" } }],
          },
          scopeLogs: [{ logRecords: [{}] }],
        },
      ],
    };
    expect(
      JSON.stringify(
        normalizeOtlp("logs", data).otel_logs[0].ResourceAttributes,
      ),
    ).toBe('{"__proto__":"safe"}');
  });
});

describe("OTLP HTTP encodings", () => {
  const root = protobuf.Root.fromJSON(descriptor as protobuf.INamespace);
  it("decodes official protobuf with lossless 64-bit timestamps and byte IDs", async () => {
    const type = root.lookupType(
      "opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest",
    );
    const protobufTrace = structuredClone(trace) as any;
    const s = protobufTrace.resourceSpans[0].scopeSpans[0].spans[0];
    s.traceId = Buffer.from(traceId, "hex");
    s.spanId = Buffer.from(spanId, "hex");
    s.links[0].traceId = Buffer.from(traceId, "hex");
    s.links[0].spanId = Buffer.from(spanId, "hex");
    const body = type.encode(type.fromObject(protobufTrace)).finish();
    const decoded = await decodeOtlp("traces", body, "application/x-protobuf");
    expect(normalizeOtlp("traces", decoded)).toEqual(
      normalizeOtlp("traces", trace),
    );
  });

  it("decodes protobuf log bodies and all metric number special values", async () => {
    const type = root.lookupType(
      "opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest",
    );
    const body = type
      .encode(
        type.fromObject({
          resourceLogs: [
            {
              scopeLogs: [
                {
                  logRecords: [
                    {
                      timeUnixNano: time,
                      body: { bytesValue: Buffer.from([1, 2, 3]) },
                    },
                  ],
                },
              ],
            },
          ],
        }),
      )
      .finish();
    expect(
      normalizeOtlp(
        "logs",
        await decodeOtlp("logs", body, "application/x-protobuf"),
      ).otel_logs[0].Body,
    ).toBe("AQID");
    const metricType = root.lookupType(
      "opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest",
    );
    const metricBody = metricType
      .encode(
        metricType.fromObject(
          metrics([
            { name: "g", gauge: { dataPoints: [{ asDouble: Infinity }] } },
          ]),
        ),
      )
      .finish();
    expect(
      normalizeOtlp(
        "metrics",
        await decodeOtlp("metrics", metricBody, "application/x-protobuf"),
      ).otel_metrics_gauge[0].Value,
    ).toBe("Infinity");
  });

  it("decodes JSON with content-type parameters and rejects invalid formats", async () => {
    expect(
      await decodeOtlp(
        "traces",
        new TextEncoder().encode(JSON.stringify(trace)),
        "application/json; charset=utf-8",
      ),
    ).toEqual(trace);
    await expect(
      decodeOtlp("logs", Uint8Array.of(255), "application/json"),
    ).rejects.toThrow("Invalid OTLP JSON");
    await expect(
      decodeOtlp("logs", Uint8Array.of(10, 128), "application/x-protobuf"),
    ).rejects.toThrow("Invalid OTLP protobuf");
    await expect(
      decodeOtlp("logs", new Uint8Array(), "text/plain"),
    ).rejects.toThrow("Expected");
  });
});
