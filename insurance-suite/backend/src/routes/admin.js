

import express from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { Roles } from '../utils/roles.js'
import { createUser } from '../services/users.js'
import { q } from '../db.js'
import { attachAgentToEmployee, setAgentComp, upsertMonthlyStats } from '../services/agents.js'
import { setMonthlyTarget, addTargetProgress } from '../services/targets.js'
import { setEmployeeSalary } from '../services/employees.js'
import { logAction } from '../services/audit.js'
import { adminSetPremiumNumber } from '../services/customers.js'

const router = express.Router()

// --------- guards ----------
router.use(requireAuth, requireRole(Roles.SUPER_ADMIN, Roles.ADMIN))

// small async wrapper so unhandled rejections don't crash Express
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

const isUuid = v =>
  typeof v === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)

function randomPassword(len = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*'
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

async function ensureUserRole(userId, mustBe /* 'employee' | 'agent' */) {
  const rows = await q('SELECT id, role FROM users WHERE id=$1', [userId])
  if (!rows.length) return { ok: false, status: 404, error: 'User not found' }
  if (mustBe && rows[0].role !== mustBe) return { ok: false, status: 409, error: `User is not ${mustBe}` }
  return { ok: true, user: rows[0] }
}

/* =========================================================================================
 * USERS (create) + read initial creds
 * =======================================================================================*/
router.post('/users', asyncHandler(async (req, res) => {
  const actor = req.user
  const { role, name, email, phone_no, employee_supervisor_id } = req.body || {}
  if (![Roles.ADMIN, Roles.EMPLOYEE, Roles.AGENT].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' })
  }
  const temp = randomPassword(12)
  const user = await createUser({ role, name, email, phone_no, password: temp })

  if (role === Roles.AGENT) {
    await q(
      'INSERT INTO agent_initial_creds (agent_user_id, temp_password) VALUES ($1,$2) ON CONFLICT (agent_user_id) DO NOTHING',
      [user.id, temp]
    )
    if (employee_supervisor_id) await attachAgentToEmployee(user.id, employee_supervisor_id)
  } else if (role === Roles.EMPLOYEE) {
    await q(
      'INSERT INTO employee_initial_creds (employee_user_id, temp_password) VALUES ($1,$2) ON CONFLICT (employee_user_id) DO NOTHING',
      [user.id, temp]
    )
  }

  await logAction(actor.sub, 'CREATE_USER', 'user', user.id, { created_role: role }, req.ip)
  res.json({ user, temp_password: temp, warning: 'Share ONLY once. User must change password on first login.' })
}))

// Read initial credentials for a specific user (agent/employee)
router.get('/users/:id/initial-creds', asyncHandler(async (req, res) => {
  const { id } = req.params
  const a = await q('SELECT temp_password, is_changed FROM agent_initial_creds WHERE agent_user_id=$1', [id])
  if (a.length) return res.json({ role: 'agent', ...a[0] })
  const e = await q('SELECT temp_password, is_changed FROM employee_initial_creds WHERE employee_user_id=$1', [id])
  if (e.length) return res.json({ role: 'employee', ...e[0] })
  res.json({ role: null, temp_password: null, is_changed: null })
}))

/* =========================================================================================
 * EMPLOYEE profile/bank/education (UPSERT)
 * =======================================================================================*/
router.post('/employees/:id/profile', asyncHandler(async (req, res) => {
  const actor = req.user
  const { id } = req.params
  const { name, phone_no, email, pan_no, aadhaar_no } = req.body || {}
  const chk = await ensureUserRole(id, 'employee')
  if (!chk.ok) return res.status(chk.status).json({ error: chk.error })

  const rows = await q(
    `INSERT INTO employee_profile (user_id,name,phone_no,email,pan_no,aadhaar_no)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (user_id) DO UPDATE
       SET name=EXCLUDED.name, phone_no=EXCLUDED.phone_no, email=EXCLUDED.email,
           pan_no=EXCLUDED.pan_no, aadhaar_no=EXCLUDED.aadhaar_no, updated_at=now()
     RETURNING *`,
    [id, name || null, phone_no || null, email || null, pan_no || null, aadhaar_no || null]
  )
  await logAction(actor.sub, 'UPSERT_EMPLOYEE_PROFILE', 'user', id, { email }, req.ip)
  res.json(rows[0])
}))

router.post('/employees/:id/bank', asyncHandler(async (req, res) => {
  const actor = req.user
  const { id } = req.params
  const { bank_name, bank_ifsc, bank_account_no } = req.body || {}
  const chk = await ensureUserRole(id, 'employee')
  if (!chk.ok) return res.status(chk.status).json({ error: chk.error })

  const rows = await q(
    `INSERT INTO employee_bank_details (user_id,bank_name,bank_ifsc,bank_account_no)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (user_id) DO UPDATE
       SET bank_name=EXCLUDED.bank_name, bank_ifsc=EXCLUDED.bank_ifsc,
           bank_account_no=EXCLUDED.bank_account_no, updated_at=now()
     RETURNING *`,
    [id, bank_name || null, bank_ifsc || null, bank_account_no || null]
  )
  await logAction(actor.sub, 'UPSERT_EMPLOYEE_BANK', 'user', id, { bank_ifsc }, req.ip)
  res.json(rows[0])
}))

router.post('/employees/:id/education', asyncHandler(async (req, res) => {
  const actor = req.user
  const { id } = req.params
  const { edu_10, edu_12, edu_degree } = req.body || {}
  const chk = await ensureUserRole(id, 'employee')
  if (!chk.ok) return res.status(chk.status).json({ error: chk.error })

  const rows = await q(
    `INSERT INTO employee_education_details (user_id,edu_10,edu_12,edu_degree)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (user_id) DO UPDATE
       SET edu_10=EXCLUDED.edu_10, edu_12=EXCLUDED.edu_12,
           edu_degree=EXCLUDED.edu_degree, updated_at=now()
     RETURNING *`,
    [id, edu_10 || null, edu_12 || null, edu_degree || null]
  )
  await logAction(actor.sub, 'UPSERT_EMPLOYEE_EDU', 'user', id, { edu_degree }, req.ip)
  res.json(rows[0])
}))

/* =========================================================================================
 * AGENT profile/bank/education (UPSERT)
 * =======================================================================================*/
router.post('/agents/:id/profile', asyncHandler(async (req, res) => {
  const actor = req.user
  const { id } = req.params
  const { name, phone_no, email, pan_no, aadhaar_no } = req.body || {}
  const chk = await ensureUserRole(id, 'agent')
  if (!chk.ok) return res.status(chk.status).json({ error: chk.error })

  const rows = await q(
    `INSERT INTO agent_profile (user_id,name,phone_no,email,pan_no,aadhaar_no)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (user_id) DO UPDATE
       SET name=EXCLUDED.name, phone_no=EXCLUDED.phone_no, email=EXCLUDED.email,
           pan_no=EXCLUDED.pan_no, aadhaar_no=EXCLUDED.aadhaar_no, updated_at=now()
     RETURNING *`,
    [id, name || null, phone_no || null, email || null, pan_no || null, aadhaar_no || null]
  )
  await logAction(actor.sub, 'UPSERT_AGENT_PROFILE', 'user', id, { email }, req.ip)
  res.json(rows[0])
}))

router.post('/agents/:id/bank', asyncHandler(async (req, res) => {
  const actor = req.user
  const { id } = req.params
  const { bank_name, bank_ifsc, bank_account_no } = req.body || {}
  const chk = await ensureUserRole(id, 'agent')
  if (!chk.ok) return res.status(chk.status).json({ error: chk.error })

  const rows = await q(
    `INSERT INTO agent_bank_details (user_id,bank_name,bank_ifsc,bank_account_no)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (user_id) DO UPDATE
       SET bank_name=EXCLUDED.bank_name, bank_ifsc=EXCLUDED.bank_ifsc,
           bank_account_no=EXCLUDED.bank_account_no, updated_at=now()
     RETURNING *`,
    [id, bank_name || null, bank_ifsc || null, bank_account_no || null]
  )
  await logAction(actor.sub, 'UPSERT_AGENT_BANK', 'user', id, { bank_ifsc }, req.ip)
  res.json(rows[0])
}))

router.post('/agents/:id/education', asyncHandler(async (req, res) => {
  const actor = req.user
  const { id } = req.params
  const { edu_10, edu_12, edu_degree } = req.body || {}
  const chk = await ensureUserRole(id, 'agent')
  if (!chk.ok) return res.status(chk.status).json({ error: chk.error })

  const rows = await q(
    `INSERT INTO agent_education_details (user_id,edu_10,edu_12,edu_degree)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (user_id) DO UPDATE
       SET edu_10=EXCLUDED.edu_10, edu_12=EXCLUDED.edu_12,
           edu_degree=EXCLUDED.edu_degree, updated_at=now()
     RETURNING *`,
    [id, edu_10 || null, edu_12 || null, edu_degree || null]
  )
  await logAction(actor.sub, 'UPSERT_AGENT_EDU', 'user', id, { edu_degree }, req.ip)
  res.json(rows[0])
}))

/* =========================================================================================
 * COMP / TARGETS / STATS / SALARY
 * =======================================================================================*/
router.post('/employees/:employeeId/salary', asyncHandler(async (req, res) => {
  const actor = req.user
  const { employeeId } = req.params
  const { base_salary } = req.body || {}
  if (!isUuid(employeeId)) return res.status(400).json({ error: 'Invalid employeeId' })
  await setEmployeeSalary(employeeId, base_salary)
  await logAction(actor.sub, 'SET_EMPLOYEE_SALARY', 'user', employeeId, { base_salary }, req.ip)
  res.json({ ok: true })
}))

router.post('/agents/:agentId/supervisor', asyncHandler(async (req, res) => {
  const actor = req.user
  const { agentId } = req.params
  const { employee_user_id } = req.body || {}
  if (!isUuid(agentId) || !isUuid(employee_user_id)) {
    return res.status(400).json({ error: 'Invalid ids' })
  }
  await attachAgentToEmployee(agentId, employee_user_id)
  await logAction(actor.sub, 'SET_AGENT_SUPERVISOR', 'user', agentId, { employee_user_id }, req.ip)
  res.json({ ok: true })
}))

router.post('/agents/:agentId/targets', asyncHandler(async (req, res) => {
  const actor = req.user
  const { agentId } = req.params
  const { month, target_value } = req.body || {}
  if (!isUuid(agentId)) return res.status(400).json({ error: 'Invalid agentId' })
  await setMonthlyTarget(agentId, month, target_value)
  await logAction(actor.sub, 'SET_AGENT_TARGET', 'user', agentId, { month, target_value }, req.ip)
  res.json({ ok: true })
}))

router.post('/agents/:agentId/targets/progress', asyncHandler(async (req, res) => {
  const actor = req.user
  const { agentId } = req.params
  const { month, delta, note } = req.body || {}
  if (!isUuid(agentId)) return res.status(400).json({ error: 'Invalid agentId' })
  await addTargetProgress(agentId, month, delta, note || null)
  await logAction(actor.sub, 'ADD_TARGET_PROGRESS', 'user', agentId, { month, delta }, req.ip)
  res.json({ ok: true })
}))

router.post('/agents/:agentId/monthly-stats', asyncHandler(async (req, res) => {
  const actor = req.user
  const { agentId } = req.params
  const { month, sales_count, total_premium, total_commission } = req.body || {}
  if (!isUuid(agentId)) return res.status(400).json({ error: 'Invalid agentId' })
  await upsertMonthlyStats(agentId, month, { sales_count, total_premium, total_commission })
  await logAction(actor.sub, 'UPSERT_AGENT_MONTHLY_STATS', 'user', agentId, { month }, req.ip)
  res.json({ ok: true })
}))

// SINGLE, SAFE route to set comp (removed duplicates)
router.post('/agents/:agentId/comp', asyncHandler(async (req, res) => {
  const actor = req.user
  const { agentId } = req.params
  let { base_salary = 0, commission_rate = 0 } = req.body || {}

  if (!isUuid(agentId)) return res.status(400).json({ error: 'Invalid agentId (must be UUID)' })

  base_salary = Number(base_salary) || 0
  commission_rate = Number(commission_rate) || 0

  await setAgentComp(agentId, { base_salary, commission_rate })
  await logAction(actor.sub, 'SET_AGENT_COMP', 'user', agentId, { base_salary, commission_rate }, req.ip)
  res.json({ ok: true })
}))

/* =========================================================================================
 * CUSTOMERS: status + premium number (admin-only)
 * =======================================================================================*/
router.post('/customers/:customerId/status', asyncHandler(async (req, res) => {
  const actor = req.user
  const { status } = req.body || {}
  await q('UPDATE customers SET status=$1, updated_at=now() WHERE id=$2', [status, req.params.customerId])
  await logAction(actor.sub, 'UPDATE_CUSTOMER_STATUS', 'customer', req.params.customerId, { status }, req.ip)
  res.json({ ok: true })
}))

router.post('/customers/:id/premium-number', asyncHandler(async (req, res) => {
  const actor = req.user
  const row = await adminSetPremiumNumber(req.params.id, req.body?.premium_number)
  await logAction(actor.sub, 'SET_CUSTOMER_PREMIUM_NUMBER', 'customer', req.params.id, {}, req.ip)
  res.json(row)
}))

// Admin list customers (filters: status, agent_id; paging: limit, offset)
router.get('/customers', asyncHandler(async (req, res) => {
  const { status, agent_id } = req.query || {}
  const limit = Math.min(parseInt(req.query.limit || '200', 10) || 200, 1000)
  const offset = parseInt(req.query.offset || '0', 10) || 0

  const params = []
  const conds = []
  if (status)   { params.push(status);   conds.push(`c.status = $${params.length}::customer_status`) }
  if (agent_id) { params.push(agent_id); conds.push(`c.agent_id = $${params.length}::uuid`) }

  params.push(limit);  const limPos = params.length
  params.push(offset); const offPos = params.length

  const rows = await q(
    `SELECT
        c.id, c.agent_id, c.name, c.email, c.phone_no, c.status,
        c.pan_no, c.aadhaar_no, c.age, c.spouse_name, c.number_of_children,
        c.parents, c.premium_number, c.created_at,
        u.name  AS agent_name, u.email AS agent_email
     FROM customers c
     LEFT JOIN users u ON u.id = c.agent_id
     ${conds.length ? 'WHERE ' + conds.join(' AND ') : ''}
     ORDER BY c.created_at DESC
     LIMIT $${limPos} OFFSET $${offPos}`,
    params
  )
  res.json(rows)
}))

// GET full customer details
router.get('/customers/:id', asyncHandler(async (req, res) => {
  const { id } = req.params
  const rows = await q(
    `SELECT c.*, ua.name AS agent_name, ua.email AS agent_email
       FROM customers c
       LEFT JOIN users ua ON ua.id = c.agent_id
      WHERE c.id = $1`,
    [id]
  )
  if (!rows.length) return res.status(404).json({ error: 'Customer not found' })
  res.json(rows[0])
}))

/* =========================================================================================
 * OVERVIEWS
 * =======================================================================================*/
router.get('/overview/users', asyncHandler(async (_req, res) => {
  const rows = await q('SELECT id, role, name, email, phone_no, created_at FROM users ORDER BY created_at DESC')
  res.json(rows)
}))

router.get('/overview/agents', asyncHandler(async (_req, res) => {
  const rows = await q('SELECT * FROM agents_with_customer_counts ORDER BY customer_count DESC')
  res.json(rows)
}))

router.get('/overview/agents/:agentId/customers', asyncHandler(async (req, res) => {
  const rows = await q('SELECT * FROM customers WHERE agent_id=$1 ORDER BY created_at DESC', [req.params.agentId])
  res.json(rows)
}))

router.get('/overview/employees', asyncHandler(async (_req, res) => {
  const rows = await q(`
    SELECT u.id, u.name, u.email, s.base_salary
      FROM users u
      LEFT JOIN employee_salary s ON s.employee_user_id = u.id
     WHERE u.role = 'employee'
     ORDER BY u.created_at DESC`)
  res.json(rows)
}))

router.get('/overview/employees-aggregate', async (_req, res) => {
  const rows = await q(`
    SELECT
      e.id,
      e.name,
      e.email,

      /* # of agents under the employee */
      COALESCE((
        SELECT COUNT(DISTINCT s.agent_user_id)
          FROM agent_supervision s
         WHERE s.employee_user_id = e.id
      ), 0)::int AS agent_count,

      /* # of customers under those agents */
      COALESCE((
        SELECT COUNT(c.id)
          FROM customers c
          JOIN agent_supervision s2 ON s2.agent_user_id = c.agent_id
         WHERE s2.employee_user_id = e.id
      ), 0)::int AS customer_count,

      /* Sum of THIS MONTH's premium across all agents under the employee */
      COALESCE((
        SELECT SUM(ams.total_premium)
          FROM agent_monthly_stats ams
          JOIN agent_supervision s3 ON s3.agent_user_id = ams.agent_user_id
         WHERE s3.employee_user_id = e.id
           AND ams.month = first_day_of_month(now()::date)
      ), 0)::numeric AS total_premium_month

    FROM users e
    WHERE e.role = 'employee'
    ORDER BY e.name ASC
  `)
  res.json(rows)
})


// router.get('/overview/employees-aggregate', asyncHandler(async (_req, res) => {
//   const rows = await q(`
//     SELECT
//       e.id,
//       e.name,
//       e.email,
//       COALESCE(COUNT(DISTINCT asv.agent_user_id), 0)::int AS agent_count,
//       COALESCE(COUNT(c.id), 0)::int AS customer_count
//     FROM users e
//       LEFT JOIN agent_supervision asv ON asv.employee_user_id = e.id
//       LEFT JOIN customers c ON c.agent_id = asv.agent_user_id
//     WHERE e.role = 'employee'
//     GROUP BY e.id, e.name, e.email
//     ORDER BY e.name ASC
//   `)
//   res.json(rows)
// }))

/* =========================================================================================
 * DELETE users (employee / agent)
 * =======================================================================================*/
async function deleteUserCascade(targetId, actor) {
  await q('BEGIN')
  try {
    await q('DELETE FROM agent_supervision WHERE agent_user_id=$1 OR employee_user_id=$1', [targetId]).catch(()=>{})
    await q('DELETE FROM "session" WHERE sess::text ILIKE $1', [`%${targetId}%`]).catch(()=>{})
    await q('DELETE FROM users WHERE id=$1', [targetId])
    await logAction(actor.sub, 'DELETE_USER', 'user', targetId, {}, null)
    await q('COMMIT')
    return true
  } catch (e) {
    await q('ROLLBACK')
    throw e
  }
}

router.delete('/employees/:id', asyncHandler(async (req, res) => {
  const actor = req.user
  const { id } = req.params
  if (id === actor.sub) return res.status(400).json({ error: 'You cannot delete your own account' })
  const rows = await q('SELECT id, role FROM users WHERE id=$1', [id])
  if (!rows.length) return res.status(404).json({ error: 'User not found' })
  if (rows[0].role !== 'employee') return res.status(409).json({ error: 'Target is not an employee' })
  await deleteUserCascade(id, actor)
  res.json({ ok: true })
}))

router.delete('/agents/:id', asyncHandler(async (req, res) => {
  const actor = req.user
  const { id } = req.params
  if (id === actor.sub) return res.status(400).json({ error: 'You cannot delete your own account' })
  const rows = await q('SELECT id, role FROM users WHERE id=$1', [id])
  if (!rows.length) return res.status(404).json({ error: 'User not found' })
  if (rows[0].role !== 'agent') return res.status(409).json({ error: 'Target is not an agent' })
  await deleteUserCascade(id, actor)
  res.json({ ok: true })
}))


router.get('/overview/agents', async (req, res, next) => {
  try {
    const rows = await q(`
      SELECT
        u.id AS agent_id,
        u.name,
        u.email,
        COALESCE(cnt.customer_count, 0)::int AS customer_count
      FROM users u
      LEFT JOIN (
        SELECT agent_id, COUNT(*)::int AS customer_count
        FROM customers
        GROUP BY agent_id
      ) cnt ON cnt.agent_id = u.id
      WHERE u.role = 'agent'
      ORDER BY customer_count DESC, u.name ASC
    `)
    res.json(rows)
  } catch (e) { next(e) }
})

router.get('/agents/:id/summary', async (req, res) => {
  const { id } = req.params

  // basic (ensure this really is an agent)
  const [agent] = await q(
    `SELECT u.id, u.name, u.email, u.phone_no,
            ap.pan_no, ap.aadhaar_no
       FROM users u
       LEFT JOIN agent_profile ap ON ap.user_id = u.id
      WHERE u.id=$1 AND u.role='agent'`,
    [id]
  )
  if (!agent) return res.status(404).json({ error: 'Agent not found' })

  // preferred: from agent_compensation
  let comp = await q(
    `SELECT ac.base_salary, ac.commission_rate
       FROM users u
       LEFT JOIN agent_compensation ac ON ac.agent_user_id = u.id
      WHERE u.id = $1
      LIMIT 1`,
    [id]
  )

  // fallback: legacy table name agent_comp (if present)
  if (!comp.length) {
    try {
      comp = await q(
        `SELECT ac.base_salary, ac.commission_rate
           FROM users u
           LEFT JOIN agent_comp ac ON (ac.agent_user_id = u.id OR ac.agent_id = u.id)
          WHERE u.id = $1
          LIMIT 1`,
        [id]
      )
    } catch { /* ignore if table doesn't exist */ }
  }
  const compRow = comp[0] || { base_salary: 0, commission_rate: 0 }

  // totals + monthly
  const [totals] = await q(
    `SELECT COALESCE(SUM(sales_count),0)::int          AS sales_count,
            COALESCE(SUM(total_premium),0)::numeric    AS total_premium,
            COALESCE(SUM(total_commission),0)::numeric AS total_commission
       FROM agent_monthly_stats
      WHERE agent_user_id=$1`,
    [id]
  )

  const monthly = await q(
    `SELECT month, sales_count, total_premium, total_commission
       FROM agent_monthly_stats
      WHERE agent_user_id=$1
      ORDER BY month DESC
      LIMIT 12`,
    [id]
  )

  const [{ customer_count }] = await q(
    `SELECT COUNT(*)::int AS customer_count FROM customers WHERE agent_id=$1`,
    [id]
  )

  res.json({
    agent,
    comp: compRow,
    totals,
    monthly: monthly.reverse(),
    customer_count
  })
})

// --- ADMIN: set monthly target for an employee ---
router.post('/employees/:employeeId/targets', async (req, res) => {
  const { employeeId } = req.params
  const { month, target_sales = 0, target_premium = 0 } = req.body || {}
  // store first day of month
  const m = month?.slice(0, 7) + '-01'
  await q(
    `INSERT INTO employee_monthly_targets (employee_user_id, month, target_sales, target_premium)
     VALUES ($1, first_day_of_month($2::date), $3, $4)
     ON CONFLICT (employee_user_id, month)
     DO UPDATE SET target_sales = EXCLUDED.target_sales,
                   target_premium = EXCLUDED.target_premium,
                   updated_at = now()`,
    [employeeId, m, Number(target_sales)||0, Number(target_premium)||0]
  )
  res.json({ ok: true })
})

router.post('/employees/:employeeId/targets/progress', async (req, res) => {
  const { employeeId } = req.params
  const { month, delta_sales = 0, delta_premium = 0, note = null } = req.body || {}
  const m = month?.slice(0, 7) + '-01'
  await q(
    `INSERT INTO employee_target_progress (employee_user_id, month, delta_sales, delta_premium, note)
     VALUES ($1, first_day_of_month($2::date), $3, $4, $5)`,
    [employeeId, m, Number(delta_sales)||0, Number(delta_premium)||0, note]
  )
  res.json({ ok: true })
})

export default router
