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
      CLICKHOUSE_QUERY_USER: "o11y_query",
      CLICKHOUSE_QUERY_PASSWORD: "local-query-only",
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

    it("executes CTEs, joins, window functions, typed parameters, and trailing SQL comments", async () => {
      const parameter = "literal'; DROP TABLE otel_logs; --";
      const result = await runQuery(env, {
        sql: `WITH base AS (SELECT number AS n FROM numbers(4))
SELECT a.n, b.n AS joined, sum(a.n) OVER (ORDER BY a.n) AS running,
  {message:String} AS message
FROM base a JOIN base b ON a.n = b.n
WHERE a.n >= {minimum:UInt32}
ORDER BY a.n; -- trailing semicolon and comment`,
        parameters: { message: parameter, minimum: 1 },
      });
      expect(result.columns).toEqual(["n", "joined", "running", "message"]);
      expect(result.rows).toEqual([
        { n: "1", joined: "1", running: "1", message: parameter },
        { n: "2", joined: "2", running: "3", message: parameter },
        { n: "3", joined: "3", running: "6", message: parameter },
      ]);
      expect(
        (
          await runQuery(env, {
            sql: "SELECT n FROM (SELECT 2 AS n UNION ALL SELECT 1 AS n) ORDER BY n FORMAT JSON",
          })
        ).rows,
      ).toEqual([{ n: 1 }, { n: 2 }]);
      const telemetry = await runQuery(env, {
        sql: "SELECT ServiceName, count() AS spans FROM otel_traces GROUP BY ServiceName ORDER BY ServiceName",
      });
      expect(telemetry.rows.length).toBeGreaterThan(0);
    });

    it("caps unrestricted result queries and reports truncation", async () => {
      const result = await runQuery(env, {
        sql: "SELECT number FROM numbers(20000) ORDER BY number",
        limit: 10_000,
      });
      expect(result.rows).toHaveLength(10_000);
      expect(result.truncated).toBe(true);
    });

    it("denies writes, DDL, multiple statements, and external source access in ClickHouse", async () => {
      for (const sql of [
        "INSERT INTO otel_logs (Body) VALUES ('denied')",
        "CREATE TABLE should_not_exist (x UInt8) ENGINE=Memory",
        "DROP TABLE otel_logs",
        "ALTER TABLE otel_logs DELETE WHERE 1",
        "TRUNCATE TABLE otel_logs",
        "CREATE USER should_not_exist",
        "SELECT 1 INTO OUTFILE '/tmp/should_not_exist'",
        "SELECT * FROM url('http://127.0.0.1:8123', 'CSV', 'value String')",
        "SELECT * FROM file('should_not_exist', 'LineAsString')",
        "SELECT * FROM remote('127.0.0.1', default, otel_logs)",
        "SELECT * FROM s3('https://example.com/should_not_exist.csv', 'CSV', 'value String')",
        "SELECT 1; SELECT 2",
      ])
        await expect(runQuery(env, { sql }), sql).rejects.toThrow(/ClickHouse/);
    });

    it("enforces profile budgets even when SQL attempts to override them", async () => {
      for (const [name, value] of Object.entries({
        readonly: 0,
        allow_ddl: 1,
        max_execution_time: 0,
        max_result_rows: 0,
        max_result_bytes: 0,
        max_memory_usage: 0,
        max_rows_to_read: 0,
        max_bytes_to_read: 0,
        limit: 0,
        result_overflow_mode: "'break'",
        timeout_overflow_mode: "'break'",
        read_overflow_mode: "'break'",
        cancel_http_readonly_queries_on_client_close: 0,
      }))
        await expect(
          runQuery(env, { sql: `SELECT 1 SETTINGS ${name}=${value}` }),
          name,
        ).rejects.toThrow(/readonly|constraint|prohibited/i);

      // ClickHouse 26.3 ignores these nested SETTINGS. Verify effective values,
      // rather than assuming every syntactically accepted clause took effect.
      const nested = await runQuery(env, {
        sql: `SELECT * FROM (SELECT getSetting('readonly') AS readOnly,
          getSetting('max_execution_time') AS seconds, getSetting('max_result_rows') AS resultRows
          SETTINGS readonly=0, max_execution_time=0, limit=0, max_result_rows=0)`,
      });
      expect(Number(nested.rows[0].readOnly)).toBe(1);
      expect(Number(nested.rows[0].seconds)).toBe(20);
      expect(Number(nested.rows[0].resultRows)).toBe(10001);
      const result = await runQuery(env, {
        sql: "SELECT * FROM (SELECT number FROM numbers(20000) SETTINGS limit=0, max_result_rows=0)",
        limit: 10000,
      });
      expect(result.rows).toHaveLength(10000);
      expect(result.truncated).toBe(true);
    });

    it("surfaces useful SQL errors and rejects non-JSON result formats", async () => {
      await expect(
        runQuery(env, { sql: "SELECT missing_column FROM otel_traces" }),
      ).rejects.toThrow("missing_column");
      await expect(
        runQuery(env, { sql: "SELECT 1 FORMAT CSV" }),
      ).rejects.toThrow("use FORMAT JSON");
    });
  },
);
