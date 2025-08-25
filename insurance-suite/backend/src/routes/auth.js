// import express from 'express';
// import cookieParser from 'cookie-parser';
// import { getUserByEmail, getUserById } from '../services/users.js';
// import {
//   verifyPassword, signAccessToken, signRefreshToken, storeRefreshToken,
//   readRefreshCookie, setRefreshCookie, clearRefreshCookie, isRefreshValid,
//   revokeRefreshToken, needsPasswordChange, markInitialChanged
// } from '../utils/auth.js';
// import { loginLimiter, refreshLimiter } from '../middleware/rateLimit.js';

// const router = express.Router();
// router.use(cookieParser());

// router.post('/login', loginLimiter, async (req, res) => {
//   const { email, password } = req.body || {};
//   const user = await getUserByEmail(email);
//   if (!user) return res.status(401).json({ error: 'Invalid credentials' });
//   const ok = await verifyPassword(password, user.password_hash);
//   if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

//   const access_token = signAccessToken(user);
//   const refresh_token = signRefreshToken(user);

//   await storeRefreshToken(user.id, refresh_token, req.headers['user-agent'], req.ip);
//   setRefreshCookie(res, refresh_token);

//   const mustChange = await needsPasswordChange(user.id, user.role);
//   res.json({ user: { id: user.id, role: user.role, name: user.name, email: user.email }, access_token, must_change_password: mustChange });
// });

// router.post('/refresh', refreshLimiter, async (req, res) => {
//   const rt = readRefreshCookie(req);
//   if (!rt) return res.status(401).json({ error: 'No refresh token' });
//   const valid = await isRefreshValid(rt);
//   if (!valid) return res.status(401).json({ error: 'Invalid refresh token' });

//   // rotate: revoke old, issue new
//   await revokeRefreshToken(rt);
//   const userId = (await import('jsonwebtoken')).then(m => m.default.decode(rt).sub);
//   const user = await getUserById(await userId);
//   const newRt = signRefreshToken(user);
//   await storeRefreshToken(user.id, newRt, req.headers['user-agent'], req.ip);
//   setRefreshCookie(res, newRt);

//   const access_token = signAccessToken(user);
//   res.json({ access_token });
// });

// router.post('/logout', async (req, res) => {
//   const rt = readRefreshCookie(req);
//   if (rt) await revokeRefreshToken(rt);
//   clearRefreshCookie(res);
//   res.json({ ok: true });
// });

// router.post('/change-password', async (req, res) => {
//   const auth = req.headers.authorization || '';
//   if (!auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
//   const token = auth.slice(7);
//   const { verifyAccess } = await import('../utils/auth.js');
//   let payload; try { payload = verifyAccess(token); } catch { return res.status(401).json({ error: 'Invalid token' }); }
//   const { q } = await import('../db.js');
//   const { hashPassword } = await import('../utils/auth.js');
//   const { new_password } = req.body || {};
//   if (!new_password || new_password.length < 8) return res.status(400).json({ error: 'Password too short' });

//   await q('UPDATE users SET password_hash=$1 WHERE id=$2', [await hashPassword(new_password), payload.sub]);
//   await markInitialChanged(payload.sub, payload.role);
//   res.json({ ok: true });
// });

// export default router;

import express from 'express'
import jwt from 'jsonwebtoken'
import { getUserByEmail, getUserById, checkPassword, setPassword } from '../services/users.js'
import { requireAuth } from '../middleware/auth.js'
import { q } from '../db.js'

const router = express.Router()
const REFRESH_COOKIE = process.env.REFRESH_COOKIE_NAME || 'rt'

function signAccess(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_TTL || '15m' }
  )
}
function signRefresh(user) {
  return jwt.sign(
    { sub: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_TTL || '7d' }
  )
}

// read cookies without cookie-parser
function readCookies(req) {
  const raw = req.headers.cookie || ''
  if (!raw) return {}
  return Object.fromEntries(
    raw.split(';').filter(Boolean).map(p => {
      const i = p.indexOf('=')
      const k = decodeURIComponent(p.slice(0, i).trim())
      const v = decodeURIComponent(p.slice(i + 1).trim())
      return [k, v]
    })
  )
}

// --- LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    const user = await getUserByEmail(email)
    if (!user || !(await checkPassword(user, password))) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const access_token = signAccess(user)
    const refresh_token = signRefresh(user)

    res.cookie(REFRESH_COOKIE, refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.COOKIE_SECURE === 'true',
      domain: process.env.COOKIE_DOMAIN || undefined,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    const { password_hash, ...safeUser } = user
    res.json({ access_token, user: safeUser })
  } catch (err) {
    console.error('login error:', err)
    res.status(500).json({ error: 'Login failed' })
  }
})

// --- REFRESH ---
router.post('/refresh', async (req, res) => {
  try {
    const cookies = readCookies(req)
    const rt = cookies[REFRESH_COOKIE] || req.body?.refresh_token
    if (!rt) return res.status(401).json({ error: 'No refresh token' })

    const { sub } = jwt.verify(rt, process.env.JWT_REFRESH_SECRET)
    const user = await getUserById(sub)
    if (!user) return res.status(401).json({ error: 'User not found' })

    const access_token = signAccess(user)
    const { password_hash, ...safeUser } = user
    res.json({ access_token, user: safeUser })
  } catch (err) {
    console.error('refresh error:', err)
    res.status(401).json({ error: 'Invalid refresh token' })
  }
})

// --- LOGOUT ---
router.post('/logout', (_req, res) => {
  res.clearCookie(REFRESH_COOKIE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/',
  })
  res.json({ ok: true })
})

// --- CHANGE PASSWORD (NEW) ---

router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub || req.user.id

    // Accept multiple common field names
    const current_password =
      req.body?.current_password ??
      req.body?.currentPassword ??
      req.body?.current ??
      null

    const new_password =
      req.body?.new_password ??
      req.body?.newPassword ??
      req.body?.next ??
      null

    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'current_password and new_password are required' })
    }
    if (String(new_password).length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' })
    }

    const user = await getUserById(userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    const ok = await checkPassword(user, current_password)
    if (!ok) return res.status(401).json({ error: 'Current password is incorrect' })

    await setPassword(userId, new_password)

    // mark initial creds changed (ignore if row doesn't exist)
    await q('UPDATE agent_initial_creds SET is_changed=true WHERE agent_user_id=$1', [userId]).catch(()=>{})
    await q('UPDATE employee_initial_creds SET is_changed=true WHERE employee_user_id=$1', [userId]).catch(()=>{})

    // rotate tokens after password change
    const freshUser = await getUserById(userId)
    const access_token = signAccess(freshUser)
    const refresh_token = signRefresh(freshUser)
    res.cookie(REFRESH_COOKIE, refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.COOKIE_SECURE === 'true',
      domain: process.env.COOKIE_DOMAIN || undefined,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    const { password_hash, ...safe } = freshUser
    res.json({ ok: true, access_token, user: safe })
  } catch (err) {
    console.error('change-password error:', err)
    res.status(500).json({ error: 'Failed to change password' })
  }
})


export default router
