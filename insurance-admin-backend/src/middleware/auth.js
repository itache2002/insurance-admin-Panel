export function requireAuth(req, res, next) {
  if (req.session?.user) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

export function attachUser(req, _res, next) {
  req.user = req.session?.user || null;
  next();
}
