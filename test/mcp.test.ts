import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Env } from "../src/worker/env";
import type { Snapshot } from "../src/shared/types";
import { handleMcp, VISUALIZATION_RESOURCE_URI } from "../src/worker/mcp";
import { runQuery } from "../src/worker/queries";
import { getSnapshot, saveSnapshot } from "../src/worker/snapshots";

vi.mock("../src/worker/queries", async (original) => ({
  ...(await original<typeof import("../src/worker/queries")>()),
  runQuery: vi.fn(),
}));
vi.mock("../src/worker/snapshots", async (original) => ({
  ...(await original<typeof import("../src/worker/snapshots")>()),
  saveSnapshot: vi.fn(),
  getSnapshot: vi.fn(),
  listSnapshots: vi.fn().mockResolvedValue({ snapshots: [] }),
}));

const snapshot: Snapshot = {
  version: 1,
  id: "bbf0d7d6-e856-4dc9-a78f-e4926b9a3ed1",
  title: "API traffic",
  visualization: "line",
  createdAt: "2026-10-11T00:05:00Z",
  executedAt: "2026-10-11T00:05:00Z",
  sha256: "a".repeat(64),
  url: "https://o11y.example.com/s/bbf0d7d6-e856-4dc9-a78f-e4926b9a3ed1",
  query: {
    template: "request_rate",
    from: "2026-10-11T00:00:00Z",
    to: "2026-10-11T00:05:00Z",
  },
  sql: "SELECT",
  parameters: {},
  columns: ["time", "value", "service"],
  rows: [{ time: "2026-10-11T00:00:00Z", value: 12, service: "api" }],
  truncated: false,
};

describe("MCP over real stateless Streamable HTTP", () => {
  let env: Env;
  let client: Client;
  let responses: Response[];
  beforeEach(async () => {
    responses = [];
    env = {
      PUBLIC_BASE_URL: "https://o11y.example.com",
      API_TOKEN: "never-send-to-app",
      ASSETS: {
        fetch: vi
          .fn()
          .mockResolvedValue(
            new Response(
              '<!doctype html><div id="root"></div><script>/* bundled React app */</script>',
              { headers: { "Content-Type": "text/html" } },
            ),
          ),
      },
    } as unknown as Env;
    vi.mocked(saveSnapshot).mockResolvedValue(snapshot);
    vi.mocked(getSnapshot).mockResolvedValue(snapshot);
    vi.mocked(runQuery).mockResolvedValue(snapshot);
    const transport = new StreamableHTTPClientTransport(
      new URL("https://o11y.example.com/mcp"),
      {
        fetch: async (input, init) => {
          const response = await handleMcp(new Request(input, init), env);
          responses.push(response.clone());
          return response;
        },
      },
    );
    client = new Client({ name: "integration-test", version: "1.0.0" });
    await client.connect(transport);
  });
  afterEach(async () => {
    await client.close();
    vi.clearAllMocks();
  });

  it("initializes, lists ten tools, and advertises MCP Apps metadata", async () => {
    const result = await client.listTools();
    expect(result.tools.map((tool) => tool.name)).toEqual([
      "list_query_templates",
      "describe_schema",
      "run_query",
      "create_visualization",
      "get_visualization",
      "list_visualizations",
      "create_alert",
      "list_alerts",
      "update_alert",
      "delete_alert",
    ]);
    const appTool = result.tools.find(
      (tool) => tool.name === "create_visualization",
    );
    expect(appTool?._meta).toMatchObject({
      ui: { resourceUri: VISUALIZATION_RESOURCE_URI },
      "ui/resourceUri": VISUALIZATION_RESOURCE_URI,
    });
    expect(appTool?.annotations?.readOnlyHint).toBe(false);
    expect(
      responses.every((response) => !response.headers.has("mcp-session-id")),
    ).toBe(true);
  });

  it("creates a snapshot and returns complete data to the app plus a durable URL", async () => {
    const result = await client.callTool({
      name: "create_visualization",
      arguments: {
        query: snapshot.query,
        title: snapshot.title,
        visualization: snapshot.visualization,
      },
    });
    expect(result.isError).not.toBe(true);
    expect(result.structuredContent).toEqual({ snapshot });
    expect(JSON.stringify(result.content)).toContain(snapshot.url);
    expect(saveSnapshot).toHaveBeenCalledWith(env, {
      query: { ...snapshot.query, limit: 1000 },
      title: snapshot.title,
      visualization: "line",
    });
    const saved = await client.callTool({
      name: "get_visualization",
      arguments: { id: snapshot.id },
    });
    expect(saved.structuredContent).toEqual({ snapshot });
    expect(runQuery).not.toHaveBeenCalled();
  });

  it("advertises SQL inputs and forwards CTEs and typed parameters without rewriting", async () => {
    const tools = await client.listTools();
    const queryTool = tools.tools.find((tool) => tool.name === "run_query")!;
    expect(queryTool.inputSchema.properties).toHaveProperty("sql");
    expect(queryTool.inputSchema.properties).toHaveProperty("parameters");
    const query = {
      sql: "WITH services AS (SELECT ServiceName FROM otel_traces) SELECT ServiceName, count() AS requests FROM services WHERE ServiceName = {service:String} GROUP BY ServiceName ORDER BY requests DESC; -- keep exact SQL",
      parameters: { service: "checkout" },
      limit: 50,
    };
    const result = await client.callTool({
      name: "run_query",
      arguments: query,
    });
    expect(result.isError).not.toBe(true);
    expect(runQuery).toHaveBeenCalledWith(env, query);
    const invalid = await client.callTool({
      name: "run_query",
      arguments: { ...query, template: "request_rate" },
    });
    expect(invalid.isError).toBe(true);
  });

  it("saves arbitrary SQL with column mapping in an MCP App snapshot", async () => {
    const sqlSnapshot: Snapshot = {
      ...snapshot,
      query: { sql: "SELECT now() AS observed, 7 AS measured" },
      sql: "SELECT now() AS observed, 7 AS measured",
      mapping: { time: "observed", value: "measured" },
      columns: ["observed", "measured"],
      rows: [{ observed: "2026-10-11T00:00:00Z", measured: 7 }],
    };
    vi.mocked(saveSnapshot).mockResolvedValue(sqlSnapshot);
    const result = await client.callTool({
      name: "create_visualization",
      arguments: {
        title: sqlSnapshot.title,
        query: sqlSnapshot.query,
        visualization: "line",
        mapping: sqlSnapshot.mapping,
      },
    });
    expect(result.isError).not.toBe(true);
    expect(result.structuredContent).toEqual({ snapshot: sqlSnapshot });
    expect(saveSnapshot).toHaveBeenCalledWith(
      env,
      expect.objectContaining({
        mapping: sqlSnapshot.mapping,
        query: expect.objectContaining({ sql: sqlSnapshot.sql }),
      }),
    );
  });

  it("discovers tables and columns before composing arbitrary SQL", async () => {
    const result = await client.callTool({
      name: "describe_schema",
      arguments: {},
    });
    expect(result.isError).not.toBe(true);
    expect(runQuery).toHaveBeenCalledWith(
      env,
      expect.objectContaining({
        sql: expect.stringContaining("FROM system.columns"),
      }),
    );
  });

  it("serves the bundled app resource with a network-free CSP and no credentials", async () => {
    const listed = await client.listResources();
    expect(listed.resources[0]).toMatchObject({
      uri: VISUALIZATION_RESOURCE_URI,
      mimeType: "text/html;profile=mcp-app",
    });
    const read = await client.readResource({ uri: VISUALIZATION_RESOURCE_URI });
    expect(read.contents[0]).toMatchObject({
      uri: VISUALIZATION_RESOURCE_URI,
      mimeType: "text/html;profile=mcp-app",
      _meta: {
        ui: {
          csp: { connectDomains: [], resourceDomains: [], frameDomains: [] },
        },
      },
    });
    expect(JSON.stringify(read)).not.toContain(env.API_TOKEN);
    expect(env.ASSETS.fetch).toHaveBeenCalledWith(
      expect.objectContaining({ url: "https://o11y.example.com/mcp-app.html" }),
    );
  });

  it("validates tool input and hides upstream secrets in failures", async () => {
    const invalid = await client.callTool({
      name: "run_query",
      arguments: { ...snapshot.query, to: "not-a-date" },
    });
    expect(invalid.isError).toBe(true);
    expect(runQuery).not.toHaveBeenCalled();
    vi.mocked(runQuery).mockRejectedValue(
      new Error("database password=secret-value"),
    );
    const failure = await client.callTool({
      name: "run_query",
      arguments: { ...snapshot.query },
    });
    expect(failure.isError).toBe(true);
    expect(JSON.stringify(failure)).not.toContain("secret-value");
  });

  it("rejects standalone SSE and enforces the request body size limit", async () => {
    expect(
      (await handleMcp(new Request("https://o11y.example.com/mcp"), env))
        .status,
    ).toBe(405);
    const response = await handleMcp(
      new Request("https://o11y.example.com/mcp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
        },
        body: JSON.stringify({ padding: "a".repeat(65536) }),
      }),
      env,
    );
    expect(response.status).toBe(413);
  });
});
