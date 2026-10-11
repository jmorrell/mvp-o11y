import { z } from "zod";
import type { Snapshot } from "../shared/types";
import type { Env } from "./env";
import { querySchema, runQuery } from "./queries";
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
  })
  .strict()
  .superRefine((spec, ctx) => {
    if (
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
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const content = {
    version: 1 as const,
    id,
    title: spec.title,
    visualization: spec.visualization,
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
