import { describe, it, expect, vi, afterEach } from "vitest";
import { compileQuery, runQuery } from "../src/worker/queries";
import { saveSnapshot, getSnapshot } from "../src/worker/snapshots";
import type { Env } from "../src/worker/env";
const spec = {
  template: "request_rate" as const,
  from: "2026-10-01T00:00:00Z",
  to: "2026-10-01T00:05:00Z",
};
afterEach(() => vi.unstubAllGlobals());
describe("deterministic queries", () => {
  it("accepts arbitrary SQL with typed bound parameters and preserves its exact text", () => {
    const sql =
      "WITH a AS (SELECT {name:String} AS name) SELECT name FROM a; -- preserved\n";
    const parameters = { name: "checkout'; DROP TABLE otel_traces; --" };
    expect(compileQuery({ sql, parameters })).toEqual({
      query: { sql, parameters, limit: 1000 },
      sql,
      parameters,
    });
    for (const invalid of [
      { sql: " " },
      { sql: "SELECT 1", from: spec.from },
      { sql: "SELECT 1", parameters: { "x&readonly": "0" } },
      { sql: "SELECT 1", parameters: { x: null } },
      { sql: "SELECT 1", parameters: { x: Number.POSITIVE_INFINITY } },
    ])
      expect(() => compileQuery(invalid)).toThrow();
  });

  it("refuses raw SQL without a separate query account before sending a request", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    await expect(
      runQuery(
        {
          CLICKHOUSE_URL: "https://example.clickhouse.cloud",
          CLICKHOUSE_PASSWORD: "ingestion-secret",
        } as Env,
        { sql: "SELECT 1" },
      ),
    ).rejects.toThrow("CLICKHOUSE_QUERY_USER");
    expect(fetch).not.toHaveBeenCalled();
  });
  it("uses bound parameters for user values and fixed ordering", () => {
    const result = compileQuery({
      ...spec,
      service: "x'; DROP TABLE otel_traces; --",
    });
    expect(result.sql).not.toContain("DROP");
    expect(result.parameters.service).toContain("DROP");
    expect(result.sql).toContain("ORDER BY time, service");
    expect(result.sql).not.toMatch(/now\(|rand\(/);
  });
  it("rejects relative times, reversed windows, unknown fields, and missing trace IDs", () => {
    for (const invalid of [
      { ...spec, from: "now-5m" },
      { ...spec, to: spec.from },
      { ...spec, sql: "SELECT 1" },
      { ...spec, template: "trace_waterfall" },
    ])
      expect(() => compileQuery(invalid)).toThrow();
  });
  it("records truncation instead of silently dropping rows", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          meta: [{ name: "value" }],
          data: [{ value: 1 }, { value: 2 }],
        }),
      ),
    );
    const result = await runQuery(
      {
        CLICKHOUSE_URL: "https://example.clickhouse.cloud",
        CLICKHOUSE_PASSWORD: "secret",
      } as Env,
      { ...spec, limit: 1 },
    );
    expect(result.truncated).toBe(true);
    expect(result.rows).toEqual([{ value: 1 }]);
  });
});
describe("immutable snapshots", () => {
  it("archives arbitrary SQL, parameters, mapping, and exact results without rerunning", async () => {
    const fetch = vi.fn(async () =>
      Response.json({
        meta: [{ name: "minute" }, { name: "latency" }],
        data: [{ minute: "2026-10-01T00:00:00Z", latency: 123 }],
      }),
    );
    vi.stubGlobal("fetch", fetch);
    const stored = new Map<string, string>();
    const env = {
      CLICKHOUSE_URL: "https://example.clickhouse.cloud",
      CLICKHOUSE_QUERY_USER: "o11y_query",
      CLICKHOUSE_QUERY_PASSWORD: "read-only-secret",
      PUBLIC_BASE_URL: "https://o11y.example",
      ARCHIVE: {
        put: vi.fn(async (key: string, value: string) =>
          stored.set(key, value),
        ),
        get: async (key: string) => ({
          json: async () => JSON.parse(stored.get(key)!),
        }),
      },
    } as unknown as Env;
    const sql =
      "SELECT {minute:String} AS minute, 123 AS latency; -- exact SQL\n";
    const mapping = { time: "minute", value: "latency" };
    const saved = await saveSnapshot(env, {
      query: { sql, parameters: { minute: "2026-10-01T00:00:00Z" } },
      visualization: "line",
      mapping,
      title: "Latency SQL",
    });
    expect(saved.sql).toBe(sql);
    expect(saved.parameters).toEqual({ minute: "2026-10-01T00:00:00Z" });
    expect(saved.mapping).toEqual(mapping);
    expect(await getSnapshot(env, saved.id)).toEqual(saved);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(saved.sha256).toHaveLength(64);
    await expect(
      saveSnapshot(env, {
        query: { sql },
        visualization: "heatmap",
        title: "Wrong columns",
      }),
    ).rejects.toThrow("requires a time column");
    await expect(
      saveSnapshot(env, {
        query: { sql },
        visualization: "table",
        title: "Unknown mapping",
        mapping: { value: "missing" },
      }),
    ).rejects.toThrow("not present in the SQL result");
    expect(env.ARCHIVE.put).toHaveBeenCalledTimes(1);
  });
  it("fails when R2 refuses the conditional write instead of returning an unsaved URL", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({ meta: [{ name: "value" }], data: [{ value: 3 }] }),
      ),
    );
    const env = {
      CLICKHOUSE_URL: "https://example.clickhouse.cloud",
      CLICKHOUSE_PASSWORD: "secret",
      PUBLIC_BASE_URL: "https://o11y.example",
      ARCHIVE: { put: async () => null },
    } as unknown as Env;
    await expect(
      saveSnapshot(env, {
        query: spec,
        title: "Conflict",
        visualization: "line",
      }),
    ).rejects.toThrow("without replacing existing evidence");
  });
  it("reads archived results without querying ClickHouse again", async () => {
    const fetch = vi.fn(async () =>
      Response.json({ meta: [{ name: "value" }], data: [{ value: 3 }] }),
    );
    vi.stubGlobal("fetch", fetch);
    const stored = new Map<string, string>();
    const put = vi.fn(async (key: string, value: string) =>
      stored.set(key, value),
    );
    const env = {
      CLICKHOUSE_URL: "https://example.clickhouse.cloud",
      CLICKHOUSE_PASSWORD: "secret",
      PUBLIC_BASE_URL: "https://o11y.example",
      ARCHIVE: {
        put,
        get: async (key: string) =>
          stored.has(key)
            ? { json: async () => JSON.parse(stored.get(key)!) }
            : null,
      },
    } as unknown as Env;
    const saved = await saveSnapshot(env, {
      query: spec,
      title: "Fixed result",
      visualization: "line",
    });
    expect(saved.sha256).toHaveLength(64);
    expect(put.mock.calls[0][0]).toBe(`snapshots/${saved.id}.json`);
    expect(await getSnapshot(env, saved.id)).toEqual(saved);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
