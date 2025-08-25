
// export async function createCustomer(agentId, payload = {}) {
//   const {
//     name, email, phone_no,
//     pan_no, aadhaar_no,
//     age, spouse_name, number_of_children,
//     parents,             // may arrive as array or string (e.g. "{Mom, Dad}")
//     premium_number       // admin-only; agent UI shouldn't send it
//   } = payload

//   if (!name) { const e = new Error('name required'); e.status = 400; throw e }

//   const pan = normPan(pan_no)
//   const aadhaar = normAadhaar(aadhaar_no)
//   if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan))  { const e = new Error('Invalid PAN format (ABCDE1234F)'); e.status = 400; throw e }
//   if (aadhaar && !/^[0-9]{12}$/.test(aadhaar))      { const e = new Error('Invalid Aadhaar (12 digits)'); e.status = 400; throw e }

//   const ageInt = (age === '' || age == null) ? null : parseInt(age, 10)
//   if (ageInt !== null && (Number.isNaN(ageInt) || ageInt < 0 || ageInt > 120)) {
//     const e = new Error('Invalid age'); e.status = 400; throw e
//   }

//   const childrenInt = (number_of_children === '' || number_of_children == null)
//     ? null : parseInt(number_of_children, 10)
//   if (childrenInt !== null && (Number.isNaN(childrenInt) || childrenInt < 0)) {
//     const e = new Error('Invalid number_of_children'); e.status = 400; throw e
//   }

//   const parentsJson = normalizeParents(parents)       // <-- ALWAYS valid JSON text or null

//   const premium = premium_number ? String(premium_number).trim() : null
//   if (premium && premium.length > 64) {
//     const e = new Error('premium_number too long'); e.status = 400; throw e
//   }

//   try {
//     const rows = await q(
//       `INSERT INTO customers
//          (agent_id, name, email, phone_no, status,
//           pan_no, aadhaar_no, age, spouse_name, number_of_children, parents, premium_number)
//        VALUES ($1,$2,$3,$4,'Pending',
//                $5,$6,$7,$8,$9,$10,$11)
//        RETURNING id, agent_id, name, email, phone_no, status,
//                  pan_no, aadhaar_no, age, spouse_name, number_of_children, parents, premium_number, created_at`,
//       [
//         agentId,
//         name,
//         email || null,
//         phone_no || null,
//         pan,
//         aadhaar,
//         ageInt,
//         spouse_name || null,
//         childrenInt,
//         parentsJson,             // jsonb column receives JSON string
//         premium
//       ]
//     )
//     return rows[0]
//   } catch (e) {
//     if (e && e.code === '23505') {
//       let msg = 'Duplicate value'
//       if (/premium_number/i.test(e.detail || '')) msg = 'Premium number already exists'
//       if (/pan/i.test(e.detail || '')) msg = 'PAN already exists'
//       if (/aadhaar/i.test(e.detail || '')) msg = 'Aadhaar already exists'
//       const err = new Error(msg); err.status = 409; throw err
//     }
//     throw e
//   }
// }

// /**
//  * Flexible customers listing:
//  * - { agentId }     -> customers for that agent
//  * - { employeeId }  -> customers for all agents supervised by that employee
//  * - (no ids)        -> all customers (admin use). Supports filters: status, agentFilter
//  */
// export async function listCustomers({ agentId, employeeId, status, agentFilter, limit = 200, offset = 0 } = {}) {
//   if (employeeId) {
//     // all customers of agents under this employee
//     return await q(
//       `SELECT c.*, ua.name AS agent_name
//          FROM customers c
//          JOIN agent_supervision s ON s.agent_user_id = c.agent_id
//          LEFT JOIN users ua ON ua.id = c.agent_id
//         WHERE s.employee_user_id = $1
//           AND ($2::text IS NULL OR c.status = $2::customer_status)
//         ORDER BY c.created_at DESC
//         LIMIT $3 OFFSET $4`,
//       [employeeId, status || null, limit, offset]
//     )
//   }

//   if (agentId) {
//     // customers of a single agent
//     return await q(
//       `SELECT c.*
//          FROM customers c
//         WHERE c.agent_id = $1
//           AND ($2::text IS NULL OR c.status = $2::customer_status)
//         ORDER BY c.created_at DESC
//         LIMIT $3 OFFSET $4`,
//       [agentId, status || null, limit, offset]
//     )
//   }

//   // admin/all
//   const conds = []
//   const params = []
//   if (status) { params.push(status); conds.push(`c.status = $${params.length}::customer_status`) }
//   if (agentFilter) { params.push(agentFilter); conds.push(`c.agent_id = $${params.length}`) }
//   const where = conds.length ? `WHERE ${conds.join(' AND ')}` : ''
//   params.push(limit, offset)

//   return await q(
//     `SELECT c.*, ua.name AS agent_name
//        FROM customers c
//        LEFT JOIN users ua ON ua.id = c.agent_id
//       ${where}
//       ORDER BY c.created_at DESC
//       LIMIT $${params.length-1} OFFSET $${params.length}`,
//     params
//   )
// }

// /** Admin-only: set or update premium number */
// export async function adminSetPremiumNumber(customerId, premium_number) {
//   const premium = premium_number ? String(premium_number).trim() : null
//   if (premium && premium.length > 64) { const e = new Error('premium_number too long'); e.status = 400; throw e }
//   const rows = await q(
//     `UPDATE customers
//         SET premium_number = $2, updated_at = now()
//       WHERE id = $1
//       RETURNING *`,
//     [customerId, premium]
//   )
//   if (!rows.length) { const e = new Error('Customer not found'); e.status = 404; throw e }
//   return rows[0]
// }


import { q } from '../db.js'

function normPan(p){ return p ? String(p).trim().toUpperCase() : null }
function normAadhaar(a){ return a ? String(a).replace(/[^0-9]/g,'') : null }

/** Coerce "parents" into a valid JSON array string (or null) for the jsonb column. */
function normalizeParents(parents){
  if (parents == null || parents === '') return null

  // Already an array -> stringify trimmed non-empty values
  if (Array.isArray(parents)) {
    const arr = parents.map(x => String(x).trim()).filter(Boolean)
    return arr.length ? JSON.stringify(arr) : null
  }

  // String cases: "[...]" JSON, or "{Mom, Dad}", or "Mom, Dad"
  if (typeof parents === 'string') {
    const s = parents.trim()

    // looks like JSON array -> validate & normalize
    if (s.startsWith('[') && s.endsWith(']')) {
      try {
        const parsed = JSON.parse(s)
        if (Array.isArray(parsed)) {
          const arr = parsed.map(x => String(x).trim()).filter(Boolean)
          return arr.length ? JSON.stringify(arr) : null
        }
      } catch { /* fall through to cleanup */ }
    }

    // cleanup braces/brackets/quotes, then split by comma
    const cleaned = s.replace(/[\{\}\[\]"]/g, '').trim()
    if (!cleaned) return null
    const arr = cleaned.split(',').map(t => t.trim()).filter(Boolean)
    return arr.length ? JSON.stringify(arr) : null
  }

  // Unknown type -> ignore
  return null
}

export async function createCustomer(agentId, payload = {}) {
  const {
    name, email, phone_no,
    pan_no, aadhaar_no,
    age, spouse_name, number_of_children,
    parents,             // may arrive as array or string (e.g. "{Mom, Dad}")
    premium_number       // admin-only; agent UI shouldn't send it
  } = payload

  if (!name) { const e = new Error('name required'); e.status = 400; throw e }

  const pan = normPan(pan_no)
  const aadhaar = normAadhaar(aadhaar_no)
  if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan))  { const e = new Error('Invalid PAN format (ABCDE1234F)'); e.status = 400; throw e }
  if (aadhaar && !/^[0-9]{12}$/.test(aadhaar))      { const e = new Error('Invalid Aadhaar (12 digits)'); e.status = 400; throw e }

  const ageInt = (age === '' || age == null) ? null : parseInt(age, 10)
  if (ageInt !== null && (Number.isNaN(ageInt) || ageInt < 0 || ageInt > 120)) {
    const e = new Error('Invalid age'); e.status = 400; throw e
  }

  const childrenInt = (number_of_children === '' || number_of_children == null)
    ? null : parseInt(number_of_children, 10)
  if (childrenInt !== null && (Number.isNaN(childrenInt) || childrenInt < 0)) {
    const e = new Error('Invalid number_of_children'); e.status = 400; throw e
  }

  const parentsJson = normalizeParents(parents) // <- always valid JSON string or null

  const premium = premium_number ? String(premium_number).trim() : null
  if (premium && premium.length > 64) {
    const e = new Error('premium_number too long'); e.status = 400; throw e
  }

  try {
    const rows = await q(
      `INSERT INTO customers
         (agent_id, name, email, phone_no, status,
          pan_no, aadhaar_no, age, spouse_name, number_of_children, parents, premium_number)
       VALUES ($1,$2,$3,$4,'Pending',
               $5,$6,$7,$8,$9,$10,$11)
       RETURNING id, agent_id, name, email, phone_no, status,
                 pan_no, aadhaar_no, age, spouse_name, number_of_children, parents, premium_number, created_at`,
      [
        agentId,
        name,
        email || null,
        phone_no || null,
        pan,
        aadhaar,
        ageInt,
        spouse_name || null,
        childrenInt,
        parentsJson,   // jsonb column gets JSON string
        premium
      ]
    )
    return rows[0]
  } catch (e) {
    if (e && e.code === '23505') {
      let msg = 'Duplicate value'
      if (/premium_number/i.test(e.detail || '')) msg = 'Premium number already exists'
      if (/pan/i.test(e.detail || '')) msg = 'PAN already exists'
      if (/aadhaar/i.test(e.detail || '')) msg = 'Aadhaar already exists'
      const err = new Error(msg); err.status = 409; throw err
    }
    throw e
  }
}

/**
 * Flexible customers listing:
 * - { agentId }     -> customers for that agent
 * - { employeeId }  -> customers for all agents supervised by that employee
 * - (no ids)        -> all customers (admin use). Supports filters: status, agentFilter
 */
export async function listCustomers({ agentId, employeeId, status, agentFilter, limit = 200, offset = 0 } = {}) {
  if (employeeId) {
    return await q(
      `SELECT c.*, ua.name AS agent_name
         FROM customers c
         JOIN agent_supervision s ON s.agent_user_id = c.agent_id
         LEFT JOIN users ua ON ua.id = c.agent_id
        WHERE s.employee_user_id = $1
          AND ($2::text IS NULL OR c.status = $2::customer_status)
        ORDER BY c.created_at DESC
        LIMIT $3 OFFSET $4`,
      [employeeId, status || null, limit, offset]
    )
  }

  if (agentId) {
    return await q(
      `SELECT c.*
         FROM customers c
        WHERE c.agent_id = $1
          AND ($2::text IS NULL OR c.status = $2::customer_status)
        ORDER BY c.created_at DESC
        LIMIT $3 OFFSET $4`,
      [agentId, status || null, limit, offset]
    )
  }

  // admin/all
  const conds = []
  const params = []
  if (status)      { params.push(status);      conds.push(`c.status = $${params.length}::customer_status`) }
  if (agentFilter) { params.push(agentFilter); conds.push(`c.agent_id = $${params.length}`) }
  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : ''
  params.push(limit, offset)

  return await q(
    `SELECT c.*, ua.name AS agent_name
       FROM customers c
       LEFT JOIN users ua ON ua.id = c.agent_id
      ${where}
      ORDER BY c.created_at DESC
      LIMIT $${params.length-1} OFFSET $${params.length}`,
    params
  )
}

/** Admin-only: set or update premium number */
export async function adminSetPremiumNumber(customerId, premium_number) {
  const premium = premium_number ? String(premium_number).trim() : null
  if (premium && premium.length > 64) { const e = new Error('premium_number too long'); e.status = 400; throw e }
  const rows = await q(
    `UPDATE customers
        SET premium_number = $2, updated_at = now()
      WHERE id = $1
      RETURNING *`,
    [customerId, premium]
  )
  if (!rows.length) { const e = new Error('Customer not found'); e.status = 404; throw e }
  return rows[0]
}
