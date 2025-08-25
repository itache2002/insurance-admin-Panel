import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import employeeRoutes from './routes/employee.js';
import agentRoutes from './routes/agent.js';
import customersRoutes from './routes/customers.js';

const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean) || true, credentials: true }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));


app.use('/api/auth', authRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/customers', customersRoutes);

app.use((err, req, res, _next) => {
  // log full error on server
  console.error('Error handler:', err)
  const status = err.status || 500
  const message = err.message || 'Server error'
  res.status(status).json({ error: message })
})
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  const message = err.message || 'Server error';
  res.status(status).json({ error: message });
});


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API listening on :${port}`));
