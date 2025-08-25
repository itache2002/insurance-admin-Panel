// // // // import express from 'express';
// // // // import { requireAuth, requireRole } from '../middleware/auth.js';
// // // // import { Roles } from '../utils/roles.js';
// // // // import { q } from '../db.js';

// // // // const router = express.Router();
// // // // router.use(requireAuth, requireRole(Roles.EMPLOYEE));

// // // // router.get('/me', async (req, res) => {
// // // //   res.json({ id: req.user.sub, role: req.user.role, name: req.user.name, email: req.user.email });
// // // // });

// // // // router.get('/agents', async (req, res) => {
// // // //   const me = req.user.sub;
// // // //   const rows = await q(
// // // //     `SELECT u.id, u.name, u.email, u.phone_no
// // // //      FROM users u
// // // //      JOIN agent_supervision s ON s.agent_user_id = u.id
// // // //      WHERE u.role='agent' AND s.employee_user_id=$1
// // // //      ORDER BY u.created_at DESC`,
// // // //     [me]
// // // //   );
// // // //   res.json(rows);
// // // // });

// // // // router.get('/customers', async (req, res) => {
// // // //   const me = req.user.sub;
// // // //   const rows = await q(
// // // //     `SELECT c.* FROM customers c
// // // //      JOIN agent_supervision s ON s.agent_user_id = c.agent_id
// // // //      WHERE s.employee_user_id=$1
// // // //      ORDER BY c.created_at DESC`,
// // // //     [me]
// // // //   );
// // // //   res.json(rows);
// // // // });

// // // // router.post('/customers/:id/status', async (req, res) => {
// // // //   const me = req.user.sub;
// // // //   const { status } = req.body || {};
// // // //   const id = req.params.id;
// // // //   const owned = await q(
// // // //     `SELECT 1 FROM customers c JOIN agent_supervision s ON s.agent_user_id=c.agent_id
// // // //      WHERE c.id=$1 AND s.employee_user_id=$2`,
// // // //     [id, me]
// // // //   );
// // // //   if (!owned.length) return res.status(403).json({ error: 'Not allowed' });
// // // //   await q('UPDATE customers SET status=$1 WHERE id=$2', [status, id]);
// // // //   res.json({ ok: true });
// // // // });

// // // // export default router;


// // // import express from 'express'
// // // import { requireAuth, requireRole } from '../middleware/auth.js'
// // // import { Roles } from '../utils/roles.js'
// // // import { createCustomer, listCustomers } from '../services/customers.js'
// // // import { q } from '../db.js'

// // // const router = express.Router()
// // // router.use(requireAuth, requireRole(Roles.EMPLOYEE))

// // // router.get('/me', (req, res) => res.json({ id: req.user.sub, role: req.user.role, name: req.user.name, email: req.user.email }))

// // // router.get('/agents', async (req, res) => {
// // //   const rows = await q(
// // //     `SELECT a.id, a.name, a.email
// // //        FROM agent_supervision s
// // //        JOIN users a ON a.id = s.agent_user_id
// // //       WHERE s.employee_user_id = $1
// // //       ORDER BY a.name ASC`,
// // //     [req.user.sub]
// // //   )
// // //   res.json(rows)
// // // })

// // // router.get('/customers', async (req, res) => {
// // //   const rows = await listCustomers({ employeeId: req.user.sub, status: req.query.status })
// // //   res.json(rows)
// // // })

// // // router.post('/customers/:id/status', async (req, res) => {
// // //   await q('UPDATE customers SET status=$1, updated_at=now() WHERE id=$2', [req.body.status, req.params.id])
// // //   res.json({ ok: true })
// // // })

// // // /* --- NEW: Agents overview for this employee (agent + #customers) --- */
// // // router.get('/agents/overview', async (req, res) => {
// // //   const rows = await q(
// // //     `SELECT
// // //         a.id        AS agent_id,
// // //         a.name      AS agent_name,
// // //         a.email     AS agent_email,
// // //         COALESCE(COUNT(c.id),0)::int AS customer_count
// // //      FROM agent_supervision s
// // //        JOIN users a ON a.id = s.agent_user_id
// // //        LEFT JOIN customers c ON c.agent_id = a.id
// // //      WHERE s.employee_user_id = $1
// // //      GROUP BY a.id, a.name, a.email
// // //      ORDER BY a.name ASC`,
// // //     [req.user.sub]
// // //   )
// // //   res.json(rows)
// // // })

// // // export default router


// // import express from 'express'
// // import { requireAuth, requireRole } from '../middleware/auth.js'
// // import { Roles } from '../utils/roles.js'
// // import { listCustomers } from '../services/customers.js'
// // import { q } from '../db.js'

// // const router = express.Router()
// // router.use(requireAuth, requireRole(Roles.EMPLOYEE))

// // router.get('/me', (req, res) =>
// //   res.json({ id: req.user.sub, role: req.user.role, name: req.user.name, email: req.user.email })
// // )

// // /** Agents under me */
// // router.get('/agents', async (req, res) => {
// //   const rows = await q(
// //     `SELECT u.id AS agent_id, u.name AS agent_name, u.email AS agent_email
// //        FROM agent_supervision s
// //        JOIN users u ON u.id = s.agent_user_id
// //       WHERE s.employee_user_id = $1
// //       ORDER BY u.created_at DESC`,
// //     [req.user.sub]
// //   )
// //   res.json(rows)
// // })

// // /** Customers under my agents (optionally filter by status) */
// // router.get('/customers', async (req, res) => {
// //   const rows = await listCustomers({
// //     employeeId: req.user.sub,
// //     status: req.query.status || null,
// //   })
// //   res.json(rows)
// // })

// // /** Update customer status I can manage (only those under my agents) */
// // router.post('/customers/:id/status', async (req, res) => {
// //   const { id } = req.params
// //   const { status } = req.body || {}
// //   await q(
// //     `UPDATE customers c
// //         SET status = $1
// //       WHERE c.id = $2
// //         AND EXISTS (
// //           SELECT 1 FROM agent_supervision s
// //            WHERE s.agent_user_id = c.agent_id
// //              AND s.employee_user_id = $3
// //         )`,
// //     [status, id, req.user.sub]
// //   )
// //   res.json({ ok: true })
// // })

// // /** (Optional) overview counts per agent for dashboards */
// // router.get('/agents/overview', async (req, res) => {
// //   const rows = await q(
// //     `SELECT ua.id AS agent_id,
// //             ua.name AS agent_name,
// //             ua.email AS agent_email,
// //             COUNT(c.id)::int AS customer_count
// //        FROM agent_supervision s
// //        JOIN users ua ON ua.id = s.agent_user_id
// //        LEFT JOIN customers c ON c.agent_id = ua.id
// //       WHERE s.employee_user_id = $1
// //       GROUP BY ua.id, ua.name, ua.email
// //       ORDER BY ua.name ASC`,
// //     [req.user.sub]
// //   )
// //   res.json(rows)
// // })

// // export default router



// import express from 'express'
// import { requireAuth, requireRole } from '../middleware/auth.js'
// import { Roles } from '../utils/roles.js'
// import { listCustomers } from '../services/customers.js'
// import { createUser } from '../services/users.js'
// import { q } from '../db.js'

// const router = express.Router()
// router.use(requireAuth, requireRole(Roles.EMPLOYEE))

// /* ---------- helpers ---------- */
// function randomPassword(len = 12) {
//   const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*'
//   return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
// }
// const normPan = (p) => (p ? String(p).trim().toUpperCase() : null)
// const normAadhaar = (a) => (a ? String(a).replace(/[^0-9]/g, '') : null)

// async function ensureAgentUnderEmployee(agentId, employeeId) {
//   const r = await q(
//     `SELECT 1 FROM agent_supervision WHERE agent_user_id=$1 AND employee_user_id=$2`,
//     [agentId, employeeId]
//   )
//   return r.length > 0
// }

// /* ---------- me ---------- */
// router.get('/me', (req, res) =>
//   res.json({ id: req.user.sub, role: req.user.role, name: req.user.name, email: req.user.email })
// )

// /* ======================================================================
//    CREATE AGENT with FULL DETAILS (profile + bank + education)
//    Body:
//    {
//      name, email, phone_no,
//      pan_no, aadhaar_no,
//      bank_name, bank_ifsc, bank_account_no,
//      edu_10, edu_12, edu_degree
//    }
// ====================================================================== */
// router.post('/agents', async (req, res) => {
//   try {
//     const {
//       name, email, phone_no,
//       pan_no, aadhaar_no,
//       bank_name, bank_ifsc, bank_account_no,
//       edu_10, edu_12, edu_degree,
//     } = req.body || {}

//     if (!name || !email) return res.status(400).json({ error: 'name and email are required' })

//     const pan = normPan(pan_no)
//     const aadhaar = normAadhaar(aadhaar_no)
//     if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) return res.status(400).json({ error: 'Invalid PAN (ABCDE1234F)' })
//     if (aadhaar && !/^[0-9]{12}$/.test(aadhaar)) return res.status(400).json({ error: 'Invalid Aadhaar (12 digits)' })

//     // 1) create user with temp password
//     const temp = randomPassword(12)
//     const user = await createUser({ role: 'agent', name, email, phone_no, password: temp })

//     // 2) store initial creds banner (ignore if exists)
//     await q(
//       `INSERT INTO agent_initial_creds (agent_user_id, temp_password)
//        VALUES ($1,$2) ON CONFLICT (agent_user_id) DO NOTHING`,
//       [user.id, temp]
//     )

//     // 3) attach under this employee
//     await q(
//       `INSERT INTO agent_supervision (agent_user_id, employee_user_id)
//        VALUES ($1,$2)
//        ON CONFLICT (agent_user_id) DO UPDATE SET employee_user_id=EXCLUDED.employee_user_id`,
//       [user.id, req.user.sub]
//     )

//     // 4) upsert profile (PAN/Aadhaar + contact)
//     await q(
//       `INSERT INTO agent_profile (user_id,name,phone_no,email,pan_no,aadhaar_no)
//        VALUES ($1,$2,$3,$4,$5,$6)
//        ON CONFLICT (user_id) DO UPDATE
//          SET name=EXCLUDED.name, phone_no=EXCLUDED.phone_no, email=EXCLUDED.email,
//              pan_no=EXCLUDED.pan_no, aadhaar_no=EXCLUDED.aadhaar_no, updated_at=now()`,
//       [user.id, name || null, phone_no || null, email || null, pan, aadhaar]
//     )

//     // 5) optional bank
//     if (bank_name || bank_ifsc || bank_account_no) {
//       await q(
//         `INSERT INTO agent_bank_details (user_id,bank_name,bank_ifsc,bank_account_no)
//          VALUES ($1,$2,$3,$4)
//          ON CONFLICT (user_id) DO UPDATE
//            SET bank_name=EXCLUDED.bank_name, bank_ifsc=EXCLUDED.bank_ifsc,
//                bank_account_no=EXCLUDED.bank_account_no, updated_at=now()`,
//         [user.id, bank_name || null, bank_ifsc || null, bank_account_no || null]
//       )
//     }

//     // 6) optional education
//     if (edu_10 || edu_12 || edu_degree) {
//       await q(
//         `INSERT INTO agent_education_details (user_id,edu_10,edu_12,edu_degree)
//          VALUES ($1,$2,$3,$4)
//          ON CONFLICT (user_id) DO UPDATE
//            SET edu_10=EXCLUDED.edu_10, edu_12=EXCLUDED.edu_12,
//                edu_degree=EXCLUDED.edu_degree, updated_at=now()`,
//         [user.id, edu_10 || null, edu_12 || null, edu_degree || null]
//       )
//     }

//     res.json({
//       user,
//       temp_password: temp,
//       warning: 'Share ONLY once. Agent must change password on first login.',
//     })
//   } catch (e) {
//     if (e && e.code === '23505') {
//       return res.status(409).json({ error: 'Email already exists' })
//     }
//     console.error('create agent error:', e)
//     res.status(500).json({ error: 'Failed to create agent' })
//   }
// })

// /* ---------- edit PROFILE for an agent under me ---------- */
// router.post('/agents/:id/profile', async (req, res) => {
//   const { id } = req.params
//   if (!(await ensureAgentUnderEmployee(id, req.user.sub))) return res.status(403).json({ error: 'Not your agent' })

//   const { name, phone_no, email, pan_no, aadhaar_no } = req.body || {}
//   const pan = normPan(pan_no)
//   const aadhaar = normAadhaar(aadhaar_no)
//   if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) return res.status(400).json({ error: 'Invalid PAN (ABCDE1234F)' })
//   if (aadhaar && !/^[0-9]{12}$/.test(aadhaar)) return res.status(400).json({ error: 'Invalid Aadhaar (12 digits)' })

//   const rows = await q(
//     `INSERT INTO agent_profile (user_id,name,phone_no,email,pan_no,aadhaar_no)
//      VALUES ($1,$2,$3,$4,$5,$6)
//      ON CONFLICT (user_id) DO UPDATE
//        SET name=EXCLUDED.name, phone_no=EXCLUDED.phone_no, email=EXCLUDED.email,
//            pan_no=EXCLUDED.pan_no, aadhaar_no=EXCLUDED.aadhaar_no, updated_at=now()
//      RETURNING *`,
//     [id, name || null, phone_no || null, email || null, pan, aadhaar]
//   )
//   res.json(rows[0])
// })

// /* ---------- edit BANK for an agent under me ---------- */
// router.post('/agents/:id/bank', async (req, res) => {
//   const { id } = req.params
//   if (!(await ensureAgentUnderEmployee(id, req.user.sub))) return res.status(403).json({ error: 'Not your agent' })

//   const { bank_name, bank_ifsc, bank_account_no } = req.body || {}
//   const rows = await q(
//     `INSERT INTO agent_bank_details (user_id,bank_name,bank_ifsc,bank_account_no)
//      VALUES ($1,$2,$3,$4)
//      ON CONFLICT (user_id) DO UPDATE
//        SET bank_name=EXCLUDED.bank_name, bank_ifsc=EXCLUDED.bank_ifsc,
//            bank_account_no=EXCLUDED.bank_account_no, updated_at=now()
//      RETURNING *`,
//     [id, bank_name || null, bank_ifsc || null, bank_account_no || null]
//   )
//   res.json(rows[0])
// })

// /* ---------- edit EDUCATION for an agent under me ---------- */
// router.post('/agents/:id/education', async (req, res) => {
//   const { id } = req.params
//   if (!(await ensureAgentUnderEmployee(id, req.user.sub))) return res.status(403).json({ error: 'Not your agent' })

//   const { edu_10, edu_12, edu_degree } = req.body || {}
//   const rows = await q(
//     `INSERT INTO agent_education_details (user_id,edu_10,edu_12,edu_degree)
//      VALUES ($1,$2,$3,$4)
//      ON CONFLICT (user_id) DO UPDATE
//        SET edu_10=EXCLUDED.edu_10, edu_12=EXCLUDED.edu_12,
//            edu_degree=EXCLUDED.edu_degree, updated_at=now()
//      RETURNING *`,
//     [id, edu_10 || null, edu_12 || null, edu_degree || null]
//   )
//   res.json(rows[0])
// })

// /* ---------- Agents under me (list) ---------- */
// router.get('/agents', async (req, res) => {
//   const rows = await q(
//     `SELECT u.id AS agent_id, u.name AS agent_name, u.email AS agent_email
//        FROM agent_supervision s
//        JOIN users u ON u.id = s.agent_user_id
//       WHERE s.employee_user_id = $1
//       ORDER BY u.created_at DESC`,
//     [req.user.sub]
//   )
//   res.json(rows)
// })

// /* ---------- Overview (for dashboards) ---------- */
// router.get('/agents/overview', async (req, res) => {
//   const rows = await q(
//     `SELECT ua.id AS agent_id,
//             ua.name AS agent_name,
//             ua.email AS agent_email,
//             COUNT(c.id)::int AS customer_count
//        FROM agent_supervision s
//        JOIN users ua ON ua.id = s.agent_user_id
//        LEFT JOIN customers c ON c.agent_id = ua.id
//       WHERE s.employee_user_id = $1
//       GROUP BY ua.id, ua.name, ua.email
//       ORDER BY ua.name ASC`,
//     [req.user.sub]
//   )
//   res.json(rows)
// })

// /* ---------- Customers under my agents ---------- */
// router.get('/customers', async (req, res) => {
//   const rows = await listCustomers({
//     employeeId: req.user.sub,
//     status: req.query.status || null,
//   })
//   res.json(rows)
// })

// /* ---------- Update customer status (only my agents) ---------- */
// router.post('/customers/:id/status', async (req, res) => {
//   const { id } = req.params
//   const { status } = req.body || {}
//   await q(
//     `UPDATE customers c
//         SET status = $1
//       WHERE c.id = $2
//         AND EXISTS (
//           SELECT 1 FROM agent_supervision s
//            WHERE s.agent_user_id = c.agent_id
//              AND s.employee_user_id = $3
//         )`,
//     [status, id, req.user.sub]
//   )
//   res.json({ ok: true })
// })

// export default router


import express from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { Roles } from '../utils/roles.js'
import { listCustomers } from '../services/customers.js'
import { createUser } from '../services/users.js'
import { q } from '../db.js'

const router = express.Router()
router.use(requireAuth, requireRole(Roles.EMPLOYEE))

function randomPassword(len = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*'
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
const normPan = (p) => (p ? String(p).trim().toUpperCase() : null)
const normAadhaar = (a) => (a ? String(a).replace(/[^0-9]/g, '') : null)

async function ensureAgentUnderEmployee(agentId, employeeId) {
  const r = await q(
    `SELECT 1 FROM agent_supervision WHERE agent_user_id=$1 AND employee_user_id=$2`,
    [agentId, employeeId]
  )
  return r.length > 0
}

router.get('/me', (req, res) =>
  res.json({ id: req.user.sub, role: req.user.role, name: req.user.name, email: req.user.email })
)

/* ---------- Dashboard summary: agents, customers, salary ---------- */
router.get('/summary', async (req, res) => {
  const employeeId = req.user.sub

  const [{ count: agents_raw } = {}] = await q(
    `SELECT COUNT(*)::int AS count
       FROM agent_supervision
      WHERE employee_user_id = $1`,
    [employeeId]
  )

  const [{ count: customers_raw } = {}] = await q(
    `SELECT COUNT(*)::int AS count
       FROM customers c
       JOIN agent_supervision s ON s.agent_user_id = c.agent_id
      WHERE s.employee_user_id = $1`,
    [employeeId]
  )

  const sal = await q(
    `SELECT base_salary
       FROM employee_salary
      WHERE employee_user_id = $1`,
    [employeeId]
  )

  res.json({
    agent_count: agents_raw ?? 0,
    customer_count: customers_raw ?? 0,
    base_salary: sal[0]?.base_salary ?? 0
  })
})

/* -------------------- CREATE AGENT (full details) -------------------- */
router.post('/agents', async (req, res) => {
  try {
    const {
      name, email, phone_no,
      pan_no, aadhaar_no,
      bank_name, bank_ifsc, bank_account_no,
      edu_10, edu_12, edu_degree,
    } = req.body || {}

    if (!name || !email) return res.status(400).json({ error: 'name and email are required' })

    const pan = normPan(pan_no)
    const aadhaar = normAadhaar(aadhaar_no)
    if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) return res.status(400).json({ error: 'Invalid PAN (ABCDE1234F)' })
    if (aadhaar && !/^[0-9]{12}$/.test(aadhaar)) return res.status(400).json({ error: 'Invalid Aadhaar (12 digits)' })

    const temp = randomPassword(12)
    const user = await createUser({ role: 'agent', name, email, phone_no, password: temp })

    await q(
      `INSERT INTO agent_initial_creds (agent_user_id, temp_password)
       VALUES ($1,$2) ON CONFLICT (agent_user_id) DO NOTHING`,
      [user.id, temp]
    )

    await q(
      `INSERT INTO agent_supervision (agent_user_id, employee_user_id)
       VALUES ($1,$2)
       ON CONFLICT (agent_user_id) DO UPDATE SET employee_user_id=EXCLUDED.employee_user_id`,
      [user.id, req.user.sub]
    )

    await q(
      `INSERT INTO agent_profile (user_id,name,phone_no,email,pan_no,aadhaar_no)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (user_id) DO UPDATE
         SET name=EXCLUDED.name, phone_no=EXCLUDED.phone_no, email=EXCLUDED.email,
             pan_no=EXCLUDED.pan_no, aadhaar_no=EXCLUDED.aadhaar_no, updated_at=now()`,
      [user.id, name || null, phone_no || null, email || null, pan, aadhaar]
    )

    if (bank_name || bank_ifsc || bank_account_no) {
      await q(
        `INSERT INTO agent_bank_details (user_id,bank_name,bank_ifsc,bank_account_no)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (user_id) DO UPDATE
           SET bank_name=EXCLUDED.bank_name, bank_ifsc=EXCLUDED.bank_ifsc,
               bank_account_no=EXCLUDED.bank_account_no, updated_at=now()`,
        [user.id, bank_name || null, bank_ifsc || null, bank_account_no || null]
      )
    }

    if (edu_10 || edu_12 || edu_degree) {
      await q(
        `INSERT INTO agent_education_details (user_id,edu_10,edu_12,edu_degree)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (user_id) DO UPDATE
           SET edu_10=EXCLUDED.edu_10, edu_12=EXCLUDED.edu_12,
               edu_degree=EXCLUDED.edu_degree, updated_at=now()`,
        [user.id, edu_10 || null, edu_12 || null, edu_degree || null]
      )
    }

    res.json({
      user,
      temp_password: temp,
      warning: 'Share ONLY once. Agent must change password on first login.'
    })
  } catch (e) {
    if (e && e.code === '23505') return res.status(409).json({ error: 'Email already exists' })
    console.error('create agent error:', e)
    res.status(500).json({ error: 'Failed to create agent' })
  }
})

/* -------------------- edit details for my agents -------------------- */
router.post('/agents/:id/profile', async (req, res) => {
  const { id } = req.params
  if (!(await ensureAgentUnderEmployee(id, req.user.sub))) return res.status(403).json({ error: 'Not your agent' })
  const { name, phone_no, email, pan_no, aadhaar_no } = req.body || {}
  const pan = normPan(pan_no)
  const aadhaar = normAadhaar(aadhaar_no)
  if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) return res.status(400).json({ error: 'Invalid PAN (ABCDE1234F)' })
  if (aadhaar && !/^[0-9]{12}$/.test(aadhaar)) return res.status(400).json({ error: 'Invalid Aadhaar (12 digits)' })

  const rows = await q(
    `INSERT INTO agent_profile (user_id,name,phone_no,email,pan_no,aadhaar_no)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (user_id) DO UPDATE
       SET name=EXCLUDED.name, phone_no=EXCLUDED.phone_no, email=EXCLUDED.email,
           pan_no=EXCLUDED.pan_no, aadhaar_no=EXCLUDED.aadhaar_no, updated_at=now()
     RETURNING *`,
    [id, name || null, phone_no || null, email || null, pan, aadhaar]
  )
  res.json(rows[0])
})

router.post('/agents/:id/bank', async (req, res) => {
  const { id } = req.params
  if (!(await ensureAgentUnderEmployee(id, req.user.sub))) return res.status(403).json({ error: 'Not your agent' })
  const { bank_name, bank_ifsc, bank_account_no } = req.body || {}
  const rows = await q(
    `INSERT INTO agent_bank_details (user_id,bank_name,bank_ifsc,bank_account_no)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (user_id) DO UPDATE
       SET bank_name=EXCLUDED.bank_name, bank_ifsc=EXCLUDED.bank_ifsc,
           bank_account_no=EXCLUDED.bank_account_no, updated_at=now()
     RETURNING *`,
    [id, bank_name || null, bank_ifsc || null, bank_account_no || null]
  )
  res.json(rows[0])
})

router.post('/agents/:id/education', async (req, res) => {
  const { id } = req.params
  if (!(await ensureAgentUnderEmployee(id, req.user.sub))) return res.status(403).json({ error: 'Not your agent' })
  const { edu_10, edu_12, edu_degree } = req.body || {}
  const rows = await q(
    `INSERT INTO agent_education_details (user_id,edu_10,edu_12,edu_degree)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (user_id) DO UPDATE
       SET edu_10=EXCLUDED.edu_10, edu_12=EXCLUDED.edu_12,
           edu_degree=EXCLUDED.edu_degree, updated_at=now()
     RETURNING *`,
    [id, edu_10 || null, edu_12 || null, edu_degree || null]
  )
  res.json(rows[0])
})

/* -------------------- lists / overview / customers -------------------- */
router.get('/agents', async (req, res) => {
  const rows = await q(
    `SELECT u.id AS agent_id, u.name AS agent_name, u.email AS agent_email
       FROM agent_supervision s
       JOIN users u ON u.id = s.agent_user_id
      WHERE s.employee_user_id = $1
      ORDER BY u.created_at DESC`,
    [req.user.sub]
  )
  res.json(rows)
})

router.get('/agents/overview', async (req, res) => {
  const rows = await q(
    `SELECT ua.id AS agent_id,
            ua.name AS agent_name,
            ua.email AS agent_email,
            COUNT(c.id)::int AS customer_count
       FROM agent_supervision s
       JOIN users ua ON ua.id = s.agent_user_id
       LEFT JOIN customers c ON c.agent_id = ua.id
      WHERE s.employee_user_id = $1
      GROUP BY ua.id, ua.name, ua.email
      ORDER BY ua.name ASC`,
    [req.user.sub]
  )
  res.json(rows)
})

router.get('/customers', async (req, res) => {
  const rows = await listCustomers({
    employeeId: req.user.sub,
    status: req.query.status || null,
  })
  res.json(rows)
})

router.post('/customers/:id/status', async (req, res) => {
  const { id } = req.params
  const { status } = req.body || {}
  await q(
    `UPDATE customers c
        SET status = $1
      WHERE c.id = $2
        AND EXISTS (
          SELECT 1 FROM agent_supervision s
           WHERE s.agent_user_id = c.agent_id
             AND s.employee_user_id = $3
        )`,
    [status, id, req.user.sub]
  )
  res.json({ ok: true })
})


/* ========= NEW: view initial credentials of my agent ========= */
router.get('/agents/:id/initial-creds', async (req, res) => {
  try {
    const agentId = req.params.id

    // 1) Ensure this agent is supervised by me
    const link = await q(
      `SELECT 1 FROM agent_supervision 
        WHERE employee_user_id=$1 AND agent_user_id=$2`,
      [req.user.sub, agentId]
    )
    if (!link.length) return res.status(403).json({ error: 'Not your agent' })

    // 2) Ensure the target user is actually an agent
    const roleRow = await q('SELECT role FROM users WHERE id=$1', [agentId])
    if (!roleRow.length || roleRow[0].role !== 'agent') {
      return res.status(404).json({ error: 'Agent not found' })
    }

    // 3) Read initial creds (may not exist yet)
    const r = await q(
      'SELECT temp_password, is_changed FROM agent_initial_creds WHERE agent_user_id=$1',
      [agentId]
    )
    const row = r[0] || null

    res.json({
      temp_password: row?.temp_password ?? null,
      is_changed: row?.is_changed ?? null
    })
  } catch (e) {
    console.error('emp initial-creds error:', e)
    res.status(500).json({ error: 'Failed to load initial credentials' })
  }
})


// GET /api/employee/customers/:id -> full details for customers under my agents

router.get('/customers/:id', async (req, res) => {
  const rows = await q(
    `SELECT c.*, ua.name AS agent_name, ua.email AS agent_email
       FROM customers c
       JOIN agent_supervision s ON s.agent_user_id = c.agent_id
       LEFT JOIN users ua ON ua.id = c.agent_id
      WHERE c.id = $1
        AND s.employee_user_id = $2`,
    [req.params.id, req.user.sub]
  )
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
})


// GET /api/employee/agents/:id/summary  -> agent profile + comp + totals
router.get('/agents/:id/summary', async (req, res) => {
  const employeeId = req.user.sub;
  const { id } = req.params; // UUID of the agent

  // ensure this agent is under the logged-in employee
  const ok = await q(
    `SELECT 1 FROM agent_supervision
      WHERE agent_user_id = $1 AND employee_user_id = $2`,
    [id, employeeId]
  );
  if (!ok.length) return res.status(403).json({ error: 'Forbidden' });

  // agent basics
  const [agent] = await q(
    `SELECT u.id, u.name, u.email, u.phone_no,
            ap.pan_no, ap.aadhaar_no
       FROM users u
       LEFT JOIN agent_profile ap ON ap.user_id = u.id
      WHERE u.id = $1 AND u.role = 'agent'`,
    [id]
  );
  if (!agent) return res.status(404).json({ error: 'Agent not found' });

  // compensation (support either table name)
  let comp = [];
  try {
    comp = await q(
      `SELECT base_salary, commission_rate
         FROM agent_compensation
        WHERE agent_user_id = $1
        LIMIT 1`,
      [id]
    );
  } catch {}
  if (!comp.length) {
    try {
      comp = await q(
        `SELECT base_salary, commission_rate
           FROM agent_comp
          WHERE agent_user_id = $1
          LIMIT 1`,
        [id]
      );
    } catch {}
  }
  const compRow = comp[0] || { base_salary: 0, commission_rate: 0 };

  // totals + monthly stats
  const [totals] = await q(
    `SELECT
       COALESCE(SUM(sales_count),0)::int          AS sales_count,
       COALESCE(SUM(total_premium),0)::numeric    AS total_premium,
       COALESCE(SUM(total_commission),0)::numeric AS total_commission
     FROM agent_monthly_stats
     WHERE agent_user_id = $1`,
    [id]
  );

  const monthly = await q(
    `SELECT month, sales_count, total_premium, total_commission
       FROM agent_monthly_stats
      WHERE agent_user_id = $1
      ORDER BY month DESC
      LIMIT 12`,
    [id]
  );

  const [{ customer_count }] = await q(
    `SELECT COUNT(*)::int AS customer_count
       FROM customers
      WHERE agent_id = $1`,
    [id]
  );

  res.json({
    agent,
    comp: compRow,
    totals,
    monthly: monthly.reverse(),
    customer_count,
  });
});

// GET /api/employee/targets/summary?month=YYYY-MM or YYYY-MM-01
router.get('/targets/summary', async (req, res) => {
  try {
    const employeeId = req.user.sub
    const m = (req.query.month || new Date().toISOString().slice(0, 7))
    const monthParam = `${m.length === 7 ? m : m.slice(0,7)}-01` // normalize

    // 1) aggregate actuals from all supervised agents
    const [agg = {}] = await q(
      `SELECT
         COALESCE(SUM(sales_count),0)::int       AS agg_sales,
         COALESCE(SUM(total_premium),0)::numeric AS agg_premium
       FROM agent_monthly_stats s
       WHERE s.month = first_day_of_month($2::date)
         AND EXISTS (
           SELECT 1
             FROM agent_supervision a
            WHERE a.agent_user_id = s.agent_user_id
              AND a.employee_user_id = $1
         )`,
      [employeeId, monthParam]
    )

    // 2) admin-set targets + manual progress
    const [t = {}] = await q(
      `SELECT
         target_sales, target_premium,
         achieved_sales, achieved_premium
       FROM employee_monthly_targets
       WHERE employee_user_id = $1
         AND month = first_day_of_month($2::date)
       LIMIT 1`,
      [employeeId, monthParam]
    )

    // 3) combine (aggregate + manual)
    const combinedSales    = Number(agg.agg_sales || 0)    + Number(t.achieved_sales || 0)
    const combinedPremium  = Number(agg.agg_premium || 0)  + Number(t.achieved_premium || 0)

    res.json({
      month: monthParam,
      target_sales:    Number(t.target_sales || 0),
      target_premium:  Number(t.target_premium || 0),
      achieved_sales:  combinedSales,
      achieved_premium: combinedPremium,

      // optional: include parts for debugging/UX
      parts: {
        aggregate_sales:   Number(agg.agg_sales || 0),
        aggregate_premium: Number(agg.agg_premium || 0),
        manual_sales:      Number(t.achieved_sales || 0),
        manual_premium:    Number(t.achieved_premium || 0),
      }
    })
  } catch (e) {
    console.error('employee targets summary error:', e)
    res.status(500).json({ error: 'Failed to load target summary' })
  }
})



export default router
