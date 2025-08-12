-- Enable UUIDs and citext
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- USERS (admins + agents)
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role            TEXT NOT NULL CHECK (role IN ('admin','agent')),
  name            VARCHAR(120) NOT NULL,
  email           CITEXT UNIQUE NOT NULL,
  phone_no        VARCHAR(20) UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- AGENT PROFILE
CREATE TABLE IF NOT EXISTS agent_profile (
  user_id         UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  pan_number      VARCHAR(10) UNIQUE NOT NULL,
  aadhaar_number  VARCHAR(12) UNIQUE NOT NULL
);

-- BANK DETAILS
CREATE TABLE IF NOT EXISTS agent_bank_details (
  agent_id        UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bank_name       VARCHAR(120) NOT NULL,
  account_no      VARCHAR(34) NOT NULL,
  ifsc_code       VARCHAR(20) NOT NULL
);

-- EDUCATION DETAILS
CREATE TABLE IF NOT EXISTS agent_education_details (
  agent_id        UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  tenth_percent   NUMERIC(5,2),
  twelfth_percent NUMERIC(5,2),
  degree_percent  NUMERIC(5,2)
);

-- COMPENSATION
CREATE TABLE IF NOT EXISTS agent_compensation (
  agent_id        UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  base_salary     NUMERIC(12,2) NOT NULL DEFAULT 0,
  incentive_rate  NUMERIC(6,3)  NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS agent_compensation_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  base_salary     NUMERIC(12,2) NOT NULL,
  incentive_rate  NUMERIC(6,3)  NOT NULL,
  changed_by      UUID NOT NULL REFERENCES users(id),
  changed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MONTHLY TARGETS
CREATE TABLE IF NOT EXISTS agent_monthly_targets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month           DATE NOT NULL,
  target_value    NUMERIC(12,2) NOT NULL,
  description     TEXT,
  UNIQUE(agent_id, month)
);

-- TARGET PROGRESS
CREATE TABLE IF NOT EXISTS agent_target_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month           DATE NOT NULL,
  achieved_value  NUMERIC(12,2) NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(agent_id, month)
);

-- CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id           UUID REFERENCES users(id) ON DELETE SET NULL,
  name               VARCHAR(120) NOT NULL,
  age                INT,
  defenders_like     TEXT,
  number_of_children INT,
  spouse             TEXT,
  parents            TEXT,
  status             TEXT NOT NULL CHECK (status IN ('pending','Verified','Unverified')),
  aadhaar_number     VARCHAR(12),
  pan_number         VARCHAR(10),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_agent ON customers(agent_id);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);

-- ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    UUID REFERENCES users(id),
  actor_role  TEXT,
  action      TEXT NOT NULL,
  resource    TEXT,
  meta        JSONB DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- EXPRESS SESSION TABLE (connect-pg-simple)
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
) WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
