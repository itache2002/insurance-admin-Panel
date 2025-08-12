# Insurance Admin Backend (Node.js + Express + PostgreSQL)

Production-ready backend for an insurance admin panel with RBAC (admin/agent), sessions, targets, salaries & incentives, activity logs, and customer management.

## Stack
- Node 18+, Express 5
- PostgreSQL 14+
- Sessions with connect-pg-simple
- Validation with zod
- Password hashing with bcrypt
- Security: helmet, CORS, HTTP-only cookies
- Logging: morgan

## Quick Start
```bash
# 1) Create DB and run schema
createdb insurance_db
psql -d insurance_db -f db/schema.sql

# 2) Install deps
npm install

# 3) Copy .env and update values
cp .env.example .env

# 4) Run (dev)
npm run dev
# or production
npm start
```

## First Admin
Call once to bootstrap an admin:
```
POST /api/auth/init-admin
{
  "name":"Admin",
  "email":"admin@example.com",
  "phone_no":"9999999999",
  "password":"StrongPass#123"
}
```

Then log in with `/api/auth/login` and manage admins/agents.
