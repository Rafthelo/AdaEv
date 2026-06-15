const pool = require('../../config/database');
const { getPagination, getPaginationMeta } = require('../../helpers/pagination.helper');

const findAll = async (filters = {}, query = {}) => {
  const { page, limit, offset } = getPagination(query);

  let where = 'WHERE 1=1';
  const params = [];

  if (filters.search) {
    where += ' AND (e.name LIKE ? OR e.location LIKE ?)';
    const s = `%${filters.search}%`;
    params.push(s, s);
  }
  if (filters.status) {
    where += ' AND e.status = ?';
    params.push(filters.status);
  }
  if (typeof filters.is_active !== 'undefined') {
    where += ' AND e.is_active = ?';
    params.push(filters.is_active);
  }

  const [rows] = await pool.execute(
    `SELECT
       e.id, e.name, e.description, e.location,
       e.starts_at, e.ends_at, e.status, e.is_active,
       e.created_at, u.username AS created_by_username
     FROM events e
     LEFT JOIN users u ON e.created_by = u.id
     ${where}
     ORDER BY e.starts_at DESC
     LIMIT ${limit} OFFSET ${offset}`,
    params
  );

  const [[{ total }]] = await pool.execute(
    `SELECT COUNT(*) AS total FROM events e ${where}`,
    params
  );

  return { rows, meta: getPaginationMeta(total, page, limit) };
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT
       e.id, e.name, e.description, e.location,
       e.starts_at, e.ends_at, e.status, e.is_active,
       e.created_at, e.updated_at,
       u.username AS created_by_username
     FROM events e
     LEFT JOIN users u ON e.created_by = u.id
     WHERE e.id = ?`,
    [id]
  );
  return rows[0] || null;
};

const findByName = async (name) => {
  const [rows] = await pool.execute(
    `SELECT id FROM events WHERE name = ?`,
    [name]
  );
  return rows[0] || null;
};

const create = async (data) => {
  const toMysql = (d) => d ? new Date(d).toISOString().slice(0, 19).replace('T', ' ') : null;
  const [result] = await pool.execute(
    `INSERT INTO events (name, description, location, starts_at, ends_at, status, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.description || null,
      data.location    || null,
      toMysql(data.starts_at),
      toMysql(data.ends_at),
      data.status      || 'draft',
      data.created_by  || null,
    ]
  );
  return result.insertId;
};
const update = async (id, data) => {
  const toMysql = (d) => d ? new Date(d).toISOString().slice(0, 19).replace('T', ' ') : null;

  const fields = [];
  const params = [];

  if (typeof data.name        !== 'undefined') { fields.push('name = ?');        params.push(data.name); }
  if (typeof data.description !== 'undefined') { fields.push('description = ?'); params.push(data.description); }
  if (typeof data.location    !== 'undefined') { fields.push('location = ?');    params.push(data.location); }
  if (typeof data.starts_at   !== 'undefined') { fields.push('starts_at = ?');   params.push(toMysql(data.starts_at)); }
  if (typeof data.ends_at     !== 'undefined') { fields.push('ends_at = ?');     params.push(toMysql(data.ends_at)); }
  if (typeof data.status      !== 'undefined') { fields.push('status = ?');      params.push(data.status); }
  if (typeof data.is_active   !== 'undefined') { fields.push('is_active = ?');   params.push(data.is_active); }

  if (fields.length === 0) return;
  params.push(id);

  await pool.execute(
    `UPDATE events SET ${fields.join(', ')} WHERE id = ?`,
    params
  );
};

const getEventProducts = async (eventId) => {
  const [rows] = await pool.execute(
    `SELECT
       ep.id, ep.product_id, ep.price AS event_price, ep.is_active,
       p.name, p.description, p.sku, p.price AS base_price,
       c.name AS category_name
     FROM event_products ep
     JOIN products p    ON ep.product_id = p.id
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE ep.event_id = ?
     ORDER BY p.name ASC`,
    [eventId]
  );
  return rows;
};

const addProduct = async (eventId, data) => {
  const [result] = await pool.execute(
    `INSERT INTO event_products (event_id, product_id, price)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE price = VALUES(price), is_active = 1`,
    [eventId, data.product_id, data.price || null]
  );
  return result.insertId;
};

const removeProduct = async (eventId, productId) => {
  await pool.execute(
    `UPDATE event_products SET is_active = 0
     WHERE event_id = ? AND product_id = ?`,
    [eventId, productId]
  );
};

module.exports = {
  findAll, findById, findByName,
  create, update,
  getEventProducts, addProduct, removeProduct,
};