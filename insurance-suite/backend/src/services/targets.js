import { q } from '../db.js';

export async function setMonthlyTarget(agentUserId, month, target_value) {
  await q(
    `INSERT INTO agent_monthly_targets (agent_user_id, month, target_value)
     VALUES ($1, first_day_of_month($2::date), $3)
     ON CONFLICT (agent_user_id, month)
     DO UPDATE SET target_value = EXCLUDED.target_value, updated_at=now()`,
    [agentUserId, month, target_value]
  );
}

export async function addTargetProgress(agentUserId, month, delta, note) {
  await q(
    `INSERT INTO agent_target_progress (agent_user_id, month, delta, note)
     VALUES ($1, first_day_of_month($2::date), $3, $4)`,
    [agentUserId, month, delta, note || null]
  );
  await q(
    `UPDATE agent_monthly_targets
     SET achieved_value = achieved_value + $3, updated_at=now()
     WHERE agent_user_id=$1 AND month=first_day_of_month($2::date)`,
    [agentUserId, month, delta]
  );
}
