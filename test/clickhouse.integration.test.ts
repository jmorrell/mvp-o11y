import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { normalizeOtlp } from "../src/worker/otlp";
import { insertRows, queryRows } from "../src/worker/clickhouse";
import { runQuery } from "../src/worker/queries";
import type { Env } from "../src/worker/env";

// Run only against a disposable local ClickHouse database initialized with schema.sql.
describe.skipIf(process.env.CLICKHOUSE_INTEGRATION !== "1")(
  "ClickStack schema on real ClickHouse",
  () => {
    const env = {
      CLICKHOUSE_URL: "http://127.0.0.1:8123",
      CLICKHOUSE_USER: "default",
      CLICKHOUSE_PASSWORD: "local-test-only",
      CLICKHOUSE_DATABASE: "default",
    } as Env;
    it("inserts every OTLP kind and runs every query preset", async () => {
      for (const signal of ["traces", "logs", "metrics"] as const) {
        const payload = JSON.parse(
          readFileSync(`test/fixtures/otlp-${signal}.json`, "utf8"),
        );
        const tables = normalizeOtlp(signal, payload);
        for (const [table, rows] of Object.entries(tables)) {
          await insertRows(env, table, rows, `integration-${table}`);
          const result = await queryRows(
            env,
            `SELECT count() AS count FROM ${table}`,
            {},
          );
          expect(Number(result.rows[0].count)).toBeGreaterThan(0);
        }
      }
      const window = {
        from: "2026-10-11T00:00:00Z",
        to: "2026-10-11T00:05:00Z",
        service: "checkout",
      };
      for (const template of [
        "request_rate",
        "latency_heatmap",
        "trace_waterfall",
        "recent_logs",
        "error_rate",
      ] as const) {
        const result = await runQuery(env, {
          ...window,
          template,
          traceId: "00112233445566778899aabbccddeeff",
        });
        expect(result.rows.length, template).toBeGreaterThan(0);
      }
    }, 60000);
  },
);
