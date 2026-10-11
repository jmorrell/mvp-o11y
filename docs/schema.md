# ClickStack schema and OTLP compatibility

`clickhouse/schema.sql` creates the seven ClickStack telemetry tables in the selected ClickHouse database. It is adapted from the [ClickStack seed schemas](https://github.com/hyperdxio/hyperdx/tree/0b9153d5e3ff9c71d4cc9f2ab0086ca93208cb59/docker/otel-collector/schema/seed), pinned to HyperDX commit `0b9153d5e3ff9c71d4cc9f2ab0086ca93208cb59` on 2026-10-11. The upstream MIT license is included in `clickhouse/UPSTREAM-LICENSE`. ClickStack's [schema documentation](https://clickhouse.com/docs/use-cases/observability/clickstack/ingesting-data/schemas) describes this table family.

The schema preserves the source column names, types, sorting keys, partition keys, materialized columns, aliases, and indexes. The adaptations are: remove the database template prefix so the configured connection selects the database, remove TTL clauses, remove the now-unused `ttl_only_drop_parts` setting, and remove Goose annotations. No telemetry table expires data. Use **ClickHouse 26.2 or newer** because the current ClickStack schema uses production text indexes. ClickStack provides separate compatibility schemas for older versions; those are not used here.

This is a fresh-database bootstrap, not a schema migration engine. `CREATE TABLE IF NOT EXISTS` will not change an existing table or remove an existing TTL. When adopting a previously populated database, inspect each table's `SHOW CREATE TABLE` output and explicitly reconcile its schema and retention policy first.

| OTLP signal | ClickStack table | Time representation |
| --- | --- | --- |
| Traces | `otel_traces` | `Timestamp DateTime64(9)`, `Duration UInt64` in nanoseconds |
| Logs | `otel_logs` | `Timestamp DateTime64(9)` |
| Gauge | `otel_metrics_gauge` | `TimeUnix` and `StartTimeUnix` as `DateTime` |
| Sum | `otel_metrics_sum` | `DateTime` |
| Histogram | `otel_metrics_histogram` | `DateTime` |
| Exponential histogram | `otel_metrics_exponential_histogram` | `DateTime` |
| Summary | `otel_metrics_summary` | `DateTime` |

The exponential histogram table name follows **ClickStack**, which uses a longer name than the upstream exporter default `otel_metrics_exp_histogram`. The tables for browser session replay, metric timeseries optimizations, and rollup materialized views are outside this project's OTLP ingestion scope.

## Wire protocol and mapping

The Worker accepts OTLP/HTTP JSON and binary protobuf on `/v1/traces`, `/v1/logs`, and `/v1/metrics`, including gzip requests. It does not provide an OTLP/gRPC listener. JSON uses the [OTLP JSON encoding](https://opentelemetry.io/docs/specs/otlp/#json-protobuf-encoding): lower-camel-case field names, hex trace/span IDs, integer enums, and decimal strings for 64-bit integers. JSON numbers exceeding the JavaScript safe integer range are rejected rather than rounded; send a decimal string for those fields.

The normalizer follows the mappings in ClickStack's pinned collector dependency, [OpenTelemetry Collector Contrib v0.155.0](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/v0.155.0/exporter/clickhouseexporter):

- Resource `service.name` becomes `ServiceName`; missing service names are empty strings.
- Trace kinds are `Unspecified`, `Internal`, `Server`, `Client`, `Producer`, or `Consumer`. Status codes are `Unset`, `Ok`, and `Error`.
- Trace IDs and span IDs are lower-case hexadecimal. All-zero IDs become empty strings, including the parent ID of a root span.
- Log timestamps use `timeUnixNano`, falling back to `observedTimeUnixNano` when zero. Missing timestamps become the Unix epoch, keeping retries deterministic.
- AnyValue attributes and log bodies become strings. Nested arrays/maps become JSON; integer attributes retain their complete decimal representation. Bytes become base64.
- Events, links, metric exemplars, summary quantiles, and positive/negative exponential histogram buckets map to their corresponding array columns.

Malformed bodies, mismatched signal envelopes, invalid IDs, out-of-range timestamps, unsafe integer numbers, malformed histogram buckets, and missing or multiple metric types are rejected before acceptance. Empty export requests are valid. Known unsupported profile string-table references are rejected. Unknown protobuf fields are skipped as required by protobuf forward compatibility.

## Schema limits and permanent source data

ClickStack intentionally stores metrics and metric exemplars at **whole-second precision**, and number metric values as `Float64`. Thus metric timestamp nanoseconds and integer metric values beyond Float64 precision cannot be represented exactly in those columns. The normalizer carries integer values as decimal strings up to insertion; ClickHouse then performs the schema's Float64 conversion. Logs, traces, and trace events preserve all nine timestamp fractional digits. Count, bucket count, duration, and other UInt64 columns preserve integers exactly.

ClickStack's schema does not have columns for every OTLP field. For example, it does not retain exponential histogram `zeroThreshold`, metric metadata, all dropped-field counters, trace flags, or resource entity references. Optional histogram `sum`, `min`, and `max` use the collector's zero defaults when absent. These are compatibility limits of this schema. The ingest pipeline archives the complete original request bytes to R2 before acknowledging ingestion, so the original precision, presence information, and otherwise-unmapped fields remain available for replay or a future schema extension. Both raw archives and visualization snapshots must use buckets without expiration lifecycle rules.

DateTime64(9) values are bounded by its signed 64-bit storage; metric DateTime values are bounded by its unsigned 32-bit second range. Out-of-range input fails validation instead of becoming a permanently uninsertable batch.

## Protobuf provenance and generation

The complete official `.proto` sources needed by the three export services are vendored in `proto/`, pinned to [opentelemetry-proto commit `4af62f3bdd60ebc5751ee0a571b7503b769479cf`](https://github.com/open-telemetry/opentelemetry-proto/tree/4af62f3bdd60ebc5751ee0a571b7503b769479cf). Their Apache-2.0 license is in `proto/LICENSE`.

`src/worker/otlp-proto.js` contains a static decoder generated using `protobufjs-cli@1.1.3`. It uses `protobufjs/minimal`, so production decoding requires no filesystem access or dynamic code evaluation. The JSON descriptor is used only by Node tests to encode independent binary fixtures. The corresponding declarations are generated from the commented static module.

To regenerate with the pinned compiler (from the repository root):

```sh
npm exec --yes --package=protobufjs-cli@1.1.3 -- pbjs \
  -t static-module -w es6 --no-create --no-encode --no-verify --no-delimited --no-service --no-typeurl \
  -p proto -o /tmp/mvp-o11y-otlp-proto.js \
  proto/opentelemetry/proto/collector/trace/v1/trace_service.proto \
  proto/opentelemetry/proto/collector/logs/v1/logs_service.proto \
  proto/opentelemetry/proto/collector/metrics/v1/metrics_service.proto
npm exec --yes --package=protobufjs-cli@1.1.3 -- pbts \
  -o src/worker/otlp-proto.d.ts /tmp/mvp-o11y-otlp-proto.js
cp /tmp/mvp-o11y-otlp-proto.js src/worker/otlp-proto.js
npm exec --yes --package=protobufjs-cli@1.1.3 -- pbjs \
  -t json -p proto -o src/worker/otlp-proto.json \
  proto/opentelemetry/proto/collector/trace/v1/trace_service.proto \
  proto/opentelemetry/proto/collector/logs/v1/logs_service.proto \
  proto/opentelemetry/proto/collector/metrics/v1/metrics_service.proto
```

The checked-in static JavaScript omits generated JSDoc comments to reduce source size. Regeneration with comments has the same runtime behavior. Run `npm test -- test/otlp.test.ts` after updating the schemas or decoder. JSON fixtures for all three signals, including all five metric families, are in `test/fixtures/`.
