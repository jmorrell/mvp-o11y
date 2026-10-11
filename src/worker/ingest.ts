import type { Env } from "./env";
import { decodeOtlp, normalizeOtlp } from "./otlp";
import type { ArchivePointer, OtlpSignal } from "./k2";

export const MAX_OTLP_BYTES = 8 * 1024 * 1024;

class RequestError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

function errorResponse(status: number, message: string): Response {
  return Response.json(
    { code: status === 503 ? 14 : status === 413 ? 8 : 3, message },
    {
      status,
      headers: status === 503 ? { "Retry-After": "5" } : undefined,
    },
  );
}

async function readBody(request: Request): Promise<Uint8Array> {
  const encoding = (request.headers.get("content-encoding") ?? "identity")
    .trim()
    .toLowerCase();
  if (encoding !== "identity" && encoding !== "gzip") {
    throw new RequestError(415, "Content-Encoding must be gzip or identity");
  }
  if (Number(request.headers.get("content-length")) > MAX_OTLP_BYTES) {
    throw new RequestError(413, "OTLP request exceeds 8 MiB");
  }
  if (!request.body) return new Uint8Array();

  let encodedBytes = 0;
  const counted = request.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        encodedBytes += chunk.byteLength;
        if (encodedBytes > MAX_OTLP_BYTES)
          throw new RequestError(413, "OTLP request exceeds 8 MiB");
        controller.enqueue(chunk);
      },
    }),
  );
  // Workers and lib.dom declare the same Web Streams API with different BufferSource variance.
  const stream =
    encoding === "gzip"
      ? counted.pipeThrough(
          new DecompressionStream("gzip") as unknown as ReadableWritablePair<
            Uint8Array,
            Uint8Array
          >,
        )
      : counted;
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_OTLP_BYTES)
        throw new RequestError(413, "Decoded OTLP request exceeds 8 MiB");
      chunks.push(value);
    }
  } catch (error) {
    await reader.cancel().catch(() => {});
    if (error instanceof RequestError) throw error;
    throw new RequestError(400, "Invalid request body or gzip encoding");
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

async function archiveId(
  signal: OtlpSignal,
  contentType: string,
  bytes: Uint8Array,
): Promise<string> {
  const prefix = new TextEncoder().encode(
    `otlp-v1\n${signal}\n${contentType}\n`,
  );
  const input = new Uint8Array(prefix.length + bytes.length);
  input.set(prefix);
  input.set(bytes, prefix.length);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

/** Return success only once a validated request is archived and durably queued. */
export async function ingest(
  request: Request,
  env: Env,
  signal: OtlpSignal,
): Promise<Response> {
  const contentType = (request.headers.get("content-type") ?? "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  if (
    contentType !== "application/json" &&
    contentType !== "application/x-protobuf"
  ) {
    return errorResponse(
      415,
      "Content-Type must be application/json or application/x-protobuf",
    );
  }

  let bytes: Uint8Array;
  try {
    bytes = await readBody(request);
    // Reject malformed or unsupported payloads before acknowledging them to the SDK.
    normalizeOtlp(signal, await decodeOtlp(signal, bytes, contentType));
  } catch (error) {
    return errorResponse(
      error instanceof RequestError ? error.status : 400,
      error instanceof RequestError ? error.message : "Invalid OTLP payload",
    );
  }

  try {
    const id = await archiveId(signal, contentType, bytes);
    const key = `otlp/v1/${signal}/${id}`;
    await env.ARCHIVE.put(key, bytes, {
      httpMetadata: { contentType },
      customMetadata: { signal, requestId: id, schemaVersion: "1" },
    });
    const pointer: ArchivePointer = {
      version: 1,
      id,
      signal,
      key,
      contentType,
    };
    if (!env.INGEST)
      return errorResponse(503, "K2 producer binding is not configured");
    const result = await env.INGEST.send([
      {
        content: new TextEncoder().encode(JSON.stringify(pointer)),
        headers: { "request-id": id, signal },
      },
    ]);
    if (!result.success)
      return errorResponse(
        503,
        "Unable to enqueue OTLP request; retry this request",
      );
  } catch {
    return errorResponse(
      503,
      "Unable to persist OTLP request; retry this request",
    );
  }

  return contentType === "application/json"
    ? Response.json({})
    : new Response(new Uint8Array(), {
        headers: { "Content-Type": "application/x-protobuf" },
      });
}
