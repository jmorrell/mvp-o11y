export type VisualizationKind = "line" | "waterfall" | "heatmap" | "table";
export type SqlParameters = Record<string, string | number>;
export interface PresetQuerySpec {
  template:
    | "request_rate"
    | "latency_heatmap"
    | "trace_waterfall"
    | "recent_logs"
    | "error_rate";
  from: string;
  to: string;
  service?: string;
  traceId?: string;
  limit?: number;
}
export interface SqlQuerySpec {
  sql: string;
  parameters?: SqlParameters;
  limit?: number;
}
export type QuerySpec = PresetQuerySpec | SqlQuerySpec;
export function isSqlQuery(query: QuerySpec): query is SqlQuerySpec {
  return "sql" in query;
}
export interface VisualizationMapping {
  time?: string;
  value?: string;
  series?: string;
  bucket?: string;
  count?: string;
  spanId?: string;
  parentSpanId?: string;
  name?: string;
  service?: string;
  startTime?: string;
  durationMs?: string;
  status?: string;
  timeBucketMs?: number;
  valueBucketSize?: number;
}
export interface QueryResult {
  query: QuerySpec;
  sql: string;
  parameters: SqlParameters;
  columns: string[];
  rows: Record<string, unknown>[];
  executedAt: string;
  truncated: boolean;
}
export interface Snapshot extends QueryResult {
  version: 1;
  id: string;
  title: string;
  visualization: VisualizationKind;
  mapping?: VisualizationMapping;
  createdAt: string;
  url: string;
  sha256: string;
}
export interface AlertInput {
  name: string;
  template?: "error_rate" | "request_rate";
  sql?: string;
  parameters?: SqlParameters;
  valueColumn?: string;
  service?: string;
  windowMinutes: number;
  threshold: number;
  comparison: "gt" | "gte" | "lt" | "lte";
  webhookUrl: string;
  cooldownMinutes: number;
  enabled: boolean;
}
export interface AlertRule extends AlertInput {
  id: string;
  createdAt: string;
  lastEvaluatedAt?: string;
  lastTriggeredAt?: string;
}
