import { opentelemetry } from "./otlp-proto.js";

export type OtlpSignal = "traces" | "logs" | "metrics";
export type OtlpRows = Record<string, Record<string, unknown>[]>;
type Obj = Record<string, unknown>;
const requests = {
  traces: opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest,
  logs: opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest,
  metrics: opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest,
};

/** Decode OTLP/HTTP. Decompression and request size limits belong to the HTTP handler. */
export async function decodeOtlp(
  signal: OtlpSignal,
  bytes: Uint8Array,
  contentType: string,
): Promise<unknown> {
  const type = contentType.split(";")[0]?.trim().toLowerCase();
  if (type === "application/json") {
    try {
      return JSON.parse(
        new TextDecoder("utf-8", { fatal: true }).decode(bytes),
      );
    } catch {
      throw new Error("Invalid OTLP JSON body");
    }
  }
  if (type !== "application/x-protobuf")
    throw new Error("Expected application/json or application/x-protobuf");
  try {
    const options = { longs: String, bytes: Uint8Array, defaults: false };
    switch (signal) {
      case "traces":
        return requests.traces.toObject(requests.traces.decode(bytes), options);
      case "logs":
        return requests.logs.toObject(requests.logs.decode(bytes), options);
      case "metrics":
        return requests.metrics.toObject(
          requests.metrics.decode(bytes),
          options,
        );
    }
  } catch {
    throw new Error("Invalid OTLP protobuf body");
  }
}

function obj(value: unknown, name: string): Obj {
  if (value === undefined) return {};
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new Error(`${name} must be an object`);
  return value as Obj;
}
function array(value: unknown, name: string): unknown[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new Error(`${name} must be an array`);
  return value;
}
function str(value: unknown, name: string): string {
  if (value === undefined) return "";
  if (typeof value !== "string") throw new Error(`${name} must be a string`);
  return value;
}
function integer(
  value: unknown,
  name: string,
  signed = false,
  bits = 64,
): bigint {
  if (value === undefined) return 0n;
  if (typeof value === "number" && !Number.isSafeInteger(value))
    throw new Error(`${name} must use a decimal string for a 64-bit integer`);
  if (
    (typeof value !== "string" && typeof value !== "number") ||
    !/^-?\d+$/.test(String(value))
  )
    throw new Error(`${name} must be an integer`);
  const n = BigInt(value);
  const upper = (1n << BigInt(signed ? bits - 1 : bits)) - 1n;
  const lower = signed ? -(1n << BigInt(bits - 1)) : 0n;
  if (n < lower || n > upper)
    throw new Error(
      `${name} is outside the ${signed ? "Int" : "UInt"}${bits} range`,
    );
  return n;
}
function int32(value: unknown, name: string, signed = false): number {
  return Number(integer(value, name, signed, 32));
}
function float(value: unknown, name: string): number | string {
  if (value === undefined) return 0;
  if (value === "NaN" || value === "Infinity" || value === "-Infinity")
    return value;
  if (typeof value !== "number")
    throw new Error(
      `${name} must be a number or an OTLP non-finite number string`,
    );
  if (!Number.isFinite(value)) return String(value);
  return value;
}
function bool(value: unknown, name: string): boolean {
  if (value === undefined) return false;
  if (typeof value !== "boolean") throw new Error(`${name} must be a boolean`);
  return value;
}
function bytes(value: unknown, name: string): string {
  if (value instanceof Uint8Array)
    return btoa(Array.from(value, (b) => String.fromCharCode(b)).join(""));
  const text = str(value, name);
  try {
    atob(text);
  } catch {
    throw new Error(`${name} must contain base64 bytes`);
  }
  return text;
}
function id(value: unknown, size: number, name: string): string {
  const text =
    value instanceof Uint8Array
      ? Array.from(value, (b) => b.toString(16).padStart(2, "0")).join("")
      : str(value, name);
  if (text === "") return "";
  if (text.length !== size * 2 || !/^[a-f\d]+$/i.test(text))
    throw new Error(`${name} must be ${size * 2} hexadecimal characters`);
  return /^0+$/.test(text) ? "" : text.toLowerCase();
}

// BigInt avoids rounding nanosecond timestamps before formatting ClickHouse's native datetime strings.
function timestamp(value: unknown, name: string, nanos = true): string {
  const n = integer(value, name);
  if (nanos && n > 9223372036854775807n)
    throw new Error(`${name} exceeds ClickHouse DateTime64(9)`);
  const seconds = n / 1_000_000_000n;
  if (!nanos && seconds > 4294967295n)
    throw new Error(`${name} exceeds ClickHouse DateTime`);
  const date = new Date(Number(seconds) * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  return nanos
    ? `${date}.${(n % 1_000_000_000n).toString().padStart(9, "0")}`
    : date;
}

function rawValue(input: unknown, depth = 0): unknown {
  if (depth > 32)
    throw new Error("OTLP attributes exceed 32 levels of nesting");
  const v = obj(input, "AnyValue");
  if (v.stringValueStrindex !== undefined)
    throw new Error(
      "String table references are only supported by OTLP profiles",
    );
  const keys = [
    "stringValue",
    "boolValue",
    "intValue",
    "doubleValue",
    "arrayValue",
    "kvlistValue",
    "bytesValue",
  ].filter((k) => v[k] !== undefined);
  if (keys.length > 1) throw new Error("AnyValue must set only one value");
  switch (keys[0]) {
    case "stringValue":
      return str(v.stringValue, "stringValue");
    case "boolValue":
      return bool(v.boolValue, "boolValue");
    case "intValue":
      return integer(v.intValue, "intValue", true);
    case "doubleValue":
      return float(v.doubleValue, "doubleValue");
    case "bytesValue":
      return bytes(v.bytesValue, "bytesValue");
    case "arrayValue":
      return array(
        obj(v.arrayValue, "arrayValue").values,
        "arrayValue.values",
      ).map((x) => rawValue(x, depth + 1));
    case "kvlistValue":
      return Object.fromEntries(
        array(
          obj(v.kvlistValue, "kvlistValue").values,
          "kvlistValue.values",
        ).map((x) => {
          const kv = obj(x, "KeyValue");
          if (kv.keyStrindex !== undefined)
            throw new Error(
              "String table references are only supported by OTLP profiles",
            );
          return [str(kv.key, "key"), rawValue(kv.value, depth + 1)];
        }),
      );
    default:
      return null;
  }
}
function jsonValue(value: unknown): string {
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return `[${value.map(jsonValue).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.entries(value)
      .map(([k, v]) => `${JSON.stringify(k)}:${jsonValue(v)}`)
      .join(",")}}`;
  return JSON.stringify(value) ?? "null";
}
function valueString(input: unknown): string {
  const value = rawValue(input);
  if (value === null) return "";
  if (typeof value === "object") return jsonValue(value);
  return String(value);
}
function attributes(input: unknown): Record<string, string> {
  return Object.fromEntries(
    array(input, "attributes").map((x) => {
      const kv = obj(x, "KeyValue");
      if (kv.keyStrindex !== undefined)
        throw new Error(
          "String table references are only supported by OTLP profiles",
        );
      return [str(kv.key, "attribute key"), valueString(kv.value)];
    }),
  );
}
function numberPoint(point: Obj): number | string {
  if (point.asInt !== undefined && point.asDouble !== undefined)
    throw new Error("NumberDataPoint sets both asInt and asDouble");
  if (point.asInt !== undefined)
    return integer(point.asInt, "asInt", true).toString();
  return float(point.asDouble, "asDouble");
}
function exemplars(input: unknown): Obj {
  const points = array(input, "exemplars").map((x) => obj(x, "exemplar"));
  return {
    "Exemplars.FilteredAttributes": points.map((p) =>
      attributes(p.filteredAttributes),
    ),
    "Exemplars.TimeUnix": points.map((p) =>
      timestamp(p.timeUnixNano, "exemplar.timeUnixNano", false),
    ),
    "Exemplars.Value": points.map(numberPoint),
    "Exemplars.SpanId": points.map((p) => id(p.spanId, 8, "exemplar.spanId")),
    "Exemplars.TraceId": points.map((p) =>
      id(p.traceId, 16, "exemplar.traceId"),
    ),
  };
}

/** Map OTLP to ClickStack's pinned Map-based schema, returning only populated tables. */
export function normalizeOtlp(signal: OtlpSignal, payload: unknown): OtlpRows {
  const result: OtlpRows = {};
  const add = (table: string, row: Obj) => {
    (result[table] ??= []).push(row);
  };
  const data = obj(payload, "OTLP request");
  const resourceKey = {
    traces: "resourceSpans",
    logs: "resourceLogs",
    metrics: "resourceMetrics",
  }[signal];
  if (Object.keys(data).length && data[resourceKey] === undefined)
    throw new Error(`OTLP ${signal} request must contain ${resourceKey}`);
  for (const input of array(data[resourceKey], resourceKey)) {
    const resourceGroup = obj(input, resourceKey);
    const resource = obj(resourceGroup.resource, "resource");
    const ResourceAttributes = attributes(resource.attributes);
    const ServiceName = ResourceAttributes["service.name"] ?? "";
    const scopeKey = {
      traces: "scopeSpans",
      logs: "scopeLogs",
      metrics: "scopeMetrics",
    }[signal];
    for (const scoped of array(resourceGroup[scopeKey], scopeKey)) {
      const group = obj(scoped, scopeKey);
      const scope = obj(group.scope, "scope");
      const common = {
        ResourceAttributes,
        ServiceName,
        ScopeName: str(scope.name, "scope.name"),
        ScopeVersion: str(scope.version, "scope.version"),
      };
      if (signal === "traces") {
        for (const inputSpan of array(group.spans, "spans")) {
          const s = obj(inputSpan, "span");
          const start = integer(s.startTimeUnixNano, "startTimeUnixNano");
          const end = integer(s.endTimeUnixNano, "endTimeUnixNano");
          if (end < start)
            throw new Error("Span endTimeUnixNano precedes startTimeUnixNano");
          const status = obj(s.status, "status");
          const kind = int32(s.kind, "span.kind");
          const code = int32(status.code, "status.code");
          if (kind > 5 || code > 2)
            throw new Error("Invalid span kind or status code");
          const events = array(s.events, "events").map((x) => obj(x, "event"));
          const links = array(s.links, "links").map((x) => obj(x, "link"));
          add("otel_traces", {
            ...common,
            Timestamp: timestamp(s.startTimeUnixNano, "startTimeUnixNano"),
            TraceId: id(s.traceId, 16, "traceId"),
            SpanId: id(s.spanId, 8, "spanId"),
            ParentSpanId: id(s.parentSpanId, 8, "parentSpanId"),
            TraceState: str(s.traceState, "traceState"),
            SpanName: str(s.name, "span.name"),
            SpanKind: [
              "Unspecified",
              "Internal",
              "Server",
              "Client",
              "Producer",
              "Consumer",
            ][kind],
            SpanAttributes: attributes(s.attributes),
            Duration: (end - start).toString(),
            StatusCode: ["Unset", "Ok", "Error"][code],
            StatusMessage: str(status.message, "status.message"),
            "Events.Timestamp": events.map((e) =>
              timestamp(e.timeUnixNano, "event.timeUnixNano"),
            ),
            "Events.Name": events.map((e) => str(e.name, "event.name")),
            "Events.Attributes": events.map((e) => attributes(e.attributes)),
            "Links.TraceId": links.map((l) =>
              id(l.traceId, 16, "link.traceId"),
            ),
            "Links.SpanId": links.map((l) => id(l.spanId, 8, "link.spanId")),
            "Links.TraceState": links.map((l) =>
              str(l.traceState, "link.traceState"),
            ),
            "Links.Attributes": links.map((l) => attributes(l.attributes)),
          });
        }
      } else if (signal === "logs") {
        for (const inputLog of array(group.logRecords, "logRecords")) {
          const l = obj(inputLog, "logRecord");
          const severity = int32(l.severityNumber, "severityNumber");
          if (severity > 24)
            throw new Error("severityNumber must be between 0 and 24");
          add("otel_logs", {
            ...common,
            Timestamp: timestamp(
              integer(l.timeUnixNano, "timeUnixNano") === 0n
                ? l.observedTimeUnixNano
                : l.timeUnixNano,
              "log timestamp",
            ),
            TraceId: id(l.traceId, 16, "traceId"),
            SpanId: id(l.spanId, 8, "spanId"),
            TraceFlags: int32(l.flags, "flags") & 255,
            SeverityText: str(l.severityText, "severityText"),
            SeverityNumber: severity,
            Body: valueString(l.body),
            ResourceSchemaUrl: str(
              resourceGroup.schemaUrl,
              "resource schemaUrl",
            ),
            ScopeSchemaUrl: str(group.schemaUrl, "scope schemaUrl"),
            ScopeAttributes: attributes(scope.attributes),
            LogAttributes: attributes(l.attributes),
            EventName: str(l.eventName, "eventName"),
          });
        }
      } else {
        for (const inputMetric of array(group.metrics, "metrics")) {
          const metric = obj(inputMetric, "metric");
          const types = [
            "gauge",
            "sum",
            "histogram",
            "exponentialHistogram",
            "summary",
          ].filter((k) => metric[k] !== undefined);
          if (types.length !== 1)
            throw new Error(
              "Metric must contain exactly one supported data type",
            );
          const type = types[0]!;
          const m = obj(metric[type], type);
          const table = `otel_metrics_${type === "exponentialHistogram" ? "exponential_histogram" : type}`;
          for (const inputPoint of array(m.dataPoints, "dataPoints")) {
            const p = obj(inputPoint, "dataPoint");
            const row: Obj = {
              ...common,
              ResourceSchemaUrl: str(
                resourceGroup.schemaUrl,
                "resource schemaUrl",
              ),
              ScopeSchemaUrl: str(group.schemaUrl, "scope schemaUrl"),
              ScopeAttributes: attributes(scope.attributes),
              ScopeDroppedAttrCount: int32(
                scope.droppedAttributesCount,
                "droppedAttributesCount",
              ),
              MetricName: str(metric.name, "metric.name"),
              MetricDescription: str(metric.description, "metric.description"),
              MetricUnit: str(metric.unit, "metric.unit"),
              Attributes: attributes(p.attributes),
              StartTimeUnix: timestamp(
                p.startTimeUnixNano,
                "startTimeUnixNano",
                false,
              ),
              TimeUnix: timestamp(p.timeUnixNano, "timeUnixNano", false),
              Flags: int32(p.flags, "flags"),
            };
            if (type !== "summary") Object.assign(row, exemplars(p.exemplars));
            if (type === "gauge" || type === "sum") row.Value = numberPoint(p);
            if (
              type === "sum" ||
              type === "histogram" ||
              type === "exponentialHistogram"
            ) {
              row.AggregationTemporality = int32(
                m.aggregationTemporality,
                "aggregationTemporality",
              );
              if (Number(row.AggregationTemporality) > 2)
                throw new Error("Invalid aggregationTemporality");
            }
            if (type === "sum")
              row.IsMonotonic = bool(m.isMonotonic, "isMonotonic");
            if (
              type === "histogram" ||
              type === "exponentialHistogram" ||
              type === "summary"
            ) {
              row.Count = integer(p.count, "count").toString();
              row.Sum = float(p.sum, "sum");
            }
            if (type === "histogram" || type === "exponentialHistogram") {
              row.Min = float(p.min, "min");
              row.Max = float(p.max, "max");
            }
            if (type === "histogram") {
              row.BucketCounts = array(p.bucketCounts, "bucketCounts").map(
                (n) => integer(n, "bucketCount").toString(),
              );
              row.ExplicitBounds = array(
                p.explicitBounds,
                "explicitBounds",
              ).map((n) => float(n, "explicitBound"));
              const counts = row.BucketCounts as string[];
              const bounds = row.ExplicitBounds as number[];
              if (
                (counts.length && counts.length !== bounds.length + 1) ||
                (!counts.length && bounds.length)
              )
                throw new Error(
                  "Histogram bucketCounts must have one more entry than explicitBounds",
                );
              if (
                bounds.some(
                  (x, i) =>
                    !Number.isFinite(x) || (i > 0 && x <= bounds[i - 1]!),
                )
              )
                throw new Error(
                  "Histogram explicitBounds must be finite and increasing",
                );
              if (
                counts.length &&
                counts.reduce((sum, n) => sum + BigInt(n), 0n).toString() !==
                  row.Count
              )
                throw new Error("Histogram bucketCounts do not sum to count");
            }
            if (type === "exponentialHistogram") {
              row.Scale = int32(p.scale, "scale", true);
              row.ZeroCount = integer(p.zeroCount, "zeroCount").toString();
              for (const side of ["positive", "negative"] as const) {
                const buckets = obj(p[side], side);
                const title = side === "positive" ? "Positive" : "Negative";
                row[`${title}Offset`] = int32(
                  buckets.offset,
                  `${side}.offset`,
                  true,
                );
                row[`${title}BucketCounts`] = array(
                  buckets.bucketCounts,
                  `${side}.bucketCounts`,
                ).map((n) => integer(n, "bucketCount").toString());
              }
              const bucketCounts = [
                ...(row.PositiveBucketCounts as string[]),
                ...(row.NegativeBucketCounts as string[]),
              ];
              if (
                bucketCounts
                  .reduce(
                    (sum, n) => sum + BigInt(n),
                    BigInt(row.ZeroCount as string),
                  )
                  .toString() !== row.Count
              )
                throw new Error(
                  "Exponential histogram bucketCounts and zeroCount do not sum to count",
                );
            }
            if (type === "summary") {
              const quantiles = array(p.quantileValues, "quantileValues").map(
                (x) => obj(x, "quantileValue"),
              );
              row["ValueAtQuantiles.Quantile"] = quantiles.map((q) =>
                float(q.quantile, "quantile"),
              );
              row["ValueAtQuantiles.Value"] = quantiles.map((q) =>
                float(q.value, "quantile.value"),
              );
            }
            add(table, row);
          }
        }
      }
    }
  }
  return result;
}
