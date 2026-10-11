import { z } from "zod";
import type { Snapshot } from "../shared/types";
import type { Env } from "./env";
import { querySchema, runQuery } from "./queries";
const column = z.string().min(1).max(256).optional();
export const visualizationMappingSchema = z
  .object({
    time: column,
    value: column,
    series: column,
    bucket: column,
    count: column,
    spanId: column,
    parentSpanId: column,
    name: column,
    service: column,
    startTime: column,
    durationMs: column,
    status: column,
    timeBucketMs: z.number().positive().finite().optional(),
    valueBucketSize: z.number().positive().finite().optional(),
  })
  .strict();
const allowedVisualizations: Record<string, string[]> = {
  request_rate: ["line", "table"],
  latency_heatmap: ["heatmap", "table"],
  trace_waterfall: ["waterfall", "table"],
  recent_logs: ["table"],
  error_rate: ["table", "line"],
};
export const snapshotSchema = z
  .object({
    query: querySchema,
    title: z.string().trim().min(1).max(160),
    visualization: z.enum(["line", "waterfall", "heatmap", "table"]),
    mapping: visualizationMappingSchema.optional(),
  })
  .strict()
  .superRefine((spec, ctx) => {
    if (
      "template" in spec.query &&
      !allowedVisualizations[spec.query.template].includes(spec.visualization)
    )
      ctx.addIssue({
        code: "custom",
        path: ["visualization"],
        message: "Visualization does not match query template",
      });
  });
export async function saveSnapshot(
  env: Env,
  input: z.input<typeof snapshotSchema>,
): Promise<Snapshot> {
  const spec = snapshotSchema.parse(input);
  const result = await runQuery(env, spec.query);
  const issues: z.core.$ZodIssue[] = [];
  for (const [field, name] of Object.entries(spec.mapping ?? {})) {
    if (typeof name === "string" && !result.columns.includes(name)) {
      issues.push({
        code: "custom",
        path: ["mapping", field],
        message: `Column ${JSON.stringify(name)} is not present in the SQL result`,
      });
    }
  }
  if ("sql" in spec.query) {
    const required = {
      table: [],
      line: ["time", "value"],
      heatmap: ["time", "bucket", "count"],
      waterfall: ["spanId", "name", "startTime", "durationMs"],
    } as const;
    for (const field of required[spec.visualization]) {
      const name = spec.mapping?.[field] ?? field;
      if (
        !result.columns.includes(name) &&
        !issues.some((issue) => issue.path[1] === field)
      ) {
        issues.push({
          code: "custom",
          path: ["mapping", field],
          message: `${spec.visualization} requires a ${field} column; alias it as ${JSON.stringify(field)} or set mapping.${field}`,
        });
      }
    }
  }
  if (issues.length) throw new z.ZodError(issues);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const content = {
    version: 1 as const,
    id,
    title: spec.title,
    visualization: spec.visualization,
    ...(spec.mapping ? { mapping: spec.mapping } : {}),
    createdAt,
    ...result,
  };
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(JSON.stringify(content)),
  );
  const sha256 = Array.from(new Uint8Array(digest), (v) =>
    v.toString(16).padStart(2, "0"),
  ).join("");
  const snapshot: Snapshot = {
    ...content,
    sha256,
    url: new URL(`/s/${id}`, env.PUBLIC_BASE_URL).toString(),
  };
  const stored = await env.ARCHIVE.put(
    `snapshots/${id}.json`,
    JSON.stringify(snapshot),
    {
      onlyIf: { etagDoesNotMatch: "*" },
      httpMetadata: { contentType: "application/json" },
      customMetadata: {
        id,
        title: spec.title,
        visualization: spec.visualization,
        createdAt,
      },
    },
  );
  if (!stored)
    throw new Error(
      "Snapshot could not be saved without replacing existing evidence",
    );
  return snapshot;
}
export async function getSnapshot(
  env: Env,
  id: string,
): Promise<Snapshot | null> {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
      id,
    )
  )
    return null;
  const object = await env.ARCHIVE.get(`snapshots/${id}.json`);
  return object ? await object.json<Snapshot>() : null;
}
export async function listSnapshots(env: Env, cursor?: string) {
  const result = await env.ARCHIVE.list({
    prefix: "snapshots/",
    limit: 100,
    include: ["customMetadata"],
    cursor,
  });
  return {
    snapshots: result.objects.map((o) => ({
      ...o.customMetadata,
      url: new URL(
        `/s/${o.customMetadata?.id}`,
        env.PUBLIC_BASE_URL,
      ).toString(),
    })),
    cursor: result.truncated ? result.cursor : undefined,
  };
}
