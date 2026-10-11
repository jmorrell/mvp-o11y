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

vi.mock("../src/worker/queries", () => ({ runQuery: vi.fn() }));

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
