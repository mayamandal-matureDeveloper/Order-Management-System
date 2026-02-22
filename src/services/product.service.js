import { pool } from '../config/database.js';

 const item_COLUMNS = 'item_id, item_desc, item_qty, price';

export async function createItem({ item_desc, item_qty, price }) {
  const [result] = await pool.query(
    `INSERT INTO 073_item (item_desc, item_qty, price)
     VALUES (?, ?, ?)`,
    [item_desc, item_qty, price]
  );

  return {
    item_id: result.insertId,
    item_desc,
    item_qty,
    price
  };
}

export async function getItemId(itemId) {
  const [rows] = await pool.query(
    `SELECT ${item_COLUMNS} FROM 073_item WHERE item_id = ? LIMIT 1`,
    [itemId]
  );
  return rows[0] || null;
}

  export async function listItem({ limit = 50, offset = 0 } = {}) {
  const [rows] = await pool.query(
    `SELECT ${item_COLUMNS}
     FROM 073_item
     ORDER BY item_desc ASC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  return rows;
}

export async function patchItemId(itemId, fields) {
  const allowedFields = [ 'item_desc', 'item_qty' ];
  const updates = [];
  const values = [];
  for (const key of allowedFields) {
    if (fields[key] !== undefined) {
      updates.push(`${key} = ?`);
      console.log(updates)
      values.push(fields[key]);
      console.log(values)
    }
  }

  if (updates.length === 0) return false;
  values.push(itemId);

  const [result] = await pool.query(
    `UPDATE 073_item SET ${updates.join(', ')} WHERE item_id = ?`,
    values
  );

  return result.affectedRows > 0;
}

export async function updateItemId(itemId, data) {
    const { item_desc, item_qty } = data;

    const [result] = await pool.query(
      `UPDATE 073_item
      SET item_desc = ?, item_qty = ?
      WHERE item_id = ?`,
      [item_desc, item_qty, itemId]
    );

    return result.affectedRows > 0;
  }
  
export async function deleteItemId(itemId) {
  try {
    const [result] = await pool.query(
      `DELETE FROM 073_item WHERE item_id = ?`,
      [itemId]
    );

    return result.affectedRows > 0;

  } catch (err) {

    // Foreign key restriction error
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return 'USED_IN_ORDER';
    }

    throw err;
  }
}