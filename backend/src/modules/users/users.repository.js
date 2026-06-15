const pool = require('../../config/database');
const { getPagination, getPaginationMeta } = require('../../helpers/pagination.helper');

const findAll = async (filters = {}, query = {}) => {
  const { page, limit, offset } = getPagination(query);

  let where = 'WHERE u.deleted_at IS NULL';
  const params = [];

  if (filters.search) {
    where += ' AND (u.username LIKE ? OR u.email LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)';
    const s = `%${filters.search}%`;
    params.push(s, s, s, s);
  }
  if (typeof filters.is_active !== 'undefined') {
    where += ' AND u.is_active = ?';
    params.push(filters.is_active);
  }

  const [rows] = await pool.execute(
    `SELECT
      u.id, u.username, u.email, u.first_name, u.last_name,
      u.seller_type, u.assigned_event_id,
      e.name AS assigned_event_name,
      u.is_active, u.last_login_at, u.created_at
    FROM users u
    LEFT JOIN events e ON u.assigned_event_id = e.id
    ${where}
    ORDER BY u.created_at DESC
    LIMIT ${limit} OFFSET ${offset}`,
    params
  );

  const [[{ total }]] = await pool.execute(
    `SELECT COUNT(*) AS total FROM users u ${where}`,
    params
  );

  return { rows, meta: getPaginationMeta(total, page, limit) };
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT
       u.id, u.username, u.email, u.first_name, u.last_name,
       u.seller_type, u.assigned_event_id,
       e.name AS assigned_event_name,
       u.is_active, u.last_login_at, u.created_at, u.updated_at
     FROM users u
     LEFT JOIN events e ON u.assigned_event_id = e.id
     WHERE u.id = ? AND u.deleted_at IS NULL`,
    [id]
  );
  return rows[0] || null;
};

const findByUsername = async (username) => {
const [rows] = await pool.execute(
  `SELECT id FROM users WHERE username = ? AND deleted_at IS NULL`,
  [username]
);
  return rows[0] || null;
};

const findByEmail = async (email) => {
const [rows] = await pool.execute(
  `SELECT id FROM users WHERE email = ? AND deleted_at IS NULL`,
  [email]
);
  return rows[0] || null;
};

const create = async (data, conn = null) => {
  const db = conn || pool;
  const [result] = await db.execute(
    `INSERT INTO users (username, email, password_hash, first_name, last_name, seller_type, assigned_event_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.username, data.email, data.password_hash, data.first_name, data.last_name,
      data.seller_type || null, data.assigned_event_id || null,
    ]
  );
  return result.insertId;
};

const update = async (id, data) => {
  const fields = [];
  const params = [];

  if (typeof data.email      !== 'undefined') { fields.push('email = ?');      params.push(data.email); }
  if (typeof data.first_name !== 'undefined') { fields.push('first_name = ?'); params.push(data.first_name); }
  if (typeof data.last_name  !== 'undefined') { fields.push('last_name = ?');  params.push(data.last_name); }
  if (typeof data.is_active  !== 'undefined') { fields.push('is_active = ?');  params.push(data.is_active); }
  if (typeof data.password_hash !== 'undefined') { fields.push('password_hash = ?'); params.push(data.password_hash); }
  if (typeof data.seller_type !== 'undefined') { fields.push('seller_type = ?'); params.push(data.seller_type || null); }
  if (typeof data.assigned_event_id !== 'undefined') { fields.push('assigned_event_id = ?'); params.push(data.assigned_event_id || null); }

  if (fields.length === 0) return;

  params.push(id);
  await pool.execute(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    params
  );
};

const assignRoles = async (userId, roleIds, conn = null) => {
  const db = conn || pool;
  await db.execute(`DELETE FROM user_roles WHERE user_id = ?`, [userId]);
  for (const roleId of roleIds) {
    await db.execute(
      `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
      [userId, roleId]
    );
  }
};

const getUserRoles = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT r.id, r.name, r.description
     FROM roles r
     JOIN user_roles ur ON r.id = ur.role_id
     WHERE ur.user_id = ?`,
    [userId]
  );
  return rows;
};

const findPasswordHash = async (id) => {
  const [rows] = await pool.execute(
    `SELECT password_hash FROM users WHERE id = ?`,
    [id]
  );
  return rows[0]?.password_hash || null;
};
const softDelete = async (id) => {
  await pool.execute(
    `UPDATE users SET deleted_at = NOW() WHERE id = ?`,
    [id]
  );
};
module.exports = {
  findAll, findById, findByUsername, findByEmail,
  create, update, assignRoles, getUserRoles,
  findPasswordHash, softDelete,
};