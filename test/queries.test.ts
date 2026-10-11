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
