import {
  isSqlQuery,
  type QueryResult,
  type VisualizationKind,
  type VisualizationMapping,
} from "../shared/types";

const colors = ["#f48120", "#3b82f6", "#14b8a6", "#8b5cf6", "#ec4899"];
const number = (value: unknown) => Number(value ?? 0);
const pick = (
  row: Record<string, unknown>,
  names: string[],
  fallback: unknown = "",
) => {
  for (const name of names) if (row[name] !== undefined) return row[name];
  return fallback;
};
const printable = (value: unknown): string =>
  typeof value === "object" && value !== null
    ? JSON.stringify(value)
    : String(value ?? "—");
export function formatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: value < 10 ? 2 : 1,
    notation: value >= 10000 ? "compact" : "standard",
  }).format(value);
}
function numeric(value: unknown): number | undefined {
  if (typeof value !== "number" && typeof value !== "string") return undefined;
  if (typeof value === "string" && !value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
function timestampNs(value: unknown): bigint | undefined {
  const epoch = numeric(value);
  if (epoch !== undefined)
    return Math.abs(epoch) <= 8.64e15
      ? BigInt(Math.round(epoch * 1e6))
      : undefined;
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().replace(" ", "T");
  const match = normalized.match(/^(.*?)(?:\.(\d+))?(Z|[+-]\d{2}:?\d{2})?$/);
  if (!match) return undefined;
  const milliseconds = Date.parse(`${match[1]}${match[3] || "Z"}`);
  if (!Number.isFinite(milliseconds)) return undefined;
  return (
    BigInt(milliseconds) * 1000000n +
    BigInt((match[2] || "").padEnd(9, "0").slice(0, 9) || "0")
  );
}
function timeMs(value: unknown): number | undefined {
  const nanoseconds = timestampNs(value);
  return nanoseconds === undefined ? undefined : Number(nanoseconds) / 1e6;
}
function timeLabel(value: unknown) {
  const parsed = timeMs(value);
  return parsed === undefined
    ? String(value)
    : new Date(parsed).toISOString().slice(11, 19);
}
function spacing(values: number[]): number | undefined {
  const sorted = [...new Set(values)].sort((a, b) => a - b);
  let minimum = Infinity;
  for (let i = 1; i < sorted.length; i++)
    minimum = Math.min(minimum, sorted[i] - sorted[i - 1]);
  return Number.isFinite(minimum) && minimum > 0 ? minimum : undefined;
}
function positive(value: number | undefined) {
  return value !== undefined && Number.isFinite(value) && value > 0
    ? value
    : undefined;
}
function MappingFeedback({ fields }: { fields: string }) {
  return (
    <div className="empty-visual">
      <strong>No plottable rows</strong>
      <p>
        Choose column mappings for {fields}. Time columns accept date strings or
        epoch milliseconds; numeric columns must contain finite numbers.
      </p>
    </div>
  );
}
function SkippedRows({ count }: { count: number }) {
  return count > 0 ? (
    <p className="table-note">
      Skipped {count} {count === 1 ? "row" : "rows"} with missing or invalid
      mapped values. Check the column mappings and query results.
    </p>
  ) : null;
}
export function Visualization({
  result,
  kind,
  compact = false,
  mapping = {},
}: {
  result: QueryResult;
  kind: VisualizationKind;
  compact?: boolean;
  mapping?: VisualizationMapping;
}) {
  const rows = result.rows;
  const sqlQuery = isSqlQuery(result.query);
  const template = isSqlQuery(result.query) ? undefined : result.query.template;
  const mapped = (
    row: Record<string, unknown>,
    key: Exclude<
      keyof VisualizationMapping,
      "timeBucketMs" | "valueBucketSize"
    >,
    aliases: string[],
    fallback?: unknown,
  ) => (mapping[key] ? row[mapping[key]] : pick(row, aliases, fallback));
  const presetBounds = isSqlQuery(result.query)
    ? undefined
    : { from: timeMs(result.query.from), to: timeMs(result.query.to) };
  if (!rows.length)
    return (
      <div className="empty-visual">
        <span className="empty-orbit">∅</span>
        <strong>No matching events</strong>
        <p>Adjust the query or choose a wider time range.</p>
      </div>
    );
  if (kind === "table") {
    return (
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {result.columns.map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {result.columns.map((key) => (
                  <td key={key} title={printable(row[key])}>
                    <span
                      className={
                        /severity/i.test(key)
                          ? `severity severity-${printable(row[key]).toLowerCase()}`
                          : ""
                      }
                    >
                      {printable(row[key])}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {result.truncated && (
          <p className="table-note">
            Result limit reached. Refine the query for more detail.
          </p>
        )}
      </div>
    );
  }
  if (kind === "waterfall") {
    const spans = rows.flatMap((row) => {
      let startNs: bigint | undefined;
      if (mapping.startTime) startNs = timestampNs(row[mapping.startTime]);
      else if (row.start_ms !== undefined) startNs = timestampNs(row.start_ms);
      else if (row.startTimeUnixNano !== undefined) {
        const raw = String(row.startTimeUnixNano);
        if (/^-?\d+$/.test(raw) && raw.length <= 23) {
          const parsed = BigInt(raw);
          if (
            parsed >= -8640000000000000000000n &&
            parsed <= 8640000000000000000000n
          )
            startNs = parsed;
        }
      } else
        startNs = timestampNs(
          pick(row, ["startTime", "timestamp", "Timestamp", "start_time"]),
        );
      const duration = numeric(
        mapped(row, "durationMs", ["durationMs", "duration_ms", "duration"]),
      );
      if (startNs === undefined || duration === undefined || duration < 0)
        return [];
      return [
        {
          name: String(
            mapped(row, "name", ["name", "span_name", "SpanName"], "span") ??
              "span",
          ),
          service: String(
            mapped(
              row,
              "service",
              ["service", "service_name", "ServiceName"],
              "service",
            ) ?? "service",
          ),
          id: String(
            mapped(row, "spanId", ["spanId", "span_id", "SpanId"], "") ?? "",
          ),
          parent: String(
            mapped(
              row,
              "parentSpanId",
              ["parentSpanId", "parent_span_id", "ParentSpanId"],
              "",
            ) ?? "",
          ),
          startNs,
          duration,
          status: String(
            mapped(
              row,
              "status",
              ["status", "StatusCode", "status_code"],
              "",
            ) ?? "",
          ),
        },
      ];
    });
    if (!spans.length)
      return <MappingFeedback fields="startTime and durationMs" />;
    const origin = spans.reduce(
      (minimum, span) => (span.startNs < minimum ? span.startNs : minimum),
      spans[0].startNs,
    );
    const offset = (start: bigint) => Number(start - origin) / 1000000;
    const total = Math.max(
      ...spans.map((span) => offset(span.startNs) + span.duration),
      0.001,
    );
    const services = [...new Set(spans.map((span) => span.service))];
    const spansById = new Map(spans.map((span) => [span.id, span]));
    const depth = (parent: string, seen = new Set<string>()): number => {
      if (!parent || seen.has(parent) || seen.size > 12) return 0;
      seen.add(parent);
      const ancestor = spansById.get(parent);
      return ancestor ? 1 + depth(ancestor.parent, seen) : 0;
    };
    return (
      <div className="waterfall">
        <SkippedRows count={rows.length - spans.length} />
        <div className="waterfall-axis">
          <span>Service / operation</span>
          <div>
            {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
              <span key={tick}>{formatNumber(total * tick)} ms</span>
            ))}
          </div>
        </div>
        {spans.map((span, index) => (
          <div className="waterfall-row" key={index}>
            <div
              className="span-name"
              style={{ paddingLeft: 14 + depth(span.parent) * 14 }}
            >
              <i
                style={{
                  background:
                    colors[services.indexOf(span.service) % colors.length],
                }}
              />
              <div>
                <strong title={span.name}>{span.name}</strong>
                <small>{span.service}</small>
              </div>
            </div>
            <div className="span-track">
              <div
                className={`span-bar ${/error|^2$/i.test(span.status) ? "span-error" : ""}`}
                style={{
                  left: `${Math.max(0, (offset(span.startNs) / total) * 100) || 0}%`,
                  width: `${Math.max(0.6, (span.duration / total) * 100)}%`,
                  background:
                    colors[services.indexOf(span.service) % colors.length],
                }}
                title={`${span.name}: ${formatNumber(span.duration)} ms`}
              />
              <span className="span-duration">
                {formatNumber(span.duration)} ms
              </span>
            </div>
          </div>
        ))}
        <div className="chart-legend">
          {services.map((service, index) => (
            <span key={service}>
              <i style={{ background: colors[index % colors.length] }} />
              {service}
            </span>
          ))}
        </div>
      </div>
    );
  }
  if (kind === "heatmap") {
    const cells = rows.flatMap((row) => {
      const time = timeMs(mapped(row, "time", ["time", "timestamp"]));
      const bucket = numeric(
        mapped(row, "bucket", [
          "bucket",
          "latency_bucket_ms",
          "latency_ms",
          "duration_bucket",
          "bucket_ms",
        ]),
      );
      const count = numeric(mapped(row, "count", ["count", "value"]));
      return time === undefined ||
        bucket === undefined ||
        count === undefined ||
        count < 0
        ? []
        : [{ time, bucket, count }];
    });
    if (!cells.length)
      return <MappingFeedback fields="time, bucket, and count" />;
    const timeBucket =
      positive(mapping.timeBucketMs) ??
      (sqlQuery ? (spacing(cells.map((cell) => cell.time)) ?? 60000) : 60000);
    const valueBucket =
      positive(mapping.valueBucketSize) ??
      (sqlQuery ? (spacing(cells.map((cell) => cell.bucket)) ?? 1) : 50);
    const start =
      presetBounds?.from !== undefined
        ? Math.floor(presetBounds.from / timeBucket) * timeBucket
        : Math.min(...cells.map((cell) => cell.time));
    const end = Math.max(
      start + timeBucket,
      presetBounds?.to !== undefined
        ? Math.ceil(presetBounds.to / timeBucket) * timeBucket
        : Math.max(...cells.map((cell) => cell.time)) + timeBucket,
    );
    const bottomBucket = sqlQuery
      ? Math.min(...cells.map((cell) => cell.bucket))
      : Math.min(...cells.map((cell) => cell.bucket), 0);
    const topBucket = Math.max(
      ...cells.map((cell) => cell.bucket + valueBucket),
      bottomBucket + valueBucket,
    );
    const bucketRange = topBucket - bottomBucket;
    const maximum = Math.max(...cells.map((cell) => cell.count), 1);
    const latency = template === "latency_heatmap";
    const unit = latency ? " ms" : "";
    const w = 900,
      h = compact ? 200 : 280,
      left = 65,
      bottom = 38,
      top = 10;
    const plotW = w - left - 20,
      plotH = h - bottom - top;
    const cellW = (plotW * timeBucket) / (end - start),
      cellH = (plotH * valueBucket) / bucketRange;
    return (
      <div className="chart-wrap">
        <SkippedRows count={rows.length - cells.length} />
        <svg
          className="chart"
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-label={latency ? "Latency heatmap" : "Query result heatmap"}
        >
          <title>
            {`${latency ? "Root span latency distribution over time" : "Query result distribution over time"}; empty cells have no returned observations`}
          </title>
          <rect x={left} y={top} width={plotW} height={plotH} fill="#f8f9fb" />
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
            <g key={tick}>
              <text
                x={left - 10}
                y={top + plotH * (1 - tick) + 4}
                textAnchor="end"
              >
                {formatNumber(bottomBucket + bucketRange * tick)}
                {unit}
              </text>
              <line
                x1={left}
                x2={left + plotW}
                y1={top + plotH * (1 - tick)}
                y2={top + plotH * (1 - tick)}
                stroke="#eceff3"
              />
            </g>
          ))}
          {cells.map((cell, index) => {
            const x = left + (plotW * (cell.time - start)) / (end - start);
            const y =
              top +
              plotH *
                (1 - (cell.bucket + valueBucket - bottomBucket) / bucketRange);
            return (
              <rect
                key={index}
                x={x + (cellW > 3 ? 1 : 0)}
                y={y + (cellH > 3 ? 1 : 0)}
                width={Math.max(0.15, cellW - (cellW > 3 ? 2 : 0))}
                height={Math.max(0.15, cellH - (cellH > 3 ? 2 : 0))}
                rx={Math.min(2, cellH / 5)}
                fill={`rgba(244, 129, 32, ${0.15 + (0.85 * Math.log1p(cell.count)) / Math.log1p(maximum)})`}
              >
                <title>{`${timeLabel(cell.time)} UTC · ${cell.bucket}–${cell.bucket + valueBucket}${unit} · ${cell.count} ${latency ? "spans" : "observations"}`}</title>
              </rect>
            );
          })}
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((tick) => (
            <text
              key={tick}
              x={left + plotW * tick}
              y={h - 12}
              textAnchor="middle"
            >
              {timeLabel(start + (end - start) * tick)}
            </text>
          ))}
        </svg>
        <div className="chart-legend">
          <span>
            {formatNumber(timeBucket / 1000)} s × {formatNumber(valueBucket)}
            {unit} buckets · UTC
          </span>
          <span className="heatmap-key">
            Fewer <i /> More {latency ? "spans" : "observations"}
          </span>
        </div>
      </div>
    );
  }
  if (
    rows.length === 1 &&
    rows[0].time === undefined &&
    template === "error_rate"
  )
    return (
      <div className="aggregate-metric">
        <span>Error rate</span>
        <strong>
          {formatNumber(number(rows[0].value))}
          <small>%</small>
        </strong>
        <p>
          {formatNumber(number(rows[0].errors))} errors across{" "}
          {formatNumber(number(rows[0].total))} requests in the selected window
        </p>
      </div>
    );
  const defaultSeries = sqlQuery
    ? "Value"
    : template === "error_rate"
      ? "Error rate (%)"
      : "Requests / second";
  const points = rows.flatMap((row) => {
    const time = timeMs(mapped(row, "time", ["time", "timestamp", "bucket"]));
    const value = numeric(
      mapped(row, "value", [
        "value",
        "rate",
        "count",
        "error_rate",
        "requests",
      ]),
    );
    return time === undefined || value === undefined
      ? []
      : [
          {
            time,
            value,
            series: String(
              mapped(
                row,
                "series",
                ["series", "service", "service_name", "ServiceName"],
                defaultSeries,
              ) ?? defaultSeries,
            ),
          },
        ];
  });
  if (!points.length)
    return <MappingFeedback fields="time and value (and an optional series)" />;
  const series = [...new Set(points.map((point) => point.series))];
  // Infer each series independently so interleaved series do not create false gaps.
  const intervals = series.flatMap((name) => {
    const interval = spacing(
      points
        .filter((point) => point.series === name)
        .map((point) => point.time),
    );
    return interval === undefined ? [] : [interval];
  });
  const timeBucket =
    positive(mapping.timeBucketMs) ??
    (sqlQuery
      ? intervals.length
        ? Math.min(...intervals)
        : undefined
      : 60000);
  const start =
    presetBounds?.from !== undefined
      ? Math.floor(presetBounds.from / 60000) * 60000
      : Math.min(...points.map((point) => point.time));
  const end = Math.max(
    start + (timeBucket ?? 60000),
    presetBounds?.to ?? Math.max(...points.map((point) => point.time)),
  );
  const minValue = Math.min(...points.map((point) => point.value), 0);
  const maxValue = Math.max(...points.map((point) => point.value), 0);
  const padding = (maxValue - minValue || 1) * 0.15;
  const min = minValue < 0 ? minValue - padding : 0;
  const max = maxValue > 0 ? maxValue + padding : minValue < 0 ? 0 : 1;
  const w = 900,
    h = compact ? 220 : 310,
    left = 52,
    right = 22,
    top = 20,
    bottom = 38,
    plotW = w - left - right,
    plotH = h - top - bottom;
  const xAt = (time: number) => left + ((time - start) / (end - start)) * plotW;
  const yAt = (value: number) =>
    top + plotH * (1 - (value - min) / (max - min));
  return (
    <div className="chart-wrap">
      <SkippedRows count={rows.length - points.length} />
      <svg
        className="chart"
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label={`${sqlQuery ? "Query results" : template === "error_rate" ? "Error rate" : "Span volume"} over time`}
      >
        <title>
          {template?.replaceAll("_", " ") ?? "SQL query results over time"}
        </title>
        <defs>
          {series.map((_, index) => (
            <linearGradient
              id={`area-${compact ? "compact" : "full"}-${index}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
              key={index}
            >
              <stop
                offset="0%"
                stopColor={colors[index % colors.length]}
                stopOpacity=".16"
              />
              <stop
                offset="100%"
                stopColor={colors[index % colors.length]}
                stopOpacity="0"
              />
            </linearGradient>
          ))}
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
          <g key={tick}>
            <line
              x1={left}
              x2={w - right}
              y1={yAt(min + (max - min) * tick)}
              y2={yAt(min + (max - min) * tick)}
              stroke="#e7e9ed"
              strokeDasharray={tick ? "3 4" : undefined}
            />
            <text
              x={left - 12}
              y={yAt(min + (max - min) * tick) + 4}
              textAnchor="end"
            >
              {formatNumber(min + (max - min) * tick)}
            </text>
          </g>
        ))}
        {series.map((name, index) => {
          const group = points
            .filter((point) => point.series === name)
            .sort((a, b) => a.time - b.time);
          const gap =
            positive(mapping.timeBucketMs) ??
            (sqlQuery ? spacing(group.map((point) => point.time)) : 60000);
          const segments: (typeof points)[] = [];
          for (const point of group) {
            const previous = segments.at(-1)?.at(-1);
            if (
              !previous ||
              (gap !== undefined &&
                point.time - previous.time > gap + Math.max(1, gap * 0.001))
            )
              segments.push([point]);
            else segments[segments.length - 1].push(point);
          }
          return (
            <g key={name}>
              {segments.map((segment, segmentIndex) => {
                const path = segment
                  .map(
                    (point, i) =>
                      `${i ? "L" : "M"}${xAt(point.time)},${yAt(point.value)}`,
                  )
                  .join(" ");
                return (
                  <g key={segmentIndex}>
                    <path
                      d={`${path} L${xAt(segment.at(-1)!.time)},${yAt(0)} L${xAt(segment[0].time)},${yAt(0)} Z`}
                      fill={`url(#area-${compact ? "compact" : "full"}-${index})`}
                    />
                    <path
                      d={path}
                      fill="none"
                      stroke={colors[index % colors.length]}
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    {segment.map((point, i) => (
                      <circle
                        key={i}
                        cx={xAt(point.time)}
                        cy={yAt(point.value)}
                        r={segment.length === 1 ? 3 : 5}
                        fill={colors[index % colors.length]}
                        opacity={segment.length === 1 ? 1 : 0}
                        className="chart-point"
                      >
                        <title>{`${name} · ${timeLabel(point.time)} UTC · ${formatNumber(point.value)}`}</title>
                      </circle>
                    ))}
                  </g>
                );
              })}
            </g>
          );
        })}
        {[0, 0.2, 0.4, 0.6, 0.8, 1].map((tick) => (
          <text
            x={left + plotW * tick}
            y={h - 10}
            key={tick}
            textAnchor="middle"
          >
            {timeLabel(start + (end - start) * tick)}
          </text>
        ))}
      </svg>
      <div className="chart-legend">
        {series.map((name, index) => (
          <span key={name}>
            <i style={{ background: colors[index % colors.length] }} />
            {name}
          </span>
        ))}
        <span className="legend-right">Time (UTC)</span>
      </div>
    </div>
  );
}
