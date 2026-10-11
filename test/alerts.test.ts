import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AlertInput, QueryResult } from "../src/shared/types";
import type { Env } from "../src/worker/env";
import {
  alertValue,
  createAlert,
  deleteAlert,
  listAlerts,
  pollAlerts,
  thresholdMatches,
  updateAlert,
  validateWebhookUrl,
} from "../src/worker/alerts";
import { runQuery } from "../src/worker/queries";

vi.mock("../src/worker/queries", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../src/worker/queries")>()),
  runQuery: vi.fn(),
}));

const base: AlertInput = {
  name: "API error rate",
  template: "error_rate",
  windowMinutes: 5,
  threshold: 10,
  comparison: "gt",
  webhookUrl: "https://hooks.example.com/alert",
  cooldownMinutes: 15,
  enabled: true,
};
const sqlBase: AlertInput = {
  name: "Checkout p99 latency",
  sql: `WITH selected AS (
    SELECT Duration FROM otel_traces
    WHERE Timestamp >= parseDateTime64BestEffort({from:String}, 9, 'UTC')
      AND Timestamp < parseDateTime64BestEffort({to:String}, 9, 'UTC')
      AND ServiceName = {service:String}
  ) SELECT quantile(0.99)(Duration) / 1000000 AS p99 FROM selected`,
  parameters: { service: "checkout" },
  valueColumn: "p99",
  windowMinutes: 5,
  threshold: 500,
  comparison: "gt",
  webhookUrl: base.webhookUrl,
  cooldownMinutes: 15,
  enabled: true,
};
const result = (rows: Record<string, unknown>[]): QueryResult => ({
  query: {
    template: "error_rate",
    from: "2026-10-11T00:00:00Z",
    to: "2026-10-11T00:05:00Z",
  },
  sql: "SELECT",
  parameters: {},
  columns: ["value", "total"],
  rows,
  executedAt: "2026-10-11T00:05:00Z",
  truncated: false,
});

function d1(sqlite: DatabaseSync): D1Database {
  function prepare(sql: string, args: unknown[] = []): D1PreparedStatement {
    const statement = {
      bind: (...values: unknown[]) => prepare(sql, values),
      run: async () => {
        const row = sqlite
          .prepare(sql)
          .run(...(args as (string | number | null)[]));
        return { success: true, meta: { changes: Number(row.changes) } };
      },
      all: async () => ({
        results: sqlite
          .prepare(sql)
          .all(...(args as (string | number | null)[])),
        success: true,
        meta: {},
      }),
      first: async () =>
        sqlite.prepare(sql).get(...(args as (string | number | null)[])) ??
        null,
      // A synchronous executor allows the batch wrapper to model D1's atomic execution.
      execute: () => {
        const row = sqlite
          .prepare(sql)
          .run(...(args as (string | number | null)[]));
        return { success: true, meta: { changes: Number(row.changes) } };
      },
    };
    return statement as unknown as D1PreparedStatement;
  }
  return {
    prepare,
    batch: async (statements: D1PreparedStatement[]) => {
      sqlite.exec("BEGIN");
      try {
        const results = statements.map((statement) =>
          (statement as unknown as { execute(): unknown }).execute(),
        );
        sqlite.exec("COMMIT");
        return results;
      } catch (error) {
        sqlite.exec("ROLLBACK");
        throw error;
      }
    },
  } as unknown as D1Database;
}

describe("durable alert rules and webhook delivery", () => {
  let sqlite: DatabaseSync;
  let env: Env;
  let fetchMock: ReturnType<typeof vi.fn<typeof fetch>>;
  beforeEach(() => {
    sqlite = new DatabaseSync(":memory:");
    sqlite.exec(
      readFileSync(
        new URL("../migrations/0001_alerts.sql", import.meta.url),
        "utf8",
      ),
    );
    env = {
      DB: d1(sqlite),
      WEBHOOK_ALLOWED_HOSTS: "hooks.example.com",
      WEBHOOK_SECRET: "test-only-key",
    } as Env;
    fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.mocked(runQuery).mockResolvedValue(
      result([{ value: 12, total: 100, errors: 12 }]),
    );
  });
  afterEach(() => {
    sqlite.close();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("creates, updates without resetting omitted fields, lists, and deletes rules", async () => {
    const created = await createAlert(env, {
      ...base,
      windowMinutes: 10,
      cooldownMinutes: 60,
      enabled: false,
    });
    const changed = await updateAlert(env, created.id, {
      name: "Renamed rule",
    });
    expect(changed).toMatchObject({
      name: "Renamed rule",
      windowMinutes: 10,
      cooldownMinutes: 60,
      enabled: false,
    });
    expect(await listAlerts(env)).toHaveLength(1);
    expect(await deleteAlert(env, created.id)).toBe(true);
    expect(await deleteAlert(env, created.id)).toBe(false);
    expect(await updateAlert(env, created.id, { name: "Missing" })).toBeNull();
  });

  it("requires an explicit HTTPS host allowlist and rejects destination tricks", async () => {
    const blocked = [
      "http://hooks.example.com/a",
      "https://hooks.example.com.evil.test/a",
      "https://user:password@hooks.example.com/a",
      "https://127.0.0.1/a",
      "https://[::1]/a",
      "https://hooks.example.com:444/a",
      "https://hooks.example.com/a#fragment",
    ];
    for (const webhookUrl of blocked)
      await expect(createAlert(env, { ...base, webhookUrl })).rejects.toThrow();
    expect(() =>
      validateWebhookUrl({ WEBHOOK_ALLOWED_HOSTS: "" }, base.webhookUrl),
    ).toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("requires one query source and reserves the SQL window parameters", async () => {
    const { template: _template, ...withoutSource } = base;
    for (const input of [
      withoutSource,
      { ...base, sql: "SELECT 1 AS value" },
      { ...sqlBase, sql: "  " },
      { ...sqlBase, service: "checkout" },
      { ...base, parameters: { service: "checkout" } },
      { ...base, valueColumn: "value" },
      { ...sqlBase, parameters: { from: "2026-01-01T00:00:00Z" } },
      { ...sqlBase, parameters: { to: "2026-01-01T00:00:00Z" } },
      { ...sqlBase, parameters: { service: null } },
      { ...sqlBase, parameters: { service: true } },
      { ...sqlBase, parameters: { number: Infinity } },
    ])
      await expect(createAlert(env, input)).rejects.toThrow();
    expect(await listAlerts(env)).toEqual([]);
    expect(
      await createAlert(env, { ...sqlBase, threshold: -10 }),
    ).toMatchObject({
      sql: sqlBase.sql,
      threshold: -10,
    });
  });

  it("switches between SQL and preset queries without resetting common fields", async () => {
    const created = await createAlert(env, {
      ...base,
      service: "checkout",
      windowMinutes: 10,
      cooldownMinutes: 60,
      enabled: false,
    });
    const sql = await updateAlert(env, created.id, {
      sql: sqlBase.sql,
      parameters: sqlBase.parameters,
      valueColumn: "p99",
    });
    expect(sql).toMatchObject({
      sql: sqlBase.sql,
      parameters: sqlBase.parameters,
      valueColumn: "p99",
      windowMinutes: 10,
      cooldownMinutes: 60,
      enabled: false,
    });
    expect(sql).not.toHaveProperty("template");
    expect(sql).not.toHaveProperty("service");
    await expect(
      updateAlert(env, created.id, {
        template: "error_rate",
        sql: "SELECT 0 AS value",
      }),
    ).rejects.toThrow();
    await expect(
      updateAlert(env, created.id, {
        parameters: { from: "yesterday" },
      }),
    ).rejects.toThrow();
    const renamed = await updateAlert(env, created.id, { name: "Latency" });
    expect(renamed).toMatchObject({
      sql: sqlBase.sql,
      parameters: sqlBase.parameters,
      valueColumn: "p99",
    });
    const preset = await updateAlert(env, created.id, {
      template: "request_rate",
      service: "api",
    });
    expect(preset).toMatchObject({
      template: "request_rate",
      service: "api",
      windowMinutes: 10,
      cooldownMinutes: 60,
      enabled: false,
    });
    expect(preset).not.toHaveProperty("sql");
    expect(preset).not.toHaveProperty("parameters");
    expect(preset).not.toHaveProperty("valueColumn");
  });

  it("evaluates arbitrary SQL with fixed window bindings and retries immutable query evidence", async () => {
    const rule = await createAlert(env, sqlBase);
    const parameters = {
      service: "checkout",
      from: "2026-10-11T00:00:00.000Z",
      to: "2026-10-11T00:05:00.000Z",
    };
    vi.mocked(runQuery).mockResolvedValue({
      ...result([{ p99: "750.5" }]),
      sql: sqlBase.sql!,
      parameters,
    });
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 503 }));
    await pollAlerts(env, new Date("2026-10-11T00:05:30Z"));
    expect(runQuery).toHaveBeenCalledWith(env, {
      sql: sqlBase.sql,
      parameters,
      limit: 2,
    });
    const firstBody = fetchMock.mock.calls[0][1]!.body as string;
    expect(JSON.parse(firstBody)).toMatchObject({
      id: `${rule.id}:2026-10-11T00:05:00.000Z`,
      alert: { id: rule.id, valueColumn: "p99" },
      value: 750.5,
      unit: "value",
      sql: sqlBase.sql,
      parameters,
      query: { sql: sqlBase.sql, parameters, limit: 2 },
    });
    await updateAlert(env, rule.id, { sql: "SELECT 999 AS p99" });
    await pollAlerts(env, new Date("2026-10-11T00:06:31Z"));
    expect(fetchMock.mock.calls[1][1]!.body).toBe(firstBody);
  });

  it("records SQL evaluation failures without triggering or logging query details", async () => {
    const rule = await createAlert(env, sqlBase);
    const logger = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      for (const response of [
        result([]),
        result([{ p99: null }]),
        result([{ p99: 750 }, { p99: 900 }]),
        { ...result([{ p99: 750 }]), truncated: true },
      ]) {
        vi.mocked(runQuery).mockResolvedValueOnce(response);
        expect(await pollAlerts(env, new Date("2026-10-11T00:05:30Z"))).toEqual(
          {
            evaluated: 0,
            failed: 1,
            delivered: 0,
          },
        );
      }
      vi.mocked(runQuery).mockRejectedValueOnce(
        new Error("credential-or-sql-must-not-be-logged"),
      );
      expect(
        (await pollAlerts(env, new Date("2026-10-11T00:05:30Z"))).failed,
      ).toBe(1);
      expect(logger.mock.calls).toEqual(
        Array(5).fill(["Alert evaluation failed", { alertId: rule.id }]),
      );
      expect(fetchMock).not.toHaveBeenCalled();
      expect((await listAlerts(env))[0].lastEvaluatedAt).toBeUndefined();
      vi.mocked(runQuery).mockResolvedValueOnce(result([{ p99: 800 }]));
      expect(
        (await pollAlerts(env, new Date("2026-10-11T00:05:30Z"))).evaluated,
      ).toBe(1);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    } finally {
      logger.mockRestore();
    }
  });

  it("enqueues one event per fixed window, signs it, and retries the same event after failure", async () => {
    const rule = await createAlert(env, base);
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 503 }));
    const now = new Date("2026-10-11T00:05:30Z");
    await pollAlerts(env, now);
    expect(runQuery).toHaveBeenCalledWith(env, {
      template: "error_rate",
      from: "2026-10-11T00:00:00.000Z",
      to: "2026-10-11T00:05:00.000Z",
      limit: 10000,
    });
    await pollAlerts(env, now);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await pollAlerts(env, new Date("2026-10-11T00:06:30Z"));
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const first = fetchMock.mock.calls[0][1]!;
    const second = fetchMock.mock.calls[1][1]!;
    expect(second.body).toBe(first.body);
    expect(second.redirect).toBe("manual");
    const headers = new Headers(second.headers);
    const expected = createHmac("sha256", env.WEBHOOK_SECRET)
      .update(`${headers.get("x-o11y-timestamp")}.${second.body}`)
      .digest("hex");
    expect(headers.get("x-o11y-signature")).toBe(`sha256=${expected}`);
    expect(headers.get("x-o11y-event-id")).toBe(
      `${rule.id}:2026-10-11T00:05:00.000Z`,
    );
    expect(
      sqlite.prepare("SELECT status, attempts FROM alert_outbox").get(),
    ).toMatchObject({ status: "delivered", attempts: 2 });
  });

  it("uses an atomic outbox to deduplicate simultaneous cron invocations", async () => {
    await createAlert(env, base);
    const now = new Date("2026-10-11T00:05:30Z");
    await Promise.all([pollAlerts(env, now), pollAlerts(env, now)]);
    expect(
      sqlite.prepare("SELECT COUNT(*) AS count FROM alert_outbox").get(),
    ).toMatchObject({ count: 1 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("observes cooldowns and treats permanent HTTP failures as final", async () => {
    await createAlert(env, base);
    fetchMock.mockResolvedValue(new Response(null, { status: 400 }));
    await pollAlerts(env, new Date("2026-10-11T00:05:00Z"));
    await pollAlerts(env, new Date("2026-10-11T00:19:00Z"));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await pollAlerts(env, new Date("2026-10-11T00:20:00Z"));
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(
      sqlite
        .prepare(
          "SELECT COUNT(*) AS count FROM alert_outbox WHERE status = 'failed'",
        )
        .get(),
    ).toMatchObject({ count: 2 });
  });

  it("cancels pending deliveries when an alert is deleted", async () => {
    const rule = await createAlert(env, base);
    fetchMock.mockResolvedValue(new Response(null, { status: 500 }));
    await pollAlerts(env, new Date("2026-10-11T00:05:00Z"));
    await deleteAlert(env, rule.id);
    await pollAlerts(env, new Date("2026-10-11T00:06:00Z"));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not evaluate disabled rules or fire on missing error-rate data", async () => {
    await createAlert(env, { ...base, enabled: false });
    await pollAlerts(env, new Date("2026-10-11T00:05:00Z"));
    expect(runQuery).not.toHaveBeenCalled();
    await createAlert(env, { ...base, comparison: "lt" });
    vi.mocked(runQuery).mockResolvedValue(
      result([{ value: 0, total: 0, errors: 0 }]),
    );
    await pollAlerts(env, new Date("2026-10-11T00:06:00Z"));
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("alert query semantics", () => {
  it("requires one finite numeric SQL scalar, accepting ClickHouse decimal strings", () => {
    const rule = { ...sqlBase, valueColumn: undefined };
    for (const [scalar, value] of [
      [0, 0],
      [-10.5, -10.5],
      ["123.4", 123.4],
      ["1e3", 1000],
    ] as const)
      expect(alertValue(rule, result([{ value: scalar }]))).toBe(value);
    for (const scalar of [
      null,
      undefined,
      "",
      "  ",
      "NaN",
      "Infinity",
      "0xff",
      true,
      false,
      [],
      {},
      Infinity,
      NaN,
    ])
      expect(alertValue(rule, result([{ value: scalar }]))).toBeNull();
    expect(alertValue(rule, result([]))).toBeNull();
    expect(alertValue(rule, result([{ value: 1 }, { value: 2 }]))).toBeNull();
    expect(
      alertValue(rule, { ...result([{ value: 1 }]), truncated: true }),
    ).toBeNull();
    expect(alertValue(sqlBase, result([{ p99: 750, value: 1 }]))).toBe(750);
  });
  it("averages rate buckets over the full window, including absent minutes", () => {
    expect(
      alertValue(
        { ...base, template: "request_rate" },
        result([{ value: 5 }, { value: 10 }]),
      ),
    ).toBe(3);
    expect(alertValue({ ...base, template: "request_rate" }, result([]))).toBe(
      0,
    );
    expect(
      alertValue(base, { ...result([{ value: 12 }]), truncated: true }),
    ).toBeNull();
  });
  it("uses the selected comparison at threshold boundaries", () => {
    expect(thresholdMatches(10, base)).toBe(false);
    expect(thresholdMatches(10, { ...base, comparison: "gte" })).toBe(true);
    expect(thresholdMatches(10, { ...base, comparison: "lt" })).toBe(false);
    expect(thresholdMatches(10, { ...base, comparison: "lte" })).toBe(true);
  });
});
