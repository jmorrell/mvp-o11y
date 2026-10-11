# SQL queries and saved visualizations

`POST /api/query` and the MCP `run_query` tool accept arbitrary read-only
ClickHouse result queries. CTEs, joins, subqueries, unions, window functions,
aggregations, and the ClickStack metric tables are available. Existing preset
query objects remain supported.

```json
{
  "sql": "SELECT ServiceName AS service, quantile(0.99)(Duration / 1000000.0) AS p99_ms FROM otel_traces WHERE Timestamp >= parseDateTime64BestEffort({from:String}, 9, 'UTC') AND Timestamp < parseDateTime64BestEffort({to:String}, 9, 'UTC') GROUP BY service ORDER BY p99_ms DESC, service",
  "parameters": {
    "from": "2026-10-11T00:00:00Z",
    "to": "2026-10-12T00:00:00Z"
  },
  "limit": 1000
}
```

Parameters use ClickHouse's native `{name:Type}` placeholders. Values are sent
separately as HTTP `param_name` values; they are never substituted into SQL by
the Worker. Supply strings or finite numbers. Use decimal strings for integers
larger than JavaScript's safe integer range, including `UInt64` parameters.
Arrays, dates, and other complex types can be supplied in ClickHouse's textual
parameter syntax as strings. Names must match `[A-Za-z_][A-Za-z0-9_]*`. Up to 100
parameters are accepted.

SQL is preserved exactly, including trailing semicolons and comments. ClickHouse
parses and executes one statement; multiple statements are rejected. Omit an
explicit output format or use `FORMAT JSON`. Other output formats fail result
validation. Syntax, unknown-column, type, and access errors return bounded
ClickHouse diagnostics with configured credentials redacted.

## Provision the query account

Apply `clickhouse/schema.sql` first. Then, using an administrator account in the
database containing those tables, run:

```sh
clickhouse-client --host YOUR_CLICKHOUSE_HOST --secure \
  --user YOUR_ADMIN_USER --password \
  --database o11y --multiquery \
  --param_query_password "$QUERY_PASSWORD" < clickhouse/query-user.sql
npx wrangler secret put CLICKHOUSE_QUERY_PASSWORD
```

Set `CLICKHOUSE_QUERY_USER` to `o11y_query` and use the same generated password
for the Worker secret. The script intentionally fails when that user already
exists: inspect its grants and settings before reusing an existing account.
Unqualified grants resolve against `--database`, so pass the database used by
`CLICKHOUSE_DATABASE`.

Raw SQL fails closed unless both query credentials are configured. The account
has SELECT grants on the seven telemetry tables, read-only execution, and
constant resource budgets. Give it additional table-specific SELECT grants if
you add application tables for joins. Keep ingestion on the separate
`CLICKHOUSE_USER` / `CLICKHOUSE_PASSWORD` account. Presets use the query account
when configured and retain the old ingestion-account fallback for existing
deployments.

The server enforces 20 seconds of execution time, 500 MB of memory, 100 million
rows / 10 GB of uncompressed data read, and 10 MB of result data. The query result
is capped at 10,001 rows; the API returns up to the requested `limit` (1–10,000,
default 1,000) and sets `truncated` when it removes extra rows. Keep predicates
and explicit SQL limits appropriate to the data size. The Worker separately
enforces result bytes/rows and a 25-second HTTP timeout. A server budget violation
returns an error instead of a partial successful result. SQL `SETTINGS` clauses
cannot relax the protected limits. The account has no writes, DDL, access
management, or external URL/FILE/REMOTE/S3 source privileges.

SQL strings are limited to 48,000 characters. HTTP request bodies (SQL,
parameters, and any snapshot metadata together) have a 65,536-byte limit.

## Visualizations and permanent URLs

Send `POST /api/snapshots` or call the MCP `create_visualization` tool with the query,
a title, and a visualization. Use aliases matching the chart's canonical fields,
or supply a `mapping` from canonical fields to result column names:

```json
{
  "title": "Latency by service",
  "visualization": "line",
  "query": {
    "sql": "SELECT toStartOfMinute(Timestamp) AS minute, ServiceName, avg(Duration / 1000000.0) AS latency_ms FROM otel_traces WHERE Timestamp >= parseDateTime64BestEffort({from:String}, 9, 'UTC') AND Timestamp < parseDateTime64BestEffort({to:String}, 9, 'UTC') GROUP BY minute, ServiceName ORDER BY minute, ServiceName",
    "parameters": {
      "from": "2026-10-11T00:00:00Z",
      "to": "2026-10-11T01:00:00Z"
    }
  },
  "mapping": {
    "time": "minute",
    "value": "latency_ms",
    "series": "ServiceName"
  }
}
```

| Visualization | Required fields                             | Optional fields                     |
| ------------- | ------------------------------------------- | ----------------------------------- |
| Table         | Any result columns                          | None                                |
| Line          | `time`, `value`                             | `series`, `service`                 |
| Heatmap       | `time`, `bucket`, `count`                   | `timeBucketMs`, `valueBucketSize`   |
| Waterfall     | `spanId`, `name`, `startTime`, `durationMs` | `parentSpanId`, `service`, `status` |

Mappings refer to column names; `timeBucketMs` and `valueBucketSize` are positive
numeric display widths for heatmaps. Every explicitly mapped column and every
required chart field must be present in the result metadata, even when there are
no rows. Invalid mappings fail before writing a snapshot. For canonical SQL,
alias time fields to `time` (or `startTime`), durations to milliseconds, and
heatmap buckets to their numeric lower bounds. Return parseable UTC timestamps.

A snapshot stores the exact SQL, bound parameters, returned columns/rows,
execution timestamp, truncation flag, visualization, and mapping in R2. Its
digest covers those values. The permanent authenticated URL and MCP App read
that immutable object and never rerun the query. Existing preset snapshots
remain readable.

## Repeatability

Arbitrary SQL can use `now()`, `rand()`, unordered results, or data that changes
between executions. The service does not rewrite these expressions or promise
that running such a query again produces identical results. For repeatable
query intent, bind absolute time bounds, use deterministic expressions, and
include `ORDER BY` with a stable tie-breaker before applying a limit. Late-arriving
telemetry can still change a later execution. Saving a snapshot freezes the
actual result and its source query permanently, regardless of later ingestion.
