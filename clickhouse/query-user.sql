-- Apply as a ClickHouse administrator after schema.sql. Pass native parameters:
-- clickhouse-client --multiquery --database o11y \
--   --param_query_password "$QUERY_PASSWORD" < clickhouse/query-user.sql
-- Use a new dedicated account. CREATE deliberately fails if the user already
-- exists, rather than silently retaining an existing account's wider grants.
CREATE USER o11y_query
IDENTIFIED WITH sha256_password BY {query_password:String}
SETTINGS
    readonly = 1 CONST,
    allow_ddl = 0 CONST,
    allow_introspection_functions = 0 CONST,
    max_execution_time = 20 CONST,
    cancel_http_readonly_queries_on_client_close = 1 CONST,
    timeout_overflow_mode = 'throw' CONST,
    max_result_rows = 10001 CONST,
    max_result_bytes = 10000000 CONST,
    result_overflow_mode = 'throw' CONST,
    limit = 10001 CONST,
    max_memory_usage = 500000000 CONST,
    max_rows_to_read = 100000000 CONST,
    max_bytes_to_read = 10000000000 CONST,
    read_overflow_mode = 'throw' CONST,
    output_format_json_quote_64bit_integers = 1 CONST,
    session_timezone = 'UTC' CONST,
    send_progress_in_http_headers = 0 CONST;

GRANT SELECT ON otel_traces TO o11y_query;
GRANT SELECT ON otel_logs TO o11y_query;
GRANT SELECT ON otel_metrics_gauge TO o11y_query;
GRANT SELECT ON otel_metrics_sum TO o11y_query;
GRANT SELECT ON otel_metrics_histogram TO o11y_query;
GRANT SELECT ON otel_metrics_exponential_histogram TO o11y_query;
GRANT SELECT ON otel_metrics_summary TO o11y_query;

-- Do not grant INSERT, DDL, access-management, or SOURCES (URL/FILE/REMOTE/S3)
-- privileges to this user, and do not attach roles with broader grants. Use the
-- separate ingestion account for writes. CONST constraints prevent SQL SETTINGS
-- clauses (including nested SELECTs) from weakening the execution budgets.
