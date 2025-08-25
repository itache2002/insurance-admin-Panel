-- Add PAN/Aadhaar columns to agent_profile, employee_profile, customers
-- + format checks and unique indexes (uniques allow multiple NULLs)

BEGIN;

-- agent_profile
ALTER TABLE agent_profile
  ADD COLUMN IF NOT EXISTS pan_no      varchar(10),
  ADD COLUMN IF NOT EXISTS aadhaar_no  varchar(12);

-- employee_profile
ALTER TABLE employee_profile
  ADD COLUMN IF NOT EXISTS pan_no      varchar(10),
  ADD COLUMN IF NOT EXISTS aadhaar_no  varchar(12);

-- customers
ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS pan_no      varchar(10),
  ADD COLUMN IF NOT EXISTS aadhaar_no  varchar(12);

-- ====== CHECK constraints (PAN: 5 letters + 4 digits + 1 letter; Aadhaar: 12 digits) ======
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='agent_profile_pan_ck') THEN
    ALTER TABLE agent_profile
      ADD CONSTRAINT agent_profile_pan_ck CHECK (pan_no IS NULL OR pan_no ~ '^[A-Z]{5}[0-9]{4}[A-Z]$') NOT VALID;
    ALTER TABLE agent_profile VALIDATE CONSTRAINT agent_profile_pan_ck;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='agent_profile_aadhaar_ck') THEN
    ALTER TABLE agent_profile
      ADD CONSTRAINT agent_profile_aadhaar_ck CHECK (aadhaar_no IS NULL OR aadhaar_no ~ '^[0-9]{12}$') NOT VALID;
    ALTER TABLE agent_profile VALIDATE CONSTRAINT agent_profile_aadhaar_ck;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='employee_profile_pan_ck') THEN
    ALTER TABLE employee_profile
      ADD CONSTRAINT employee_profile_pan_ck CHECK (pan_no IS NULL OR pan_no ~ '^[A-Z]{5}[0-9]{4}[A-Z]$') NOT VALID;
    ALTER TABLE employee_profile VALIDATE CONSTRAINT employee_profile_pan_ck;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='employee_profile_aadhaar_ck') THEN
    ALTER TABLE employee_profile
      ADD CONSTRAINT employee_profile_aadhaar_ck CHECK (aadhaar_no IS NULL OR aadhaar_no ~ '^[0-9]{12}$') NOT VALID;
    ALTER TABLE employee_profile VALIDATE CONSTRAINT employee_profile_aadhaar_ck;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='customers_pan_ck') THEN
    ALTER TABLE customers
      ADD CONSTRAINT customers_pan_ck CHECK (pan_no IS NULL OR pan_no ~ '^[A-Z]{5}[0-9]{4}[A-Z]$') NOT VALID;
    ALTER TABLE customers VALIDATE CONSTRAINT customers_pan_ck;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='customers_aadhaar_ck') THEN
    ALTER TABLE customers
      ADD CONSTRAINT customers_aadhaar_ck CHECK (aadhaar_no IS NULL OR aadhaar_no ~ '^[0-9]{12}$') NOT VALID;
    ALTER TABLE customers VALIDATE CONSTRAINT customers_aadhaar_ck;
  END IF;
END $$;

-- ====== Unique indexes (only when value present) ======
CREATE UNIQUE INDEX IF NOT EXISTS agent_profile_pan_uniq
  ON agent_profile(pan_no) WHERE pan_no IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS agent_profile_aadhaar_uniq
  ON agent_profile(aadhaar_no) WHERE aadhaar_no IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS employee_profile_pan_uniq
  ON employee_profile(pan_no) WHERE pan_no IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS employee_profile_aadhaar_uniq
  ON employee_profile(aadhaar_no) WHERE aadhaar_no IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS customers_pan_uniq
  ON customers(pan_no) WHERE pan_no IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS customers_aadhaar_uniq
  ON customers(aadhaar_no) WHERE aadhaar_no IS NOT NULL;

COMMIT;



BEGIN;

ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS age                integer,
  ADD COLUMN IF NOT EXISTS spouse_name        varchar(120),
  ADD COLUMN IF NOT EXISTS number_of_children integer,
  ADD COLUMN IF NOT EXISTS parents            jsonb,
  ADD COLUMN IF NOT EXISTS premium_number     varchar(64);

-- validation
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='customers_age_ck') THEN
    ALTER TABLE customers
      ADD CONSTRAINT customers_age_ck CHECK (age IS NULL OR age BETWEEN 0 AND 120) NOT VALID;
    ALTER TABLE customers VALIDATE CONSTRAINT customers_age_ck;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='customers_children_ck') THEN
    ALTER TABLE customers
      ADD CONSTRAINT customers_children_ck CHECK (number_of_children IS NULL OR number_of_children >= 0) NOT VALID;
    ALTER TABLE customers VALIDATE CONSTRAINT customers_children_ck;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='customers_parents_ck') THEN
    ALTER TABLE customers
      ADD CONSTRAINT customers_parents_ck CHECK (parents IS NULL OR jsonb_typeof(parents) = 'array') NOT VALID;
    ALTER TABLE customers VALIDATE CONSTRAINT customers_parents_ck;
  END IF;
END $$;

-- premium_number should be unique when present
CREATE UNIQUE INDEX IF NOT EXISTS customers_premium_number_uniq
  ON customers(premium_number) WHERE premium_number IS NOT NULL;

COMMIT;


-- employee targets per month
CREATE TABLE IF NOT EXISTS employee_monthly_targets (
  employee_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month            DATE NOT NULL,                -- store as first day of month
  target_value     NUMERIC NOT NULL DEFAULT 0,   -- your currency units
  updated_at       TIMESTAMP NOT NULL DEFAULT now(),
  PRIMARY KEY (employee_user_id, month)
);

-- If you don't already have it in your DB:
-- helper: normalize any date to first day of the month
CREATE OR REPLACE FUNCTION first_day_of_month(d DATE)
RETURNS DATE LANGUAGE sql IMMUTABLE AS $$
  SELECT date_trunc('month', d)::date
$$;


-- helper (if you don't already have it)
CREATE OR REPLACE FUNCTION first_day_of_month(d date)
RETURNS date LANGUAGE sql IMMUTABLE AS
$$ SELECT date_trunc('month', d)::date $$;

-- Create table if missing
CREATE TABLE IF NOT EXISTS employee_monthly_targets (
  employee_user_id   uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month              date NOT NULL,
  target_sales       integer      NOT NULL DEFAULT 0,
  achieved_sales     integer      NOT NULL DEFAULT 0,
  target_premium     numeric(14,2) NOT NULL DEFAULT 0,
  achieved_premium   numeric(14,2) NOT NULL DEFAULT 0,
  created_at         timestamptz  NOT NULL DEFAULT now(),
  updated_at         timestamptz  NOT NULL DEFAULT now(),
  PRIMARY KEY (employee_user_id, month)
);


CREATE TABLE IF NOT EXISTS employee_target_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month date NOT NULL,
  delta_sales integer NOT NULL DEFAULT 0,
  delta_premium numeric(14,2) NOT NULL DEFAULT 0,
  note text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add any missing columns (no-op if they already exist)
ALTER TABLE employee_monthly_targets
  ADD COLUMN IF NOT EXISTS target_sales     integer       NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS achieved_sales   integer       NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS target_premium   numeric(14,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS achieved_premium numeric(14,2) NOT NULL DEFAULT 0;

-- If you previously had a legacy "target_value", migrate it into target_premium once
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='employee_monthly_targets' AND column_name='target_value'
  ) THEN
    UPDATE employee_monthly_targets
      SET target_premium = COALESCE(target_premium,0) + COALESCE(target_value::numeric,0);
    -- Optionally drop old column:
    -- ALTER TABLE employee_monthly_targets DROP COLUMN target_value;
  END IF;
END$$;

-- Keep updated_at fresh
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DROP TRIGGER IF EXISTS trg_emp_monthly_targets_updated ON employee_monthly_targets;
CREATE TRIGGER trg_emp_monthly_targets_updated
BEFORE UPDATE ON employee_monthly_targets
FOR EACH ROW EXECUTE FUNCTION set_updated_at();




CREATE INDEX IF NOT EXISTS ix_supervision_employee ON agent_supervision (employee_user_id);
CREATE INDEX IF NOT EXISTS ix_supervision_agent    ON agent_supervision (agent_user_id);
CREATE INDEX IF NOT EXISTS ix_ams_agent_month      ON agent_monthly_stats (agent_user_id, month);
CREATE INDEX IF NOT EXISTS ix_customers_agent      ON customers (agent_id);