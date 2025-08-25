import { q } from '../db.js';

export async function logAction(actor_user_id, action, entity_type, entity_id, details, ip) {
  await q(
    `INSERT INTO activity_logs (actor_user_id, action, entity_type, entity_id, details, ip)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [actor_user_id || null, action, entity_type || null, entity_id || null, details || null, ip || null]
  );
}
