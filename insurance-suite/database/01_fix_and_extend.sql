-- 01_fix_and_extend.sql
-- Add 'super_admin' role, supervision, current comp table, monthly stats, helper fn.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t JOIN pg_enum e ON e.enumtypid = t.oid
    WHERE t.typname = 'user_role' AND e.enumlabel = 'super_admin'
  ) THEN
    ALTER TYPE user_role ADD VALUE 'super_admin';
  END IF;
END $$;

-- Current agent compensation table + trigger
CREATE TABLE IF NOT EXISTS agent_compensation (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_user_id   uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  base_salary     numeric(12,2) NOT NULL DEFAULT 0,
  commission_rate numeric(5,4)  NOT NULL DEFAULT 0,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_agent_compensation_updated ON agent_compensation;
CREATE TRIGGER trg_agent_compensation_updated BEFORE UPDATE ON agent_compensation
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Supervision link (Agent -> Employee)
CREATE TABLE IF NOT EXISTS agent_supervision (
  agent_user_id     uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  employee_user_id  uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at        timestamptz DEFAULT now()
);

-- Monthly sales/premium/commission per agent
CREATE TABLE IF NOT EXISTS agent_monthly_stats (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month             date NOT NULL,
  sales_count       integer NOT NULL DEFAULT 0,
  total_premium     numeric(14,2) NOT NULL DEFAULT 0,
  total_commission  numeric(14,2) NOT NULL DEFAULT 0,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now(),
  CONSTRAINT agent_monthly_stats_unique UNIQUE (agent_user_id, month)
);
DROP TRIGGER IF EXISTS trg_agent_monthly_stats_updated ON agent_monthly_stats;
CREATE TRIGGER trg_agent_monthly_stats_updated BEFORE UPDATE ON agent_monthly_stats
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Helper function
CREATE OR REPLACE FUNCTION first_day_of_month(d date)
RETURNS date LANGUAGE sql IMMUTABLE AS $$
  SELECT make_date(EXTRACT(YEAR FROM d)::int, EXTRACT(MONTH FROM d)::int, 1);
$$;
