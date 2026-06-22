CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS event_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_name VARCHAR(160) NOT NULL,
  email VARCHAR(254) NOT NULL,
  event_date DATE,
  estimated_guests INTEGER CHECK (estimated_guests IS NULL OR estimated_guests > 0),
  notes TEXT,
  status VARCHAR(40) NOT NULL DEFAULT 'new',
  source VARCHAR(80) NOT NULL DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_inquiries_created_at
  ON event_inquiries (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_event_inquiries_status
  ON event_inquiries (status);
