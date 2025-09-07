# Insurance Suite (Backend + Frontend)

## Quick Start
1. **Database**
   ```bash
   psql < database/backupfile.sql
   ```
2. **Backend**
   ```bash
   cd backend
   cp .env.example .env   # set DATABASE_URL, JWT secrets, CORS_ORIGIN
   npm i
   npm run dev
   ```
3. **Frontend**
   ```bash
   cd ../frontend
   npm i
   npm run dev
   ```

## Auth Flow
- `POST /api/auth/login` -> returns `{ access_token, user, must_change_password }` and sets httpOnly refresh cookie.
- Add `Authorization: Bearer <access_token>` to protected requests.
- `POST /api/auth/refresh` -> rotates refresh cookie, returns new access token.
- `POST /api/auth/logout` -> revokes current refresh token.

## Roles
- **super_admin/admin:** create users (admin/employee/agent), set salaries, comp, targets, monthly stats, update customer status, list users/agents/customers.
- **employee:** view profile, agents under me, customers under my agents, update those customers' status.
- **agent:** add customers, view own customers/targets/stats.

