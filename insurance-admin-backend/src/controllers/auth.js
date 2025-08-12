import { q } from '../db.js';
import { checkPassword, hashPassword } from '../utils/passwords.js';
import { loginSchema, createAdminSchema } from '../validations/authSchemas.js';

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;

  const { rows } = await q(`SELECT id, role, name, email, phone_no, password_hash FROM users WHERE email=$1`, [email]);
  const user = rows[0];
  if (!user || !(await checkPassword(password, user.password_hash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  delete user.password_hash;
  req.session.user = user;
  res.json({ user });
}

export async function logout(req, res) {
  req.session.destroy(() => res.json({ ok: true }));
}

export async function createInitialAdmin(req, res) {
  const parsed = createAdminSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { name, email, phone_no, password } = parsed.data;
  const { rows: exists } = await q(`SELECT 1 FROM users WHERE email=$1`, [email]);
  if (exists.length) return res.status(409).json({ error: 'Email exists' });

  const hash = await hashPassword(password);
  const { rows } = await q(
    `INSERT INTO users (role, name, email, phone_no, password_hash)
     VALUES ('admin',$1,$2,$3,$4)
     RETURNING id, role, name, email, phone_no`,
    [name, email, phone_no, hash]
  );
  res.status(201).json(rows[0]);
}
