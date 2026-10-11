import { afterEach, describe, expect, it, vi } from "vitest";
import type { Env } from "../src/worker/env";
import {
  ClickHouseError,
  insertRows,
  queryRows,
} from "../src/worker/clickhouse";

const env = {
  CLICKHOUSE_URL: "https://test.clickhouse.cloud",
  CLICKHOUSE_DATABASE: "o11y",
  CLICKHOUSE_USER: "worker",
  CLICKHOUSE_PASSWORD: "private-password",
} as Env;
afterEach(() => vi.unstubAllGlobals());

function respond(response: Response) {
  const fetchMock = vi.fn(async (_url: URL, _init: RequestInit) => response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("ClickHouse execution confirmation", () => {
  it("waits for buffered async insert completion and sends a stable deduplication token", async () => {
    const fetchMock = respond(new Response(""));
    await insertRows(env, "otel_traces", [{ SpanId: "123" }], "stable-token");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url.searchParams.get("wait_end_of_query")).toBe("1");
    expect(url.searchParams.get("wait_for_async_insert")).toBe("1");
    expect(url.searchParams.get("insert_deduplication_token")).toBe(
      "stable-token",
    );
    expect(url.searchParams.get("async_insert_deduplicate")).toBe("1");
    expect(url.searchParams.get("buffer_size")).toBe("65536");
    expect(url.searchParams.get("session_timezone")).toBe("UTC");
    expect(init.redirect).toBe("manual");
    expect(init.body).toBe('{"SpanId":"123"}\n');
    expect(new Headers(init.headers).get("X-ClickHouse-Key")).toBe(
      "private-password",
    );
    expect(url.toString()).not.toContain("private-password");
  });

  it("rejects an HTTP 200 insert with a late exception in its body", async () => {
    respond(
      new Response("Code: 241. DB::Exception: Memory limit exceeded", {
        status: 200,
      }),
    );
    await expect(insertRows(env, "otel_traces", [{}], "id")).rejects.toThrow(
      "execution error",
    );
  });

  it("rejects HTTP 200 with an exception code header even when its body is empty", async () => {
    respond(
      new Response("", { headers: { "X-ClickHouse-Exception-Code": "241" } }),
    );
    await expect(
      insertRows(env, "otel_traces", [{}], "id"),
    ).rejects.toBeInstanceOf(ClickHouseError);
  });

  it("rejects a disconnected response body instead of confirming an insert", async () => {
    respond(
      new Response(
        new ReadableStream({
          start(controller) {
            controller.error(new Error("Disconnected"));
          },
        }),
      ),
    );
    await expect(insertRows(env, "otel_logs", [{}], "id")).rejects.toThrow(
      "incomplete or invalid",
    );
  });

  it("uses read-only bounded queries and buffers until execution finishes", async () => {
    const fetchMock = respond(
      Response.json({
        meta: [{ name: "value" }],
        data: [{ value: "18446744073709551615" }],
      }),
    );
    expect(
      await queryRows(env, "SELECT {value:UInt64} AS value", {
        value: "18446744073709551615",
      }),
    ).toEqual({
      columns: ["value"],
      rows: [{ value: "18446744073709551615" }],
    });
    const [url] = fetchMock.mock.calls[0];
    expect(url.searchParams.get("readonly")).toBe("1");
    expect(url.searchParams.get("max_execution_time")).toBe("20");
    expect(url.searchParams.get("max_result_rows")).toBe("10001");
    expect(url.searchParams.get("max_result_bytes")).toBe("10000000");
    expect(url.searchParams.get("wait_end_of_query")).toBe("1");
    expect(url.searchParams.get("buffer_size")).toBe("10000000");
    expect(url.searchParams.get("default_format")).toBe("JSON");
    expect(url.searchParams.get("limit")).toBe("10001");
  });

  it("uses the dedicated account for queries, preserves SQL, and keeps ingestion credentials for writes", async () => {
    const fetchMock = respond(
      Response.json({ meta: [{ name: "value" }], data: [{ value: 1 }] }),
    );
    const configured = {
      ...env,
      CLICKHOUSE_QUERY_USER: "o11y_query",
      CLICKHOUSE_QUERY_PASSWORD: "query-secret",
    };
    const sql =
      "WITH x AS (SELECT {value:UInt32} AS value) SELECT * FROM x; -- trailing comment";
    await queryRows(
      configured,
      sql,
      { value: 1 },
      { requireQueryCredentials: true },
    );
    const [url, init] = fetchMock.mock.calls[0];
    expect(init.body).toBe(sql);
    expect(url.searchParams.get("param_value")).toBe("1");
    expect(new Headers(init.headers).get("X-ClickHouse-User")).toBe(
      "o11y_query",
    );
    expect(new Headers(init.headers).get("X-ClickHouse-Key")).toBe(
      "query-secret",
    );
    const write = respond(new Response(""));
    await insertRows(configured, "otel_logs", [{}], "test");
    expect(
      new Headers(write.mock.calls[0][1].headers).get("X-ClickHouse-Key"),
    ).toBe("private-password");
  });

  it("returns bounded useful SQL diagnostics with configured credentials removed", async () => {
    respond(
      new Response(
        "Code: 47. DB::Exception: Unknown expression missing_column. private-password query-secret\nStack trace:\ninternal",
        { status: 400 },
      ),
    );
    await expect(
      queryRows(
        {
          ...env,
          CLICKHOUSE_QUERY_USER: "o11y_query",
          CLICKHOUSE_QUERY_PASSWORD: "query-secret",
        },
        "SELECT missing_column",
        {},
      ),
    ).rejects.toThrow(
      "Unknown expression missing_column. [redacted] [redacted]",
    );
    respond(
      new Response("Code: 62. Syntax error. " + "x".repeat(10_000), {
        status: 400,
      }),
    );
    const error = await queryRows(env, "SELECT ?", {}).catch(
      (error: Error) => error,
    );
    expect(error).toBeInstanceOf(ClickHouseError);
    expect((error as Error).message.length).toBeLessThan(2100);
  });

  it("rejects a syntactically valid JSON result containing a ClickHouse exception", async () => {
    respond(
      Response.json({
        meta: [{ name: "value" }],
        data: [{ value: 1 }],
        exception: "Code: 241. Memory limit exceeded",
      }),
    );
    await expect(queryRows(env, "SELECT 1", {})).rejects.toThrow(
      "execution error",
    );
  });

  it("rejects late raw errors appended after partial JSON", async () => {
    respond(
      new Response(
        '{"meta":[],"data":[]}\n__exception__\nCode: 241. DB::Exception',
      ),
    );
    await expect(queryRows(env, "SELECT 1", {})).rejects.toThrow(
      "execution error",
    );
  });

  it("enforces response bytes while streaming even without Content-Length", async () => {
    let cancelled = false;
    respond(
      new Response(
        new ReadableStream({
          pull(controller) {
            controller.enqueue(new Uint8Array(1_000_000));
          },
          cancel() {
            cancelled = true;
          },
        }),
      ),
    );
    await expect(queryRows(env, "SELECT 1", {})).rejects.toThrow("byte limit");
    expect(cancelled).toBe(true);
  });

  it("enforces the row limit independently of server settings", async () => {
    respond(
      Response.json({
        meta: [{ name: "value" }],
        data: Array.from({ length: 10002 }, () => ({ value: 1 })),
      }),
    );
    await expect(queryRows(env, "SELECT 1", {})).rejects.toThrow("row limit");
  });

  it("rejects unrecognized insertion table names before sending credentials", async () => {
    const fetchMock = respond(new Response(""));
    await expect(
      insertRows(env, "otel_traces; DROP TABLE otel_logs", [{}], "id"),
    ).rejects.toThrow("Unknown telemetry table");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
