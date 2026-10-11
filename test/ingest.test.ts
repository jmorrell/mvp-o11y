import { beforeEach, describe, expect, it, vi } from "vitest";
import { gzipSync } from "node:zlib";
import type { Env } from "../src/worker/env";
import { ingest, MAX_OTLP_BYTES } from "../src/worker/ingest";

const otlp = vi.hoisted(() => ({ decode: vi.fn(), normalize: vi.fn() }));
vi.mock("../src/worker/otlp", () => ({
  decodeOtlp: otlp.decode,
  normalizeOtlp: otlp.normalize,
}));

function harness() {
  const events: string[] = [];
  const put = vi.fn(
    async (_key: string, _value: Uint8Array, _metadata: unknown) => {
      events.push("archive");
    },
  );
  const send = vi.fn(async (_records: { content: Uint8Array }[]) => {
    events.push("queue");
    return { success: true };
  });
  const env = { ARCHIVE: { put }, INGEST: { send } } as unknown as Env;
  return { env, put, send, events };
}

function request(
  body: string | Uint8Array,
  headers: Record<string, string> = {},
) {
  return new Request("https://o11y.example/v1/traces", {
    method: "POST",
    body: body as BodyInit,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

beforeEach(() => {
  otlp.decode.mockReset().mockResolvedValue({ resourceSpans: [] });
  otlp.normalize.mockReset().mockReturnValue({});
});

describe("OTLP ingress durability", () => {
  it("archives original bytes before publishing only a small R2 pointer", async () => {
    const { env, put, send, events } = harness();
    const raw = '{"resourceSpans":[]}';
    const response = await ingest(request(raw), env, "traces");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({});
    expect(events).toEqual(["archive", "queue"]);
    expect(new TextDecoder().decode(put.mock.calls[0][1] as Uint8Array)).toBe(
      raw,
    );
    const pointer = JSON.parse(
      new TextDecoder().decode(send.mock.calls[0][0][0].content),
    );
    expect(pointer).toMatchObject({
      version: 1,
      signal: "traces",
      contentType: "application/json",
    });
    expect(pointer.id).toMatch(/^[a-f0-9]{64}$/);
    expect(pointer.key).toBe(`otlp/v1/traces/${pointer.id}`);
    expect(JSON.stringify(pointer)).not.toContain("resourceSpans");
    expect(put.mock.calls[0][0]).toBe(pointer.key);
  });

  it("keeps the same archive ID on retries, including gzip transport", async () => {
    const { env, put } = harness();
    const raw = '{"resourceSpans":[]}';
    await ingest(request(raw), env, "traces");
    await ingest(
      request(gzipSync(raw), { "Content-Encoding": "gzip" }),
      env,
      "traces",
    );
    expect(put.mock.calls[1][0]).toBe(put.mock.calls[0][0]);
    expect(new TextDecoder().decode(put.mock.calls[1][1] as Uint8Array)).toBe(
      raw,
    );
  });

  it("retains the archive and returns retryable 503 when K2 rejects or is missing", async () => {
    const { env, put, send } = harness();
    send.mockResolvedValueOnce({ success: false });
    expect((await ingest(request("{}"), env, "traces")).status).toBe(503);
    expect(put).toHaveBeenCalledTimes(1);
    const response = await ingest(
      request("{}"),
      { ...env, INGEST: undefined },
      "traces",
    );
    expect(response.status).toBe(503);
    expect(response.headers.get("Retry-After")).toBe("5");
    expect(put).toHaveBeenCalledTimes(2);
  });

  it("does not publish when archival fails", async () => {
    const { env, put, send } = harness();
    put.mockRejectedValueOnce(new Error("R2 unavailable"));
    expect((await ingest(request("{}"), env, "traces")).status).toBe(503);
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects decode and normalization failures before persistence", async () => {
    const { env, put, send } = harness();
    otlp.decode.mockRejectedValueOnce(new Error("Malformed protobuf"));
    expect((await ingest(request("{}"), env, "traces")).status).toBe(400);
    otlp.normalize.mockImplementationOnce(() => {
      throw new Error("Invalid timestamp");
    });
    expect((await ingest(request("{}"), env, "traces")).status).toBe(400);
    expect(put).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects gzip expansion past the decoded size bound", async () => {
    const { env, put } = harness();
    const compressed = gzipSync(new Uint8Array(MAX_OTLP_BYTES + 1));
    const response = await ingest(
      request(compressed, { "Content-Encoding": "gzip" }),
      env,
      "traces",
    );
    expect(response.status).toBe(413);
    expect(otlp.decode).not.toHaveBeenCalled();
    expect(put).not.toHaveBeenCalled();
  });

  it("rejects unsupported encoding and malformed gzip", async () => {
    const { env } = harness();
    expect(
      (await ingest(request("{}", { "Content-Encoding": "br" }), env, "traces"))
        .status,
    ).toBe(415);
    expect(
      (
        await ingest(
          request("{}", { "Content-Encoding": "gzip" }),
          env,
          "traces",
        )
      ).status,
    ).toBe(400);
  });

  it("returns an empty protobuf ExportResponse for protobuf input", async () => {
    const { env } = harness();
    const response = await ingest(
      request(new Uint8Array(), { "Content-Type": "application/x-protobuf" }),
      env,
      "logs",
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/x-protobuf");
    expect((await response.arrayBuffer()).byteLength).toBe(0);
  });
});
