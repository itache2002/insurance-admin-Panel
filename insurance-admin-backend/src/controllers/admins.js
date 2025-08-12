import { q } from '../db.js';
import { hashPassword } from '../utils/passwords.js';
import { createAdminSchema } from '../validations/authSchemas.js';

export async function createAdmin(req, res) {
  const parsed = createAdminSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { name, email, phone_no, password } = parsed.data;
  const hash = await hashPassword(password);
  const { rows } = await q(
    `INSERT INTO users (role,name,email,phone_no,password_hash)
     VALUES ('admin',$1,$2,$3,$4)
     RETURNING id, role, name, email, phone_no`,
    [name, email, phone_no, hash]
  );
  res.status(201).json(rows[0]);
}

export async function deleteUser(req, res) {
  const { userId } = req.params;
  await q(`DELETE FROM users WHERE id=$1`, [userId]);
  res.json({ ok: true });
}

export async function listAdmins(_req, res) {
  const { rows } = await q(`SELECT id, name, email, phone_no, created_at FROM users WHERE role='admin' ORDER BY created_at DESC`);
  res.json(rows);
}
