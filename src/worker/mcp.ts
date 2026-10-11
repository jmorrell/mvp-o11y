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
import { ClickHouseError, ClickHouseConfigurationError } from "./clickhouse";
import type { Snapshot } from "../shared/types";
import {
  QUERY_TEMPLATES,
  querySchema,
  presetQuerySchema,
  sqlQuerySchema,
  runQuery,
} from "./queries";
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
// SDK v1 advertises top-level object schemas; preserve union validation inside the handler.
const queryToolSchema = z
  .object({
    sql: sqlQuerySchema.shape.sql.optional(),
    parameters: sqlQuerySchema.shape.parameters.optional(),
    limit: sqlQuerySchema.shape.limit.optional(),
    template: presetQuerySchema.shape.template.optional(),
    from: presetQuerySchema.shape.from.optional(),
    to: presetQuerySchema.shape.to.optional(),
    service: presetQuerySchema.shape.service.optional(),
    traceId: presetQuerySchema.shape.traceId.optional(),
  })
  .strict();

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
    if (
      error instanceof AlertError ||
      error instanceof ClickHouseError ||
      error instanceof ClickHouseConfigurationError
    )
      return errorResult(error.message);
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
        "List optional query presets to use as starting examples. run_query accepts arbitrary read-only ClickHouse SQL, including CTEs, joins, metrics, and typed parameters. Presets use absolute from/to times and [from, to) windows.",
      inputSchema: z.object({}).strict(),
      annotations: readOnly,
    },
    async () => dataResult({ templates: QUERY_TEMPLATES }),
  );

  server.registerTool(
    "describe_schema",
    {
      title: "Describe available ClickHouse tables",
      description:
        "List queryable tables and their columns, ClickHouse types, and default expressions in the configured database. Use this before composing SQL, especially joins or metric queries.",
      inputSchema: z.object({}).strict(),
      annotations: readOnly,
    },
    () =>
      safely(async () =>
        dataResult({
          result: await runQuery(env, {
            sql: "SELECT table, name, type, default_kind, default_expression FROM system.columns WHERE database = currentDatabase() ORDER BY table, position",
            limit: 10000,
          }),
        }),
      ),
  );

  server.registerTool(
    "run_query",
    {
      title: "Run observability query",
      description:
        "Execute arbitrary read-only ClickHouse SQL by passing sql, optional parameters, and limit. Supports SELECT, WITH, joins, aggregations, window functions, and DESCRIBE. Use {name:Type} placeholders with parameters; include ORDER BY and explicit time parameters for repeatable selections. Returns rows, exact SQL, bound parameters, execution time, and truncation. Optional presets are also accepted. Use create_visualization to preserve the exact returned result in R2.",
      inputSchema: queryToolSchema,
      annotations: { ...readOnly, idempotentHint: false },
    },
    (query) =>
      safely(async () =>
        dataResult({ result: await runQuery(env, querySchema.parse(query)) }),
      ),
  );

  registerAppTool(
    server,
    "create_visualization",
    {
      title: "Save observability visualization",
      description:
        "Execute arbitrary read-only SQL or a preset query, save its returned rows, SQL and parameters in R2, and render a line graph, trace waterfall, heatmap, or table. Optional mapping selects result columns for the chart; table accepts any columns. The frozen result and authenticated URL remain unchanged even when later SQL executions differ. Creates a new immutable snapshot each time.",
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
        "Create a scheduled threshold alert using arbitrary read-only sql with optional parameters and valueColumn (default value). SQL must return exactly one row with a numeric value; from/to parameters are reserved for the absolute evaluation window. Existing error_rate and request_rate presets are also supported. Evaluations run on minute boundaries and deliver signed webhooks with retries. The HTTPS webhook hostname must be configured in WEBHOOK_ALLOWED_HOSTS.",
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
