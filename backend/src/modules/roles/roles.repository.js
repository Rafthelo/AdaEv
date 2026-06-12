const pool = require('../../config/database');

const findAll = async () => {
  const [rows] = await pool.execute(
    `SELECT r.id, r.name, r.description, r.is_active, r.created_at,
       COUNT(DISTINCT ur.user_id)    AS total_users,
       COUNT(DISTINCT rp.permission_id) AS total_permissions
     FROM roles r
     LEFT JOIN user_roles ur       ON r.id = ur.role_id
     LEFT JOIN role_permissions rp ON r.id = rp.role_id
     GROUP BY r.id
     ORDER BY r.id ASC`
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, name, description, is_active, created_at, updated_at
     FROM roles WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
};

const findByName = async (name) => {
  const [rows] = await pool.execute(
    `SELECT id FROM roles WHERE name = ?`,
    [name]
  );
  return rows[0] || null;
};

const getRolePermissions = async (roleId) => {
  const [rows] = await pool.execute(
    `SELECT p.id, p.code, p.module, p.action, p.description
     FROM permissions p
     JOIN role_permissions rp ON p.id = rp.permission_id
     WHERE rp.role_id = ?
     ORDER BY p.module, p.action`,
    [roleId]
  );
  return rows;
};

const create = async (data) => {
  const [result] = await pool.execute(
    `INSERT INTO roles (name, description) VALUES (?, ?)`,
    [data.name, data.description || null]
  );
  return result.insertId;
};

const update = async (id, data) => {
  const fields = [];
  const params = [];

  if (typeof data.description !== 'undefined') { fields.push('description = ?'); params.push(data.description); }
  if (typeof data.is_active   !== 'undefined') { fields.push('is_active = ?');   params.push(data.is_active); }

  if (fields.length === 0) return;
  params.push(id);

  await pool.execute(
    `UPDATE roles SET ${fields.join(', ')} WHERE id = ?`,
    params
  );
};

const assignPermissions = async (roleId, permissionIds) => {
  await pool.execute(
    `DELETE FROM role_permissions WHERE role_id = ?`,
    [roleId]
  );
  for (const permId of permissionIds) {
    await pool.execute(
      `INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)`,
      [roleId, permId]
    );
  }
};

module.exports = {
  findAll,
  findById,
  findByName,
  getRolePermissions,
  create,
  update,
  assignPermissions,
};