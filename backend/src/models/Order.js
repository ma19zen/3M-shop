const { getPool } = require('../config/db');
const User = require('./User');

const initOrderTable = async () => {
    const client = await getPool().connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(24) NOT NULL,
        shipping_address JSONB NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id VARCHAR(24) NOT NULL,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(500),
        price DECIMAL(10,2) NOT NULL,
        quantity INTEGER NOT NULL
      )
    `);
  } finally {
    client.release();
  }
};

const Order = {
  create: async (userId, items, shippingAddress, paymentMethod, totalAmount) => {
  const client = await getPool().connect();
    try {
      await client.query('BEGIN');
      const orderResult = await client.query(
        `INSERT INTO orders (user_id, shipping_address, payment_method, total_amount) VALUES ($1, $2, $3, $4) RETURNING *`,
        [userId, JSON.stringify(shippingAddress), paymentMethod, totalAmount]
      );
      const order = orderResult.rows[0];
      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, name, image, price, quantity) VALUES ($1, $2, $3, $4, $5, $6)`,
          [order.id, item.product, item.name, item.image, item.price, item.quantity]
        );
      }
      await client.query('COMMIT');
      return Order.findById(order.id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  findById: async (id) => {
    const orderResult = await getPool().query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderResult.rows.length === 0) return null;
    const itemsResult = await getPool().query('SELECT * FROM order_items WHERE order_id = $1', [id]);
    return { ...orderResult.rows[0], items: itemsResult.rows };
  },

  findByUserId: async (userId) => {
    const result = await getPool().query(
      `SELECT o.*, json_agg(json_build_object('id', oi.id, 'product_id', oi.product_id, 'name', oi.name, 'image', oi.image, 'price', oi.price, 'quantity', oi.quantity)) as items FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id WHERE o.user_id = $1 GROUP BY o.id ORDER BY o.created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  findAll: async () => {
    const result = await getPool().query(
      `SELECT o.*, json_agg(json_build_object('id', oi.id, 'product_id', oi.product_id, 'name', oi.name, 'image', oi.image, 'price', oi.price, 'quantity', oi.quantity)) as items FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id GROUP BY o.id ORDER BY o.created_at DESC`
    );
    const orders = result.rows;
    const userIds = [...new Set(orders.map((o) => o.user_id))];
    if (userIds.length > 0) {
      const users = await User.find({ _id: { $in: userIds } }).select('name email');
      const userMap = {};
      users.forEach((u) => { userMap[u._id.toString()] = u; });
      return orders.map((o) => ({
        ...o,
        user_name: userMap[o.user_id]?.name || 'Deleted User',
        user_email: userMap[o.user_id]?.email || '',
      }));
    }
    return orders.map((o) => ({ ...o, user_name: 'Unknown', user_email: '' }));
  },

  updateStatus: async (id, status) => {
    const result = await getPool().query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  },
};

module.exports = { initOrderTable, Order };
