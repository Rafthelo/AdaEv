const pool = require('../../config/database');
const { getPagination, getPaginationMeta } = require('../../helpers/pagination.helper');

const findAll = async (filters = {}, query = {}) => {
  const { page, limit, offset } = getPagination(query);

  let where = 'WHERE 1=1';
  const params = [];

  if (filters.search) {
    where += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
    const s = `%${filters.search}%`;
    params.push(s, s);
  }
  if (filters.category_id) {
    where += ' AND p.category_id = ?';
    params.push(filters.category_id);
  }
  if (typeof filters.is_active !== 'undefined') {
    where += ' AND p.is_active = ?';
    params.push(filters.is_active);
  }

  const [rows] = await pool.execute(
    `SELECT
       p.id, p.name, p.description, p.sku, p.price,
       p.category_id, p.is_active, p.created_at,
       c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     ${where}
     ORDER BY p.name ASC
     LIMIT ${limit} OFFSET ${offset}`,
    params
  );

  const [[{ total }]] = await pool.execute(
    `SELECT COUNT(*) AS total FROM products p ${where}`,
    params
  );

  return { rows, meta: getPaginationMeta(total, page, limit) };
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT
       p.id, p.name, p.description, p.sku, p.price,
       p.category_id, p.is_active, p.created_at, p.updated_at,
       c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = ?`,
    [id]
  );
  return rows[0] || null;
};

const findBySku = async (sku) => {
  const [rows] = await pool.execute(
    `SELECT id FROM products WHERE sku = ?`,
    [sku]
  );
  return rows[0] || null;
};

const create = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO products (name, description, sku, price, category_id, created_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.description || null,
      data.sku         || null,
      data.price,
      data.category_id || null,
      data.created_by  || null,
    ]
  );
  return result.insertId;
};

const update = async (id, data) => {
  const fields = [];
  const params = [];

  if (typeof data.name        !== 'undefined') { fields.push('name = ?');        params.push(data.name); }
  if (typeof data.description !== 'undefined') { fields.push('description = ?'); params.push(data.description); }
  if (typeof data.sku         !== 'undefined') { fields.push('sku = ?');         params.push(data.sku); }
  if (typeof data.price       !== 'undefined') { fields.push('price = ?');       params.push(data.price); }
  if (typeof data.category_id !== 'undefined') { fields.push('category_id = ?'); params.push(data.category_id); }
  if (typeof data.is_active   !== 'undefined') { fields.push('is_active = ?');   params.push(data.is_active); }

  if (fields.length === 0) return;
  params.push(id);

  await pool.execute(
    `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
    params
  );
};

module.exports = { findAll, findById, findBySku, create, update };