-- Permanent receipts survive K2 redelivery and producer retries. Do not add a TTL.
CREATE TABLE IF NOT EXISTS ingestion_receipts (
  request_id TEXT NOT NULL,
  table_name TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  inserted_at TEXT NOT NULL,
  PRIMARY KEY (request_id, table_name, chunk_index)
);
