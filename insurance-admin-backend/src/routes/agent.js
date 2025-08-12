import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import * as agents from '../controllers/agents.js';
import * as customers from '../controllers/customers.js';
import * as targets from '../controllers/targets.js';

const r = Router();

r.get('/me', requireAuth, requireRole('agent'), agents.agentMe);
r.put('/me', requireAuth, requireRole('agent'), agents.updateAgentSelf);
r.post('/customers', requireAuth, requireRole('agent'), customers.createCustomer);
// r.get('/targets/summary', (req, res) => {
//   req.params.agentId = req.session.user.id; // inject agentId param
//   return targets.agentTargetSummary(req, res); // pass the real req (keeps req.query intact)
// });

r.get('/targets/summary', (req, res) => {
  req.params.agentId = req.session.user.id;
  return targets.agentTargetSummary(req, res);
});
r.post('/change-password', agents.changeOwnPassword);

r.get('/customers', customers.listOwnCustomers);

export default r;
