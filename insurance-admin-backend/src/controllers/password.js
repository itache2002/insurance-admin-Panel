import { q } from '../db.js';
import { checkPassword, hashPassword } from '../utils/passwords.js';

export async function changeOwnPassword(req, res) {
  const userId = req.session.user.id;
  const { old_password, new_password } = req.body;

  // verify old password
  const { rows } = await q(`SELECT password_hash FROM users WHERE id=$1`, [userId]);
  if (!rows.length) return res.status(404).json({ error: 'User not found' });

  const ok = await checkPassword(old_password, rows[0].password_hash);
  if (!ok) return res.status(400).json({ error: 'Old password incorrect' });

  const hash = await hashPassword(new_password);
  await q(`UPDATE users SET password_hash=$1, must_change_password=false, updated_at=NOW() WHERE id=$2`, [hash, userId]);

  // wipe initial creds if any
  await q(`DELETE FROM agent_initial_creds WHERE agent_id=$1`, [userId]);

  res.json({ ok: true });
}
