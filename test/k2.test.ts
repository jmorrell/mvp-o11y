import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Env } from "../src/worker/env";
import { pollK2, type ArchivePointer } from "../src/worker/k2";

const mocks = vi.hoisted(() => ({
  insert: vi.fn(),
  decode: vi.fn(),
  normalize: vi.fn(),
}));
vi.mock("../src/worker/clickhouse", () => ({ insertRows: mocks.insert }));
vi.mock("../src/worker/otlp", () => ({
  decodeOtlp: mocks.decode,
  normalizeOtlp: mocks.normalize,
}));

function pointer(id = "a".repeat(64)): ArchivePointer {
  return {
    version: 1,
    id,
    signal: "traces",
    key: `otlp/v1/traces/${id}`,
    contentType: "application/json",
  };
}

function batch(id: string, pointers = [pointer()]) {
  return {
    batch_id: id,
    leased_until_ms: Date.now() + 300_000,
    records: pointers.map((value) => ({
      timestamp_ms: Date.now(),
      content: btoa(JSON.stringify(value)),
    })),
  };
}

function harness() {
  const receipts = new Set<string>();
  const receiptWrites = vi.fn(async (key: string) => {
    receipts.add(key);
  });
  const db = {
    prepare: (sql: string) => ({
      bind: (...args: unknown[]) => {
        const key = JSON.stringify(args.slice(0, 3));
        return {
          first: async () => (receipts.has(key) ? { inserted: 1 } : null),
          run: async () => {
            if (sql.startsWith("INSERT")) await receiptWrites(key);
            return { success: true };
          },
        };
      },
    }),
  };
  const get = vi.fn(async (key: string) => {
    const bytes = new TextEncoder().encode(
      JSON.stringify({ id: key.split("/").at(-1) }),
    );
    return { size: bytes.length, arrayBuffer: async () => bytes.buffer };
  });
  const queue: ReturnType<typeof batch>[] = [];
  const calls: { path: string; body: Record<string, unknown> }[] = [];
  const fetchMock = vi.fn(async (url: string, init: RequestInit) => {
    const path = new URL(url).pathname;
    calls.push({ path, body: JSON.parse(init.body as string) });
    expect(new Headers(init.headers).get("Authorization")).toBe(
      "Bearer test-k2-token",
    );
    expect(init.redirect).toBe("manual");
    const result = path.endsWith("/consume")
      ? (queue.shift() ?? {
          batch_id: null,
          leased_until_ms: null,
          records: [],
        })
      : {};
    return Response.json({ success: true, result, errors: [], messages: [] });
  });
  vi.stubGlobal("fetch", fetchMock);
  const env = {
    ARCHIVE: { get },
    DB: db,
    K2_STREAM_ID: "1".repeat(32),
    K2_SUBSCRIPTION_ID: "2".repeat(32),
    K2_API_TOKEN: "test-k2-token",
  } as unknown as Env;
  return { env, queue, calls, get, receipts, receiptWrites, fetchMock };
}

beforeEach(() => {
  mocks.insert.mockReset().mockResolvedValue(undefined);
  mocks.decode
    .mockReset()
    .mockImplementation(async (_signal, bytes) =>
      JSON.parse(new TextDecoder().decode(bytes)),
    );
  mocks.normalize
    .mockReset()
    .mockImplementation((_signal, payload) => ({
      otel_traces: [{ TraceId: payload.id }],
    }));
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("K2 polling and insert acknowledgment", () => {
  it("uses subscription polling and acknowledges only after insert receipts", async () => {
    const { env, queue, calls, receipts } = harness();
    queue.push(batch("first"));
    expect(await pollK2(env)).toEqual({ records: 1 });
    expect(calls.map((call) => call.path.split("/").at(-1))).toEqual([
      "consume",
      "ack",
      "consume",
    ]);
    expect(calls[0].body).toMatchObject({ max_records: 10 });
    expect(calls[0].body.worker_id).toBe(calls[1].body.worker_id);
    expect(mocks.insert).toHaveBeenCalledWith(
      env,
      "otel_traces",
      [{ TraceId: "a".repeat(64) }],
      `otlp-v1:${"a".repeat(64)}:otel_traces:0`,
    );
    expect(receipts.size).toBe(1);
  });

  it("nacks on a ClickHouse failure and never acknowledges the batch", async () => {
    const { env, queue, calls, receipts } = harness();
    queue.push(batch("failed"));
    mocks.insert.mockRejectedValueOnce(new Error("ClickHouse unavailable"));
    await expect(pollK2(env)).rejects.toThrow("ClickHouse unavailable");
    expect(calls.some((call) => call.path.endsWith("/ack"))).toBe(false);
    expect(calls.some((call) => call.path.endsWith("/nack"))).toBe(true);
    expect(receipts.size).toBe(0);
  });

  it("skips confirmed inserts when a partially processed batch is redelivered with another batch ID", async () => {
    const { env, queue } = harness();
    const values = [pointer(), pointer("b".repeat(64))];
    queue.push(batch("old-id", values));
    mocks.insert
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("second insert failed"));
    await expect(pollK2(env)).rejects.toThrow("second insert failed");
    queue.push(batch("new-id", values));
    await expect(pollK2(env)).resolves.toEqual({ records: 2 });
    expect(mocks.insert).toHaveBeenCalledTimes(3);
    expect(mocks.insert.mock.calls[1][3]).toBe(mocks.insert.mock.calls[2][3]);
    expect(mocks.insert.mock.calls[0][3]).not.toBe(
      mocks.insert.mock.calls[2][3],
    );
  });

  it("reuses a stable ClickHouse deduplication token if receipt storage fails after insertion", async () => {
    const { env, queue, receiptWrites } = harness();
    queue.push(batch("before-restart"));
    receiptWrites.mockRejectedValueOnce(new Error("D1 unavailable"));
    await expect(pollK2(env)).rejects.toThrow("D1 unavailable");
    queue.push(batch("after-restart"));
    await pollK2(env);
    expect(mocks.insert).toHaveBeenCalledTimes(2);
    expect(mocks.insert.mock.calls[0][3]).toBe(mocks.insert.mock.calls[1][3]);
  });

  it("does not repeat a confirmed insert after a lost acknowledgment", async () => {
    const { env, queue, fetchMock } = harness();
    const originalFetch = fetchMock.getMockImplementation()!;
    let failAck = true;
    fetchMock.mockImplementation(async (url, init) => {
      if (url.endsWith("/ack") && failAck) {
        failAck = false;
        return new Response("K2 unavailable", { status: 503 });
      }
      return originalFetch(url, init);
    });
    queue.push(batch("lost-ack"));
    await expect(pollK2(env)).rejects.toThrow("failed (503)");
    queue.push(batch("redelivered"));
    await expect(pollK2(env)).resolves.toEqual({ records: 1 });
    expect(mocks.insert).toHaveBeenCalledTimes(1);
  });

  it("releases a partially processed batch when the polling budget expires", async () => {
    const { env, queue, calls } = harness();
    const now = Date.now();
    const clock = vi.spyOn(Date, "now").mockReturnValue(now);
    mocks.insert.mockImplementationOnce(async () => {
      clock.mockReturnValue(now + 46_000);
    });
    queue.push(batch("time-budget", [pointer(), pointer("b".repeat(64))]));
    expect(await pollK2(env)).toEqual({ records: 0 });
    expect(mocks.insert).toHaveBeenCalledTimes(1);
    expect(calls.some((call) => call.path.endsWith("/nack"))).toBe(true);
    expect(calls.some((call) => call.path.endsWith("/ack"))).toBe(false);
  });

  it("splits large request tables into stable bounded inserts", async () => {
    const { env, queue } = harness();
    const rows = Array.from({ length: 5001 }, (_, id) => ({ id }));
    mocks.normalize.mockReturnValueOnce({ otel_traces: rows });
    queue.push(batch("large"));
    await pollK2(env);
    expect(mocks.insert.mock.calls.map((call) => call[2].length)).toEqual([
      5000, 1,
    ]);
    expect(mocks.insert.mock.calls[0][3]).toBe(
      `otlp-v1:${"a".repeat(64)}:otel_traces:0`,
    );
    expect(mocks.insert.mock.calls[1][3]).toBe(
      `otlp-v1:${"a".repeat(64)}:otel_traces:1`,
    );
  });

  it("does not acknowledge missing archives or malformed pointers", async () => {
    const { env, queue, get, calls } = harness();
    get.mockResolvedValueOnce(null as never);
    queue.push(batch("missing"));
    await expect(pollK2(env)).rejects.toThrow(
      "Archived OTLP request is missing",
    );
    queue.push(
      batch("invalid", [{ ...pointer(), key: "another-prefix/secret" }]),
    );
    await expect(pollK2(env)).rejects.toThrow("Invalid K2 archive pointer");
    expect(calls.some((call) => call.path.endsWith("/ack"))).toBe(false);
    expect(get).toHaveBeenCalledTimes(1);
  });

  it("exits on empty polls and rejects missing configuration", async () => {
    const { env, calls } = harness();
    await expect(pollK2(env)).resolves.toEqual({ records: 0 });
    expect(calls).toHaveLength(1);
    await expect(pollK2({ ...env, K2_API_TOKEN: undefined })).rejects.toThrow(
      "Configure K2_STREAM_ID",
    );
    expect(calls).toHaveLength(1);
  });

  it("bounds backlog consumption to four batches per invocation", async () => {
    const { env, queue, calls } = harness();
    for (let i = 0; i < 5; i++) queue.push(batch(`batch-${i}`));
    expect(await pollK2(env)).toEqual({ records: 4 });
    expect(calls.filter((call) => call.path.endsWith("/consume"))).toHaveLength(
      4,
    );
    expect(queue).toHaveLength(1);
  });
});
