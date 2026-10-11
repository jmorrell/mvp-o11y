import type { QueryResult, VisualizationKind } from "../shared/types";

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
function timestampNs(value: string): bigint {
  const normalized = value.replace(" ", "T");
  const match = normalized.match(/^(.*?)(?:\.(\d+))?(Z|[+-]\d{2}:?\d{2})?$/);
  if (!match) return 0n;
  const milliseconds = Date.parse(`${match[1]}${match[3] || "Z"}`);
  if (!Number.isFinite(milliseconds)) return 0n;
  return (
    BigInt(milliseconds) * 1000000n +
    BigInt((match[2] || "").padEnd(9, "0").slice(0, 9) || "0")
  );
}
function timeLabel(value: unknown) {
  const date = new Date(String(value));
  return Number.isNaN(date.valueOf())
    ? String(value)
    : date.toISOString().slice(11, 16);
}
export function Visualization({
  result,
  kind,
  compact = false,
}: {
  result: QueryResult;
  kind: VisualizationKind;
  compact?: boolean;
}) {
  const rows = result.rows;
  if (!rows.length)
    return (
      <div className="empty-visual">
        <span className="empty-orbit">∅</span>
        <strong>No matching events</strong>
        <p>Try a wider time range or a different service.</p>
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
            Result limit reached. Narrow the time range for more detail.
          </p>
        )}
      </div>
    );
  }
  if (kind === "waterfall") {
    const spans = rows.map((row) => ({
      name: String(pick(row, ["name", "span_name", "SpanName"], "span")),
      service: String(
        pick(row, ["service", "service_name", "ServiceName"], "service"),
      ),
      id: String(pick(row, ["spanId", "span_id", "SpanId"])),
      parent: String(
        pick(row, ["parentSpanId", "parent_span_id", "ParentSpanId"]),
      ),
      startNs:
        row.start_ms !== undefined
          ? BigInt(Math.round(Number(row.start_ms) * 1e6))
          : row.startTimeUnixNano !== undefined
            ? BigInt(String(row.startTimeUnixNano))
            : timestampNs(
                String(
                  pick(row, [
                    "startTime",
                    "timestamp",
                    "Timestamp",
                    "start_time",
                  ]),
                ),
              ),
      duration: Number(pick(row, ["durationMs", "duration_ms", "duration"], 0)),
      status: String(pick(row, ["status", "StatusCode", "status_code"])),
    }));
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
    const cells = rows.map((row) => ({
      time: String(pick(row, ["time", "timestamp"])),
      bucket: number(
        pick(row, [
          "bucket",
          "latency_bucket_ms",
          "latency_ms",
          "duration_bucket",
          "bucket_ms",
        ]),
      ),
      count: number(pick(row, ["count", "value"])),
    }));
    const start = Math.floor(Date.parse(result.query.from) / 60000) * 60000;
    const end = Math.max(
      start + 60000,
      Math.ceil(Date.parse(result.query.to) / 60000) * 60000,
    );
    const topBucket = Math.max(...cells.map((cell) => cell.bucket + 50), 50);
    const maximum = Math.max(...cells.map((cell) => cell.count), 1);
    const w = 900,
      h = compact ? 200 : 280,
      left = 65,
      bottom = 38,
      top = 10;
    const plotW = w - left - 20,
      plotH = h - bottom - top;
    const cellW = (plotW * 60000) / (end - start),
      cellH = (plotH * 50) / topBucket;
    return (
      <div className="chart-wrap">
        <svg
          className="chart"
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-label="Latency heatmap with one-minute time buckets and 50 millisecond latency buckets"
        >
          <title>
            Root span latency distribution over time; empty cells have no
            returned observations
          </title>
          <rect x={left} y={top} width={plotW} height={plotH} fill="#f8f9fb" />
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
            <g key={tick}>
              <text
                x={left - 10}
                y={top + plotH * (1 - tick) + 4}
                textAnchor="end"
              >
                {formatNumber(topBucket * tick)} ms
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
            const x =
              left + (plotW * (Date.parse(cell.time) - start)) / (end - start);
            const y = top + plotH * (1 - (cell.bucket + 50) / topBucket);
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
                <title>{`${timeLabel(cell.time)} UTC · ${cell.bucket}–${cell.bucket + 50} ms · ${cell.count} spans`}</title>
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
              {timeLabel(new Date(start + (end - start) * tick).toISOString())}
            </text>
          ))}
        </svg>
        <div className="chart-legend">
          <span>1 min × 50 ms buckets · UTC</span>
          <span className="heatmap-key">
            Fewer <i /> More spans
          </span>
        </div>
      </div>
    );
  }
  if (
    rows.length === 1 &&
    rows[0].time === undefined &&
    result.query.template === "error_rate"
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
  const groupKey = rows.some(
    (row) =>
      row.service !== undefined ||
      row.service_name !== undefined ||
      row.ServiceName !== undefined,
  )
    ? ["service", "service_name", "ServiceName"]
    : [];
  const series = [
    ...new Set(
      rows.map((row) =>
        String(
          pick(
            row,
            groupKey,
            result.query.template === "error_rate"
              ? "Error rate (%)"
              : "Requests / second",
          ),
        ),
      ),
    ),
  ];
  const points = rows.map((row) => ({
    time: String(pick(row, ["time", "timestamp", "bucket"])),
    value: number(
      pick(row, ["value", "rate", "count", "error_rate", "requests"]),
    ),
    series: String(pick(row, groupKey, series[0])),
  }));
  const start = Math.floor(Date.parse(result.query.from) / 60000) * 60000;
  const end = Math.max(start + 60000, Date.parse(result.query.to));
  const max = Math.max(...points.map((point) => point.value), 1) * 1.15;
  const w = 900,
    h = compact ? 220 : 310,
    left = 52,
    right = 22,
    top = 20,
    bottom = 38,
    plotW = w - left - right,
    plotH = h - top - bottom;
  const xAt = (time: string) =>
    left + ((Date.parse(time) - start) / (end - start)) * plotW;
  const yAt = (value: number) => top + plotH * (1 - value / max);
  return (
    <div className="chart-wrap">
      <svg
        className="chart"
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label={`${result.query.template === "error_rate" ? "Error rate" : "Span volume"} over time`}
      >
        <title>{result.query.template.replaceAll("_", " ")}</title>
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
              y1={yAt(max * tick)}
              y2={yAt(max * tick)}
              stroke="#e7e9ed"
              strokeDasharray={tick ? "3 4" : undefined}
            />
            <text x={left - 12} y={yAt(max * tick) + 4} textAnchor="end">
              {formatNumber(max * tick)}
            </text>
          </g>
        ))}
        {series.map((name, index) => {
          const group = points
            .filter((point) => point.series === name)
            .sort((a, b) => a.time.localeCompare(b.time));
          const segments: (typeof points)[] = [];
          for (const point of group) {
            const previous = segments.at(-1)?.at(-1);
            if (
              !previous ||
              Date.parse(point.time) - Date.parse(previous.time) > 60001
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
                      d={`${path} L${xAt(segment.at(-1)!.time)},${top + plotH} L${xAt(segment[0].time)},${top + plotH} Z`}
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
            {timeLabel(new Date(start + (end - start) * tick).toISOString())}
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
