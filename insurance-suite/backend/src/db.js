// import pg from 'pg';
// const { Pool } = pg;

// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   max: 20,
//   idleTimeoutMillis: 30_000,
// });

// export async function q(text, params) {
//   const { rows } = await pool.query(text, params);
//   return rows;
// }

// backend/src/db.js
import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

function buildUrlFromParts() {
  const { PGHOST, PGPORT = '5432', PGDATABASE, PGUSER, PGPASSWORD, PGSSLMODE } = process.env;
  if (PGHOST && PGDATABASE && PGUSER) {
    const pass = PGPASSWORD ? `:${encodeURIComponent(PGPASSWORD)}` : '';
    // only append sslmode=require if explicitly asked via PGSSLMODE
    const ssl = (PGSSLMODE || '').toLowerCase() === 'require' ? '?sslmode=require' : '';
    return `postgresql://${encodeURIComponent(PGUSER)}${pass}@${PGHOST}:${PGPORT}/${PGDATABASE}${ssl}`;
  }
  return null;
}

const connectionString = (process.env.DATABASE_URL || '').trim() || buildUrlFromParts();
if (!connectionString) {
  throw new Error('DATABASE_URL is missing and PG* parts not set.');
}

// Decide SSL behavior:
// - DB_SSL=disable/false -> ssl: false
// - DB_SSL=require/true  -> ssl: { rejectUnauthorized: false }
// - DB_SSL not set       -> auto: SSL only if NOT localhost
const DB_SSL = (process.env.DB_SSL || '').toLowerCase();
let ssl;
if (DB_SSL === 'disable' || DB_SSL === 'false') {
  ssl = false;
} else if (DB_SSL === 'require' || DB_SSL === 'true') {
  ssl = { rejectUnauthorized: false };
} else {
  const isLocal = /^(postgres(ql)?:\/\/)?(localhost|127\.0\.0\.1)/i.test(connectionString);
  ssl = isLocal ? false : { rejectUnauthorized: false };
}

export const pool = new Pool({
  connectionString,
  ssl,
  max: 20,
  idleTimeoutMillis: 30_000,
});

export async function q(text, params) {
  const { rows } = await pool.query(text, params);
  return rows;
}
