import { z } from "zod";
import type { QuerySpec, QueryResult } from "../shared/types";
import type { Env } from "./env";
import { queryRows } from "./clickhouse";

export const querySchema = z
  .object({
    template: z.enum([
      "request_rate",
      "latency_heatmap",
      "trace_waterfall",
      "recent_logs",
      "error_rate",
    ]),
    from: z.iso.datetime({ offset: true }),
    to: z.iso.datetime({ offset: true }),
    service: z.string().min(1).max(256).optional(),
    traceId: z
      .string()
      .regex(/^[a-fA-F0-9]{32}$/)
      .optional(),
    limit: z.number().int().min(1).max(10000).default(1000),
  })
  .strict()
  .superRefine((q, ctx) => {
    if (Date.parse(q.from) >= Date.parse(q.to))
      ctx.addIssue({ code: "custom", message: "from must precede to" });
    if (Date.parse(q.to) - Date.parse(q.from) > 31 * 86400_000)
      ctx.addIssue({
        code: "custom",
        message: "Query window must be 31 days or less",
      });
    if (q.template === "trace_waterfall" && !q.traceId)
      ctx.addIssue({
        code: "custom",
        message: "traceId is required for a waterfall",
      });
  });
export const QUERY_TEMPLATES = [
  {
    id: "request_rate",
    title: "Request rate",
    visualization: "line",
    unit: "requests/s",
    description:
      "Root spans per second in one-minute buckets, grouped by service.",
  },
  {
    id: "latency_heatmap",
    title: "Latency distribution",
    visualization: "heatmap",
    unit: "ms",
    description: "Root spans in one-minute buckets and 50 ms latency buckets.",
  },
  {
    id: "trace_waterfall",
    title: "Trace waterfall",
    visualization: "waterfall",
    unit: "ms",
    description: "Every span in a trace, ordered by start time and span ID.",
  },
  {
    id: "recent_logs",
    title: "Recent logs",
    visualization: "table",
    description: "Logs ordered by timestamp and stable content fields.",
  },
  {
    id: "error_rate",
    title: "Error rate",
    visualization: "table",
    unit: "%",
    description:
      "Percentage of root spans with error status in the selected window.",
  },
] as const;
const filter = `Timestamp >= parseDateTime64BestEffort({from:String}, 9, 'UTC') AND Timestamp < parseDateTime64BestEffort({to:String}, 9, 'UTC') AND ({service:String} = '' OR ServiceName = {service:String})`;
const time = (field: string) =>
  `formatDateTime(${field}, '%Y-%m-%dT%H:%i:%S', 'UTC') || 'Z'`;
export function compileQuery(input: unknown): {
  query: QuerySpec;
  sql: string;
  parameters: Record<string, string | number>;
} {
  const parsed = querySchema.parse(input);
  const query = {
    ...parsed,
    from: new Date(parsed.from).toISOString(),
    to: new Date(parsed.to).toISOString(),
    ...(parsed.traceId ? { traceId: parsed.traceId.toLowerCase() } : {}),
  };
  const parameters: Record<string, string | number> = {
    from: query.from,
    to: query.to,
    service: query.service || "",
    limit: (query.limit || 1000) + 1,
  };
  let sql: string;
  switch (query.template) {
    case "request_rate":
      sql = `SELECT ${time("toStartOfMinute(Timestamp)")} AS time, ServiceName AS service, count() / 60.0 AS value FROM otel_traces WHERE ${filter} AND ParentSpanId = '' GROUP BY time, service ORDER BY time, service LIMIT {limit:UInt32}`;
      break;
    case "latency_heatmap":
      sql = `SELECT ${time("toStartOfMinute(Timestamp)")} AS time, floor(Duration / 50000000) * 50 AS bucket, count() AS count FROM otel_traces WHERE ${filter} AND ParentSpanId = '' GROUP BY time, bucket ORDER BY time, bucket LIMIT {limit:UInt32}`;
      break;
    case "trace_waterfall":
      parameters.traceId = query.traceId!;
      sql = `SELECT SpanId AS spanId, ParentSpanId AS parentSpanId, SpanName AS name, ServiceName AS service, toString(Timestamp, 'UTC') AS startTime, Duration / 1000000.0 AS durationMs, StatusCode AS status FROM otel_traces WHERE ${filter} AND TraceId = {traceId:String} ORDER BY Timestamp, SpanId, ServiceName, SpanName, Duration, ParentSpanId, StatusCode LIMIT {limit:UInt32}`;
      break;
    case "recent_logs":
      sql = `SELECT toString(Timestamp, 'UTC') AS timestamp, ServiceName AS service, SeverityText AS severity, Body AS body, TraceId AS traceId FROM otel_logs WHERE ${filter} ORDER BY Timestamp DESC, ServiceName, SeverityText, Body, TraceId, SpanId LIMIT {limit:UInt32}`;
      break;
    case "error_rate":
      sql = `SELECT if(count() = 0, 0., countIf(StatusCode = 'Error') * 100.0 / count()) AS value, countIf(StatusCode = 'Error') AS errors, count() AS total FROM otel_traces WHERE ${filter} AND ParentSpanId = ''`;
      break;
  }
  return { query, sql, parameters };
}
export async function runQuery(
  env: Env,
  input: QuerySpec,
): Promise<QueryResult> {
  const compiled = compileQuery(input);
  const result = await queryRows(env, compiled.sql, compiled.parameters);
  const limit = compiled.query.limit || 1000;
  return {
    ...compiled,
    columns: result.columns,
    rows: result.rows.slice(0, limit),
    executedAt: new Date().toISOString(),
    truncated: result.rows.length > limit,
  };
}
