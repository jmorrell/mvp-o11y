# MCP and MCP Apps

Connect an MCP client to `https://YOUR_WORKER/mcp` using Streamable HTTP and
`Authorization: Bearer YOUR_API_TOKEN`. The server uses stateless JSON responses:
initialization is supported, requests do not need session affinity, and standalone
SSE subscriptions are not offered. Each request is authenticated by the Worker.
This MVP uses a shared bearer token; OAuth discovery and per-user permissions are
not implemented. Use a client that supports custom authorization headers.

| Tool                   | Behavior                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------- |
| `list_query_templates` | Describes five optional starter presets.                                                                 |
| `describe_schema`      | Lists available tables, columns, and ClickHouse types before composing SQL.                              |
| `run_query`            | Executes arbitrary read-only SQL with typed bound parameters, returning rows and exact query provenance. |
| `create_visualization` | Executes a query, saves an immutable R2 snapshot, and displays an MCP App.                               |
| `get_visualization`    | Displays saved rows without rerunning the query.                                                         |
| `list_visualizations`  | Lists snapshot metadata and permanent URLs, with a pagination cursor.                                    |
| `create_alert`         | Saves a threshold rule and its webhook destination.                                                      |
| `list_alerts`          | Lists rules and their last evaluation/trigger timestamps.                                                |
| `update_alert`         | Updates selected fields using `{id, changes}`; `enabled: false` pauses evaluations.                      |
| `delete_alert`         | Deletes the rule and cancels queued deliveries.                                                          |

Queries accept `{sql, parameters?, limit?}`. ClickHouse executes the SQL directly, including CTEs, joins, aggregates, and window functions. Use `describe_schema` or `run_query` with `DESCRIBE TABLE otel_traces` to inspect columns. Typed placeholders such as `{service:String}` bind values safely. Queries can use any retained time range; use explicit absolute parameters and `ORDER BY` when repeatable selection matters.

Late telemetry or nondeterministic functions can change a later execution of the same SQL. A saved visualization permanently preserves the exact returned rows, SQL, bound parameters, column mapping, execution time, checksum, and row-limit indicator.
Snapshot URLs are stable and use the same dashboard authentication.

For example, call `create_visualization` with:

```json
{
  "title": "Checkout request rate",
  "visualization": "line",
  "query": {
    "sql": "SELECT toStartOfMinute(Timestamp) AS minute, count() / 60.0 AS requests_per_second FROM otel_traces WHERE ServiceName = {service:String} AND Timestamp >= parseDateTime64BestEffort({from:String}, 9, 'UTC') AND Timestamp < parseDateTime64BestEffort({to:String}, 9, 'UTC') GROUP BY minute ORDER BY minute",
    "parameters": {
      "service": "checkout",
      "from": "2026-10-11T12:00:00Z",
      "to": "2026-10-11T13:00:00Z"
    },
    "limit": 1000
  },
  "mapping": { "time": "minute", "value": "requests_per_second" }
}
```

The `create_visualization` and `get_visualization` tools advertise
`ui://mvp-o11y/visualization.html`. That resource uses
`text/html;profile=mcp-app` and contains the React application in one HTML file.
Its input is `structuredContent.snapshot` from the tool result. The MCP host
bridge carries data; the iframe receives no bearer token and its declared CSP
permits no external connections or resources. Clients without MCP Apps support
still receive the permanent URL and structured snapshot data.

## Alerts and webhooks

Set `WEBHOOK_ALLOWED_HOSTS` to a comma-separated list of exact DNS hostnames,
for example `hooks.example.com,events.example.org`, and store `WEBHOOK_SECRET`
as a Worker secret. Destinations must use HTTPS, the default port, no URL
credentials, and an allowed hostname. IP literals, local hostnames, and redirects
are rejected. Only configure hosts you control or explicitly trust; the allowlist
is the outbound trust boundary.

Rules can supply arbitrary SQL, custom parameters, and `valueColumn` (default `value`). SQL must return exactly one row with a numeric value. Reserved `from` and `to` parameters are bound to the current window; custom parameters cannot replace them. See [SQL alert examples](sql-alerts.md).

Rules run from the minute cron trigger using absolute windows ending on a minute
boundary. `request_rate` compares average root spans per second across the full
window; `error_rate` compares the percentage of root spans with error status.
An empty error-rate denominator does not trigger. The `gt`, `gte`, `lt`, and `lte`
comparisons are supported. A matching rule can trigger again after its cooldown;
it is a repeating threshold alert, not an incident lifecycle. Late arrivals may
affect the next overlapping window. Failed queries and truncated results do not
trigger alerts.

Each poll evaluates at most 20 enabled rules, choosing the least recently attempted
first, with a 45-second work budget. A separate 45-second budget sends up to 20
due webhooks. Slow queries or a large rule count can increase evaluation lag.
Rules are durable in D1. Trigger creation and cooldown updates use a D1
transaction; an outbox and leases provide at-least-once delivery. Failed requests,
HTTP 408/429, and 5xx responses retry up to eight attempts with exponential delays
starting at one minute and capped at one hour. Other HTTP failures are final.
Delivery history and final failures are retained in `alert_outbox` for inspection.
Pausing a rule stops new evaluations but leaves queued events intact; deleting it
cancels pending events. A request already in flight can still complete.

Webhook requests include:

```text
Content-Type: application/json
X-O11y-Event-Id: <alert UUID>:<window end ISO timestamp>
X-O11y-Timestamp: <Unix seconds>
X-O11y-Signature: sha256=<hex HMAC-SHA256>
```

Verify the HMAC over `timestamp + "." + rawRequestBody` using `WEBHOOK_SECRET`,
compare signatures in constant time, and reject timestamps outside your accepted
clock-skew window. The timestamp and signature refresh on retries, while the
event ID and body remain stable. Deduplicate on `X-O11y-Event-Id`. The JSON body
includes `type: "alert.triggered"`, rule metadata, observed value, unit, and the
absolute query window. The implementation never forwards the API token or
ClickHouse credentials to webhook destinations.
