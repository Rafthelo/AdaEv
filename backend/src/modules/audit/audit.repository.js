const pool = require('../../config/database');
const { getPagination, getPaginationMeta } = require('../../helpers/pagination.helper');

const create = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO audit_logs
      (user_id, action, entity, entity_id, old_values, new_values, ip_address, user_agent, metadata)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.user_id    || null,
      data.action,
      data.entity,
      data.entity_id  || null,
      data.old_values ? JSON.stringify(data.old_values) : null,
      data.new_values ? JSON.stringify(data.new_values) : null,
      data.ip_address || null,
      data.user_agent || null,
      data.metadata   ? JSON.stringify(data.metadata)   : null,
    ]
  );
  return result.insertId;
};

const findAll = async (filters = {}, query = {}) => {
  const { page, limit, offset } = getPagination(query);

  let where = 'WHERE 1=1';
  const params = [];

  if (filters.user_id) {
    where += ' AND al.user_id = ?';
    params.push(filters.user_id);
  }
  if (filters.entity) {
    where += ' AND al.entity = ?';
    params.push(filters.entity);
  }
  if (filters.action) {
    where += ' AND al.action LIKE ?';
    params.push(`%${filters.action}%`);
  }
  if (filters.from) {
    where += ' AND al.created_at >= ?';
    params.push(filters.from);
  }
  if (filters.to) {
    where += ' AND al.created_at <= ?';
    params.push(filters.to);
  }

  const [rows] = await pool.execute(
    `SELECT
       al.id, al.action, al.entity, al.entity_id,
       al.ip_address, al.created_at,
       u.username
     FROM audit_logs al
     LEFT JOIN users u ON al.user_id = u.id
     ${where}
     ORDER BY al.created_at DESC
     LIMIT ${limit} OFFSET ${offset}`,
    params
  );

  const [[{ total }]] = await pool.execute(
    `SELECT COUNT(*) AS total FROM audit_logs al ${where}`,
    params
  );

  return { rows, meta: getPaginationMeta(total, page, limit) };
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT
       al.*,
       u.username
     FROM audit_logs al
     LEFT JOIN users u ON al.user_id = u.id
     WHERE al.id = ?`,
    [id]
  );
  return rows[0] || null;
};

module.exports = { create, findAll, findById };