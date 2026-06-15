-- =====================================================
-- Seed 007: Permisos de Gestión Financiera
-- =====================================================

USE adaev;

INSERT IGNORE INTO permissions (code, module, action, description) VALUES
  ('finance:read',         'finance', 'read',         'Ver movimientos financieros'),
  ('finance:create',       'finance', 'create',       'Registrar movimientos financieros'),
  ('finance:delete',       'finance', 'delete',       'Eliminar movimientos financieros'),
  ('finance:summary',      'finance', 'summary',      'Ver resumen financiero del evento'),
  ('organizations:read',   'finance', 'org_read',     'Ver organizaciones'),
  ('organizations:manage', 'finance', 'org_manage',   'Gestionar organizaciones');

-- superadmin: todos los permisos financieros
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'superadmin'
  AND p.code IN (
    'finance:read', 'finance:create', 'finance:delete',
    'finance:summary', 'organizations:read', 'organizations:manage'
  );

-- admin: crear, ver y resumen (no eliminar)
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'admin'
  AND p.code IN (
    'finance:read', 'finance:create',
    'finance:summary', 'organizations:read', 'organizations:manage'
  );

-- supervisor: ver y resumen
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'supervisor'
  AND p.code IN (
    'finance:read', 'finance:summary', 'organizations:read'
  );