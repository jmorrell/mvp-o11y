# SQL alerts

Create an alert through MCP `create_alert` or `POST /api/alerts` using arbitrary
ClickHouse SQL. CTEs, joins, aggregations, and metrics tables are available through
the same read-only query path as `run_query`. Configure the dedicated ClickHouse
query credentials described in the [deployment instructions](../README.md).

For example, this rule compares checkout's p99 latency with 500 milliseconds:

```json
{
  "name": "Checkout p99 latency",
  "sql": "SELECT quantileExact(0.99)(Duration) / 1000000 AS p99 FROM otel_traces WHERE Timestamp >= parseDateTime64BestEffort({from:String}, 9, 'UTC') AND Timestamp < parseDateTime64BestEffort({to:String}, 9, 'UTC') AND ServiceName = {service:String} AND ParentSpanId = '' HAVING count() > 0",
  "parameters": { "service": "checkout" },
  "valueColumn": "p99",
  "windowMinutes": 5,
  "threshold": 500,
  "comparison": "gt",
  "webhookUrl": "https://hooks.example.com/alert",
  "cooldownMinutes": 15,
  "enabled": true
}
```

SQL alerts bind `from` and `to` as absolute UTC ISO timestamps for the evaluation
window. A poll at `12:05:30Z` with `windowMinutes: 5` supplies `12:00:00.000Z` and
`12:05:00.000Z` on that date. Use these parameters explicitly in SQL for a
`[from, to)` window; the server does not rewrite the query or inject a time
filter. Custom parameters accept strings and finite numbers, using ClickHouse's
`{name:Type}` syntax. `from` and `to` are reserved and cannot be overridden.
At most 98 custom parameters are accepted, leaving two slots for the window.

Return exactly one row with a finite numeric value in `valueColumn` (default
`value`). Numeric strings returned by ClickHouse for decimals and wide integers
are accepted. Extra columns are allowed. Empty or multiple rows, null, missing
columns, booleans, nonnumeric or nonfinite values, and truncated results count as
failed evaluations and never trigger. Failures are logged with the rule ID,
without query text, parameters, or ClickHouse error details. Choose the meaning
of an empty source window in SQL: `count()` can produce a valid zero, while
`HAVING count() > 0` suppresses an empty aggregate result.

Thresholds can be any finite number, including negative values. Comparisons are
`gt`, `gte`, `lt`, and `lte`. Defaults are a five-minute window, `gt`, a
15-minute cooldown, and `enabled: true`. The query must return one value for the
whole window; it is not automatically reduced across rows or divided by time.

Each rule has exactly one source: `sql` or the existing `template` preset.
`parameters` and `valueColumn` belong to SQL rules; the top-level `service` field
belongs to presets. Setting `sql` in an update switches to SQL and clears preset
fields. Setting `template` switches to a preset and clears SQL fields. Other
omitted fields retain their previous values, including cooldown and enabled
status. Use `parameters: {}` to clear custom parameters. Existing persisted
preset rules continue to work without a migration.

Triggered webhook bodies include the executed `sql`, resolved `parameters`,
query specification, numeric `value`, `unit: "value"`, and selected
`alert.valueColumn`. The durable outbox retains that evidence unchanged on
delivery retries, even if the alert is edited later. Scheduling, cooldowns,
signatures, and delivery retries follow the existing
[webhook contract](mcp.md#alerts-and-webhooks).
