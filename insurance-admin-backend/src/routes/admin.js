import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { logAction } from '../middleware/activity.js';
import * as admins from '../controllers/admins.js';
import * as agents from '../controllers/agents.js';
import * as customers from '../controllers/customers.js';
import * as targets from '../controllers/targets.js';
import * as activity from '../controllers/activity.js';
import * as creds from '../controllers/initialCreds.js';
import * as customersCtrl from '../controllers/customers.js';
const r = Router();

// Admin management
r.post('/admins', requireAuth, requireRole('admin'), logAction('CREATE_ADMIN','user',{}), admins.createAdmin);
r.get('/admins', requireAuth, requireRole('admin'), admins.listAdmins);
r.delete('/users/:userId', requireAuth, requireRole('admin'), logAction('DELETE_USER','user',{}), admins.deleteUser);
// NEW: admin can view the temp password until agent changes it (audited by logs if you want)
r.get('/agents/:agentId/initial-password', creds.getInitialPassword);

// Agent management
r.post('/agents', requireAuth, requireRole('admin'), logAction('CREATE_AGENT','user',{}), agents.createAgent);
r.get('/agents', requireAuth, requireRole('admin'), agents.listAgents);
r.put('/agents/:agentId/compensation', requireAuth, requireRole('admin'), logAction('SET_COMP','agent',{}), agents.setCompensation);

// Targets
r.post('/agents/:agentId/targets', requireAuth, requireRole('admin'), targets.setMonthlyTarget);
r.put('/targets/:targetId', requireAuth, requireRole('admin'), targets.updateMonthlyTarget);
r.get('/agents/:agentId/targets/summary', requireAuth, requireRole('admin'), targets.agentTargetSummary);

// Customers overview
r.get('/agents/:agentId/customers', requireAuth, requireRole('admin'), customers.listCustomersByAgent);
r.get('/agents-with-customer-counts', requireAuth, requireRole('admin'), customers.listAgentsWithCustomerCounts);

// Activity logs
r.get('/activity', requireAuth, requireRole('admin'), activity.listActivity);

// Admin: all customers (with agent info)
r.get('/customers', customers.listAllCustomersForAdmin);

// Admin: set or increment sales (achieved value) for an agent/month
r.post('/agents/:agentId/sales', targets.setAgentMonthlySales);      // body: { month, achieved_value }
r.patch('/agents/:agentId/sales', targets.incrementAgentMonthlySales); // body: { month, delta }


r.get('/customers/:id', customersCtrl.getCustomerDetailAdmin);
r.patch('/customers/:id/status', customersCtrl.updateCustomerStatusAdmin);

export default r;
