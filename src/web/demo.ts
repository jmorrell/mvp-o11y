import type { QueryResult, PresetQuerySpec } from "../shared/types";
export function previewResult(query: PresetQuerySpec): QueryResult {
  const from = new Date(query.from).valueOf(),
    to = new Date(query.to).valueOf();
  const time = (index: number) =>
    new Date(from + ((to - from) * index) / 60).toISOString();
  let rows: Record<string, unknown>[];
  if (query.template === "latency_heatmap")
    rows = Array.from({ length: 60 }, (_, i) =>
      [0, 50, 100, 150, 200, 250, 300].map((bin, j) => ({
        time: time(i),
        latency_bucket_ms: bin,
        count: Math.max(
          0,
          Math.round(
            (Math.sin(i * 0.45) + 1.6) * (70 - j * 9) - ((i * j) % 17),
          ),
        ),
      })),
    ).flat();
  else if (query.template === "trace_waterfall")
    rows = [
      {
        span_id: "a",
        parent_span_id: "",
        service: "api-gateway",
        span_name: "POST /checkout",
        duration_ms: 248,
        start_ms: from,
      },
      {
        span_id: "b",
        parent_span_id: "a",
        service: "auth",
        span_name: "validate session",
        duration_ms: 18,
        start_ms: from + 3,
      },
      {
        span_id: "c",
        parent_span_id: "a",
        service: "checkout",
        span_name: "create order",
        duration_ms: 216,
        start_ms: from + 24,
      },
      {
        span_id: "d",
        parent_span_id: "c",
        service: "database",
        span_name: "SELECT products",
        duration_ms: 37,
        start_ms: from + 29,
      },
      {
        span_id: "e",
        parent_span_id: "c",
        service: "payments",
        span_name: "authorize payment",
        duration_ms: 127,
        start_ms: from + 72,
      },
      {
        span_id: "f",
        parent_span_id: "c",
        service: "database",
        span_name: "INSERT orders",
        duration_ms: 23,
        start_ms: from + 205,
      },
    ];
  else if (query.template === "recent_logs")
    rows = Array.from({ length: 8 }, (_, i) => ({
      timestamp: time(60 - i),
      service: ["api-gateway", "checkout", "payments"][i % 3],
      severity: i === 3 ? "WARN" : "INFO",
      body: [
        "Request completed",
        "Order created",
        "Payment authorized",
        "Upstream response delayed",
      ][i % 4],
      trace_id: "a7d82c601baf497da5f6c39b1280e412",
    }));
  else if (query.template === "error_rate")
    rows = [{ value: 0.42, errors: 84, total: 20000 }];
  else
    rows = Array.from({ length: 61 }, (_, i) => ({
      time: time(i),
      value: Math.round(
        420 +
          Math.sin(i * 0.35) * 90 +
          Math.cos(i * 1.3) * 25 +
          (i > 20 ? 60 : 0),
      ),
    }));
  return {
    query,
    rows,
    columns: Object.keys(rows[0] ?? {}),
    sql: "-- Preview data. Connect a workspace to execute a query in ClickHouse.",
    parameters: {},
    executedAt: new Date().toISOString(),
    truncated: false,
  };
}
