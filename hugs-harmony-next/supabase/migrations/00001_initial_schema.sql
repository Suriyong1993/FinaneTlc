-- Church Finance App — Supabase Schema
-- Run this in Supabase SQL Editor or via migration

-- 1. Settings (single-row config)
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  church_name TEXT NOT NULL DEFAULT '',
  church_website TEXT NOT NULL DEFAULT '',
  weekly_note TEXT NOT NULL DEFAULT '',
  webhook_url TEXT NOT NULL DEFAULT '',
  week_index INTEGER NOT NULL DEFAULT 1,
  opening_cash REAL NOT NULL DEFAULT 0,
  opening_bank REAL NOT NULL DEFAULT 0,
  cash REAL NOT NULL DEFAULT 0,
  bank REAL NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Donation rows (weekly income entries)
CREATE TABLE IF NOT EXISTS donation_rows (
  id BIGSERIAL PRIMARY KEY,
  week_index INTEGER NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  method TEXT NOT NULL CHECK (method IN ('cash','online')),
  tithe REAL NOT NULL DEFAULT 0,
  rent REAL NOT NULL DEFAULT 0,
  memorial REAL NOT NULL DEFAULT 0,
  mission REAL NOT NULL DEFAULT 0,
  special REAL NOT NULL DEFAULT 0,
  land REAL NOT NULL DEFAULT 0,
  party REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_donation_week ON donation_rows(week_index);

-- 3. Expense logs
CREATE TABLE IF NOT EXISTS expense_logs (
  id BIGSERIAL PRIMARY KEY,
  week_index INTEGER NOT NULL,
  requester TEXT NOT NULL DEFAULT '',
  payee TEXT NOT NULL DEFAULT '',
  purpose TEXT NOT NULL DEFAULT '',
  amount REAL NOT NULL DEFAULT 0,
  method TEXT NOT NULL CHECK (method IN ('cash','bank')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expense_week ON expense_logs(week_index);

-- 4. History (weekly rollover snapshots)
CREATE TABLE IF NOT EXISTS history (
  id BIGSERIAL PRIMARY KEY,
  week INTEGER NOT NULL,
  date_closed TEXT NOT NULL,
  open_cash REAL NOT NULL DEFAULT 0,
  open_online REAL NOT NULL DEFAULT 0,
  income_cash REAL NOT NULL DEFAULT 0,
  income_online REAL NOT NULL DEFAULT 0,
  expenses REAL NOT NULL DEFAULT 0,
  close_cash REAL NOT NULL DEFAULT 0,
  close_online REAL NOT NULL DEFAULT 0,
  override_reason TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  tithe REAL NOT NULL DEFAULT 0,
  rent REAL NOT NULL DEFAULT 0,
  memorial REAL NOT NULL DEFAULT 0,
  mission REAL NOT NULL DEFAULT 0,
  special REAL NOT NULL DEFAULT 0,
  land REAL NOT NULL DEFAULT 0,
  party REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Receipts (donation receipts with images)
CREATE TABLE IF NOT EXISTS receipts (
  id BIGSERIAL PRIMARY KEY,
  week_index INTEGER NOT NULL DEFAULT 1,
  donor_name TEXT NOT NULL DEFAULT '',
  amount REAL NOT NULL DEFAULT 0,
  fund TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default settings row
INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Row Level Security
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read/write
DROP POLICY IF EXISTS "authenticated_all" ON settings;
CREATE POLICY "authenticated_all" ON settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON donation_rows;
CREATE POLICY "authenticated_all" ON donation_rows FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON expense_logs;
CREATE POLICY "authenticated_all" ON expense_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON history;
CREATE POLICY "authenticated_all" ON history FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "authenticated_all" ON receipts;
CREATE POLICY "authenticated_all" ON receipts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow anonymous access for single-user mode (can be removed if auth is required)
DROP POLICY IF EXISTS "anon_all" ON settings;
CREATE POLICY "anon_all" ON settings FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_all" ON donation_rows;
CREATE POLICY "anon_all" ON donation_rows FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_all" ON expense_logs;
CREATE POLICY "anon_all" ON expense_logs FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_all" ON history;
CREATE POLICY "anon_all" ON history FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_all" ON receipts;
CREATE POLICY "anon_all" ON receipts FOR ALL TO anon USING (true) WITH CHECK (true);
