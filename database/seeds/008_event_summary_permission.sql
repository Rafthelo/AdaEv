USE adaev;

INSERT IGNORE INTO permissions (code, module, action, description) VALUES
  ('events:summary', 'events', 'summary', 'Ver resumen consolidado de un evento cerrado');

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'superadmin' AND p.code = 'events:summary';

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'admin' AND p.code = 'events:summary';

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'supervisor' AND p.code = 'events:summary';