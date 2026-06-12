const pool = require('../../config/database');

const findAll = async (filters = {}) => {
  let where = 'WHERE 1=1';
  const params = [];

  if (filters.module) {
    where += ' AND module = ?';
    params.push(filters.module);
  }

  const [rows] = await pool.execute(
    `SELECT id, code, module, action, description, created_at
     FROM permissions
     ${where}
     ORDER BY module ASC, action ASC`,
    params
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, code, module, action, description, created_at
     FROM permissions WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
};

const findByCode = async (code) => {
  const [rows] = await pool.execute(
    `SELECT id FROM permissions WHERE code = ?`,
    [code]
  );
  return rows[0] || null;
};

const getModules = async () => {
  const [rows] = await pool.execute(
    `SELECT DISTINCT module FROM permissions ORDER BY module ASC`
  );
  return rows.map((r) => r.module);
};

module.exports = { findAll, findById, findByCode, getModules };