import { q } from '../db.js';

export function logAction(action, resource, meta = {}) {
  return async (req, _res, next) => {
    try {
      const actor = req.session?.user;
      await q(
        `INSERT INTO activity_logs (actor_id, actor_role, action, resource, meta)
         VALUES ($1,$2,$3,$4,$5)`,
        [actor?.id || null, actor?.role || null, action, resource, meta]
      );
    } catch (_) {}
    next();
  };
}
