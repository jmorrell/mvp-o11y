# Architecture decisions

## One workspace, two credentials

All routes execute in one Cloudflare account/workspace. An administration token controls queries, saved views, MCP, and alerts. A separate ingestion token only exports telemetry. Tokens never travel in permanent URLs or MCP resource HTML. Static frontend assets contain no secrets; saved data requires an authenticated API read. Shared links therefore work for people and clients with workspace access.

## Archive before queue

The ingress Worker bounds and decodes an OTLP request, validates the data, writes its exact decompressed bytes to R2, then appends an archive pointer to K2. A retryable queue failure can leave an unqueued archive object, but it cannot produce an acknowledged request with no archive. The SDK receives success only after both writes succeed. The producer does not perform ClickHouse inserts.

K2 polling is driven by Cron Triggers until K2 supports Worker push consumers. A subscription lease groups archive pointers. The consumer normalizes records to ClickStack rows, waits for ClickHouse's insert acknowledgment, persists receipts, and acknowledges K2 only after all records are processed. ClickHouse asynchronous insertion combines concurrent insert traffic on the server while `wait_for_async_insert=1` keeps acknowledgment tied to a durable flush.

## A saved visualization is an immutable result

Live queries execute the supplied ClickHouse SQL with bound parameters and a dedicated SELECT-only account. Optional presets provide examples with explicit UTC time bounds and ordering. ClickHouse parses the complete statement and enforces privileges and immutable settings constraints; the Worker does not classify SQL using a keyword blacklist. Snapshot creation saves the actual executed SQL and parameters alongside the rows and rendering kind. Rendering a saved result never calls ClickHouse. A UUID URL identifies the immutable object; a digest of the versioned content provides a reproducibility check. Preset windows use millisecond UTC boundaries. Row limits and truncation are recorded.

Arbitrary SQL is the primary query interface. SQL is sent unchanged, including comments and trailing semicolons; the HTTP interface supplies the default JSON result format. Dedicated query credentials are required for custom SQL, and server-side constraints plus Worker response limits bound resource use. Queries may deliberately use functions such as `now()` or `rand()`. Explicit parameters and ordering make the query definition repeatable; the immutable snapshot captures the actual result even when later executions differ. Column mappings are saved with charts so arbitrary SQL aliases work in the dashboard and MCP App.

## MCP is a first-class interface

REST, MCP, the dashboard, and scheduled alert evaluation invoke the same service functions. MCP resources serve a bundled React app, and tool results supply the saved snapshot. The app uses the host SDK to receive tool results instead of putting a bearer token inside the iframe. An MCP client without app support can still read the text/structured result and permanent URL.

## Alerts for agents

Rules supply SQL and a numeric result column, or select an existing preset, together with an evaluation window. SQL rules receive reserved absolute `from` and `to` parameters and must return one numeric scalar row. Each minute's evaluation has fixed boundaries and creates an outbox event when the threshold and cooldown conditions match. Webhook destinations are explicitly configured HTTPS hosts. Signatures cover the timestamp and exact payload bytes; receivers verify freshness and deduplicate event IDs. Delivery attempts and failures are durable in D1.

## Retention and future work

K2 is a transient transport with finite retention. R2 archives and ClickHouse tables have no automatic expiry. Storage cost grows with telemetry volume. Future priorities are replay/backfill tooling, ingestion lag/poison-record visibility, tenant isolation and OAuth, additional metric query examples, alert evidence snapshots/recovery signals, and K2 push consumers when available.
