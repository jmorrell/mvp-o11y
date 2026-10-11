import type { Env } from "./env";
import { insertRows } from "./clickhouse";
import { decodeOtlp, normalizeOtlp } from "./otlp";

export type OtlpSignal = "traces" | "logs" | "metrics";
export interface ArchivePointer {
  version: 1;
  id: string;
  signal: OtlpSignal;
  key: string;
  contentType: "application/json" | "application/x-protobuf";
}

interface K2Record {
  timestamp_ms: number;
  content: string;
  headers?: Record<string, string>;
}
interface K2Batch {
  batch_id: string | null;
  leased_until_ms: number | null;
  records: K2Record[];
}
interface K2Response<T> {
  success: boolean;
  result: T;
  errors?: { code: number; message: string }[];
}

const ROWS_PER_INSERT = 5000;
const POLL_BUDGET_MS = 45_000;
const MAX_BATCHES_PER_POLL = 4;
const MAX_RECORDS_PER_BATCH = 10;

function parsePointer(record: K2Record): ArchivePointer {
  const binary = atob(record.content);
  const value = JSON.parse(
    new TextDecoder().decode(
      Uint8Array.from(binary, (char) => char.charCodeAt(0)),
    ),
  );
  if (
    value?.version !== 1 ||
    !/^[a-f0-9]{64}$/.test(value.id ?? "") ||
    !["traces", "logs", "metrics"].includes(value.signal) ||
    !["application/json", "application/x-protobuf"].includes(
      value.contentType,
    ) ||
    value.key !== `otlp/v1/${value.signal}/${value.id}`
  ) {
    throw new Error("Invalid K2 archive pointer");
  }
  return value as ArchivePointer;
}

async function insertPointer(
  env: Env,
  pointer: ArchivePointer,
  deadline: number,
): Promise<boolean> {
  const archived = await env.ARCHIVE.get(pointer.key);
  if (!archived)
    throw new Error(`Archived OTLP request is missing: ${pointer.id}`);
  // R2 is private and only ingress writes this prefix; never load an unbounded external record.
  if (archived.size > 8 * 1024 * 1024)
    throw new Error("Archived OTLP request exceeds 8 MiB");
  const payload = await decodeOtlp(
    pointer.signal,
    new Uint8Array(await archived.arrayBuffer()),
    pointer.contentType,
  );
  const tables = normalizeOtlp(pointer.signal, payload);
  for (const table of Object.keys(tables).sort()) {
    const rows = tables[table];
    for (let offset = 0; offset < rows.length; offset += ROWS_PER_INSERT) {
      if (Date.now() >= deadline) return false;
      const chunk = offset / ROWS_PER_INSERT;
      const inserted = await env.DB.prepare(
        "SELECT 1 AS inserted FROM ingestion_receipts WHERE request_id = ? AND table_name = ? AND chunk_index = ?",
      )
        .bind(pointer.id, table, chunk)
        .first();
      if (inserted) continue;
      const token = `otlp-v1:${pointer.id}:${table}:${chunk}`;
      await insertRows(
        env,
        table,
        rows.slice(offset, offset + ROWS_PER_INSERT),
        token,
      );
      // Writing after the insert ensures a receipt can never hide an uninserted chunk.
      await env.DB.prepare(
        "INSERT OR IGNORE INTO ingestion_receipts (request_id, table_name, chunk_index, inserted_at) VALUES (?, ?, ?, ?)",
      )
        .bind(pointer.id, table, chunk, new Date().toISOString())
        .run();
    }
  }
  return true;
}

/** Poll K2 from Cron Triggers. Acknowledgment belongs after every insert and receipt. */
export async function pollK2(env: Env): Promise<{ records: number }> {
  if (
    !env.K2_STREAM_ID ||
    !/^[a-f0-9]{32}$/.test(env.K2_STREAM_ID) ||
    !env.K2_SUBSCRIPTION_ID ||
    !/^[a-f0-9]{32}$/.test(env.K2_SUBSCRIPTION_ID) ||
    !env.K2_API_TOKEN
  ) {
    throw new Error(
      "Configure K2_STREAM_ID, K2_SUBSCRIPTION_ID and K2_API_TOKEN before polling",
    );
  }
  const subscription = `https://${env.K2_STREAM_ID}.k2.cloudflarestorage.com/subscriptions/${env.K2_SUBSCRIPTION_ID}`;
  const workerId = `cron-${crypto.randomUUID()}`;
  const deadline = Date.now() + POLL_BUDGET_MS;
  let records = 0;

  async function post<T>(path: string, body: object): Promise<T> {
    const response = await fetch(`${subscription}${path}`, {
      method: "POST",
      redirect: "manual",
      headers: {
        Authorization: `Bearer ${env.K2_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`K2 ${path} failed (${response.status})`);
    const data = (await response.json()) as K2Response<T>;
    if (!data.success)
      throw new Error(
        `K2 ${path} failed (${data.errors?.[0]?.code ?? "unknown"})`,
      );
    return data.result;
  }

  for (
    let attempt = 0;
    attempt < MAX_BATCHES_PER_POLL && Date.now() < deadline;
    attempt++
  ) {
    const batch = await post<K2Batch>("/consume", {
      worker_id: workerId,
      max_records: MAX_RECORDS_PER_BATCH,
    });
    if (!batch.batch_id || batch.records.length === 0) break;
    const batchPath = `/batches/${encodeURIComponent(batch.batch_id)}`;
    try {
      for (const record of batch.records) {
        if (!(await insertPointer(env, parsePointer(record), deadline))) {
          await post(`${batchPath}/nack`, { worker_id: workerId });
          return { records };
        }
      }
      await post(`${batchPath}/ack`, { worker_id: workerId });
      records += batch.records.length;
    } catch (error) {
      // Release promptly; if release also fails, the five-minute lease still expires.
      await post(`${batchPath}/nack`, { worker_id: workerId }).catch(() => {});
      throw error;
    }
  }
  return { records };
}
