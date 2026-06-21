-- =====================================================
-- Seed 009: Permisos del módulo de Seminarios
-- =====================================================

USE adaev;

INSERT IGNORE INTO permissions (code, module, action, description) VALUES
  ('seminar:read',   'seminar', 'read',   'Ver temas e inscripciones de seminarios'),
  ('seminar:create', 'seminar', 'create', 'Crear temas y registrar inscripciones'),
  ('seminar:update', 'seminar', 'update', 'Editar inscripciones y habilitar certificados'),
  ('seminar:delete', 'seminar', 'delete', 'Eliminar inscripciones'),
  ('seminar:deliver','seminar', 'deliver','Registrar entrega de certificados');

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'superadmin' AND p.module = 'seminar';

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'admin' AND p.module = 'seminar';

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'supervisor' AND p.code IN ('seminar:read', 'seminar:deliver');