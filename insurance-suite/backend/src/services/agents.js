// import { q } from '../db.js';

// export async function attachAgentToEmployee(agentUserId, employeeUserId) {
//   await q(
//     `INSERT INTO agent_supervision (agent_user_id, employee_user_id)
//      VALUES ($1,$2)
//      ON CONFLICT (agent_user_id) DO UPDATE SET employee_user_id = EXCLUDED.employee_user_id`,
//     [agentUserId, employeeUserId]
//   );
// }

// export async function setAgentComp(agentUserId, { base_salary = 0, commission_rate = 0 }) {
//   const exist = await q('SELECT 1 FROM agent_compensation WHERE agent_user_id=$1', [agentUserId]);
//   if (exist.length) {
//     await q('UPDATE agent_compensation SET base_salary=$1, commission_rate=$2 WHERE agent_user_id=$3', [base_salary, commission_rate, agentUserId]);
//   } else {
//     await q('INSERT INTO agent_compensation (agent_user_id, base_salary, commission_rate) VALUES ($1,$2,$3)', [agentUserId, base_salary, commission_rate]);
//   }
//   await q('INSERT INTO agent_compensation_history (agent_user_id, base_salary, commission_rate) VALUES ($1,$2,$3)', [agentUserId, base_salary, commission_rate]);
// }

// export async function upsertMonthlyStats(agentUserId, month, { sales_count = 0, total_premium = 0, total_commission = 0 }) {
//   await q(
//     `INSERT INTO agent_monthly_stats (agent_user_id, month, sales_count, total_premium, total_commission)
//      VALUES ($1, first_day_of_month($2::date), $3,$4,$5)
//      ON CONFLICT (agent_user_id, month)
//      DO UPDATE SET sales_count=$3, total_premium=$4, total_commission=$5, updated_at=now()`,
//     [agentUserId, month, sales_count, total_premium, total_commission]
//   );
// }

// export async function setAgentComp(agentId, { base_salary = 0, commission_rate = 0 } = {}) {
//   if (!agentId) { const e = new Error('agentId required'); e.status = 400; throw e }

//   const base = Number(base_salary) || 0
//   const rate = Number(commission_rate) || 0

//   await q(
//     `INSERT INTO agent_compensation (agent_user_id, base_salary, commission_rate)
//      VALUES ($1,$2,$3)
//      ON CONFLICT (agent_user_id) DO UPDATE
//        SET base_salary = EXCLUDED.base_salary,
//            commission_rate = EXCLUDED.commission_rate,
//            updated_at = now()`,
//     [agentId, base, rate]
//   )
// }



import { q } from '../db.js'

/* -------------------------- helpers -------------------------- */
function isUuid(v) {
  return typeof v === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)
}

/* ---------------- attach agent to employee ------------------- */
export async function attachAgentToEmployee(agentUserId, employeeUserId) {
  if (!isUuid(agentUserId) || !isUuid(employeeUserId)) {
    const e = new Error('agentUserId and employeeUserId must be valid UUIDs'); e.status = 400; throw e
  }
  await q(
    `INSERT INTO agent_supervision (agent_user_id, employee_user_id)
     VALUES ($1,$2)
     ON CONFLICT (agent_user_id) DO UPDATE
       SET employee_user_id = EXCLUDED.employee_user_id,
           updated_at = now()`,
    [agentUserId, employeeUserId]
  )
}

/* ---------------------- set agent comp ----------------------- */
export async function setAgentComp(agentId, { base_salary = 0, commission_rate = 0 } = {}) {
  if (!isUuid(agentId)) { const e = new Error('Invalid agentId (must be UUID)'); e.status = 400; throw e }

  const base = Number(base_salary)
  const rate = Number(commission_rate)
  if (!Number.isFinite(base) || !Number.isFinite(rate)) {
    const e = new Error('base_salary and commission_rate must be numbers'); e.status = 400; throw e
  }

  // upsert current comp
  await q(
    `INSERT INTO agent_compensation (agent_user_id, base_salary, commission_rate)
     VALUES ($1,$2,$3)
     ON CONFLICT (agent_user_id) DO UPDATE
       SET base_salary = EXCLUDED.base_salary,
           commission_rate = EXCLUDED.commission_rate,
           updated_at = now()`,
    [agentId, base, rate]
  )

  // append to history (best-effort)
  await q(
    `INSERT INTO agent_compensation_history (agent_user_id, base_salary, commission_rate)
     VALUES ($1,$2,$3)`,
    [agentId, base, rate]
  ).catch(() => {})
}

/* ------------------- upsert monthly stats -------------------- */
// export async function upsertMonthlyStats(
//   agentId,
//   month,
//   { sales_count = 0, total_premium = 0, total_commission = 0 } = {}
// ) {
//   if (!isUuid(agentId)) { const e = new Error('Invalid agentId (must be UUID)'); e.status = 400; throw e }

//   const s = Number(sales_count) || 0
//   const p = Number(total_premium) || 0
//   const c = Number(total_commission) || 0

//   // normalize month to 1st of month via SQL
//   await q(
//     `INSERT INTO agent_monthly_stats (agent_user_id, month, sales_count, total_premium, total_commission)
//      VALUES ($1, date_trunc('month', $2::date)::date, $3, $4, $5)
//      ON CONFLICT (agent_user_id, month) DO UPDATE
//        SET sales_count = EXCLUDED.sales_count,
//            total_premium = EXCLUDED.total_premium,
//            total_commission = EXCLUDED.total_commission`,
//     [agentId, month || new Date().toISOString().slice(0, 10), s, p, c]
//   )
// }
export async function upsertMonthlyStats(
  agentId,
  month,
  { sales_count = 0, total_premium = 0, total_commission = 0 } = {}
) {
  if (!isUuid(agentId)) {
    const e = new Error('Invalid agentId (must be UUID)');
    e.status = 400;
    throw e;
  }

  const s = Number(sales_count) || 0;
  const p = Number(total_premium) || 0;
  const c = Number(total_commission) || 0;

  // Normalize month to first day of month on the DB side
  await q(
    `INSERT INTO agent_monthly_stats (agent_user_id, month, sales_count, total_premium, total_commission)
     VALUES ($1, date_trunc('month', $2::date)::date, $3, $4, $5)
     ON CONFLICT (agent_user_id, month) DO UPDATE
       SET sales_count      = COALESCE(agent_monthly_stats.sales_count, 0)      + EXCLUDED.sales_count,
           total_premium    = COALESCE(agent_monthly_stats.total_premium, 0)    + EXCLUDED.total_premium,
           total_commission = COALESCE(agent_monthly_stats.total_commission, 0) + EXCLUDED.total_commission`,
    [agentId, month || new Date().toISOString().slice(0, 10), s, p, c]
  );
}


/* ----------------- optional: read comp quick ----------------- */
export async function getAgentComp(agentId) {
  if (!isUuid(agentId)) return null
  const rows = await q(
    `SELECT agent_user_id, base_salary, commission_rate, updated_at
       FROM agent_compensation
      WHERE agent_user_id = $1`,
    [agentId]
  )
  return rows[0] || null
}
