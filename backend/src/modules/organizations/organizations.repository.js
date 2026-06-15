const pool = require('../../config/database');

const findAll = async (filters = {}) => {
  let where = 'WHERE 1=1';
  const params = [];

  if (filters.search) {
    where += ' AND (name LIKE ? OR type LIKE ?)';
    const s = `%${filters.search}%`;
    params.push(s, s);
  }
  if (typeof filters.is_active !== 'undefined') {
    where += ' AND is_active = ?';
    params.push(filters.is_active);
  }

  const [rows] = await pool.execute(
    `SELECT id, name, type, contact, phone, observations, is_active, created_at
     FROM organizations ${where} ORDER BY name ASC`,
    params
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT * FROM organizations WHERE id = ?`, [id]
  );
  return rows[0] || null;
};

const create = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO organizations (name, type, contact, phone, observations)
     VALUES (?, ?, ?, ?, ?)`,
    [data.name, data.type || null, data.contact || null, data.phone || null, data.observations || null]
  );
  return result.insertId;
};

const update = async (id, data) => {
  const fields = [];
  const params = [];

  if (typeof data.name         !== 'undefined') { fields.push('name = ?');         params.push(data.name); }
  if (typeof data.type         !== 'undefined') { fields.push('type = ?');         params.push(data.type); }
  if (typeof data.contact      !== 'undefined') { fields.push('contact = ?');      params.push(data.contact); }
  if (typeof data.phone        !== 'undefined') { fields.push('phone = ?');        params.push(data.phone); }
  if (typeof data.observations !== 'undefined') { fields.push('observations = ?'); params.push(data.observations); }
  if (typeof data.is_active    !== 'undefined') { fields.push('is_active = ?');    params.push(data.is_active); }

  if (fields.length === 0) return;
  params.push(id);
  await pool.execute(`UPDATE organizations SET ${fields.join(', ')} WHERE id = ?`, params);
};

module.exports = { findAll, findById, create, update };