import type {
  PresetQuerySpec,
  SqlParameters,
  SqlQuerySpec,
  VisualizationKind,
  VisualizationMapping,
} from "../shared/types";

const windowFilter = `Timestamp >= parseDateTime64BestEffort({from:String}, 9, 'UTC')
  AND Timestamp < parseDateTime64BestEffort({to:String}, 9, 'UTC')`;
const serviceFilter = `({service:String} = '' OR ServiceName = {service:String})`;

export const alertSql = `SELECT count() AS value
FROM otel_traces
WHERE ${windowFilter}
  AND ParentSpanId = ''`;

/** Examples are editable SQL, with fixed parameter values captured when loaded. */
export function sqlExample(template: PresetQuerySpec["template"]): {
  query: SqlQuerySpec;
  kind: VisualizationKind;
  mapping: VisualizationMapping;
} {
  const parameters: SqlParameters = {
    from: new Date(Date.now() - 3600000).toISOString(),
    to: new Date().toISOString(),
    service: "",
  };
  const where = `${windowFilter}\n  AND ${serviceFilter}`;
  let sql: string;
  let kind: VisualizationKind;
  let mapping: VisualizationMapping = {};
  switch (template) {
    case "request_rate":
      kind = "line";
      mapping = {
        time: "time",
        value: "value",
        series: "service",
        timeBucketMs: 60000,
      };
      sql = `SELECT toStartOfMinute(Timestamp) AS time,
       ServiceName AS service, count() / 60.0 AS value
FROM otel_traces
WHERE ${where}
  AND ParentSpanId = ''
GROUP BY time, service
ORDER BY time, service`;
      break;
    case "latency_heatmap":
      kind = "heatmap";
      mapping = {
        time: "time",
        bucket: "bucket",
        count: "count",
        timeBucketMs: 60000,
        valueBucketSize: 50,
      };
      sql = `SELECT toStartOfMinute(Timestamp) AS time,
       floor(Duration / 50000000) * 50 AS bucket, count() AS count
FROM otel_traces
WHERE ${where}
  AND ParentSpanId = ''
GROUP BY time, bucket
ORDER BY time, bucket`;
      break;
    case "trace_waterfall":
      kind = "waterfall";
      parameters.traceId = "";
      sql = `SELECT SpanId AS spanId, ParentSpanId AS parentSpanId,
       SpanName AS name, ServiceName AS service,
       toString(Timestamp, 'UTC') AS startTime,
       Duration / 1000000.0 AS durationMs, StatusCode AS status
FROM otel_traces
WHERE ${where}
  AND TraceId = {traceId:String}
ORDER BY Timestamp, SpanId, ServiceName, SpanName, Duration, ParentSpanId, StatusCode`;
      break;
    case "recent_logs":
      kind = "table";
      sql = `SELECT Timestamp, ServiceName, SeverityText, Body, TraceId
FROM otel_logs
WHERE ${where}
ORDER BY Timestamp DESC, ServiceName, SeverityText, Body, TraceId, SpanId`;
      break;
    case "error_rate":
      kind = "table";
      sql = `SELECT if(count() = 0, 0., countIf(StatusCode = 'Error') * 100.0 / count()) AS value,
       countIf(StatusCode = 'Error') AS errors, count() AS total
FROM otel_traces
WHERE ${where}
  AND ParentSpanId = ''`;
  }
  return { query: { sql, parameters, limit: 1000 }, kind, mapping };
}

export function parseParameters(text: string): SqlParameters {
  let value: unknown;
  try {
    value = JSON.parse(text || "{}");
  } catch {
    throw new Error("Parameters must be a valid JSON object.");
  }
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    !Object.values(value).every(
      (item) =>
        typeof item === "string" ||
        (typeof item === "number" && Number.isFinite(item)),
    )
  )
    throw new Error(
      "Parameter values must be strings or numbers in a JSON object.",
    );
  return value as SqlParameters;
}
