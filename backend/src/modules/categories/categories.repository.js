const pool = require('../../config/database');

const findAll = async (filters = {}) => {
  let where = 'WHERE 1=1';
  const params = [];

  if (typeof filters.is_active !== 'undefined') {
    where += ' AND c.is_active = ?';
    params.push(filters.is_active);
  }
  if (filters.parent_id === 'null') {
    where += ' AND c.parent_id IS NULL';
  } else if (filters.parent_id) {
    where += ' AND c.parent_id = ?';
    params.push(filters.parent_id);
  }

  const [rows] = await pool.execute(
    `SELECT
       c.id, c.name, c.description, c.parent_id, c.is_active, c.created_at,
       p.name AS parent_name
     FROM categories c
     LEFT JOIN categories p ON c.parent_id = p.id
     ${where}
     ORDER BY c.parent_id ASC, c.name ASC`,
    params
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT
       c.id, c.name, c.description, c.parent_id, c.is_active,
       c.created_at, c.updated_at,
       p.name AS parent_name
     FROM categories c
     LEFT JOIN categories p ON c.parent_id = p.id
     WHERE c.id = ?`,
    [id]
  );
  return rows[0] || null;
};

const findByName = async (name, parentId = null) => {
  const [rows] = await pool.execute(
    `SELECT id FROM categories
     WHERE name = ? AND (parent_id = ? OR (parent_id IS NULL AND ? IS NULL))`,
    [name, parentId, parentId]
  );
  return rows[0] || null;
};

const create = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO categories (name, description, parent_id)
     VALUES (?, ?, ?)`,
    [data.name, data.description || null, data.parent_id || null]
  );
  return result.insertId;
};

const update = async (id, data) => {
  const fields = [];
  const params = [];

  if (typeof data.name        !== 'undefined') { fields.push('name = ?');        params.push(data.name); }
  if (typeof data.description !== 'undefined') { fields.push('description = ?'); params.push(data.description); }
  if (typeof data.parent_id   !== 'undefined') { fields.push('parent_id = ?');   params.push(data.parent_id); }
  if (typeof data.is_active   !== 'undefined') { fields.push('is_active = ?');   params.push(data.is_active); }

  if (fields.length === 0) return;
  params.push(id);

  await pool.execute(
    `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
    params
  );
};

const getChildren = async (parentId) => {
  const [rows] = await pool.execute(
    `SELECT id FROM categories WHERE parent_id = ?`,
    [parentId]
  );
  return rows;
};

module.exports = { findAll, findById, findByName, create, update, getChildren };