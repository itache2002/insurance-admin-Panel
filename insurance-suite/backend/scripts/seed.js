// backend/scripts/seed.js
// Run with: node backend/scripts/seed.js
import 'dotenv/config'
import { q } from '../src/db.js'

/* ──────────────────────────────────────────────────────────────
   Helpers
────────────────────────────────────────────────────────────── */
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = (arr) => arr[rnd(0, arr.length - 1)]

function pan() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const L = () => letters[rnd(0, letters.length - 1)]
  const D = () => String(rnd(0, 9))
  return `${L()}${L()}${L()}${L()}${L()}${D()}${D()}${D()}${D()}${L()}`
}
function aadhaar() {
  let s = ''
  for (let i = 0; i < 12; i++) s += rnd(0, 9)
  return s
}
function firstOfMonthOffset(monthsAgo = 0) {
  const d = new Date()
  d.setUTCDate(1)
  d.setUTCHours(0, 0, 0, 0)
  d.setUTCMonth(d.getUTCMonth() - monthsAgo)
  return d.toISOString().slice(0, 10) // 'YYYY-MM-DD'
}

/* ──────────────────────────────────────────────────────────────
   Ensure aux tables exist if your schema missed them
────────────────────────────────────────────────────────────── */
async function ensureTables() {
  await q(`
    CREATE TABLE IF NOT EXISTS agent_supervision (
      agent_user_id   uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      employee_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at      timestamptz DEFAULT now()
    );
  `)

  await q(`
    CREATE TABLE IF NOT EXISTS agent_monthly_stats (
      id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      agent_user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      month             date NOT NULL,
      sales_count       int NOT NULL DEFAULT 0,
      total_premium     numeric(14,2) NOT NULL DEFAULT 0,
      total_commission  numeric(14,2) NOT NULL DEFAULT 0,
      created_at        timestamptz DEFAULT now(),
      updated_at        timestamptz DEFAULT now(),
      CONSTRAINT agent_monthly_stats_uniq UNIQUE (agent_user_id, month)
    );
    DROP TRIGGER IF EXISTS trg_agent_monthly_stats_updated ON agent_monthly_stats;
    CREATE TRIGGER trg_agent_monthly_stats_updated
    BEFORE UPDATE ON agent_monthly_stats
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  `)
}

/* ──────────────────────────────────────────────────────────────
   Users
────────────────────────────────────────────────────────────── */
async function insertUser({ role, name, email, phone_no, password }) {
  const rows = await q(
    `INSERT INTO users (role, name, email, phone_no, password_hash)
     VALUES ($1,$2,$3,$4, crypt($5, gen_salt('bf', 10)))
     ON CONFLICT (email) DO UPDATE
       SET name=EXCLUDED.name, phone_no=EXCLUDED.phone_no
     RETURNING *`,
    [role, name, email.toLowerCase(), phone_no || null, password]
  )
  return rows[0]
}

/* ──────────────────────────────────────────────────────────────
   Seed everything
────────────────────────────────────────────────────────────── */
async function main() {
  await ensureTables()

  console.log('Seeding users…')
  // 1 admin (role only supports 'admin' in your enum)
  const admin = await insertUser({
    role: 'admin',
    name: 'Super Admin',
    email: 'admin@company.com',
    phone_no: '9990001111',
    password: 'Admin@1234'
  })

  // Employees
  const employees = []
  for (const e of [
    { name: 'Rahul Mehta',   email: 'rahul.mehta@company.com',   phone_no: '9876500011' },
    { name: 'Priya Sharma',  email: 'priya.sharma@company.com',  phone_no: '9876500012' },
    { name: 'Arjun Verma',   email: 'arjun.verma@company.com',   phone_no: '9876500013' },
  ]) {
    employees.push(await insertUser({
      role: 'employee', ...e, password: 'Employee@123'
    }))
  }

  // Agents
  const agents = []
  for (const a of [
    { name: 'Agent A', email: 'agent.a@company.com', phone_no: '9001112222' },
    { name: 'Agent B', email: 'agent.b@company.com', phone_no: '9001113333' },
    { name: 'Agent C', email: 'agent.c@company.com', phone_no: '9001114444' },
    { name: 'Agent D', email: 'agent.d@company.com', phone_no: '9001115555' },
  ]) {
    agents.push(await insertUser({
      role: 'agent', ...a, password: 'Agent@123'
    }))
  }

  /* Initial credentials tables (for your “must change password” banner) */
  for (const ag of agents) {
    await q(
      `INSERT INTO agent_initial_creds (agent_user_id, temp_password)
       VALUES ($1,$2) ON CONFLICT (agent_user_id) DO NOTHING`,
      [ag.id, 'Agent@123']
    )
  }
  for (const em of employees) {
    await q(
      `INSERT INTO employee_initial_creds (employee_user_id, temp_password)
       VALUES ($1,$2) ON CONFLICT (employee_user_id) DO NOTHING`,
      [em.id, 'Employee@123']
    )
  }

  /* Profiles with PAN / Aadhaar + bank + education */
  console.log('Seeding profiles/bank/education…')
  for (const em of employees) {
    await q(
      `INSERT INTO employee_profile (user_id, name, phone_no, email, pan_no, aadhaar_no)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (user_id) DO UPDATE
         SET name=EXCLUDED.name, phone_no=EXCLUDED.phone_no, email=EXCLUDED.email,
             pan_no=EXCLUDED.pan_no, aadhaar_no=EXCLUDED.aadhaar_no, updated_at=now()`,
      [em.id, em.name, em.phone_no, em.email, pan(), aadhaar()]
    )
    await q(
      `INSERT INTO employee_bank_details (user_id, bank_name, bank_ifsc, bank_account_no)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (user_id) DO UPDATE
         SET bank_name=EXCLUDED.bank_name, bank_ifsc=EXCLUDED.bank_ifsc,
             bank_account_no=EXCLUDED.bank_account_no, updated_at=now()`,
      [em.id, pick(['SBI','HDFC','ICICI','Axis']), 'HDFC0001234', '00112233445566']
    )
    await q(
      `INSERT INTO employee_education_details (user_id, edu_10, edu_12, edu_degree)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (user_id) DO UPDATE
         SET edu_10=EXCLUDED.edu_10, edu_12=EXCLUDED.edu_12,
             edu_degree=EXCLUDED.edu_degree, updated_at=now()`,
      [em.id, 'CBSE', 'CBSE', pick(['B.Com','BBA','B.Sc','B.A.'])]
    )
  }

  for (const ag of agents) {
    await q(
      `INSERT INTO agent_profile (user_id, name, phone_no, email, pan_no, aadhaar_no)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (user_id) DO UPDATE
         SET name=EXCLUDED.name, phone_no=EXCLUDED.phone_no, email=EXCLUDED.email,
             pan_no=EXCLUDED.pan_no, aadhaar_no=EXCLUDED.aadhaar_no, updated_at=now()`,
      [ag.id, ag.name, ag.phone_no, ag.email, pan(), aadhaar()]
    )
    await q(
      `INSERT INTO agent_bank_details (user_id, bank_name, bank_ifsc, bank_account_no)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (user_id) DO UPDATE
         SET bank_name=EXCLUDED.bank_name, bank_ifsc=EXCLUDED.bank_ifsc,
             bank_account_no=EXCLUDED.bank_account_no, updated_at=now()`,
      [ag.id, pick(['SBI','HDFC','ICICI','Axis']), 'SBIN0009876', '99887766554433']
    )
    await q(
      `INSERT INTO agent_education_details (user_id, edu_10, edu_12, edu_degree)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (user_id) DO UPDATE
         SET edu_10=EXCLUDED.edu_10, edu_12=EXCLUDED.edu_12,
             edu_degree=EXCLUDED.edu_degree, updated_at=now()`,
      [ag.id, 'State Board', 'State Board', pick(['B.A.','B.Sc','B.Com','Diploma'])]
    )
  }

  /* Employee salary + history */
  console.log('Seeding employee salaries…')
  for (const em of employees) {
    const sal = rnd(35000, 65000)
    await q(
      `INSERT INTO employee_salary (employee_user_id, base_salary)
       VALUES ($1,$2)
       ON CONFLICT (employee_user_id) DO UPDATE
         SET base_salary=EXCLUDED.base_salary, updated_at=now()
       RETURNING *`,
      [em.id, sal]
    )
    await q(
      `INSERT INTO employee_salary_history (employee_user_id, base_salary)
       VALUES ($1,$2)`,
      [em.id, sal]
    )
  }

  /* Agent supervision: map agents under employees */
  console.log('Mapping agents to employees…')
  const em1 = employees[0].id
  const em2 = employees[1].id
  await q(`INSERT INTO agent_supervision (agent_user_id, employee_user_id)
           VALUES ($1,$2)
           ON CONFLICT (agent_user_id) DO UPDATE SET employee_user_id=EXCLUDED.employee_user_id`,
          [agents[0].id, em1])
  await q(`INSERT INTO agent_supervision (agent_user_id, employee_user_id)
           VALUES ($1,$2)
           ON CONFLICT (agent_user_id) DO UPDATE SET employee_user_id=EXCLUDED.employee_user_id`,
          [agents[1].id, em1])
  await q(`INSERT INTO agent_supervision (agent_user_id, employee_user_id)
           VALUES ($1,$2)
           ON CONFLICT (agent_user_id) DO UPDATE SET employee_user_id=EXCLUDED.employee_user_id`,
          [agents[2].id, em2])
  await q(`INSERT INTO agent_supervision (agent_user_id, employee_user_id)
           VALUES ($1,$2)
           ON CONFLICT (agent_user_id) DO UPDATE SET employee_user_id=EXCLUDED.employee_user_id`,
          [agents[3].id, em2])

  /* Agent compensation history */
  console.log('Seeding agent compensation…')
  const compByAgent = new Map()
  for (const ag of agents) {
    const base = rnd(20000, 40000)
    const rate = [0.05, 0.06, 0.07, 0.08][rnd(0, 3)]
    compByAgent.set(ag.id, { base, rate })
    await q(
      `INSERT INTO agent_compensation_history (agent_user_id, base_salary, commission_rate)
       VALUES ($1,$2,$3)`,
      [ag.id, base, rate]
    )
  }

  /* Monthly targets + progress + stats for last 6 months */
  console.log('Seeding monthly targets & stats…')
  for (const ag of agents) {
    for (let i = 5; i >= 0; i--) {
      const month = firstOfMonthOffset(i)
      const target = rnd(150000, 350000)  // target_value
      const achieved = rnd(Math.floor(target * 0.6), Math.floor(target * 1.1))
      await q(
        `INSERT INTO agent_monthly_targets (agent_user_id, month, target_value, achieved_value)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (agent_user_id, month) DO UPDATE
           SET target_value=EXCLUDED.target_value, achieved_value=EXCLUDED.achieved_value, updated_at=now()`,
        [ag.id, month, target, achieved]
      )

      const sales = rnd(2, 12)
      const total_premium = rnd(50000, 250000)
      const comp = compByAgent.get(ag.id) || { rate: 0.07 }
      const total_commission = Math.round(total_premium * comp.rate)

      await q(
        `INSERT INTO agent_monthly_stats (agent_user_id, month, sales_count, total_premium, total_commission)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (agent_user_id, month) DO UPDATE
           SET sales_count=EXCLUDED.sales_count,
               total_premium=EXCLUDED.total_premium,
               total_commission=EXCLUDED.total_commission,
               updated_at=now()`,
        [ag.id, month, sales, total_premium, total_commission]
      )
    }
  }

  /* Customers per agent */
  console.log('Seeding customers…')
  const firstNames = ['Aarav','Vivaan','Aditya','Vihaan','Arjun','Sai','Krishna','Ishaan','Rohit','Kunal','Riya','Aisha','Ananya','Diya','Ira','Mira']
  const lastNames = ['Sharma','Verma','Kapoor','Khanna','Patel','Agarwal','Mehta','Iyer','Ghosh','Nair','Das','Reddy']
  const statuses = ['Pending','Closed','Denied']

  let cCounter = 1
  for (const ag of agents) {
    for (let i = 0; i < 8; i++) {
      const fn = pick(firstNames)
      const ln = pick(lastNames)
      const full = `${fn} ${ln}`
      const email = `${fn}.${ln}.${cCounter}@example.com`.toLowerCase()
      const phone = `9${rnd(100000000, 999999999)}`
      const status = pick(statuses)

      const age = rnd(22, 58)
      const spouseName = rnd(0,1) ? `${pick(firstNames)} ${ln}` : null
      const kids = rnd(0, 3)
      const parents = JSON.stringify([`${pick(firstNames)} ${ln}`, `${pick(firstNames)} ${ln}`])

      // Only some customers get a premium number (as if set by admin later)
      const premium = rnd(0, 1) ? `PRM-${new Date().getFullYear()}-${String(1000 + cCounter).slice(-4)}` : null

      await q(       
        `INSERT INTO customers
          (agent_id, name, email, phone_no, status,
           pan_no, aadhaar_no, age, spouse_name, number_of_children, parents, premium_number)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [
          ag.id, full, email, phone, status,
          pan(), aadhaar(), age, spouseName, kids, parents, premium
        ]
      )
      cCounter++
    }
  }

  console.log('✅ Seed complete!\n')
  console.log('Demo logins:')
  console.log('  Admin:    admin@company.com / Admin@1234')
  console.log('  Employee: rahul.mehta@company.com / Employee@123')
  console.log('  Agent:    agent.a@company.com   / Agent@123')
}

main().then(()=>process.exit(0)).catch(err => {
  console.error('Seed error:', err) 
  process.exit(1)
})
