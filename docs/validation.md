# Validation

The initial implementation was checked with:

- `npm run check`: TypeScript, 72 unit/integration tests, React dashboard build, single-file MCP App build, and Wrangler Worker dry run.
- Real ClickHouse 26.3: applied the pinned seven-table schema, inserted all three OTLP fixtures (including five metric kinds), and executed every query preset. The same integration runs in GitHub Actions using a pinned container image.
- Actual workerd: decoded JSON and binary protobuf for every signal; results matched. Authenticated live query, snapshot creation, snapshot retrieval, and permanent view routes succeeded.
- Real MCP SDK client against the local Worker: initialization, nine tools, query templates, and the HTML app resource succeeded.
- Chromium: desktop preview navigation and all four visualizations, settings, mobile overflow/error checks, live query/save/reload/list flow, and MCP App host-bridge rendering plus chart/data switching. No page errors were observed.

Local ClickHouse used disposable fixture data. K2 production/consumption and remote webhook delivery were tested with mocks, including failure and retry paths; no live K2 account or external webhook was used. Cloudflare and ClickHouse Cloud deployment was not attempted because deployment credentials were not configured.

To run the real ClickHouse test, provision a disposable local ClickHouse server on port 8123 with default-user password `local-test-only`, apply `clickhouse/schema.sql` using `clickhouse-client --multiquery`, then run:

```sh
CLICKHOUSE_INTEGRATION=1 npx vitest run test/clickhouse.integration.test.ts
```

The integration test only targets `127.0.0.1`; never point it at production telemetry. The ordinary test command skips this one optional integration test. Browser checks used the existing local Chromium installation and a temporary Playwright harness; they are not part of CI.
