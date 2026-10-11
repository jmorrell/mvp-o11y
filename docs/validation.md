# Validation

The implementation, including arbitrary SQL, was checked with:

- `npm run check`: TypeScript, 97 automated tests, React dashboard build, single-file MCP App build, and Wrangler Worker dry run.
- Six additional tests against real ClickHouse 26.3: applied the pinned seven-table schema and restricted query account, inserted all three OTLP fixtures (including five metric kinds), and executed every query preset. Arbitrary SQL checks cover CTEs, joins, windows, unions, typed parameters, comments, truncation, and error reporting. Writes, DDL, multiple statements, external data sources, and attempts to relax resource budgets were denied or constrained by ClickHouse. The same integration runs in GitHub Actions using a pinned container image.
- Actual workerd: decoded JSON and binary protobuf for every signal; results matched. Authenticated live query, snapshot creation, snapshot retrieval, and permanent view routes succeeded.
- Real MCP SDK client against the local Worker: initialization, ten advertised tools, SQL input schemas, schema discovery (174 fixture columns), parameterized CTE execution, SQL snapshot creation, query templates, and the HTML app resource succeeded.
- Chromium: desktop preview navigation and all four visualizations, settings, mobile overflow/error checks, live query/save/reload/list flow, and MCP App host-bridge rendering plus chart/data switching. The SQL editor ran a parameterized CTE with custom column aliases and negative values, saved its exact SQL/parameters/mapping, and reloaded the permanent chart. The same SQL snapshot rendered through the MCP App bridge. SQL alert creation, editing, persistence, and deletion also passed with a paused rule, a custom value column, and a negative threshold. No page errors were observed.

Local ClickHouse used disposable fixture data. K2 production/consumption and remote webhook delivery were tested with mocks, including failure and retry paths; no live K2 account or external webhook was used. Cloudflare and ClickHouse Cloud deployment was not attempted because deployment credentials were not configured.

To run the real ClickHouse tests, provision a disposable local ClickHouse server on port 8123 with default-user password `local-test-only` and access management enabled. Apply `clickhouse/schema.sql` using `clickhouse-client --multiquery`, then provision the query account and run:

```sh
clickhouse-client --password local-test-only --database default \
  --param_query_password=local-query-only --multiquery < clickhouse/query-user.sql
CLICKHOUSE_INTEGRATION=1 npx vitest run test/clickhouse.integration.test.ts
```

The integration suite only targets `127.0.0.1`; never point it at production telemetry. The ordinary test command skips these six optional tests. Browser checks used the existing local Chromium installation and a temporary Playwright harness; they are not part of CI.
