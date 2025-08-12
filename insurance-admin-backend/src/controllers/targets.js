// src/controllers/targets.js
import { q } from '../db.js';
import { upsertTargetSchema, updateTargetSchema } from '../validations/targetSchemas.js';

export async function setMonthlyTarget(req, res) {
  const { agentId } = req.params;
  const parsed = upsertTargetSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { month, target_value, description } = parsed.data;

  const { rows } = await q(
    `INSERT INTO agent_monthly_targets (agent_id, month, target_value, description)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (agent_id, month)
     DO UPDATE SET target_value=EXCLUDED.target_value, description=EXCLUDED.description
     RETURNING id, agent_id, month, target_value, description`,
    [agentId, month, target_value, description ?? null]
  );

  const r = rows[0];
  res.json({
    ...r,
    target_value: Number(r.target_value)
  });
}

export async function updateMonthlyTarget(req, res) {
  const { targetId } = req.params;
  const parsed = updateTargetSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { target_value, description } = parsed.data;

  const { rows } = await q(
    `UPDATE agent_monthly_targets
     SET target_value=$1, description=$2
     WHERE id=$3
     RETURNING id, agent_id, month, target_value, description`,
    [target_value, description ?? null, targetId]
  );

  const r = rows[0];
  res.json({
    ...r,
    target_value: Number(r.target_value)
  });
}

export async function agentTargetSummary(req, res) {
  // accept agentId from params; fallback to logged-in agent (for /api/agent route)
  const agentId = req.params.agentId ?? req.session.user?.id;
  const { month } = req.query || {};

  if (!month) {
    return res.status(400).json({ error: "month query param required (YYYY-MM-01)" });
  }

  const { rows: t } = await q(
    `SELECT target_value FROM agent_monthly_targets WHERE agent_id=$1 AND month=$2`,
    [agentId, month]
  );
  const target = Number(t[0]?.target_value ?? 0);

  const { rows: p } = await q(
    `SELECT achieved_value FROM agent_target_progress WHERE agent_id=$1 AND month=$2`,
    [agentId, month]
  );
  const achieved = Number(p[0]?.achieved_value ?? 0);

  res.json({
    month,
    target_value: target,
    achieved_value: achieved,
    completion_pct: target ? Number(((achieved / target) * 100).toFixed(2)) : 0
  });
}

export async function setAgentMonthlySales(req, res) {
  const { agentId } = req.params;
  const { month, achieved_value } = req.body || {};
  if (!month || typeof achieved_value !== 'number') {
    return res.status(400).json({ error: "month (YYYY-MM-01) and numeric achieved_value are required" });
  }

  const { rows } = await q(
    `INSERT INTO agent_target_progress (agent_id, month, achieved_value)
     VALUES ($1, $2, $3)
     ON CONFLICT (agent_id, month)
     DO UPDATE SET achieved_value = EXCLUDED.achieved_value, updated_at = NOW()
     RETURNING id, agent_id, month, achieved_value, updated_at`,
    [agentId, month, achieved_value]
  );

  const r = rows[0];
  res.json({ ...r, achieved_value: Number(r.achieved_value) });
}

// (Optional) Admin: increment achieved_value by delta
export async function incrementAgentMonthlySales(req, res) {
  const { agentId } = req.params;
  const { month, delta } = req.body || {};
  if (!month || typeof delta !== 'number') {
    return res.status(400).json({ error: "month (YYYY-MM-01) and numeric delta are required" });
  }

  await q('BEGIN');
  try {
    // ensure a row exists
    await q(
      `INSERT INTO agent_target_progress (agent_id, month, achieved_value)
       VALUES ($1, $2, 0)
       ON CONFLICT (agent_id, month) DO NOTHING`,
      [agentId, month]
    );

    const { rows } = await q(
      `UPDATE agent_target_progress
       SET achieved_value = achieved_value + $1, updated_at = NOW()
       WHERE agent_id = $2 AND month = $3
       RETURNING id, agent_id, month, achieved_value, updated_at`,
      [delta, agentId, month]
    );

    await q('COMMIT');
    const r = rows[0];
    res.json({ ...r, achieved_value: Number(r.achieved_value) });
  } catch (e) {
    await q('ROLLBACK');
    res.status(400).json({ error: e.message });
  }
}
