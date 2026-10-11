import type { Env } from "./env";

const tables = new Set([
  "otel_traces",
  "otel_logs",
  "otel_metrics_gauge",
  "otel_metrics_sum",
  "otel_metrics_histogram",
  "otel_metrics_exponential_histogram",
  "otel_metrics_summary",
]);
const MAX_QUERY_BYTES = 10_000_000;
const MAX_QUERY_ROWS = 10_001; // One extra row lets the API report truncation explicitly.
export class ClickHouseError extends Error {
  constructor(
    public status: number,
    reason = "request failed",
  ) {
    super(`ClickHouse ${reason} (${status})`);
  }
}
function endpoint(env: Env): URL {
  if (!env.CLICKHOUSE_URL || !env.CLICKHOUSE_PASSWORD)
    throw new Error("ClickHouse is not configured");
  const url = new URL(env.CLICKHOUSE_URL);
  if (
    url.protocol !== "https:" &&
    !["localhost", "127.0.0.1"].includes(url.hostname)
  )
    throw new Error("ClickHouse requires HTTPS");
  if (url.username || url.password)
    throw new Error("Use ClickHouse secret bindings for credentials");
  url.searchParams.set("database", env.CLICKHOUSE_DATABASE || "default");
  url.searchParams.set("session_timezone", "UTC");
  return url;
}
function headers(env: Env): HeadersInit {
  return {
    "X-ClickHouse-User": env.CLICKHOUSE_USER || "default",
    "X-ClickHouse-Key": env.CLICKHOUSE_PASSWORD,
    "Content-Type": "text/plain; charset=utf-8",
  };
}

async function responseText(
  response: Response,
  maximumBytes: number,
): Promise<string> {
  if (
    !response.ok ||
    Number(response.headers.get("X-ClickHouse-Exception-Code")) > 0
  ) {
    await response.body?.cancel();
    throw new ClickHouseError(response.status);
  }
  if (Number(response.headers.get("Content-Length")) > maximumBytes) {
    await response.body?.cancel();
    throw new ClickHouseError(
      response.status,
      "response exceeds the byte limit",
    );
  }
  const reader = response.body?.getReader();
  if (!reader) return "";
  let bytes = 0;
  let text = "";
  const decoder = new TextDecoder("utf-8", { fatal: true });
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maximumBytes)
        throw new ClickHouseError(
          response.status,
          "response exceeds the byte limit",
        );
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } catch (error) {
    await reader.cancel().catch(() => {});
    if (error instanceof ClickHouseError) throw error;
    throw new ClickHouseError(
      response.status,
      "response was incomplete or invalid",
    );
  } finally {
    reader.releaseLock();
  }
}

function bufferResponse(url: URL, bytes: number): void {
  // Status 200 alone cannot confirm execution: ClickHouse may append an exception after headers.
  url.searchParams.set("wait_end_of_query", "1");
  url.searchParams.set("buffer_size", String(bytes));
  url.searchParams.set("send_progress_in_http_headers", "0");
}

// Workers supports manual/follow redirects. Manual keeps credentials on the configured origin;
// responseText rejects the resulting 3xx response instead of following it.

export async function queryRows(
  env: Env,
  sql: string,
  parameters: Record<string, string | number>,
): Promise<{ rows: Record<string, unknown>[]; columns: string[] }> {
  const url = endpoint(env);
  for (const [name, value] of Object.entries(parameters))
    url.searchParams.set(`param_${name}`, String(value));
  url.searchParams.set("readonly", "1");
  url.searchParams.set("max_execution_time", "20");
  url.searchParams.set("max_result_rows", String(MAX_QUERY_ROWS));
  url.searchParams.set("max_result_bytes", String(MAX_QUERY_BYTES));
  url.searchParams.set("result_overflow_mode", "throw");
  url.searchParams.set("output_format_json_quote_64bit_integers", "1");
  bufferResponse(url, MAX_QUERY_BYTES);
  const response = await fetch(url, {
    method: "POST",
    headers: headers(env),
    body: `${sql}\nFORMAT JSON`,
    signal: AbortSignal.timeout(25_000),
    redirect: "manual",
  });
  const text = await responseText(response, MAX_QUERY_BYTES);
  let result: {
    data: Record<string, unknown>[];
    meta: { name: string }[];
    exception?: unknown;
  };
  try {
    result = JSON.parse(text);
  } catch {
    throw new ClickHouseError(
      response.status,
      "returned invalid JSON or an execution error",
    );
  }
  if (!result || typeof result !== "object" || "exception" in result) {
    throw new ClickHouseError(response.status, "reported an execution error");
  }
  if (
    !Array.isArray(result.data) ||
    !Array.isArray(result.meta) ||
    !result.data.every(
      (row) => row !== null && typeof row === "object" && !Array.isArray(row),
    ) ||
    !result.meta.every(
      (column) =>
        column !== null &&
        typeof column === "object" &&
        typeof column.name === "string",
    )
  ) {
    throw new ClickHouseError(
      response.status,
      "returned an invalid result shape",
    );
  }
  if (result.data.length > MAX_QUERY_ROWS)
    throw new ClickHouseError(
      response.status,
      "response exceeds the row limit",
    );
  return { rows: result.data, columns: result.meta.map((c) => c.name) };
}
export async function insertRows(
  env: Env,
  table: string,
  rows: Record<string, unknown>[],
  dedupToken: string,
): Promise<void> {
  if (!tables.has(table)) throw new Error("Unknown telemetry table");
  if (!rows.length) return;
  const url = endpoint(env);
  url.searchParams.set("query", `INSERT INTO ${table} FORMAT JSONEachRow`);
  url.searchParams.set("date_time_input_format", "best_effort");
  url.searchParams.set("input_format_skip_unknown_fields", "0");
  url.searchParams.set("insert_deduplicate", "1");
  url.searchParams.set("insert_deduplication_token", dedupToken);
  url.searchParams.set("async_insert", "1");
  url.searchParams.set("wait_for_async_insert", "1");
  url.searchParams.set("async_insert_deduplicate", "1");
  bufferResponse(url, 65_536);
  const response = await fetch(url, {
    method: "POST",
    headers: headers(env),
    body: rows.map((row) => JSON.stringify(row)).join("\n") + "\n",
    signal: AbortSignal.timeout(20_000),
    redirect: "manual",
  });
  // Successful INSERT without RETURNING has an empty body. Read to completion before acknowledging K2.
  if ((await responseText(response, 65_536)).trim() !== "") {
    throw new ClickHouseError(
      response.status,
      "returned an unexpected insert response or execution error",
    );
  }
}
