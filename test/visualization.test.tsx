import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Visualization } from "../src/web/Visualization";
import type { PresetQuerySpec, QueryResult } from "../src/shared/types";

const result = (
  template: PresetQuerySpec["template"],
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

const sqlResult = (rows: QueryResult["rows"]): QueryResult => ({
  ...result("request_rate", rows),
  query: { sql: "SELECT custom_columns FROM telemetry" },
  sql: "SELECT custom_columns FROM telemetry",
});

describe("arbitrary SQL visualizations", () => {
  it("uses returned timestamps, sorts by instant, and plots negative custom values within the chart", () => {
    const html = renderToStaticMarkup(
      <Visualization
        kind="line"
        mapping={{ time: "at", value: "temperature", series: "region" }}
        result={sqlResult([
          { at: "2026-10-11T12:00:00+02:00", temperature: 10, region: "north" },
          {
            at: Date.parse("2026-10-11T09:00:00Z"),
            temperature: -10,
            region: "north",
          },
          { at: "2026-10-11 09:30:00", temperature: 0, region: "north" },
        ])}
      />,
    );
    const positions = [
      ...html.matchAll(/<circle[^>]*cx="([\d.]+)" cy="([\d.]+)"/g),
    ].map((match) => [Number(match[1]), Number(match[2])]);
    expect(positions).toHaveLength(3);
    expect(positions[0][0]).toBeCloseTo(52);
    expect(positions[2][0]).toBeCloseTo(878);
    expect(positions[1][0]).toBeCloseTo((52 + 878) / 2);
    expect(positions[0][1]).toBeGreaterThan(positions[1][1]);
    expect(positions[1][1]).toBeGreaterThan(positions[2][1]);
    expect(positions.every(([, y]) => y >= 20 && y <= 272)).toBe(true);
    expect(html).toContain("north");
    expect(html).not.toContain("Requests / second");
    expect(html).not.toContain("NaN");
  });

  it("uses explicit SQL bucket widths to keep gaps disconnected", () => {
    const html = renderToStaticMarkup(
      <Visualization
        kind="line"
        mapping={{ timeBucketMs: 300000 }}
        result={sqlResult([
          { time: "2026-10-11T10:00:00Z", value: 10 },
          { time: "2026-10-11T10:05:00Z", value: 20 },
          { time: "2026-10-11T10:20:00Z", value: 30 },
        ])}
      />,
    );
    const paths = [...html.matchAll(/<path d="([^"]+)" fill="none"/g)].map(
      (match) => match[1],
    );
    expect(paths).toHaveLength(2);
    expect(paths[0].match(/L/g)).toHaveLength(1);
    expect(paths[1]).not.toContain("L");
  });

  it("infers SQL time spacing without imposing the preset one-minute cadence", () => {
    const html = renderToStaticMarkup(
      <Visualization
        kind="line"
        result={sqlResult([
          { time: "2026-10-11T10:00:00Z", value: 1 },
          { time: "2026-10-11T10:05:00Z", value: 2 },
          { time: "2026-10-11T10:10:00Z", value: 3 },
        ])}
      />,
    );
    const paths = [...html.matchAll(/<path d="([^"]+)" fill="none"/g)].map(
      (match) => match[1],
    );
    expect(paths).toHaveLength(1);
    expect(paths[0].match(/L/g)).toHaveLength(2);
  });

  it("renders custom sparse heatmap bins with generic units and returned time bounds", () => {
    const rows = Array.from({ length: 100 }, (_, index) => ({
      at: Date.parse("2026-10-11T10:00:00Z") + index * 300000,
      temperature: -20 + index * 0.5,
      samples: index + 1,
    }));
    const html = renderToStaticMarkup(
      <Visualization
        kind="heatmap"
        mapping={{
          time: "at",
          bucket: "temperature",
          count: "samples",
          timeBucketMs: 300000,
          valueBucketSize: 0.5,
        }}
        result={sqlResult(rows)}
      />,
    );
    expect(html.match(/<rect\b/g)).toHaveLength(rows.length + 1);
    expect(html).toContain("-20–-19.5 · 1 observations");
    expect(html).toContain("300 s × 0.5 buckets");
    expect(html).not.toContain("latency");
    expect(html).not.toContain(" spans");
    expect(html).not.toContain("NaN");
  });

  it("infers heatmap dimensions from SQL results", () => {
    const html = renderToStaticMarkup(
      <Visualization
        kind="heatmap"
        result={sqlResult([
          { time: "2026-10-11 10:00:00", bucket: -5, count: 2 },
          { time: "2026-10-11 10:05:00", bucket: -2.5, count: 3 },
        ])}
      />,
    );
    expect(html).toContain("300 s × 2.5 buckets");
    expect(html).toContain("-5–-2.5 · 2 observations");
    expect(html).not.toContain("NaN");
  });

  it("maps SQL waterfall fields and accepts both date strings and numeric epoch milliseconds", () => {
    const epoch = Date.parse("2026-10-11T10:00:00Z");
    const html = renderToStaticMarkup(
      <Visualization
        kind="waterfall"
        mapping={{
          startTime: "started",
          durationMs: "elapsed",
          spanId: "id",
          parentSpanId: "parent",
          name: "operation",
          service: "app",
          status: "outcome",
        }}
        result={sqlResult([
          {
            id: "root",
            parent: "",
            operation: "request",
            app: "api",
            started: epoch,
            elapsed: 10,
            outcome: "Ok",
          },
          {
            id: "child",
            parent: "root",
            operation: "query",
            app: "db",
            started: "2026-10-11 10:00:00.002500",
            elapsed: "5",
            outcome: "Error",
          },
          { id: "invalid", started: "bad timestamp", elapsed: -3 },
        ])}
      />,
    );
    const positions = [
      ...html.matchAll(/class="span-bar [^"]*" style="left:([\d.]+)%/g),
    ].map((match) => Number(match[1]));
    expect(positions).toEqual([0, 25]);
    expect(html).toContain("padding-left:28px");
    expect(html).toContain("span-error");
    expect(html).toContain("Skipped 1 row");
    expect(html).not.toContain("NaN");
  });

  it.each(["line", "heatmap", "waterfall"] as const)(
    "explains missing mappings for %s without plotting invented zeroes",
    (kind) => {
      const html = renderToStaticMarkup(
        <Visualization kind={kind} result={sqlResult([{ unrelated: 123 }])} />,
      );
      expect(html).toContain("No plottable rows");
      expect(html).toContain("column mappings");
      expect(html).not.toContain("NaN");
      expect(html).not.toContain("<svg");
    },
  );

  it("skips invalid SQL points without converting empty numeric values to zero", () => {
    const html = renderToStaticMarkup(
      <Visualization
        kind="line"
        result={sqlResult([
          { time: "2026-10-11T10:00:00Z", value: null },
          { time: "2026-10-11T10:01:00Z", value: "" },
          { time: "not a date", value: 12 },
          { time: "2026-10-11T10:03:00Z", value: "Infinity" },
          { time: "2026-10-11T10:04:00Z", value: -4 },
        ])}
      />,
    );
    expect(html.match(/<circle\b/g)).toHaveLength(1);
    expect(html).toContain("Skipped 4 rows");
    expect(html).not.toContain("NaN");
  });

  it("renders arbitrary table columns directly", () => {
    const html = renderToStaticMarkup(
      <Visualization
        kind="table"
        result={sqlResult([
          { region: "north", mean: -4, tags: { cluster: "a" } },
        ])}
      />,
    );
    expect(html).toContain("<th>region</th><th>mean</th><th>tags</th>");
    expect(html).toContain("north");
    expect(html).toContain("-4");
    expect(html).toContain("cluster");
  });
});
