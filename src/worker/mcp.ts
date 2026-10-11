import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";
import type { Env } from "./env";
import type { Snapshot } from "../shared/types";
import { QUERY_TEMPLATES, querySchema, runQuery } from "./queries";
import {
  getSnapshot,
  listSnapshots,
  saveSnapshot,
  snapshotSchema,
} from "./snapshots";
import {
  AlertError,
  alertInputSchema,
  alertPatchSchema,
  createAlert,
  deleteAlert,
  listAlerts,
  updateAlert,
} from "./alerts";

export const VISUALIZATION_RESOURCE_URI = "ui://mvp-o11y/visualization.html";
const readOnly = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};
const appMeta = { ui: { resourceUri: VISUALIZATION_RESOURCE_URI } };
const appSecurity = {
  ui: {
    prefersBorder: true,
    csp: { connectDomains: [], resourceDomains: [], frameDomains: [] },
  },
};
const idSchema = z.object({ id: z.string().uuid() }).strict();

function dataResult(data: Record<string, unknown>): CallToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify(data) }],
    structuredContent: data,
  };
}
function snapshotResult(snapshot: Snapshot): CallToolResult {
  return {
    content: [
      {
        type: "text",
        text: `${snapshot.title}: ${snapshot.rows.length} saved rows. Permanent URL: ${snapshot.url}${snapshot.truncated ? " (Result reached its row limit.)" : ""}`,
      },
    ],
    structuredContent: { snapshot },
  };
}
function errorResult(message: string): CallToolResult {
  return { isError: true, content: [{ type: "text", text: message }] };
}
async function safely(
  action: () => Promise<CallToolResult>,
): Promise<CallToolResult> {
  try {
    return await action();
  } catch (error) {
    if (error instanceof AlertError) return errorResult(error.message);
    if (error instanceof z.ZodError)
      return errorResult(
        `Invalid input: ${error.issues.map((issue) => issue.message).join("; ")}`,
      );
    // Upstream errors can include URLs, database details, or secrets. Never echo them into chat.
    return errorResult(
      "The operation failed. Verify the query inputs and service configuration, then retry.",
    );
  }
}

function createServer(env: Env): McpServer {
  const server = new McpServer({ name: "mvp-o11y", version: "0.1.0" });

  server.registerTool(
    "list_query_templates",
    {
      title: "List observability queries",
      description:
        "List deterministic ClickHouse query templates and compatible visualizations. Queries require absolute from/to ISO 8601 timestamps. Time windows use [from, to).",
      inputSchema: z.object({}).strict(),
      annotations: readOnly,
    },
    async () => dataResult({ templates: QUERY_TEMPLATES }),
  );

  server.registerTool(
    "run_query",
    {
      title: "Run observability query",
      description:
        "Execute a parameterized, read-only query against ClickHouse. Returns ordered rows, SQL, parameters, and execution time. Data can arrive late; use create_visualization to freeze exact results in R2.",
      inputSchema: querySchema,
      annotations: { ...readOnly, idempotentHint: false },
    },
    (query) =>
      safely(async () => dataResult({ result: await runQuery(env, query) })),
  );

  registerAppTool(
    server,
    "create_visualization",
    {
      title: "Save observability visualization",
      description:
        "Run a deterministic query over an absolute time window, save its complete returned rows and provenance permanently to R2, and display a line graph, trace waterfall, heatmap, or table. Creates a new immutable snapshot and stable URL each time. The URL uses the dashboard authentication.",
      inputSchema: snapshotSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
      _meta: appMeta,
    },
    (input: z.infer<typeof snapshotSchema>) =>
      safely(async () => snapshotResult(await saveSnapshot(env, input))),
  );

  registerAppTool(
    server,
    "get_visualization",
    {
      title: "View saved visualization",
      description:
        "Render an immutable saved visualization from R2 without rerunning ClickHouse. The saved rows, query, checksum, and permanent URL are returned.",
      inputSchema: idSchema,
      annotations: readOnly,
      _meta: appMeta,
    },
    ({ id }: z.infer<typeof idSchema>) =>
      safely(async () => {
        const snapshot = await getSnapshot(env, id);
        return snapshot
          ? snapshotResult(snapshot)
          : errorResult("Visualization not found.");
      }),
  );

  server.registerTool(
    "list_visualizations",
    {
      title: "List saved visualizations",
      description:
        "List saved visualization metadata and URLs. Pass the returned cursor to read the next page.",
      inputSchema: z
        .object({ cursor: z.string().max(4096).optional() })
        .strict(),
      annotations: readOnly,
    },
    ({ cursor }) =>
      safely(async () => dataResult(await listSnapshots(env, cursor))),
  );

  server.registerTool(
    "create_alert",
    {
      title: "Create alert",
      description:
        "Create a scheduled threshold alert. error_rate is percent of root spans with error status; request_rate is average root spans per second over the whole window. Rules evaluate on minute boundaries and deliver signed webhooks with durable retries. The HTTPS webhook hostname must be configured in WEBHOOK_ALLOWED_HOSTS.",
      inputSchema: alertInputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    (input) =>
      safely(async () => dataResult({ alert: await createAlert(env, input) })),
  );

  server.registerTool(
    "list_alerts",
    {
      title: "List alerts",
      description:
        "List threshold alert rules and their last evaluation and trigger times (up to 500 rules).",
      inputSchema: z.object({}).strict(),
      annotations: readOnly,
    },
    () => safely(async () => dataResult({ alerts: await listAlerts(env) })),
  );

  server.registerTool(
    "update_alert",
    {
      title: "Update alert",
      description:
        "Change selected alert fields. Set enabled=false to pause future evaluations. Existing queued webhook deliveries retain their original event and destination.",
      inputSchema: z
        .object({ id: z.string().uuid(), changes: alertPatchSchema })
        .strict(),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    ({ id, changes }) =>
      safely(async () => {
        const alert = await updateAlert(env, id, changes);
        return alert ? dataResult({ alert }) : errorResult("Alert not found.");
      }),
  );

  server.registerTool(
    "delete_alert",
    {
      title: "Delete alert",
      description:
        "Delete an alert rule and cancel queued deliveries. A webhook already in flight may still finish.",
      inputSchema: idSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    ({ id }) =>
      safely(async () => dataResult({ deleted: await deleteAlert(env, id) })),
  );

  const resourceConfig = {
    description:
      "Interactive React visualization of a saved observability snapshot. Uses tool results and the MCP Apps host bridge; no credentials or external network requests.",
    _meta: appSecurity,
  };
  registerAppResource(
    server,
    "Observability visualization",
    VISUALIZATION_RESOURCE_URI,
    resourceConfig,
    async () => {
      const asset = await env.ASSETS.fetch(
        new Request(new URL("/mcp-app.html", env.PUBLIC_BASE_URL)),
      );
      if (!asset.ok)
        throw new Error(
          "The visualization application is unavailable. Build and deploy the web assets.",
        );
      return {
        contents: [
          {
            uri: VISUALIZATION_RESOURCE_URI,
            mimeType: RESOURCE_MIME_TYPE,
            text: await asset.text(),
            _meta: appSecurity,
          },
        ],
      };
    },
  );

  return server;
}

/** Authentication and Origin validation are enforced by the /mcp Worker route. */
export async function handleMcp(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32000,
          message: "This stateless MCP endpoint accepts POST requests.",
        },
      },
      {
        status: 405,
        headers: { Allow: "POST", "Cache-Control": "no-store" },
      },
    );
  }
  const server = createServer(env);
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
    maxRequestBodySize: 65_536,
  });
  await server.connect(transport);
  try {
    const response = await transport.handleRequest(request);
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("X-Content-Type-Options", "nosniff");
    return response;
  } finally {
    await server.close();
  }
}
