import { z } from "zod";
import type {
  AlertInput,
  AlertRule,
  QueryResult,
  QuerySpec,
} from "../shared/types";
import type { Env } from "./env";
import { runQuery, sqlParametersSchema, sqlQuerySchema } from "./queries";

const alertFieldsSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    template: z.enum(["error_rate", "request_rate"]).optional(),
    sql: sqlQuerySchema.shape.sql.optional(),
    parameters: sqlParametersSchema
      .superRefine((parameters, ctx) => {
        if (Object.keys(parameters).length > 98)
          ctx.addIssue({
            code: "custom",
            message: "At most 98 custom alert parameters are supported",
          });
        for (const name of ["from", "to"])
          if (Object.hasOwn(parameters, name))
            ctx.addIssue({
              code: "custom",
              path: [name],
              message: `${name} is reserved for the alert evaluation window`,
            });
      })
      .optional(),
    valueColumn: z.string().trim().min(1).max(256).optional(),
    service: z.string().trim().min(1).max(256).optional(),
    windowMinutes: z.number().int().min(1).max(1440),
    threshold: z.number().finite(),
    comparison: z.enum(["gt", "gte", "lt", "lte"]),
    webhookUrl: z.string().url().max(2048),
    cooldownMinutes: z.number().int().min(1).max(10080),
    enabled: z.boolean(),
  })
  .strict();
export const alertInputSchema = alertFieldsSchema
  .extend({
    windowMinutes: alertFieldsSchema.shape.windowMinutes.default(5),
    comparison: alertFieldsSchema.shape.comparison.default("gt"),
    cooldownMinutes: alertFieldsSchema.shape.cooldownMinutes.default(15),
    enabled: alertFieldsSchema.shape.enabled.default(true),
  })
  .superRefine((rule, ctx) => {
    if ((rule.template !== undefined) === (rule.sql !== undefined))
      ctx.addIssue({
        code: "custom",
        message: "Supply exactly one of sql or template",
      });
    if (rule.sql !== undefined && rule.service !== undefined)
      ctx.addIssue({
        code: "custom",
        path: ["service"],
        message: "Use SQL parameters to filter a SQL alert by service",
      });
    if (
      rule.template !== undefined &&
      (rule.parameters !== undefined || rule.valueColumn !== undefined)
    )
      ctx.addIssue({
        code: "custom",
        message: "parameters and valueColumn are only supported for SQL alerts",
      });
  });
export const alertPatchSchema = alertFieldsSchema
  .partial()
  .superRefine((patch, ctx) => {
    if (patch.sql !== undefined && patch.template !== undefined)
      ctx.addIssue({
        code: "custom",
        message: "Supply exactly one of sql or template",
      });
  });

interface RuleRow {
  id: string;
  input_json: string;
  created_at: string;
  last_evaluated_at: string | null;
  last_triggered_at: string | null;
}
interface OutboxRow {
  event_id: string;
  alert_id: string;
  webhook_url: string;
  payload: string;
  attempts: number;
}

export class AlertError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
    this.name = "AlertError";
  }
}

function asRule(row: RuleRow): AlertRule {
  return {
    ...(JSON.parse(row.input_json) as AlertInput),
    id: row.id,
    createdAt: row.created_at,
    ...(row.last_evaluated_at
      ? { lastEvaluatedAt: row.last_evaluated_at }
      : {}),
    ...(row.last_triggered_at
      ? { lastTriggeredAt: row.last_triggered_at }
      : {}),
  };
}

/** Exact DNS host allowlist; redirects and arbitrary callback destinations are forbidden. */
export function validateWebhookUrl(
  env: Pick<Env, "WEBHOOK_ALLOWED_HOSTS">,
  value: string,
): URL {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new AlertError("Webhook must be a valid HTTPS URL.");
  }
  const host = url.hostname.toLowerCase();
  const allowed = (env.WEBHOOK_ALLOWED_HOSTS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.port ||
    url.hash ||
    !allowed.includes(host) ||
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host.startsWith("[") ||
    /^\d+(\.\d+){3}$/.test(host) ||
    !host.includes(".")
  ) {
    throw new AlertError(
      "Webhook must use HTTPS and an exact DNS hostname configured in WEBHOOK_ALLOWED_HOSTS.",
    );
  }
  return url;
}

function validateInput(env: Env, input: unknown): AlertInput {
  const parsed = alertInputSchema.parse(input);
  validateWebhookUrl(env, parsed.webhookUrl);
  if (!env.WEBHOOK_SECRET)
    throw new AlertError(
      "WEBHOOK_SECRET must be configured before creating alerts.",
      503,
    );
  return parsed;
}

export async function createAlert(
  env: Env,
  input: unknown,
): Promise<AlertRule> {
  const rule = validateInput(env, input);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  await env.DB.prepare(
    "INSERT INTO alert_rules (id, input_json, created_at) VALUES (?, ?, ?)",
  )
    .bind(id, JSON.stringify(rule), createdAt)
    .run();
  return { ...rule, id, createdAt };
}

export async function listAlerts(env: Env): Promise<AlertRule[]> {
  const result = await env.DB.prepare(
    "SELECT * FROM alert_rules ORDER BY created_at DESC LIMIT 500",
  ).all<RuleRow>();
  return result.results.map(asRule);
}

export async function updateAlert(
  env: Env,
  id: string,
  input: unknown,
): Promise<AlertRule | null> {
  const patch = alertPatchSchema.parse(input);
  const row = await env.DB.prepare("SELECT * FROM alert_rules WHERE id = ?")
    .bind(id)
    .first<RuleRow>();
  if (!row) return null;
  const previous = JSON.parse(row.input_json) as AlertInput;
  // Selecting a source also clears fields that belong exclusively to the previous source.
  if (patch.sql !== undefined) {
    delete previous.template;
    delete previous.service;
  } else if (patch.template !== undefined) {
    delete previous.sql;
    delete previous.parameters;
    delete previous.valueColumn;
  }
  const rule = validateInput(env, {
    ...previous,
    ...patch,
  });
  await env.DB.prepare("UPDATE alert_rules SET input_json = ? WHERE id = ?")
    .bind(JSON.stringify(rule), id)
    .run();
  return asRule({ ...row, input_json: JSON.stringify(rule) });
}

export async function deleteAlert(env: Env, id: string): Promise<boolean> {
  const results = await env.DB.batch([
    env.DB.prepare(
      "UPDATE alert_outbox SET status = 'failed', last_error = 'Alert deleted' WHERE alert_id = ? AND status = 'pending'",
    ).bind(id),
    env.DB.prepare("DELETE FROM alert_rules WHERE id = ?").bind(id),
  ]);
  return (results[1].meta.changes ?? 0) > 0;
}

export function alertValue(
  rule: AlertInput,
  result: QueryResult,
): number | null {
  if (result.truncated) return null;
  if (rule.sql !== undefined) {
    if (result.rows.length !== 1) return null;
    const scalar = result.rows[0][rule.valueColumn ?? "value"];
    // ClickHouse encodes wide integers and decimals as strings; reject coercions of null/booleans.
    if (
      typeof scalar !== "number" &&
      (typeof scalar !== "string" ||
        !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(scalar.trim()))
    )
      return null;
    const value = Number(scalar);
    return Number.isFinite(value) ? value : null;
  }
  if (rule.template === "request_rate") {
    const values = result.rows.map((row) => Number(row.value));
    return values.every(Number.isFinite)
      ? values.reduce((sum, value) => sum + value, 0) / rule.windowMinutes
      : null;
  }
  // An empty window has no denominator: do not fire a low-error-rate rule on missing data.
  if (!result.rows.length || Number(result.rows[0].total) === 0) return null;
  const value = Number(result.rows[0].value);
  return Number.isFinite(value) ? value : null;
}

export function thresholdMatches(
  value: number,
  rule: Pick<AlertInput, "threshold" | "comparison">,
): boolean {
  switch (rule.comparison) {
    case "gt":
      return value > rule.threshold;
    case "gte":
      return value >= rule.threshold;
    case "lt":
      return value < rule.threshold;
    case "lte":
      return value <= rule.threshold;
  }
}

export async function signWebhook(
  secret: string,
  timestamp: string,
  payload: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${timestamp}.${payload}`),
  );
  return `sha256=${Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

async function evaluateRule(env: Env, row: RuleRow, end: Date): Promise<void> {
  const rule = asRule(row);
  const to = end.toISOString();
  if (!rule.enabled || (row.last_evaluated_at && row.last_evaluated_at >= to))
    return;
  const from = new Date(
    end.getTime() - rule.windowMinutes * 60_000,
  ).toISOString();
  const query: QuerySpec =
    rule.sql !== undefined
      ? {
          sql: rule.sql,
          parameters: { ...rule.parameters, from, to },
          limit: 2,
        }
      : {
          template: rule.template!,
          from,
          to,
          ...(rule.service ? { service: rule.service } : {}),
          limit: 10000,
        };
  const result = await runQuery(env, query);
  const value = alertValue(rule, result);
  if (rule.sql !== undefined && value === null)
    throw new AlertError(
      "SQL alert must return exactly one row with a finite numeric value",
      502,
    );
  const cooldownCutoff = new Date(
    end.getTime() - rule.cooldownMinutes * 60_000,
  ).toISOString();
  const shouldTrigger =
    value !== null &&
    thresholdMatches(value, rule) &&
    (!row.last_triggered_at || row.last_triggered_at <= cooldownCutoff);
  if (!shouldTrigger) {
    await env.DB.prepare(
      "UPDATE alert_rules SET last_evaluated_at = ? WHERE id = ? AND input_json = ? AND (last_evaluated_at IS NULL OR last_evaluated_at < ?)",
    )
      .bind(to, rule.id, row.input_json, to)
      .run();
    return;
  }
  const eventId = `${rule.id}:${to}`;
  const payload = JSON.stringify({
    id: eventId,
    type: "alert.triggered",
    occurredAt: to,
    alert: {
      id: rule.id,
      name: rule.name,
      template: rule.template,
      service: rule.service,
      valueColumn:
        rule.sql !== undefined ? (rule.valueColumn ?? "value") : undefined,
      threshold: rule.threshold,
      comparison: rule.comparison,
    },
    value,
    unit:
      rule.sql !== undefined
        ? "value"
        : rule.template === "error_rate"
          ? "percent"
          : "requests_per_second",
    query,
    sql: result.sql,
    parameters: result.parameters,
  });
  // D1 batches are transactional. The window predicate prevents duplicate concurrent cron runs.
  await env.DB.batch([
    env.DB.prepare(
      `INSERT OR IGNORE INTO alert_outbox (event_id, alert_id, webhook_url, payload, created_at, next_attempt_at)
      SELECT ?, id, ?, ?, ?, ? FROM alert_rules
      WHERE id = ? AND input_json = ? AND (last_evaluated_at IS NULL OR last_evaluated_at < ?)
      AND (last_triggered_at IS NULL OR last_triggered_at <= ?)`,
    ).bind(
      eventId,
      rule.webhookUrl,
      payload,
      to,
      to,
      rule.id,
      row.input_json,
      to,
      cooldownCutoff,
    ),
    env.DB.prepare(
      `UPDATE alert_rules SET last_evaluated_at = ?, last_triggered_at = ?
      WHERE id = ? AND input_json = ? AND (last_evaluated_at IS NULL OR last_evaluated_at < ?)
      AND (last_triggered_at IS NULL OR last_triggered_at <= ?)`,
    ).bind(to, to, rule.id, row.input_json, to, cooldownCutoff),
  ]);
}

/** Delivers durable events at least once; consumers must deduplicate X-O11y-Event-Id. */
export async function deliverWebhooks(
  env: Env,
  now = new Date(),
): Promise<number> {
  if (!env.WEBHOOK_SECRET) return 0;
  const current = now.toISOString();
  const started = Date.now();
  const due = await env.DB.prepare(
    `SELECT event_id, alert_id, webhook_url, payload, attempts FROM alert_outbox
    WHERE status = 'pending' AND next_attempt_at <= ? AND (lease_until IS NULL OR lease_until <= ?)
    ORDER BY next_attempt_at LIMIT 20`,
  )
    .bind(current, current)
    .all<OutboxRow>();
  let delivered = 0;
  for (const event of due.results) {
    if (Date.now() - started >= 45_000) break;
    const attemptTime = new Date(now.getTime() + Date.now() - started);
    const lease = new Date(attemptTime.getTime() + 60_000).toISOString();
    const claim = await env.DB.prepare(
      `UPDATE alert_outbox SET lease_until = ?, attempts = attempts + 1
      WHERE event_id = ? AND status = 'pending' AND attempts = ? AND next_attempt_at <= ?
      AND (lease_until IS NULL OR lease_until <= ?)`,
    )
      .bind(
        lease,
        event.event_id,
        event.attempts,
        attemptTime.toISOString(),
        attemptTime.toISOString(),
      )
      .run();
    if (!claim.meta.changes) continue;
    const attempt = event.attempts + 1;
    let retryable = true;
    let error = "Webhook network error";
    try {
      let url: URL;
      try {
        url = validateWebhookUrl(env, event.webhook_url);
      } catch {
        retryable = false;
        throw new Error("Webhook host is no longer allowed");
      }
      const timestamp = Math.floor(attemptTime.getTime() / 1000).toString();
      const response = await fetch(url, {
        method: "POST",
        redirect: "manual",
        signal: AbortSignal.timeout(10_000),
        headers: {
          "content-type": "application/json",
          "x-o11y-event-id": event.event_id,
          "x-o11y-timestamp": timestamp,
          "x-o11y-signature": await signWebhook(
            env.WEBHOOK_SECRET,
            timestamp,
            event.payload,
          ),
        },
        body: event.payload,
      });
      await response.body?.cancel();
      if (response.ok) {
        await env.DB.prepare(
          "UPDATE alert_outbox SET status = 'delivered', lease_until = NULL, last_error = NULL WHERE event_id = ? AND lease_until = ?",
        )
          .bind(event.event_id, lease)
          .run();
        delivered++;
        continue;
      }
      retryable =
        response.status === 408 ||
        response.status === 429 ||
        response.status >= 500;
      error = `Webhook HTTP ${response.status}`;
    } catch {
      if (!retryable) error = "Webhook host is no longer allowed";
    }
    const status = retryable && attempt < 8 ? "pending" : "failed";
    const next = new Date(
      attemptTime.getTime() +
        Math.min(60 * 60_000, 60_000 * 2 ** (attempt - 1)),
    ).toISOString();
    await env.DB.prepare(
      "UPDATE alert_outbox SET status = ?, next_attempt_at = ?, lease_until = NULL, last_error = ? WHERE event_id = ? AND lease_until = ?",
    )
      .bind(status, next, error, event.event_id, lease)
      .run();
  }
  return delivered;
}

export async function pollAlerts(
  env: Env,
  now = new Date(),
): Promise<{ evaluated: number; failed: number; delivered: number }> {
  const end = new Date(Math.floor(now.getTime() / 60_000) * 60_000);
  const started = Date.now();
  const rows = await env.DB.prepare(
    "SELECT * FROM alert_rules WHERE json_extract(input_json, '$.enabled') = 1 ORDER BY COALESCE(last_attempted_at, ''), created_at LIMIT 20",
  ).all<RuleRow>();
  let evaluated = 0;
  let failed = 0;
  for (const row of rows.results) {
    if (Date.now() - started >= 45_000) break;
    try {
      await env.DB.prepare(
        "UPDATE alert_rules SET last_attempted_at = ? WHERE id = ?",
      )
        .bind(now.toISOString(), row.id)
        .run();
      await evaluateRule(env, row, end);
      evaluated++;
    } catch {
      failed++;
      console.error("Alert evaluation failed", { alertId: row.id });
    }
  }
  return { evaluated, failed, delivered: await deliverWebhooks(env, now) };
}
