-- 00_base_schema.sql
-- User-provided base with original roles (admin, employee, agent)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END; $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM('admin','employee','agent');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role           user_role NOT NULL,
  name           varchar(120) NOT NULL,
  email          varchar(180) UNIQUE NOT NULL,
  phone_no       varchar(15),
  password_hash  text NOT NULL,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_users_updated ON users;
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- Session table (unused with JWT but safe to keep)
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL,
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

CREATE TABLE IF NOT EXISTS activity_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action        varchar(60) NOT NULL,
  entity_type   varchar(60),
  entity_id     uuid,
  details       jsonb,
  ip            inet,
  created_at    timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS activity_logs_created_at_idx ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS activity_logs_action_idx ON activity_logs(action);

CREATE TABLE IF NOT EXISTS agent_profile (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name       varchar(120),
  phone_no   varchar(15),
  email      varchar(180),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_agent_profile_updated ON agent_profile;
CREATE TRIGGER trg_agent_profile_updated BEFORE UPDATE ON agent_profile
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS agent_bank_details (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bank_name       varchar(120),
  bank_ifsc       varchar(11),
  bank_account_no varchar(32),
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_agent_bank_details_updated ON agent_bank_details;
CREATE TRIGGER trg_agent_bank_details_updated BEFORE UPDATE ON agent_bank_details
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS agent_education_details (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  edu_10     varchar(120),
  edu_12     varchar(120),
  edu_degree varchar(120),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_agent_education_details_updated ON agent_education_details;
CREATE TRIGGER trg_agent_education_details_updated BEFORE UPDATE ON agent_education_details
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS agent_initial_creds (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  temp_password text NOT NULL,
  is_changed    boolean NOT NULL DEFAULT false,
  created_at    timestamptz DEFAULT now()
);

-- You referenced a trigger for agent_compensation before the table existed in the provided text.
-- We'll add the table later in 01_fix_and_extend.sql

CREATE TABLE IF NOT EXISTS agent_compensation_history (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  base_salary      numeric(12,2),
  commission_rate  numeric(5,4),
  effective_from   timestamptz NOT NULL DEFAULT now(),
  created_at       timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS agent_comp_hist_user_idx ON agent_compensation_history(agent_user_id, effective_from DESC);

CREATE TABLE IF NOT EXISTS agent_monthly_targets (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_user_id  uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month          date NOT NULL,
  target_value   numeric(14,2) NOT NULL,
  achieved_value numeric(14,2) NOT NULL DEFAULT 0,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now(),
  CONSTRAINT agent_monthly_targets_uniq UNIQUE (agent_user_id, month)
);
DROP TRIGGER IF EXISTS trg_agent_monthly_targets_updated ON agent_monthly_targets;
CREATE TRIGGER trg_agent_monthly_targets_updated BEFORE UPDATE ON agent_monthly_targets
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Typo in user-provided script (REATE). Properly create agent_target_progress:
CREATE TABLE IF NOT EXISTS agent_target_progress (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_user_id  uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month          date NOT NULL,
  delta          numeric(14,2) NOT NULL,
  note           text,
  created_at     timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS agent_target_progress_idx ON agent_target_progress(agent_user_id, month);

CREATE TABLE IF NOT EXISTS employee_profile (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name       varchar(120),
  phone_no   varchar(15),
  email      varchar(180),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_employee_profile_updated ON employee_profile;
CREATE TRIGGER trg_employee_profile_updated BEFORE UPDATE ON employee_profile
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS employee_bank_details (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bank_name       varchar(120),
  bank_ifsc       varchar(11),
  bank_account_no varchar(32),
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_employee_bank_details_updated ON employee_bank_details;
CREATE TRIGGER trg_employee_bank_details_updated BEFORE UPDATE ON employee_bank_details
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS employee_education_details (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  edu_10     varchar(120),
  edu_12     varchar(120),
  edu_degree varchar(120),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_employee_education_details_updated ON employee_education_details;
CREATE TRIGGER trg_employee_education_details_updated BEFORE UPDATE ON employee_education_details
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'customer_status') THEN
    CREATE TYPE customer_status AS ENUM('Pending','Closed','Denied');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS customers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id    uuid REFERENCES users(id) ON DELETE SET NULL,
  name        varchar(120) NOT NULL,
  email       varchar(180),
  phone_no    varchar(15),
  status      customer_status NOT NULL DEFAULT 'Pending',
  meta        jsonb,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_customers_updated ON customers;
CREATE TRIGGER trg_customers_updated BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE INDEX IF NOT EXISTS customers_agent_idx ON customers(agent_id);
CREATE INDEX IF NOT EXISTS customers_status_idx ON customers(status);

CREATE OR REPLACE VIEW agents_with_customer_counts AS
SELECT
  u.id   AS agent_id,
  u.name AS agent_name,
  u.email,
  u.phone_no,
  COALESCE(COUNT(c.id),0)::int AS customer_count
FROM users u
LEFT JOIN customers c ON c.agent_id = u.id
WHERE u.role = 'agent'
GROUP BY u.id;

CREATE TABLE IF NOT EXISTS employee_salary (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  base_salary      numeric(12,2) NOT NULL,
  effective_from   timestamptz DEFAULT now(),
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_employee_salary_updated ON employee_salary;
CREATE TRIGGER trg_employee_salary_updated BEFORE UPDATE ON employee_salary
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS employee_salary_history (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  base_salary      numeric(12,2) NOT NULL,
  effective_from   timestamptz NOT NULL DEFAULT now(),
  created_at       timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS employee_salary_hist_user_idx
  ON employee_salary_history(employee_user_id, effective_from DESC);

-- In original text, employee_initial_creds used wrong column name. We'll fix in 01_fix_and_extend.sql
CREATE TABLE IF NOT EXISTS employee_initial_creds (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  temp_password text NOT NULL,
  is_changed    boolean NOT NULL DEFAULT false,
  created_at    timestamptz DEFAULT now()
);
