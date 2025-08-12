// src/controllers/initialCreds.js
import { q } from '../db.js';
import { decrypt } from '../utils/crypto.js';

export async function getInitialPassword(req, res) {
  const { agentId } = req.params;

  // If agent already changed password, deny
  const { rows: u } = await q(
    `SELECT must_change_password FROM users WHERE id=$1 AND role='agent'`, [agentId]
  );
  if (!u.length) return res.status(404).json({ error: 'Agent not found' });
  if (!u[0].must_change_password) return res.status(410).json({ error: 'Initial password no longer available' });

  const { rows } = await q(
    `SELECT ciphertext, iv, expires_at
     FROM agent_initial_creds
     WHERE agent_id=$1`,
    [agentId]
  );
  const row = rows[0];
  if (!row) return res.status(404).json({ error: 'No initial password set' });

  if (new Date(row.expires_at) < new Date()) {
    return res.status(410).json({ error: 'Initial password expired' });
  }

  const plain = decrypt(row.ciphertext, row.iv);
  res.json({ initial_password: plain, expires_at: row.expires_at });
}
