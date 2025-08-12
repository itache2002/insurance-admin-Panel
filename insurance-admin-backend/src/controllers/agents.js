// import { q } from '../db.js';
// import { hashPassword } from '../utils/passwords.js';
// import { createAgentSchema, updateAgentSelfSchema } from '../validations/userSchemas.js';

// export async function createAgent(req, res) {
//   const parsed = createAgentSchema.safeParse(req.body);
//   if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
//   const { name, email, phone_no, password, pan_number, aadhaar_number,
//           bank_name, account_no, ifsc_code,
//           tenth_percent, twelfth_percent, degree_percent } = parsed.data;

//   await q('BEGIN');
//   try {
//     const pwd = password || Math.random().toString(36).slice(2,10) + 'A!';
//     const hash = await hashPassword(pwd);

//     const { rows: u } = await q(
//       `INSERT INTO users (role,name,email,phone_no,password_hash)
//        VALUES ('agent',$1,$2,$3,$4)
//        RETURNING id, role, name, email, phone_no`,
//       [name, email, phone_no, hash]
//     );
//     const agent = u[0];

//     await q(`INSERT INTO agent_profile (user_id,pan_number,aadhaar_number) VALUES ($1,$2,$3)`,
//       [agent.id, pan_number, aadhaar_number]);

//     await q(`INSERT INTO agent_bank_details (agent_id,bank_name,account_no,ifsc_code)
//              VALUES ($1,$2,$3,$4)`,
//       [agent.id, bank_name, account_no, ifsc_code]);

//     await q(`INSERT INTO agent_education_details (agent_id,tenth_percent,twelfth_percent,degree_percent)
//              VALUES ($1,$2,$3,$4)`,
//       [agent.id, tenth_percent || null, twelfth_percent || null, degree_percent || null]);

//     await q(`INSERT INTO agent_compensation (agent_id,base_salary,incentive_rate)
//              VALUES ($1,0,0)`, [agent.id]);

//     await q('COMMIT');
//     res.status(201).json(agent);
//   } catch (e) {
//     await q('ROLLBACK');
//     res.status(400).json({ error: e.message });
//   }
// }

// export async function listAgents(_req, res) {
//   const { rows } = await q(`
//     SELECT u.id, u.name, u.email, u.phone_no,
//            ap.pan_number, ap.aadhaar_number,
//            ab.bank_name, ab.account_no, ab.ifsc_code,
//            ae.tenth_percent, ae.twelfth_percent, ae.degree_percent,
//            ac.base_salary, ac.incentive_rate
//     FROM users u
//     JOIN agent_profile ap ON ap.user_id=u.id
//     LEFT JOIN agent_bank_details ab ON ab.agent_id=u.id
//     LEFT JOIN agent_education_details ae ON ae.agent_id=u.id
//     LEFT JOIN agent_compensation ac ON ac.agent_id=u.id
//     WHERE u.role='agent'
//     ORDER BY u.created_at DESC
//   `);
//   res.json(rows);
// }

// export async function setCompensation(req, res) {
//   const { agentId } = req.params;
//   const { base_salary, incentive_rate } = req.body;

//   await q('BEGIN');
//   try {
//     await q(`UPDATE agent_compensation SET base_salary=$1, incentive_rate=$2 WHERE agent_id=$3`,
//       [base_salary, incentive_rate, agentId]);

//     await q(`INSERT INTO agent_compensation_history (agent_id, base_salary, incentive_rate, changed_by)
//              VALUES ($1,$2,$3,$4)`,
//       [agentId, base_salary, incentive_rate, req.session.user.id]);

//     await q('COMMIT');
//     res.json({ ok: true });
//   } catch (e) {
//     await q('ROLLBACK');
//     res.status(400).json({ error: e.message });
//   }
// }

// export async function agentMe(req, res) {
//   const id = req.session.user.id;
//   const { rows } = await q(`
//     SELECT u.id, u.name, u.email, u.phone_no, u.role,
//            ac.base_salary, ac.incentive_rate
//     FROM users u
//     LEFT JOIN agent_compensation ac ON ac.agent_id=u.id
//     WHERE u.id=$1
//   `,[id]);
//   res.json(rows[0]);
// }

// export async function updateAgentSelf(req, res) {
//   const parsed = updateAgentSelfSchema.safeParse(req.body);
//   if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
//   const { name, email, phone_no } = parsed.data;
//   const id = req.session.user.id;
//   const { rows } = await q(
//     `UPDATE users SET name=$1, email=$2, phone_no=$3, updated_at=NOW()
//      WHERE id=$4 AND role='agent'
//      RETURNING id, name, email, phone_no`, [name, email, phone_no, id]
//   );
//   res.json(rows[0]);
// }

// src/controllers/agents.js
import { q } from '../db.js';
import { hashPassword, checkPassword } from '../utils/passwords.js';
import { createAgentSchema, updateAgentSelfSchema } from '../validations/userSchemas.js';
import { encrypt } from '../utils/crypto.js';

export async function createAgent(req, res) {
  const parsed = createAgentSchema.safeParse(req.body);
  if (!parsed.success) {
    console.error('[createAgent] validation error:', parsed.error.flatten());
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const {
    name, email, phone_no, password,
    pan_number, aadhaar_number,
    bank_name, account_no, ifsc_code,
    tenth_percent, twelfth_percent, degree_percent
  } = parsed.data;

  await q('BEGIN');
  try {
    const plainPwd =
      (password && password.trim()) ||
      (Math.random().toString(36).slice(2, 10) + 'A!' + Math.floor(Math.random() * 10));

    const pwdHash = await hashPassword(plainPwd);

    const { rows: u } = await q(
      `INSERT INTO users (role, name, email, phone_no, password_hash, must_change_password)
       VALUES ('agent', $1, $2, $3, $4, true)
       RETURNING id, role, name, email, phone_no, must_change_password`,
      [name, email, phone_no, pwdHash]
    );
    const agent = u[0];

    const { ciphertext, iv } = encrypt(plainPwd);
    await q(
      `INSERT INTO agent_initial_creds (agent_id, ciphertext, iv, expires_at)
       VALUES ($1, $2, $3, NOW() + interval '7 days')
       ON CONFLICT (agent_id)
       DO UPDATE SET ciphertext=EXCLUDED.ciphertext, iv=EXCLUDED.iv, expires_at=EXCLUDED.expires_at`,
      [agent.id, ciphertext, iv]
    );

    await q(
      `INSERT INTO agent_profile (user_id, pan_number, aadhaar_number)
       VALUES ($1, $2, $3)`,
      [agent.id, pan_number, aadhaar_number]
    );

    await q(
      `INSERT INTO agent_bank_details (agent_id, bank_name, account_no, ifsc_code)
       VALUES ($1, $2, $3, $4)`,
      [agent.id, bank_name, account_no, ifsc_code]
    );

    await q(
      `INSERT INTO agent_education_details (agent_id, tenth_percent, twelfth_percent, degree_percent)
       VALUES ($1, $2, $3, $4)`,
      [agent.id, tenth_percent ?? null, twelfth_percent ?? null, degree_percent ?? null]
    );

    await q(
      `INSERT INTO agent_compensation (agent_id, base_salary, incentive_rate)
       VALUES ($1, 0, 0)`,
      [agent.id]
    );

    await q('COMMIT');
    return res.status(201).json({ ...agent, initial_password: plainPwd });
  } catch (e) {
    await q('ROLLBACK');
    console.error('[createAgent] error:', e);
    return res.status(400).json({ error: e.message });
  }
}

export async function listAgents(_req, res) {
  const { rows } = await q(`
    SELECT u.id, u.name, u.email, u.phone_no,
           ap.pan_number, ap.aadhaar_number,
           ab.bank_name, ab.account_no, ab.ifsc_code,
           ae.tenth_percent, ae.twelfth_percent, ae.degree_percent,
           ac.base_salary, ac.incentive_rate
    FROM users u
    JOIN agent_profile ap ON ap.user_id = u.id
    LEFT JOIN agent_bank_details ab ON ab.agent_id = u.id
    LEFT JOIN agent_education_details ae ON ae.agent_id = u.id
    LEFT JOIN agent_compensation ac ON ac.agent_id = u.id
    WHERE u.role = 'agent'
    ORDER BY u.created_at DESC
  `);
  return res.json(rows);
}

export async function setCompensation(req, res) {
  const { agentId } = req.params;
  const { base_salary, incentive_rate } = req.body;

  await q('BEGIN');
  try {
    await q(
      `UPDATE agent_compensation
       SET base_salary = $1, incentive_rate = $2
       WHERE agent_id = $3`,
      [base_salary, incentive_rate, agentId]
    );

    await q(
      `INSERT INTO agent_compensation_history (agent_id, base_salary, incentive_rate, changed_by)
       VALUES ($1, $2, $3, $4)`,
      [agentId, base_salary, incentive_rate, req.session.user.id]
    );

    await q('COMMIT');
    return res.json({ ok: true });
  } catch (e) {
    await q('ROLLBACK');
    console.error('[setCompensation] error:', e);
    return res.status(400).json({ error: e.message });
  }
}

export async function agentMe(req, res) {
  const id = req.session.user.id;
  const { rows } = await q(`
    SELECT u.id, u.name, u.email, u.phone_no, u.role, u.must_change_password,
           ac.base_salary, ac.incentive_rate
    FROM users u
    LEFT JOIN agent_compensation ac ON ac.agent_id = u.id
    WHERE u.id = $1
  `,[id]);
  return res.json(rows[0]);
}

export async function updateAgentSelf(req, res) {
  const parsed = updateAgentSelfSchema.safeParse(req.body);
  if (!parsed.success) {
    console.error('[updateAgentSelf] validation error:', parsed.error.flatten());
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { name, email, phone_no } = parsed.data;
  const id = req.session.user.id;

  const { rows } = await q(
    `UPDATE users
     SET name = $1, email = $2, phone_no = $3, updated_at = NOW()
     WHERE id = $4 AND role = 'agent'
     RETURNING id, name, email, phone_no`,
    [name, email, phone_no, id]
  );
  return res.json(rows[0]);
}

export async function changeOwnPassword(req, res) {
  const userId = req.session.user.id;
  const { old_password, new_password } = req.body || {};

  if (!old_password || !new_password) {
    return res.status(400).json({ error: 'old_password and new_password are required' });
  }

  const { rows: u } = await q(
    `SELECT password_hash FROM users WHERE id=$1 AND role='agent'`,
    [userId]
  );
  if (!u.length) return res.status(404).json({ error: 'User not found' });

  const ok = await checkPassword(old_password, u[0].password_hash);
  if (!ok) return res.status(400).json({ error: 'Old password incorrect' });

  const newHash = await hashPassword(new_password);
  await q(
    `UPDATE users
     SET password_hash=$1, must_change_password=false, updated_at=NOW()
     WHERE id=$2`,
    [newHash, userId]
  );

  await q(`DELETE FROM agent_initial_creds WHERE agent_id=$1`, [userId]);

  return res.json({ ok: true });
}
