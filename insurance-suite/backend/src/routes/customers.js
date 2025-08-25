import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { Roles } from '../utils/roles.js';
import { listCustomers } from '../services/customers.js';

const router = express.Router();
router.use(requireAuth);

router.get('/', requireRole(Roles.SUPER_ADMIN, Roles.ADMIN, Roles.EMPLOYEE), async (req, res) => {
  const u = req.user;
  let rows = [];
  if (u.role === Roles.EMPLOYEE) {
    rows = await listCustomers({ employeeId: u.sub, status: req.query.status, limit: +req.query.limit || 50, offset: +req.query.offset || 0 });
  } else {
    rows = await listCustomers({ status: req.query.status, limit: +req.query.limit || 50, offset: +req.query.offset || 0 });
  }
  res.json(rows);
});

export default router;
