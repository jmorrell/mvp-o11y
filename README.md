# mvp-o11y

An agent-first observability workbench on Cloudflare Workers. Send OTLP, query ClickHouse Cloud through MCP, save visual evidence, and send alerts to agents through webhooks.

React + Cloudflare Kumo provide a dashboard and the same visualizations inside MCP Apps. This repository is an initial single-workspace implementation, intended to run in your own Cloudflare and ClickHouse accounts.

```mermaid
flowchart LR
  SDK[OTLP HTTP SDKs] --> W[Workers ingest]
  W --> R2[(R2 raw OTLP archive)]
  W --> K2[K2 archive pointers]
  Cron[Minute cron] --> P[Poll leased batches]
  K2 --> P
  R2 --> P
  P --> CH[(ClickHouse Cloud)]
  MCP[MCP / MCP Apps] --> Q[Deterministic query service]
  UI[React / Kumo dashboard] --> Q
  Q --> CH
  Q --> S[(R2 immutable snapshots)]
  S --> URL[Permanent authenticated URLs]
  Cron --> A[Alert evaluation / durable outbox]
  A --> CH
  A --> Hooks[Signed webhooks]
```

## What works

- OTLP/HTTP traces, logs, and all five metric kinds, as JSON or protobuf, optionally gzip compressed. Requests are validated and archived before success. Maximum decoded request size: 8 MiB.
- K2 producer binding and scheduled HTTP pull consumption, acknowledgment after ClickHouse insertion, stable deduplication tokens and durable ingestion receipts.
- ClickStack's pinned ClickHouse schema, with expiration TTLs removed. Raw payloads and saved query results have no application expiration in R2.
- Parameterized query presets for request rate, latency heatmaps, trace waterfalls, recent logs, and error rate. Values are bound ClickHouse parameters; time windows are absolute and results have fixed ordering.
- Immutable saved results with the executed SQL, parameters, columns, rows, timestamps, and SHA-256 digest. `/s/:id` reads the saved object without querying ClickHouse again.
- Streamable HTTP MCP at `/mcp`, including tools for querying, saving and retrieving visualizations, and managing alerts. MCP Apps share the React renderer with the dashboard.
- Threshold alerts with fixed evaluation windows, cooldowns, durable webhook outbox, HMAC signatures, and retry handling.
- Bearer authentication on ingestion, API, and MCP endpoints. Permanent view URLs retain workspace authentication; possession of a URL alone does not grant access.

## Local development

Requires Node.js 24 and npm. Docker is optional for ClickHouse integration testing.

```sh
npm ci
cp .dev.vars.example .dev.vars
npm run build:web
npx wrangler d1 migrations apply mvp-o11y --local
npm run dev
```

Open `http://localhost:8787`. The dashboard has an explicitly labeled preview mode with sample telemetry. Enter the local `API_TOKEN` in Settings for live requests. Tokens are held in browser session storage. ClickHouse and K2 require configured services; local preview does not simulate successful ingestion.

For frontend iteration, use `npm run dev:web` alongside Wrangler on port 8787. `npm run check` runs TypeScript, unit/integration tests, the two frontend builds, and a Worker dry run.

## Provision and deploy

1. Create a ClickHouse Cloud service running **26.2 or newer**. Apply `clickhouse/schema.sql` to the database selected by `CLICKHOUSE_DATABASE`. See [schema provenance and compatibility](docs/schema.md). Use database-scoped credentials with SELECT and INSERT privileges; DDL privileges are only needed for setup. Query requests set `readonly=1`.
2. Create an R2 bucket and a D1 database:

   ```sh
   npx wrangler r2 bucket create mvp-o11y-archive
   npx wrangler d1 create mvp-o11y
   ```

   Copy the D1 ID into `wrangler.jsonc`, then run `npx wrangler d1 migrations apply mvp-o11y --remote`.
3. Create a K2 stream and an earliest-starting subscription. Add the producer binding and consumer IDs described in [K2 setup](docs/k2.md). K2 is a public beta and requires an eligible Cloudflare account. Its retention is finite; R2 is the permanent archive.
4. Set `PUBLIC_BASE_URL` to your final Worker/custom-domain HTTPS origin. Set `CLICKHOUSE_DATABASE`, `CLICKHOUSE_USER`, and comma-separated `WEBHOOK_ALLOWED_HOSTS` in `wrangler.jsonc`. Allowlist the exact hostnames of the webhook destinations you intend to use.
5. Configure secrets using `npx wrangler secret put NAME` for each of:

   ```text
   API_TOKEN
   INGEST_TOKEN
   CLICKHOUSE_URL
   CLICKHOUSE_PASSWORD
   K2_STREAM_ID
   K2_SUBSCRIPTION_ID
   K2_API_TOKEN
   WEBHOOK_SECRET
   ```

   Use separate strong random API, ingestion, and signing secrets. `K2_API_TOKEN` needs K2 Consume permission. `INGEST_TOKEN` is optional; when omitted ingestion uses `API_TOKEN`.
6. Run `npm run deploy`. Cron runs every minute. Check Worker logs for failed ingestion or alert polls and verify an actual SDK export before routing production telemetry.

No application code expires raw telemetry or snapshots. Keep R2 lifecycle expiration disabled for `otlp/` and `snapshots/`, and do not add ClickHouse TTLs. Storage availability still depends on keeping the accounts, resources, and billing active. Deleting the bucket or tables deletes the data.

## Send telemetry

Standard SDK configuration:

```sh
export OTEL_EXPORTER_OTLP_ENDPOINT=https://your-worker.example
export OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer YOUR_INGEST_TOKEN"
```

Endpoints are `POST /v1/traces`, `/v1/logs`, and `/v1/metrics`. OTLP/gRPC is not supported by this Worker. SDKs should retry retryable failures. The HTTP success response means the request is archived and queued, not that it is immediately queryable. With minute polling, freshness is typically one to two minutes and can increase under backlog.

## Query, save, and connect an agent

See [MCP and webhook usage](docs/mcp.md). Configure a remote MCP client with the URL `https://your-worker.example/mcp` and the `Authorization: Bearer …` header. This initial version uses a workspace bearer token; OAuth discovery and multi-user authorization are not implemented. Clients that require OAuth need an authentication gateway or a future OAuth provider.

Example REST request body for `POST /api/query`:

```json
{
  "template": "request_rate",
  "from": "2026-10-01T00:00:00Z",
  "to": "2026-10-01T01:00:00Z",
  "service": "checkout"
}
```

To save evidence, `POST /api/snapshots` with `{"title":"Checkout traffic","visualization":"line","query":{...}}`. Saving executes that query once and archives its result. Re-running the same time window later can include late-arriving telemetry; the saved snapshot itself does not change. Presets and their SQL are the deterministic source of each result; arbitrary SQL is intentionally outside this first API.

## Current scope and operating limits

This is a project foundation, not a managed multi-tenant service. It has no organization accounts, OAuth login, arbitrary SQL editor, alert recovery notifications, or generalized dashboard layout builder. Metric ingestion is implemented; metric-specific query presets are a next step. Request/error presets count root spans, so sampling and instrumented span boundaries affect their interpretation.

The K2 consumer guarantees at-least-once processing. Stable tokens and D1 receipts reduce duplicates, but cannot make ClickHouse and D1 an atomic transaction. See [delivery semantics](docs/k2.md). Invalid archived records block their leased batch until investigated. Polling is deliberately bounded; scale consumer concurrency and backfill/replay tooling before high-volume use. R2 keeps the raw records available for recovery, but this version does not run automatic archive backfills after K2 retention expires.

Saved result sets are capped at 10,000 rows and 10 MB. Truncation is recorded and shown. Read-only queries have an execution timeout and a maximum 31-day window; these limits do not impose data retention. Alerts skip truncated results. Webhooks are delivered at least once, so receivers must deduplicate event IDs.

## Source map

- `src/worker/` — ingestion, K2 consumer, ClickHouse client, queries, snapshots, alerts, MCP, and HTTP routing.
- `src/web/` — React/Kumo dashboard, chart renderer, and MCP App.
- `clickhouse/schema.sql`, `migrations/` — ClickHouse and D1 schema.
- `proto/` — pinned Apache-2.0 OpenTelemetry protocol definitions and provenance.
- `test/` — protocol normalization, failure/retry behavior, deterministic queries, and immutable results.
