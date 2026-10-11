import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import worker from "../src/worker/index";
import type { Env } from "../src/worker/env";
import { ingest } from "../src/worker/ingest";
import { handleMcp } from "../src/worker/mcp";
import {
  getSnapshot,
  listSnapshots,
  saveSnapshot,
  snapshotSchema,
} from "../src/worker/snapshots";
import { querySchema, runQuery } from "../src/worker/queries";
import {
  AlertError,
  createAlert,
  deleteAlert,
  updateAlert,
} from "../src/worker/alerts";
import { ClickHouseError } from "../src/worker/clickhouse";

vi.mock("../src/worker/ingest", () => ({ ingest: vi.fn() }));
vi.mock("../src/worker/k2", () => ({ pollK2: vi.fn() }));
vi.mock("../src/worker/mcp", () => ({ handleMcp: vi.fn() }));
vi.mock("../src/worker/queries", async (original) => ({
  ...(await original<typeof import("../src/worker/queries")>()),
  runQuery: vi.fn(),
}));
vi.mock("../src/worker/snapshots", async (original) => ({
  ...(await original<typeof import("../src/worker/snapshots")>()),
  saveSnapshot: vi.fn(),
  getSnapshot: vi.fn(),
  listSnapshots: vi.fn(),
}));
vi.mock("../src/worker/alerts", async (original) => ({
  ...(await original<typeof import("../src/worker/alerts")>()),
  createAlert: vi.fn(),
  listAlerts: vi.fn(),
  updateAlert: vi.fn(),
  deleteAlert: vi.fn(),
  pollAlerts: vi.fn(),
}));

describe("Worker HTTP authentication and error boundaries", () => {
  const id = "bbf0d7d6-e856-4dc9-a78f-e4926b9a3ed1";
  let env: Env;
  let context: ExecutionContext;
  let consoleError: ReturnType<typeof vi.spyOn>;
  const request = (path: string, token?: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return new Request(`https://o11y.example.com${path}`, { ...init, headers });
  };
  const call = (path: string, token?: string, init?: RequestInit) =>
    worker.fetch(request(path, token, init), env, context);
  beforeEach(() => {
    env = {
      API_TOKEN: "admin-test-secret",
      INGEST_TOKEN: "ingest-test-secret",
      PUBLIC_BASE_URL: "https://o11y.example.com",
      ASSETS: {
        fetch: vi
          .fn()
          .mockResolvedValue(
            new Response('<!doctype html><div id="root"></div>'),
          ),
      },
    } as unknown as Env;
    context = { waitUntil: vi.fn() } as unknown as ExecutionContext;
    consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(ingest).mockResolvedValue(Response.json({}));
    vi.mocked(handleMcp).mockResolvedValue(
      Response.json({ jsonrpc: "2.0", id: 1, result: {} }),
    );
    vi.mocked(getSnapshot).mockResolvedValue(null);
    vi.mocked(listSnapshots).mockResolvedValue({
      snapshots: [],
      cursor: undefined,
    });
    vi.mocked(updateAlert).mockResolvedValue(null);
    vi.mocked(deleteAlert).mockResolvedValue(false);
  });
  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  it("requires the admin bearer token for saved data and MCP, ignoring URL tokens", async () => {
    for (const path of [
      "/api/snapshots",
      `/api/snapshots/${id}`,
      "/api/query",
      "/api/alerts",
      "/mcp",
    ]) {
      expect((await call(path)).status).toBe(401);
      expect((await call(path, env.INGEST_TOKEN)).status).toBe(401);
      expect((await call(`${path}?token=${env.API_TOKEN}`)).status).toBe(401);
    }
    expect(getSnapshot).not.toHaveBeenCalled();
    expect(listSnapshots).not.toHaveBeenCalled();
    expect(handleMcp).not.toHaveBeenCalled();
    expect(runQuery).not.toHaveBeenCalled();
    expect((await call("/api/snapshots", env.API_TOKEN)).status).toBe(200);
    expect((await call("/mcp", env.API_TOKEN, { method: "POST" })).status).toBe(
      200,
    );
  });

  it("keeps public permanent pages as a static shell and protects snapshot reads", async () => {
    const page = await call(`/s/${id}`);
    expect(page.status).toBe(200);
    expect(await page.text()).toBe('<!doctype html><div id="root"></div>');
    expect(getSnapshot).not.toHaveBeenCalled();
    expect((await call(`/api/snapshots/${id}`)).status).toBe(401);
    vi.mocked(getSnapshot).mockResolvedValue({
      id,
      rows: [{ privateTelemetry: "only-authorized" }],
    } as never);
    const saved = await call(`/api/snapshots/${id}`, env.API_TOKEN);
    expect(saved.status).toBe(200);
    expect(await saved.json()).toMatchObject({
      rows: [{ privateTelemetry: "only-authorized" }],
    });
    expect(saved.headers.get("Cache-Control")).toBe("no-store");
    expect(saved.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  it("isolates ingestion authorization and supports the documented fallback token", async () => {
    for (const signal of ["traces", "logs", "metrics"]) {
      expect(
        (await call(`/v1/${signal}`, env.API_TOKEN, { method: "POST" })).status,
      ).toBe(401);
      expect(
        (await call(`/v1/${signal}`, env.INGEST_TOKEN, { method: "POST" }))
          .status,
      ).toBe(200);
      expect(ingest).toHaveBeenLastCalledWith(expect.any(Request), env, signal);
    }
    expect((await call("/v1/traces", env.INGEST_TOKEN)).status).toBe(405);
    expect(
      (await call("/v1/unknown", env.INGEST_TOKEN, { method: "POST" })).status,
    ).toBe(404);
    env.INGEST_TOKEN = undefined;
    expect(
      (await call("/v1/traces", env.API_TOKEN, { method: "POST" })).status,
    ).toBe(200);
    env.API_TOKEN = "";
    expect(
      (await call("/v1/traces", "arbitrary", { method: "POST" })).status,
    ).toBe(401);
    expect((await call("/api/snapshots", "arbitrary")).status).toBe(401);
  });

  it("rejects browser requests from other origins and accepts the configured origin", async () => {
    expect(
      (
        await call("/api/snapshots", env.API_TOKEN, {
          headers: { Origin: "https://evil.example" },
        })
      ).status,
    ).toBe(403);
    expect(
      (
        await call("/mcp", env.API_TOKEN, {
          method: "POST",
          headers: { Origin: "null" },
        })
      ).status,
    ).toBe(403);
    expect(listSnapshots).not.toHaveBeenCalled();
    expect(handleMcp).not.toHaveBeenCalled();
    expect(
      (
        await call("/api/snapshots", env.API_TOKEN, {
          headers: { Origin: env.PUBLIC_BASE_URL },
        })
      ).status,
    ).toBe(200);
  });

  it("returns 404 for missing saved data, alert rules, and authenticated unknown routes", async () => {
    for (const path of [
      `/api/snapshots/${id}`,
      "/api/snapshots/not-a-uuid",
      "/api/unknown",
    ]) {
      expect((await call(path, env.API_TOKEN)).status).toBe(404);
    }
    expect(
      (
        await call(`/api/alerts/${id}`, env.API_TOKEN, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        })
      ).status,
    ).toBe(404);
    expect(
      (await call(`/api/alerts/${id}`, env.API_TOKEN, { method: "DELETE" }))
        .status,
    ).toBe(404);
  });

  it("maps body and query validation errors to client errors", async () => {
    expect(
      (await call("/api/query", env.API_TOKEN, { method: "POST", body: "{}" }))
        .status,
    ).toBe(415);
    const jsonHeaders = { "Content-Type": "application/json" };
    expect(
      (
        await call("/api/query", env.API_TOKEN, {
          method: "POST",
          headers: jsonHeaders,
          body: "{broken",
        })
      ).status,
    ).toBe(400);
    expect(
      (
        await call("/api/query", env.API_TOKEN, {
          method: "POST",
          headers: jsonHeaders,
          body: "a".repeat(65537),
        })
      ).status,
    ).toBe(413);
    vi.mocked(runQuery).mockImplementation(async (_env, query) => {
      querySchema.parse(query);
      throw new Error("unreachable");
    });
    const invalid = await call("/api/query", env.API_TOKEN, {
      method: "POST",
      headers: jsonHeaders,
      body: "{}",
    });
    expect(invalid.status).toBe(400);
    expect(await invalid.json()).toMatchObject({ error: "Validation failed" });
  });

  it("maps safe service errors to meaningful statuses without credentials", async () => {
    const init = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    };
    vi.mocked(createAlert).mockRejectedValue(
      new AlertError("Webhook hostname must be allowed.", 400),
    );
    const badDestination = await call("/api/alerts", env.API_TOKEN, init);
    expect(badDestination.status).toBe(400);
    expect(await badDestination.json()).toEqual({
      error: "Webhook hostname must be allowed.",
    });
    vi.mocked(createAlert).mockRejectedValue(
      new AlertError("Webhook signing is not configured.", 503),
    );
    expect((await call("/api/alerts", env.API_TOKEN, init)).status).toBe(503);
    vi.mocked(runQuery).mockRejectedValue(new ClickHouseError(500));
    const upstream = await call("/api/query", env.API_TOKEN, init);
    expect(upstream.status).toBe(502);
    expect(await upstream.json()).toEqual({
      error: "ClickHouse request failed (500)",
    });
  });

  it("reports incompatible query and visualization selections as validation errors", async () => {
    vi.mocked(saveSnapshot).mockImplementation(async (_env, input) => {
      snapshotSchema.parse(input);
      throw new Error("unreachable");
    });
    const response = await call("/api/snapshots", env.API_TOKEN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Invalid visualization",
        visualization: "waterfall",
        query: {
          template: "recent_logs",
          from: "2026-10-11T00:00:00Z",
          to: "2026-10-11T01:00:00Z",
        },
      }),
    });
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      error: "Validation failed",
      issues: [{ path: ["visualization"] }],
    });
  });

  it.each(["ingest", "mcp", "assets"] as const)(
    "catches asynchronous %s failures and does not leak tokens",
    async (target) => {
      const error = new Error(
        `upstream failure with password=${env.API_TOKEN}`,
      );
      const path =
        target === "ingest"
          ? "/v1/traces"
          : target === "mcp"
            ? "/mcp"
            : "/s/example";
      const token = target === "ingest" ? env.INGEST_TOKEN : env.API_TOKEN;
      if (target === "ingest") vi.mocked(ingest).mockRejectedValue(error);
      else if (target === "mcp") vi.mocked(handleMcp).mockRejectedValue(error);
      else vi.mocked(env.ASSETS.fetch).mockRejectedValue(error);
      const response = await call(path, token, {
        method: target === "assets" ? "GET" : "POST",
      });
      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
        error: "Request failed; check Worker logs",
      });
      expect(JSON.stringify(consoleError.mock.calls)).not.toContain(
        env.API_TOKEN,
      );
    },
  );
});
