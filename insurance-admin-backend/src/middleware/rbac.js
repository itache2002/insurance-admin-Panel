export const requireRole = (role) => (req, res, next) => {
  const r = req.session?.user?.role;
  if (r === role) return next();
  return res.status(403).json({ error: `${role} only` });
};
