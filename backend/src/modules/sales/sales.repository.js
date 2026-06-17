const pool = require('../../config/database');
const { getPagination, getPaginationMeta } = require('../../helpers/pagination.helper');

const findAll = async (filters = {}, query = {}) => {
  const { page, limit, offset } = getPagination(query);

  let where = 'WHERE 1=1';
  const params = [];

  if (filters.event_id) {
    where += ' AND s.event_id = ?';
    params.push(filters.event_id);
  }
  if (filters.user_id) {
    where += ' AND s.user_id = ?';
    params.push(filters.user_id);
  }
  if (filters.status) {
    where += ' AND s.status = ?';
    params.push(filters.status);
  }
  if (filters.from) {
    where += ' AND s.created_at >= ?';
    params.push(filters.from);
  }
  if (filters.to) {
    where += ' AND s.created_at <= ?';
    params.push(filters.to);
  }

const [rows] = await pool.execute(
  `SELECT
     s.id, s.event_id, s.user_id, s.total, s.status,
     s.order_status, s.confirmation_code, s.display_code,
     s.notes, s.created_at,
     u.username AS cashier_username,
     e.name AS event_name,
     (SELECT GROUP_CONCAT(p.sku SEPARATOR ', ')
        FROM sale_items si
        JOIN products p ON si.product_id = p.id
        WHERE si.sale_id = s.id) AS product_codes
   FROM sales s
   LEFT JOIN users u  ON s.user_id  = u.id
   LEFT JOIN events e ON s.event_id = e.id
   ${where}
   ORDER BY s.created_at DESC
   LIMIT ${limit} OFFSET ${offset}`,
  params
);

  const [[{ total }]] = await pool.execute(
    `SELECT COUNT(*) AS total FROM sales s ${where}`,
    params
  );

  return { rows, meta: getPaginationMeta(total, page, limit) };
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT
       s.id, s.event_id, s.user_id, s.total, s.status,
       s.order_status, s.confirmation_code, s.display_code, s.prepared_by, s.ready_at, s.delivered_at,
       s.notes, s.voided_at, s.void_reason, s.created_at, s.updated_at,
       u.username  AS cashier_username,
       e.name      AS event_name,
       vu.username AS voided_by_username
     FROM sales s
     LEFT JOIN users u  ON s.user_id   = u.id
     LEFT JOIN events e ON s.event_id  = e.id
     LEFT JOIN users vu ON s.voided_by = vu.id
     WHERE s.id = ?`,
    [id]
  );
  return rows[0] || null;
};

const getSaleItems = async (saleId) => {
  const [rows] = await pool.execute(
    `SELECT
       si.id, si.product_id, si.quantity, si.unit_price, si.subtotal,
       p.name AS product_name, p.sku
     FROM sale_items si
     LEFT JOIN products p ON si.product_id = p.id
     WHERE si.sale_id = ?`,
    [saleId]
  );
  return rows;
};

const create = async (data, conn = null) => {
  const db = conn || pool;

  let displayCode = null;
  if (data.event_id) {
    const [[eventData]] = await db.execute(
      `SELECT prefix FROM events WHERE id = ?`,
      [data.event_id]
    );
    if (eventData?.prefix) {
      const [[countData]] = await db.execute(
        `SELECT COUNT(*) AS cnt FROM sales WHERE event_id = ?`,
        [data.event_id]
      );
      const nextNum = parseInt(countData.cnt) + 1;
      displayCode = `${eventData.prefix}V-${String(nextNum).padStart(6, '0')}`;
    }
  }

  const [result] = await db.execute(
    `INSERT INTO sales (event_id, user_id, total, status, order_status, notes, display_code)
     VALUES (?, ?, ?, 'completed', ?, ?, ?)`,
    [
      data.event_id || null,
      data.user_id,
      data.total,
      data.order_status || 'completed',
      data.notes    || null,
      displayCode,
    ]
  );
  return result.insertId;
};

const createItems = async (saleId, items, conn = null) => {
  const db = conn || pool;
  for (const item of items) {
    await db.execute(
      `INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
       VALUES (?, ?, ?, ?, ?)`,
      [saleId, item.product_id, item.quantity, item.unit_price, item.subtotal]
    );
  }
};

const voidSale = async (id, voidedBy, voidReason, conn = null) => {
  const db = conn || pool;
  await db.execute(
    `UPDATE sales
     SET status = 'voided', voided_by = ?, voided_at = NOW(), void_reason = ?
     WHERE id = ?`,
    [voidedBy, voidReason, id]
  );
};

const getSaleStats = async (eventId = null) => {
  let where = 'WHERE s.status = "completed"';
  const params = [];

  if (eventId) {
    where += ' AND s.event_id = ?';
    params.push(eventId);
  }

  const [[stats]] = await pool.execute(
    `SELECT
       COUNT(*)        AS total_sales,
       SUM(s.total)    AS total_revenue,
       AVG(s.total)    AS avg_sale
     FROM sales s
     ${where}`,
    params
  );
  return stats;
};
const findPendingOrders = async (eventId) => {
  const [rows] = await pool.execute(
    `SELECT
       s.id, s.total, s.notes, s.created_at,
       u.username AS waiter_username,
       (SELECT GROUP_CONCAT(CONCAT(si.quantity, 'x ', p.name) SEPARATOR ', ')
          FROM sale_items si
          JOIN products p ON si.product_id = p.id
          WHERE si.sale_id = s.id) AS items_summary
     FROM sales s
     LEFT JOIN users u ON s.user_id = u.id
     WHERE s.order_status = 'pending'
       AND s.event_id = ?
     ORDER BY s.created_at ASC`,
    [eventId]
  );
  return rows;
};
const findReadyOrders = async (eventId) => {
  const [rows] = await pool.execute(
    `SELECT
       s.id, s.total, s.confirmation_code, s.ready_at,
       u.username AS waiter_username,
       (SELECT GROUP_CONCAT(CONCAT(si.quantity, 'x ', p.name) SEPARATOR ', ')
          FROM sale_items si
          JOIN products p ON si.product_id = p.id
          WHERE si.sale_id = s.id) AS items_summary
     FROM sales s
     LEFT JOIN users u ON s.user_id = u.id
     WHERE s.order_status = 'ready'
       AND s.event_id = ?
     ORDER BY s.ready_at ASC`,
    [eventId]
  );
  return rows;
};
const markReady = async (id, preparedBy, code) => {
  await pool.execute(
    `UPDATE sales
     SET order_status = 'ready',
         confirmation_code = ?,
         prepared_by = ?,
         ready_at = NOW()
     WHERE id = ? AND order_status = 'pending'`,
    [code, preparedBy, id]
  );
};

const markDelivered = async (id) => {
  await pool.execute(
    `UPDATE sales
     SET order_status = 'delivered',
         delivered_at = NOW()
     WHERE id = ?`,
    [id]
  );
};
module.exports = {
  findAll, findById, getSaleItems,
  create, createItems, voidSale, getSaleStats,
  findPendingOrders, findReadyOrders, markReady, markDelivered,
};