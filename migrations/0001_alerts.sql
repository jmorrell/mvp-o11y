CREATE TABLE IF NOT EXISTS alert_rules (
  id TEXT PRIMARY KEY,
  input_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_attempted_at TEXT,
  last_evaluated_at TEXT,
  last_triggered_at TEXT
);

CREATE TABLE IF NOT EXISTS alert_outbox (
  event_id TEXT PRIMARY KEY,
  alert_id TEXT NOT NULL,
  webhook_url TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL,
  next_attempt_at TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'failed')),
  lease_until TEXT,
  last_error TEXT
);
CREATE INDEX IF NOT EXISTS alert_outbox_due ON alert_outbox(status, next_attempt_at);
