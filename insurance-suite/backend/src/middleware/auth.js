import { verifyAccess } from '../utils/auth.js';

export function authOptional(req, _res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (token) {
    try {
      req.user = verifyAccess(token);
    } catch {
      req.user = null;
    }
  }
  next();
}

export function requireAuth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = verifyAccess(token);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(...allowed) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (role && allowed.includes(role)) return next();
    return res.status(403).json({ error: 'Forbidden' });
  };
}
