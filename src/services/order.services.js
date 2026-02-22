import { pool } from '../config/database.js';

export async function getAllOrders() {
  const [rows] = await pool.query(`
    SELECT 
  o.order1_id,
  o.customer_id,
  c.customer_desc,
  o.item_id,
  i.item_desc,
  o.order1_qty,
  i.price,
  o.discount,
  o.total_price
FROM 073_order1 o
JOIN 073_customer c ON o.customer_id = c.customer_id
JOIN 073_item i ON o.item_id = i.item_id;

  `);
  return rows;
}

export async function getOrderById(id) {
  const [rows] = await pool.query(`
    SELECT 
      o.order1_id,
      o.customer_id,
      c.customer_desc,
      o.item_id,
      i.item_desc,
      o.order1_qty,
      i.price,
      o.discount,
      o.total_price
    FROM 073_order1 o
    JOIN 073_customer c ON o.customer_id = c.customer_id
    JOIN 073_item i ON o.item_id = i.item_id
    WHERE o.order1_id = ?
  `, [id]);

  return rows[0] || null;
}

export async function createOrder(data) {
  const { customer_id, item_id, order1_qty = 1, discount = 0 } = data;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1️⃣ Get item price & stock
    const [itemRows] = await connection.query(
      'SELECT item_qty, price FROM 073_item WHERE item_id = ? FOR UPDATE',
      [item_id]
    );

    if (itemRows.length === 0) throw new Error('Item not found');
    if (itemRows[0].item_qty < order1_qty)
      throw new Error('Insufficient stock');

    const price = itemRows[0].price;

    // 2️⃣ Calculate total price
    const totalPrice =
      order1_qty * price * (1 - discount / 100);

    // 3️⃣ Insert order
    const [orderResult] = await connection.query(
      `INSERT INTO 073_order1
       (customer_id, item_id, order1_qty, discount, total_price)
       VALUES (?, ?, ?, ?, ?)`,
      [customer_id, item_id, order1_qty, discount, totalPrice]
    );

    // 4️⃣ Reduce stock
    await connection.query(
      'UPDATE 073_item SET item_qty = item_qty - ? WHERE item_id = ?',
      [order1_qty, item_id]
    );

    await connection.commit();

    return {
      order1_id: orderResult.insertId,
      customer_id,
      item_id,
      order1_qty,
      discount,
      total_price: totalPrice
    };

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}


export async function deleteOrder(id) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [orderRows] = await connection.query(
      'SELECT customer_id, item_id, order1_qty FROM 073_order1 WHERE order1_id = ?',
      [id]
    );

    if (orderRows.length === 0) {
      await connection.rollback();
      return false;
    }

    const { customer_id, item_id, order1_qty } = orderRows[0];

    await connection.query(
      'DELETE FROM 073_order1 WHERE order1_id = ?',
      [id]
    );

    // Return item stock
    await connection.query(
      'UPDATE 073_item SET item_qty = item_qty + ? WHERE item_id = ?',
      [order1_qty, item_id]
    );

    // Update customer priority
    const [orderCountRows] = await connection.query(
      'SELECT COUNT(*) AS total FROM 073_order1 WHERE customer_id = ?',
      [customer_id]
    );

    if (orderCountRows[0].total < 3) {
      await connection.query(
        'UPDATE 073_customer SET customer_priority = FALSE WHERE customer_id = ?',
        [customer_id]
      );
    }

    await connection.commit();
    return true;

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

export async function updateOrder(id, data) {
  const { customer_id, item_id, order1_qty, discount = 0 } = data;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [oldOrderRows] = await connection.query(
      'SELECT item_id, order1_qty FROM 073_order1 WHERE order1_id = ? FOR UPDATE',
      [id]
    );

    if (oldOrderRows.length === 0) throw new Error('Order not found');

    const oldItemID = oldOrderRows[0].item_id;
    const oldQty = oldOrderRows[0].order1_qty;

    if (oldItemID === item_id) {
      const diff = order1_qty - oldQty;

      if (diff > 0) {
        const [itemRows] = await connection.query(
          'SELECT item_qty FROM 073_item WHERE item_id = ? FOR UPDATE',
          [item_id]
        );

        if (itemRows[0].item_qty < diff)
          throw new Error(`Insufficient stock. Available: ${itemRows[0].item_qty}`);
      }

      await connection.query(
        'UPDATE 073_item SET item_qty = item_qty - ? WHERE item_id = ?',
        [diff, item_id]
      );

    } else {

      // Restore old item stock
      await connection.query(
        'UPDATE 073_item SET item_qty = item_qty + ? WHERE item_id = ?',
        [oldQty, oldItemID]
      );

      const [newItemRows] = await connection.query(
        'SELECT item_qty FROM 073_item WHERE item_id = ? FOR UPDATE',
        [item_id]
      );

      if (newItemRows[0].item_qty < order1_qty)
        throw new Error(`Insufficient stock. Available: ${newItemRows[0].item_qty}`);

      await connection.query(
        'UPDATE 073_item SET item_qty = item_qty - ? WHERE item_id = ?',
        [order1_qty, item_id]
      );
    }

    // 🔥 Get item price
    const [priceRows] = await connection.query(
      'SELECT price FROM 073_item WHERE item_id = ?',
      [item_id]
    );

    const price = priceRows[0].price;

    // 🔥 Calculate total price
    const totalPrice = order1_qty * price * (1 - discount / 100);

    // 🔥 Update order with discount & total_price
    await connection.query(
      `UPDATE 073_order1 
       SET customer_id = ?, 
           item_id = ?, 
           order1_qty = ?, 
           discount = ?, 
           total_price = ?
       WHERE order1_id = ?`,
      [customer_id, item_id, order1_qty, discount, totalPrice, id]
    );

    await connection.commit();
    return true;

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}