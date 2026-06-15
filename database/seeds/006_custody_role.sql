-- =====================================================
-- Seed 006: Rol y permisos de custodia
-- =====================================================

USE adaev;

-- -----------------------------------------------------
-- Permisos de custodia
-- -----------------------------------------------------
INSERT IGNORE INTO permissions (code, module, action, description) VALUES
  ('custody:create', 'custody', 'create', 'Registrar objetos en custodia'),
  ('custody:read',   'custody', 'read',   'Ver registros de custodia'),
  ('custody:return', 'custody', 'return', 'Marcar objeto como devuelto'),
  ('custody:manage', 'custody', 'manage', 'Gestión completa de custodia (admin)');

-- -----------------------------------------------------
-- Rol custodian
-- -----------------------------------------------------
INSERT IGNORE INTO roles (name, description) VALUES
  ('custodian', 'Operador de custodia de objetos en eventos.');

-- -----------------------------------------------------
-- Permisos del custodian
-- -----------------------------------------------------
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'custodian'
  AND p.code IN (
    'custody:create',
    'custody:read',
    'custody:return',
    'events:read',
    'dashboard:view'
  );

-- -----------------------------------------------------
-- superadmin: agregar permisos de custodia
-- -----------------------------------------------------
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'superadmin'
  AND p.code IN ('custody:create', 'custody:read', 'custody:return', 'custody:manage');

-- -----------------------------------------------------
-- admin: gestión completa de custodia
-- -----------------------------------------------------
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'admin'
  AND p.code IN ('custody:create', 'custody:read', 'custody:return', 'custody:manage');

-- -----------------------------------------------------
-- supervisor: ver y devolver
-- -----------------------------------------------------
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'supervisor'
  AND p.code IN ('custody:read', 'custody:return', 'custody:manage');