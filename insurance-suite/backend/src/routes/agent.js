// // import express from 'express';
// // import { requireAuth, requireRole } from '../middleware/auth.js';
// // import { Roles } from '../utils/roles.js';
// // import { createCustomer, listCustomers } from '../services/customers.js';
// // import { q } from '../db.js';

// // const router = express.Router();
// // router.use(requireAuth, requireRole(Roles.AGENT));

// // router.get('/me', (req, res) => res.json({ id: req.user.sub, role: req.user.role, name: req.user.name, email: req.user.email }));

// // router.post('/customers', async (req, res) => {
// //   const created = await createCustomer(req.user.sub, req.body);
// //   res.json(created);
// // });

// // router.get('/customers', async (req, res) => {
// //   const rows = await listCustomers({ agentId: req.user.sub, status: req.query.status });
// //   res.json(rows);
// // });

// // router.get('/targets', async (req, res) => {
// //   const rows = await q(
// //     `SELECT month, target_value, achieved_value FROM agent_monthly_targets
// //      WHERE agent_user_id=$1 ORDER BY month DESC LIMIT 24`,
// //     [req.user.sub]
// //   );
// //   res.json(rows);
// // });

// // router.get('/stats', async (req, res) => {
// //   const rows = await q(
// //     `SELECT month, sales_count, total_premium, total_commission
// //      FROM agent_monthly_stats WHERE agent_user_id=$1 ORDER BY month DESC LIMIT 24`,
// //     [req.user.sub]
// //   );
// //   res.json(rows);
// // });

// // export default router;


// import express from 'express'
// import { requireAuth, requireRole } from '../middleware/auth.js'
// import { Roles } from '../utils/roles.js'
// import { createCustomer, listCustomers } from '../services/customers.js'
// import { q } from '../db.js'

// const router = express.Router()
// router.use(requireAuth, requireRole(Roles.AGENT))

// router.get('/me', (req, res) =>
//   res.json({ id: req.user.sub, role: req.user.role, name: req.user.name, email: req.user.email })
// )

// router.post('/customers', async (req, res) => {
//   const created = await createCustomer(req.user.sub, req.body)
//   res.json(created)
// })

// router.get('/customers', async (req, res) => {
//   const rows = await listCustomers({ agentId: req.user.sub, status: req.query.status })
//   res.json(rows)
// })

// router.get('/targets', async (req, res) => {
//   const rows = await q(
//     `SELECT month, target_value, achieved_value
//        FROM agent_monthly_targets
//       WHERE agent_user_id=$1
//       ORDER BY month DESC
//       LIMIT 24`,
//     [req.user.sub]
//   )
//   res.json(rows)
// })

// router.get('/stats', async (req, res) => {
//   const rows = await q(
//     `SELECT month, sales_count, total_premium, total_commission
//        FROM agent_monthly_stats
//       WHERE agent_user_id=$1
//       ORDER BY month DESC
//       LIMIT 24`,
//     [req.user.sub]
//   )
//   res.json(rows)
// })

// /* NEW: latest compensation for this agent */
// router.get('/compensation', async (req, res) => {
//   const rows = await q(
//     `SELECT base_salary, commission_rate, effective_from
//        FROM agent_compensation_history
//       WHERE agent_user_id=$1
//       ORDER BY effective_from DESC
//       LIMIT 1`,
//     [req.user.sub]
//   )
//   res.json(rows[0] || { base_salary: 0, commission_rate: 0, effective_from: null })
// })


// router.post('/customers', async (req, res) => {
//   try {
//     const created = await createCustomer(req.user.sub, req.body)
//     res.json(created)
//   } catch (e) {
//     console.error('createCustomer error:', e)
//     res.status(e.status || 500).json({ error: e.message || 'Failed to create customer' })
//   }
// })
// export default router


import express from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { Roles } from '../utils/roles.js'
import { createCustomer, listCustomers } from '../services/customers.js'
import { q } from '../db.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = express.Router()
router.use(requireAuth, requireRole(Roles.AGENT))

router.get('/me', (req, res) =>
  res.json({ id: req.user.sub, role: req.user.role, name: req.user.name, email: req.user.email })
)

// Create customer (catch 409 like “PAN/Aadhaar already exists” without crashing)
router.post('/customers', asyncHandler(async (req, res) => {
  const created = await createCustomer(req.user.sub, req.body)
  res.json(created)
}))

router.get('/customers', asyncHandler(async (req, res) => {
  const rows = await listCustomers({ agentId: req.user.sub, status: req.query.status })
  res.json(rows)
}))

router.get('/targets', asyncHandler(async (req, res) => {
  const rows = await q(
    `SELECT month, target_value, achieved_value
       FROM agent_monthly_targets
      WHERE agent_user_id=$1
      ORDER BY month DESC
      LIMIT 24`,
    [req.user.sub]
  )
  res.json(rows)
}))

router.get('/stats', asyncHandler(async (req, res) => {
  const rows = await q(
    `SELECT month, sales_count, total_premium, total_commission
       FROM agent_monthly_stats
      WHERE agent_user_id=$1
      ORDER BY month DESC
      LIMIT 24`,
    [req.user.sub]
  )
  res.json(rows)
}))

// (optional) expose current compensation to show on agent dashboard
router.get('/compensation', asyncHandler(async (req, res) => {
  const rows = await q(
    `SELECT base_salary, commission_rate, effective_from
       FROM agent_compensation_history
      WHERE agent_user_id=$1
      ORDER BY effective_from DESC
      LIMIT 1`,
    [req.user.sub]
  )
  res.json(rows[0] || { base_salary: 0, commission_rate: 0 })
}))

export default router
