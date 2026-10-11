export interface Env {
  ASSETS: Fetcher;
  ARCHIVE: R2Bucket;
  DB: D1Database;
  INGEST?: {
    send(
      records: { content: Uint8Array; headers?: Record<string, string> }[],
    ): Promise<{ success: boolean; [key: string]: unknown }>;
  };
  API_TOKEN: string;
  INGEST_TOKEN?: string;
  CLICKHOUSE_URL: string;
  CLICKHOUSE_DATABASE: string;
  CLICKHOUSE_USER: string;
  CLICKHOUSE_PASSWORD: string;
  K2_STREAM_ID?: string;
  K2_SUBSCRIPTION_ID?: string;
  K2_API_TOKEN?: string;
  PUBLIC_BASE_URL: string;
  WEBHOOK_SECRET: string;
  WEBHOOK_ALLOWED_HOSTS?: string;
}
