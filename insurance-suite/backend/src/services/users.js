// import { q } from '../db.js';
// import { hashPassword } from '../utils/auth.js';

// export async function createUser({ role, name, email, phone_no, password }) {
//   const password_hash = await hashPassword(password);
//   const rows = await q(
//     `INSERT INTO users (role, name, email, phone_no, password_hash)
//      VALUES ($1,$2,$3,$4,$5)
//      RETURNING id, role, name, email, phone_no, created_at`,
//     [role, name, email, phone_no, password_hash]
//   );
//   return rows[0];
// }

// export async function getUserByEmail(email) {
//   return (await q('SELECT * FROM users WHERE email=$1', [email]))[0];
// }
// export async function getUserById(id) {
//   return (await q('SELECT * FROM users WHERE id=$1', [id]))[0];
// }


// backend/src/services/users.js
import { q } from '../db.js'
import bcrypt from 'bcryptjs'

// ---- helpers ----
export async function hashPassword(plain) {
  if (!plain || typeof plain !== 'string') throw new Error('password required')
  const saltRounds = 12
  return bcrypt.hash(plain, saltRounds)
}

export async function checkPassword(userOrHash, plain) {
  const hash = typeof userOrHash === 'string' ? userOrHash : userOrHash?.password_hash
  if (!hash) return false
  if (!plain) return false
  return bcrypt.compare(plain, hash)
}

// ---- queries ----
export async function getUserByEmail(email) {
  const rows = await q(
    `SELECT id, role, name, email, phone_no, password_hash, created_at, updated_at
       FROM users
      WHERE email = $1`,
    [email]
  )
  return rows[0] || null
}

export async function getUserById(id) {
  const rows = await q(
    `SELECT id, role, name, email, phone_no, password_hash, created_at, updated_at
       FROM users
      WHERE id = $1`,
    [id]
  )
  return rows[0] || null
}

export async function createUser({ role, name, email, phone_no = null, password }) {
  if (!role || !name || !email || !password) {
    throw new Error('role, name, email, password are required')
  }
  const password_hash = await hashPassword(password)
  const rows = await q(
    `INSERT INTO users (role, name, email, phone_no, password_hash)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING id, role, name, email, phone_no, created_at`,
    [role, name, email, phone_no, password_hash]
  )
  return rows[0]
}

export async function setPassword(userId, newPassword) {
  const password_hash = await hashPassword(newPassword)
  await q(`UPDATE users SET password_hash=$1, updated_at=now() WHERE id=$2`, [
    password_hash,
    userId,
  ])
  return { ok: true }
}
