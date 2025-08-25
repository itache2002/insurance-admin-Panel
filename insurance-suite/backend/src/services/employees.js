import { q } from '../db.js';

export async function setEmployeeSalary(employeeUserId, base_salary) {
  const exist = await q('SELECT 1 FROM employee_salary WHERE employee_user_id=$1', [employeeUserId]);
  if (exist.length) {
    await q('UPDATE employee_salary SET base_salary=$1 WHERE employee_user_id=$2', [base_salary, employeeUserId]);
  } else {
    await q('INSERT INTO employee_salary (employee_user_id, base_salary) VALUES ($1,$2)', [employeeUserId, base_salary]);
  }
  await q('INSERT INTO employee_salary_history (employee_user_id, base_salary) VALUES ($1,$2)', [employeeUserId, base_salary]);
}
