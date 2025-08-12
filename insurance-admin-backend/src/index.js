import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { pool } from './db.js';
import { attachUser } from './middleware/auth.js';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import agentRoutes from './routes/agent.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('tiny'));

const PgStore = pgSession(session);
app.use(session({
  store: new PgStore({ pool, tableName: 'session' }),
  name: 'sid',
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

app.use(attachUser);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/agent', agentRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API on :${port}`));
