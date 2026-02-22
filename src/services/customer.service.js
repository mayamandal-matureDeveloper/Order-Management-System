import { pool } from '../config/database.js';

  const customer_COLUMNS = 'customer_id, customer_desc, customer_priority';

  export async function getCustomerId(customerId) {
    const [rows] = await pool.query(
      `SELECT ${customer_COLUMNS} FROM 073_customer WHERE customer_id = ? LIMIT 1`,
      [customerId]
    );
    return rows[0] || null;
  }

  export async function listByCustomer({ limit = 50, offset = 0 } = {}) {
  const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);
  const safeOffset = Math.max(parseInt(offset, 10) || 0, 0);

  const [rows] = await pool.query(
    `SELECT ${customer_COLUMNS}
     FROM \`073_customer\`
     ORDER BY customer_desc ASC
     LIMIT ? OFFSET ?`,
    [safeLimit, safeOffset]
  );

  return rows;
}

export async function patchCustomerId(customerId, fields) {
  const allowedFields = ['customer_desc', 'customer_priority'];
  const updates = [];
  const values = [];

  for (const key of allowedFields) {
    if (fields[key] !== undefined) {

      updates.push(`${key} = ?`);
      if (key === 'customer_priority') {
        values.push(fields[key] ? 1 : 0);
      } else {
        values.push(fields[key]);
      }
    }
  }

  if (updates.length === 0) return false;

  values.push(customerId);

  const [result] = await pool.query(
    `UPDATE \`073_customer\`
     SET ${updates.join(', ')}
     WHERE customer_id = ?`,
    values
  );

  return result.affectedRows > 0;
}


export async function createCustomer({ customer_desc, customer_priority }) {
  const priorityValue = customer_priority ? 1 : 0;

  const [result] = await pool.query(
    `INSERT INTO \`073_customer\` (customer_desc, customer_priority)
     VALUES (?, ?)`,
    [customer_desc, priorityValue]
  );

  return {
    customer_id: result.insertId,
    customer_desc,
    customer_priority: Boolean(priorityValue)
  };
}
  
export async function updateCustomerId(customerId, data) {
  const { customer_desc, customer_priority } = data;
  const priorityValue = customer_priority ? 1 : 0;

  const [result] = await pool.query(
    `UPDATE \`073_customer\`
     SET customer_desc = ?, customer_priority = ?
     WHERE customer_id = ?`,
    [customer_desc, priorityValue, customerId]
  );

  return result.affectedRows > 0;
}

  export async function deleteCustomerId(customerId) {
    const [result] = await pool.query(
      `DELETE FROM 073_customer WHERE customer_id = ?`,
      [customerId]
    );

    return result.affectedRows > 0;
  }