-- =====================================================
-- Seed 004: Asignación de permisos a roles
-- =====================================================

USE adaev;

-- -----------------------------------------------------
-- superadmin: todos los permisos
-- -----------------------------------------------------
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'superadmin';

-- -----------------------------------------------------
-- admin: todos excepto roles:manage
-- -----------------------------------------------------
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'admin'
  AND p.code != 'roles:manage';

-- -----------------------------------------------------
-- supervisor: ventas, inventario, caja, reportes
-- -----------------------------------------------------
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'supervisor'
  AND p.code IN (
    'events:read',
    'categories:read',
    'products:read',
    'products:create',
    'products:update',
    'inventory:read',
    'inventory:adjust',
    'sales:read',
    'sales:create',
    'sales:void',
    'cash:read',
    'cash:open',
    'cash:close',
    'cash:movement',
    'dashboard:view'
  );

-- -----------------------------------------------------
-- cashier: ventas y caja
-- -----------------------------------------------------
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'cashier'
  AND p.code IN (
    'events:read',
    'products:read',
    'inventory:read',
    'sales:create',
    'sales:read',
    'cash:open',
    'cash:close',
    'cash:movement',
    'cash:read',
    'dashboard:view'
  );

-- -----------------------------------------------------
-- viewer: solo lectura
-- -----------------------------------------------------
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'viewer'
  AND p.code IN (
    'events:read',
    'categories:read',
    'products:read',
    'inventory:read',
    'sales:read',
    'cash:read',
    'dashboard:view'
  );