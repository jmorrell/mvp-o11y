import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Visualization } from "../src/web/Visualization";
import type { QueryResult } from "../src/shared/types";

const result = (
  template: QueryResult["query"]["template"],
  rows: QueryResult["rows"],
  to = "2026-10-11T10:10:00Z",
): QueryResult => ({
  query: { template, from: "2026-10-11T10:00:00Z", to },
  rows,
  columns: Object.keys(rows[0] ?? {}),
  sql: "SELECT test",
  parameters: {},
  executedAt: "2026-10-11T11:00:00Z",
  truncated: false,
});

describe("telemetry visualization accuracy", () => {
  it("keeps time proportional and leaves missing minute buckets disconnected", () => {
    const html = renderToStaticMarkup(
      <Visualization
        kind="line"
        result={result("request_rate", [
          { time: "2026-10-11T10:00:00Z", service: "api", value: 10 },
          { time: "2026-10-11T10:01:00Z", service: "api", value: 11 },
          { time: "2026-10-11T10:09:00Z", service: "api", value: 12 },
        ])}
      />,
    );
    const positions = [...html.matchAll(/<circle[^>]*cx="([\d.]+)"/g)].map(
      (match) => Number(match[1]),
    );
    expect(positions).toHaveLength(3);
    // Nine minutes must span nine times the distance of one minute, not two.
    expect(
      (positions[2] - positions[0]) / (positions[1] - positions[0]),
    ).toBeCloseTo(9);
    // The final observation follows an eight-minute gap and must be its own segment.
    const linePaths = [...html.matchAll(/<path d="([^"]+)" fill="none"/g)].map(
      (match) => match[1],
    );
    expect(linePaths).toHaveLength(2);
    expect(linePaths[0].match(/L/g)).toHaveLength(1);
    expect(linePaths[1]).not.toContain("L");
  });

  it("renders sparse heatmaps without allocating the Cartesian product of time and latency bins", () => {
    const rows = Array.from({ length: 250 }, (_, index) => ({
      time: new Date(
        Date.parse("2026-10-11T10:00:00Z") + index * 60000,
      ).toISOString(),
      bucket: index * 50,
      count: index + 1,
    }));
    const html = renderToStaticMarkup(
      <Visualization
        kind="heatmap"
        result={result("latency_heatmap", rows, "2026-10-11T14:10:00Z")}
      />,
    );
    const rectangles = html.match(/<rect\b/g) ?? [];
    // 250 sparse observations must not produce 62,500 empty cells.
    expect(rectangles.length).toBeGreaterThanOrEqual(rows.length);
    expect(rectangles.length).toBeLessThan(rows.length + 10);
    expect(html).toContain("12450–12500 ms");
    expect(html).not.toContain("NaN");
  });

  it("preserves sub-millisecond waterfall offsets for mixed ClickHouse and ISO UTC timestamps", () => {
    const html = renderToStaticMarkup(
      <Visualization
        kind="waterfall"
        result={result("trace_waterfall", [
          {
            spanId: "root",
            parentSpanId: "",
            name: "request",
            service: "api",
            startTime: "2026-10-11 10:00:00.123456100",
            durationMs: 2,
            status: "Ok",
          },
          {
            spanId: "child",
            parentSpanId: "root",
            name: "query",
            service: "db",
            startTime: "2026-10-11T10:00:00.123956100Z",
            durationMs: 1,
            status: "Ok",
          },
        ])}
      />,
    );
    const positions = [
      ...html.matchAll(/class="span-bar [^"]*" style="left:([\d.]+)%/g),
    ].map((match) => Number(match[1]));
    // A 0.5 ms offset in a 2 ms trace is 25%; truncating timestamps would lose it.
    expect(positions).toEqual([0, 25]);
    expect(html).not.toContain("NaN");
  });
});
