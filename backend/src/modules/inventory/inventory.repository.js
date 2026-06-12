const pool = require('../../config/database');
const { getPagination, getPaginationMeta } = require('../../helpers/pagination.helper');

const findAll = async (filters = {}, query = {}) => {
  const { page, limit, offset } = getPagination(query);

  let where = 'WHERE 1=1';
  const params = [];

  if (filters.event_id) {
    where += ' AND i.event_id = ?';
    params.push(filters.event_id);
  }
  if (filters.product_id) {
    where += ' AND i.product_id = ?';
    params.push(filters.product_id);
  }
  if (filters.low_stock) {
    where += ' AND i.quantity <= i.min_stock';
  }

  const [rows] = await pool.execute(
    `SELECT
       i.id, i.product_id, i.event_id, i.quantity, i.min_stock,
       i.updated_at,
       p.name AS product_name, p.sku,
       e.name AS event_name
     FROM inventory i
     JOIN products p     ON i.product_id = p.id
     LEFT JOIN events e  ON i.event_id   = e.id
     ${where}
     ORDER BY p.name ASC
     LIMIT ${limit} OFFSET ${offset}`,
    params
  );

  const [[{ total }]] = await pool.execute(
    `SELECT COUNT(*) AS total FROM inventory i ${where}`,
    params
  );

  return { rows, meta: getPaginationMeta(total, page, limit) };
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT
       i.id, i.product_id, i.event_id, i.quantity, i.min_stock,
       i.created_at, i.updated_at,
       p.name AS product_name, p.sku,
       e.name AS event_name
     FROM inventory i
     JOIN products p    ON i.product_id = p.id
     LEFT JOIN events e ON i.event_id   = e.id
     WHERE i.id = ?`,
    [id]
  );
  return rows[0] || null;
};

const findByProductAndEvent = async (productId, eventId = null) => {
  const [rows] = await pool.execute(
    `SELECT * FROM inventory
     WHERE product_id = ?
       AND (event_id = ? OR (event_id IS NULL AND ? IS NULL))`,
    [productId, eventId, eventId]
  );
  return rows[0] || null;
};

const createOrUpdate = async (productId, eventId, quantity, conn = null) => {
  const db = conn || pool;
  await db.execute(
    `INSERT INTO inventory (product_id, event_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
    [productId, eventId || null, quantity]
  );
  return findByProductAndEvent(productId, eventId);
};

const decrementStock = async (productId, eventId, quantity, conn = null) => {
  const db = conn || pool;
  const [result] = await db.execute(
    `UPDATE inventory
     SET quantity = quantity - ?
     WHERE product_id = ?
       AND (event_id = ? OR (event_id IS NULL AND ? IS NULL))
       AND quantity >= ?`,
    [quantity, productId, eventId || null, eventId || null, quantity]
  );
  return result.affectedRows > 0;
};

const setQuantity = async (productId, eventId, quantity) => {
  await pool.execute(
    `INSERT INTO inventory (product_id, event_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`,
    [productId, eventId || null, quantity]
  );
};

const updateMinStock = async (id, minStock) => {
  await pool.execute(
    `UPDATE inventory SET min_stock = ? WHERE id = ?`,
    [minStock, id]
  );
};

const createMovement = async (data, conn = null) => {
  const db = conn || pool;
  await db.execute(
    `INSERT INTO inventory_movements
       (inventory_id, type, quantity, reason, reference, created_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.inventory_id,
      data.type,
      data.quantity,
      data.reason    || null,
      data.reference || null,
      data.created_by || null,
    ]
  );
};

const getMovements = async (inventoryId, query = {}) => {
  const { page, limit, offset } = getPagination(query);

  const [rows] = await pool.execute(
    `SELECT
       im.id, im.type, im.quantity, im.reason, im.reference,
       im.created_at, u.username AS created_by_username
     FROM inventory_movements im
     LEFT JOIN users u ON im.created_by = u.id
     WHERE im.inventory_id = ?
     ORDER BY im.created_at DESC
     LIMIT ${limit} OFFSET ${offset}`,
    [inventoryId]
  );

  const [[{ total }]] = await pool.execute(
    `SELECT COUNT(*) AS total FROM inventory_movements WHERE inventory_id = ?`,
    [inventoryId]
  );

  return { rows, meta: getPaginationMeta(total, page, limit) };
};

module.exports = {
  findAll, findById, findByProductAndEvent,
  createOrUpdate, decrementStock, setQuantity,
  updateMinStock, createMovement, getMovements,
};