// // src/controllers/customers.js
// import { q } from '../db.js';
// import { updateCustomerStatusSchema } from '../validations/customerSchemas.js';

// /** Admin dashboard card: agents with customer counts */
// export async function listAgentsWithCustomerCounts(_req, res) {
//   const { rows } = await q(`
//     SELECT
//       u.id   AS agent_id,
//       u.name,
//       u.email,
//       u.phone_no,
//       COUNT(c.id)::int AS customer_count
//     FROM users u
//     LEFT JOIN customers c ON c.agent_id = u.id
//     WHERE u.role = 'agent'
//     GROUP BY u.id
//     ORDER BY customer_count DESC, u.created_at DESC
//   `);
//   res.json(rows);
// }

// /** Admin: list all customers with agent info + optional filters */
// export async function listAllCustomersForAdmin(req, res) {
//   const { status, from, to, q: search } = req.query || {};

//   const where = [];
//   const params = [];
//   if (status) { params.push(status); where.push(`c.status = $${params.length}`); }
//   if (from)   { params.push(from);   where.push(`c.created_at >= $${params.length}`); }
//   if (to)     { params.push(to);     where.push(`c.created_at <= $${params.length}`); }
//   if (search) {
//     params.push(`%${search}%`);
//     where.push(`(LOWER(c.name) LIKE LOWER($${params.length}) OR LOWER(u.name) LIKE LOWER($${params.length}))`);
//   }
//   const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

//   const { rows } = await q(
//     `
//     SELECT
//       c.id,
//       c.name         AS customer_name,
//       c.status,
//       c.created_at,
//       u.id           AS agent_id,
//       u.name         AS agent_name,
//       u.email        AS agent_email
//     FROM customers c
//     LEFT JOIN users u ON u.id = c.agent_id
//     ${whereSql}
//     ORDER BY c.created_at DESC
//     `,
//     params
//   );
//   res.json(rows);
// }

// /** Admin (optional): customers for a specific agent */
// export async function listCustomersByAgent(req, res) {
//   const { agentId } = req.params;
//   const { rows } = await q(
//     `SELECT id, name, status, created_at
//      FROM customers
//      WHERE agent_id = $1
//      ORDER BY created_at DESC`,
//     [agentId]
//   );
//   res.json(rows);
// }

// /** Agent: only my customers */
// export async function listOwnCustomers(req, res) {
//   const me = req.session.user.id;
//   const { rows } = await q(
//     `SELECT id, name, status, created_at
//      FROM customers
//      WHERE agent_id = $1
//      ORDER BY created_at DESC`,
//     [me]
//   );
//   res.json(rows);
// }

// /** Agent: create customer (force status = pending for agents) */
// export async function createCustomer(req, res) {
//   const me = req.session.user.id;
//   const {
//     name, age, defenders_like, number_of_children,
//     spouse, parents, /* status ignored */ aadhaar_number, pan_number
//   } = req.body || {};

//   const { rows } = await q(
//     `INSERT INTO customers
//        (agent_id, name, age, defenders_like, number_of_children, spouse, parents, status, aadhaar_number, pan_number)
//      VALUES
//        ($1,$2,$3,$4,$5,$6,$7,'pending',$8,$9)
//      RETURNING id, name, status, created_at`,
//     [me, name, age ?? null, defenders_like ?? null, number_of_children ?? null,
//      spouse ?? null, parents ?? null, aadhaar_number ?? null, pan_number ?? null]
//   );
//   res.status(201).json(rows[0]);
// }

// /** ADMIN: full customer detail (with agent info) */
// export async function getCustomerDetailAdmin(req, res) {
//   const { id } = req.params;

//   const { rows } = await q(
//     `
//     SELECT
//       c.id,
//       c.name,
//       c.age,
//       c.defenders_like,
//       c.number_of_children,
//       c.spouse,
//       c.parents,
//       c.status,
//       c.aadhaar_number,
//       c.pan_number,
//       c.created_at,
//       c.updated_at,
//       u.id        AS agent_id,
//       u.name      AS agent_name,
//       u.email     AS agent_email,
//       u.phone_no  AS agent_phone
//     FROM customers c
//     LEFT JOIN users u ON u.id = c.agent_id
//     WHERE c.id = $1
//     `,
//     [id]
//   );

//   if (!rows.length) return res.status(404).json({ error: 'Customer not found' });
//   return res.json(rows[0]);
// }

// /** ADMIN: change status from 'pending' -> 'Verified' or 'Unverified' */
// export async function updateCustomerStatusAdmin(req, res) {
//   const { id } = req.params;
//   const parsed = updateCustomerStatusSchema.safeParse(req.body);
//   if (!parsed.success) {
//     return res.status(400).json({ error: parsed.error.flatten() });
//   }
//   const { status } = parsed.data;

//   // Only allow transition from 'pending'
//   const { rows: cur } = await q(`SELECT status FROM customers WHERE id=$1`, [id]);
//   if (!cur.length) return res.status(404).json({ error: 'Customer not found' });

//   if (cur[0].status !== 'pending') {
//     return res.status(409).json({ error: `Status change only allowed from 'pending'. Current: '${cur[0].status}'` });
//   }

//   const { rows } = await q(
//     `UPDATE customers
//        SET status=$1, updated_at=NOW()
//      WHERE id=$2 AND status='pending'
//      RETURNING id, status, updated_at`,
//     [status, id]
//   );

//   if (!rows.length) {
//     // race condition protection
//     return res.status(409).json({ error: 'Status already updated by another action' });
//   }

//   return res.json(rows[0]);
// }



// src/controllers/customers.js
import { q } from '../db.js';
import { updateCustomerStatusSchema } from '../validations/customerSchemas.js';

/** Admin dashboard card: agents with customer counts */
export async function listAgentsWithCustomerCounts(_req, res) {
  const { rows } = await q(`
    SELECT
      u.id   AS agent_id,
      u.name,
      u.email,
      u.phone_no,
      COUNT(c.id)::int AS customer_count
    FROM users u
    LEFT JOIN customers c ON c.agent_id = u.id
    WHERE u.role = 'agent'
    GROUP BY u.id
    ORDER BY customer_count DESC, u.created_at DESC
  `);
  res.json(rows);
}

/** Admin: list all customers with agent info + optional filters */
export async function listAllCustomersForAdmin(req, res) {
  const { status, from, to, q: search } = req.query || {};

  const where = [];
  const params = [];
  if (status) { params.push(status); where.push(`c.status = $${params.length}`); }
  if (from)   { params.push(from);   where.push(`c.created_at >= $${params.length}`); }
  if (to)     { params.push(to);     where.push(`c.created_at <= $${params.length}`); }
  if (search) {
    params.push(`%${search}%`);
    where.push(`(LOWER(c.name) LIKE LOWER($${params.length}) OR LOWER(u.name) LIKE LOWER($${params.length}))`);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const { rows } = await q(
    `
    SELECT
      c.id,
      c.name         AS customer_name,
      c.status,
      c.created_at,
      u.id           AS agent_id,
      u.name         AS agent_name,
      u.email        AS agent_email
    FROM customers c
    LEFT JOIN users u ON u.id = c.agent_id
    ${whereSql}
    ORDER BY c.created_at DESC
    `,
    params
  );
  res.json(rows);
}

/** Admin (optional): customers for a specific agent */
export async function listCustomersByAgent(req, res) {
  const { agentId } = req.params;
  const { rows } = await q(
    `SELECT id, name, status, created_at
     FROM customers
     WHERE agent_id = $1
     ORDER BY created_at DESC`,
    [agentId]
  );
  res.json(rows);
}

/** Agent: only my customers */
export async function listOwnCustomers(req, res) {
  const me = req.session.user.id;
  const { rows } = await q(
    `SELECT id, name, status, created_at
     FROM customers
     WHERE agent_id = $1
     ORDER BY created_at DESC`,
    [me]
  );
  res.json(rows);
}

/** Agent: create customer (force status = pending for agents) */
export async function createCustomer(req, res) {
  const me = req.session.user.id;
  const {
    name, age, defenders_like, number_of_children,
    spouse, parents, /* status ignored */ aadhaar_number, pan_number
  } = req.body || {};

  const { rows } = await q(
    `INSERT INTO customers
       (agent_id, name, age, defenders_like, number_of_children, spouse, parents, status, aadhaar_number, pan_number)
     VALUES
       ($1,$2,$3,$4,$5,$6,$7,'pending',$8,$9)
     RETURNING id, name, status, created_at`,
    [me, name, age ?? null, defenders_like ?? null, number_of_children ?? null,
     spouse ?? null, parents ?? null, aadhaar_number ?? null, pan_number ?? null]
  );
  res.status(201).json(rows[0]);
}

/** ADMIN: full customer detail (with agent info) */
export async function getCustomerDetailAdmin(req, res) {
  const { id } = req.params;

  const { rows } = await q(
    `
    SELECT
      c.id,
      c.name,
      c.age,
      c.defenders_like,
      c.number_of_children,
      c.spouse,
      c.parents,
      c.status,
      c.aadhaar_number,
      c.pan_number,
      c.created_at,
      c.updated_at,
      u.id        AS agent_id,
      u.name      AS agent_name,
      u.email     AS agent_email,
      u.phone_no  AS agent_phone
    FROM customers c
    LEFT JOIN users u ON u.id = c.agent_id
    WHERE c.id = $1
    `,
    [id]
  );

  if (!rows.length) return res.status(404).json({ error: 'Customer not found' });
  return res.json(rows[0]);
}

/**
 * ADMIN: change status
 * Business rule: allow only transition FROM 'pending' TO 'Verified' or 'Unverified'.
 * Improvements:
 *  - Idempotent: if requested status equals current, return 200 with current state (no 409).
 *  - Still blocks changing away from non-'pending' to a different status (returns 409).
 */
export async function updateCustomerStatusAdmin(req, res) {
  const { id } = req.params;
  const parsed = updateCustomerStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { status } = parsed.data; // 'pending' | 'Verified' | 'Unverified'

  const { rows: curRows } = await q(`SELECT id, status, updated_at FROM customers WHERE id=$1`, [id]);
  if (!curRows.length) return res.status(404).json({ error: 'Customer not found' });

  const current = curRows[0].status;

  // Idempotent: if no change requested, just return current row (200)
  if (current === status) {
    return res.json(curRows[0]);
  }

  // Enforce your business rule
  if (current !== 'pending') {
    return res.status(409).json({ error: `Status change only allowed from 'pending'. Current: '${current}'` });
  }

  // Perform update
  const { rows } = await q(
    `UPDATE customers
       SET status=$1, updated_at=NOW()
     WHERE id=$2
     RETURNING id, status, updated_at`,
    [status, id]
  );

  // In the unlikely event of a race: if nothing returned, re-read and return latest
  if (!rows.length) {
    const { rows: latest } = await q(`SELECT id, status, updated_at FROM customers WHERE id=$1`, [id]);
    return res.json(latest[0]);
  }

  return res.json(rows[0]);
}
