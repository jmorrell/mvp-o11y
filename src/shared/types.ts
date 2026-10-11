export type VisualizationKind = "line" | "waterfall" | "heatmap" | "table";
export interface QuerySpec {
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
export interface QueryResult {
  query: QuerySpec;
  sql: string;
  parameters: Record<string, string | number>;
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
  createdAt: string;
  url: string;
  sha256: string;
}
export interface AlertInput {
  name: string;
  template: "error_rate" | "request_rate";
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
