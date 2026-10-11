import type { Env } from "./env";
import { ingest } from "./ingest";
import { pollK2 } from "./k2";
import { runQuery, QUERY_TEMPLATES } from "./queries";
import { saveSnapshot, getSnapshot, listSnapshots } from "./snapshots";
import {
  createAlert,
  listAlerts,
  updateAlert,
  deleteAlert,
  pollAlerts,
  AlertError,
} from "./alerts";
import { handleMcp } from "./mcp";
import { ZodError } from "zod";
import { ClickHouseError, ClickHouseConfigurationError } from "./clickhouse";

export function json(value: unknown, status = 200): Response {
  return Response.json(value, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
async function validToken(
  request: Request,
  expected: string | undefined,
): Promise<boolean> {
  if (!expected) return false;
  const supplied = request.headers.get("Authorization");
  if (!supplied?.startsWith("Bearer ")) return false;
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(supplied.slice(7))),
    crypto.subtle.digest("SHA-256", enc.encode(expected)),
  ]);
  const aa = new Uint8Array(a),
    bb = new Uint8Array(b);
  let difference = 0;
  for (let i = 0; i < aa.length; i++) difference |= aa[i] ^ bb[i];
  return difference === 0;
}
async function body(request: Request): Promise<any> {
  if (!request.headers.get("Content-Type")?.includes("application/json"))
    throw new RequestError("Expected application/json", 415);
  if (Number(request.headers.get("Content-Length") || 0) > 65536)
    throw new RequestError("Request too large", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError("Request body required", 400);
  const chunks: Uint8Array[] = [];
  let length = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > 65536) {
      await reader.cancel();
      throw new RequestError("Request too large", 413);
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new RequestError("Invalid JSON", 400);
  }
}
class RequestError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    try {
      const url = new URL(request.url),
        path = url.pathname;
      if (path === "/health") return json({ ok: true, service: "mvp-o11y" });
      if (path.startsWith("/v1/")) {
        if (!(await validToken(request, env.INGEST_TOKEN || env.API_TOKEN)))
          return json({ error: "Unauthorized" }, 401);
        if (request.method !== "POST")
          return json({ error: "Method not allowed" }, 405);
        const signal = path.slice(4);
        if (!["traces", "logs", "metrics"].includes(signal))
          return json({ error: "Not found" }, 404);
        return await ingest(
          request,
          env,
          signal as "traces" | "logs" | "metrics",
        );
      }
      if (path === "/mcp" || path.startsWith("/api/")) {
        // Browser clients use the same origin. Explicitly configured origins prevent cross-site authenticated requests.
        const origin = request.headers.get("Origin");
        if (
          origin &&
          origin !== url.origin &&
          origin !== new URL(env.PUBLIC_BASE_URL).origin
        )
          return json({ error: "Origin not allowed" }, 403);
        if (!(await validToken(request, env.API_TOKEN)))
          return json({ error: "Unauthorized" }, 401);
        if (path === "/mcp") return await handleMcp(request, env);
        if (path === "/api/templates" && request.method === "GET")
          return json({ templates: QUERY_TEMPLATES });
        if (path === "/api/query" && request.method === "POST")
          return json(await runQuery(env, await body(request)));
        if (path === "/api/snapshots") {
          if (request.method === "POST")
            return json(await saveSnapshot(env, await body(request)), 201);
          if (request.method === "GET")
            return json(
              await listSnapshots(
                env,
                url.searchParams.get("cursor") || undefined,
              ),
            );
        }
        if (path.startsWith("/api/snapshots/") && request.method === "GET") {
          const saved = await getSnapshot(
            env,
            path.slice("/api/snapshots/".length),
          );
          return saved
            ? json(saved)
            : json({ error: "Snapshot not found" }, 404);
        }
        if (path === "/api/alerts") {
          if (request.method === "POST")
            return json(await createAlert(env, await body(request)), 201);
          if (request.method === "GET")
            return json({ alerts: await listAlerts(env) });
        }
        if (path.startsWith("/api/alerts/")) {
          const id = path.slice("/api/alerts/".length);
          if (request.method === "PUT" || request.method === "PATCH") {
            const rule = await updateAlert(env, id, await body(request));
            return rule ? json(rule) : json({ error: "Alert not found" }, 404);
          }
          if (request.method === "DELETE") {
            const deleted = await deleteAlert(env, id);
            return deleted
              ? json({ deleted: true })
              : json({ error: "Alert not found" }, 404);
          }
        }
        return json({ error: "Not found" }, 404);
      }
      return await env.ASSETS.fetch(request);
    } catch (error) {
      if (error instanceof ZodError)
        return json({ error: "Validation failed", issues: error.issues }, 400);
      if (error instanceof AlertError)
        return json({ error: error.message }, error.status);
      if (error instanceof RequestError)
        return json({ error: error.message }, error.status);
      if (error instanceof ClickHouseConfigurationError)
        return json({ error: error.message }, 503);
      if (error instanceof ClickHouseError)
        return json({ error: error.message }, 502);
      // Upstream exception messages may contain credentials or telemetry payloads.
      console.error(JSON.stringify({ event: "request_failed" }));
      return json({ error: "Request failed; check Worker logs" }, 500);
    }
  },
  async scheduled(
    _controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ) {
    ctx.waitUntil(
      Promise.allSettled([pollK2(env), pollAlerts(env)]).then((results) => {
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          if (result.status === "rejected")
            console.error(
              JSON.stringify({
                event: i === 0 ? "ingest_poll_failed" : "alert_poll_failed",
                message:
                  result.reason instanceof Error
                    ? result.reason.message
                    : "Unknown error",
              }),
            );
        }
      }),
    );
  },
} satisfies ExportedHandler<Env>;
