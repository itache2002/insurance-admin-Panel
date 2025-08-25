import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { q } from '../db.js';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TTL = process.env.ACCESS_TOKEN_TTL || '15m';
const REFRESH_TTL = process.env.REFRESH_TOKEN_TTL || '7d';
const REFRESH_COOKIE = process.env.REFRESH_COOKIE_NAME || 'rt';

export async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}
export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export function signAccessToken(user) {
  const payload = { sub: user.id, role: user.role, name: user.name, email: user.email };
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TTL });
}
export function verifyAccess(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function signRefreshToken(user) {
  const payload = { sub: user.id, role: user.role };
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TTL });
}
export function verifyRefresh(token) {
  return jwt.verify(token, REFRESH_SECRET);
}
export function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

export async function storeRefreshToken(userId, token, userAgent, ip) {
  const token_hash = sha256(token);
  const { exp } = verifyRefresh(token);
  const expires_at = new Date(exp * 1000);
  await q(
    `INSERT INTO refresh_tokens (user_id, token_hash, user_agent, created_ip, expires_at)
     VALUES ($1,$2,$3,$4,$5)`,
    [userId, token_hash, userAgent || null, ip || null, expires_at]
  );
}

export async function revokeRefreshToken(token) {
  const token_hash = sha256(token);
  await q('UPDATE refresh_tokens SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL', [token_hash]);
}

export async function isRefreshValid(token) {
  try {
    const { sub } = verifyRefresh(token);
    const rows = await q('SELECT 1 FROM refresh_tokens WHERE token_hash=$1 AND user_id=$2 AND revoked_at IS NULL AND expires_at > now()', [sha256(token), sub]);
    return rows.length > 0;
  } catch {
    return false;
  }
}

export function setRefreshCookie(res, token) {
  const secure = (process.env.COOKIE_SECURE || 'false') === 'true';
  const domain = process.env.COOKIE_DOMAIN || undefined;
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    domain,
    path: '/api/auth',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7d max (browser), server verifies exp
  });
}
export function clearRefreshCookie(res) {
  const secure = (process.env.COOKIE_SECURE || 'false') === 'true';
  const domain = process.env.COOKIE_DOMAIN || undefined;
  res.clearCookie(REFRESH_COOKIE, {
    httpOnly: true, sameSite: 'lax', secure, domain, path: '/api/auth'
  });
}
export function readRefreshCookie(req) {
  const name = process.env.REFRESH_COOKIE_NAME || 'rt';
  return req.cookies?.[name];
}

export async function markInitialChanged(userId, role) {
  if (role === 'agent') {
    await q('UPDATE agent_initial_creds SET is_changed = true WHERE agent_user_id=$1', [userId]);
  } else if (role === 'employee') {
    await q('UPDATE employee_initial_creds SET is_changed = true WHERE employee_user_id=$1', [userId]);
  }
}
export async function needsPasswordChange(userId, role) {
  if (role === 'agent') {
    const r = await q('SELECT NOT is_changed AS needs FROM agent_initial_creds WHERE agent_user_id=$1', [userId]);
    return r[0]?.needs || false;
  } else if (role === 'employee') {
    const r = await q('SELECT NOT is_changed AS needs FROM employee_initial_creds WHERE employee_user_id=$1', [userId]);
    return r[0]?.needs || false;
  }
  return false;
}
