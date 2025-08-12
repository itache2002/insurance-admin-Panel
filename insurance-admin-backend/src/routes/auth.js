import { Router } from 'express';
import { login, logout, createInitialAdmin } from '../controllers/auth.js';

const r = Router();
r.post('/login', login);
r.post('/logout', logout);
r.post('/init-admin', createInitialAdmin); // remove after first use
r.get('/csrf', (req, res) => {
  res.json({ csrfToken: 'ok' });
});

export default r;
