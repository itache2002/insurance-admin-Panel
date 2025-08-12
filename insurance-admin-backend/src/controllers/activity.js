import { q } from '../db.js';

export async function listActivity(req, res) {
  const { limit = 50, offset = 0 } = req.query;
  const { rows } = await q(
    `SELECT al.*, u.name AS actor_name
     FROM activity_logs al
     LEFT JOIN users u ON u.id = al.actor_id
     ORDER BY al.created_at DESC
     LIMIT $1 OFFSET $2`, [limit, offset]
  );
  res.json(rows);
}
