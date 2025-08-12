// import pg from 'pg';
// const { Pool } = pg;

// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false
// });

// console.log('Database connected:', process.env.DATABASE_URL || 'No connection string provided');

// export const q = (text, params) => pool.query(text, params);
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pg;

const hasConnString = !!process.env.DATABASE_URL;
console.log('ENV TEST:', {
  PGHOST: process.env.PGHOST,
  PGPORT: process.env.PGPORT,
  PGUSER: process.env.PGUSER,
  PGPASSWORD: process.env.PGPASSWORD,
  PGDATABASE: process.env.PGDATABASE
});
const baseConfig = hasConnString
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT || 5432),
      user: process.env.PGUSER || 'postgres',
      password: String(process.env.PGPASSWORD ?? 'root'), // ← force string
      database: process.env.PGDATABASE || 'insurance_db',
    };

export const pool = new Pool({
  ...baseConfig,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
});

export const q = (text, params) => pool.query(text, params);
