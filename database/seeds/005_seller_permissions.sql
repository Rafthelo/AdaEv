-- =====================================================
-- Seed 005: Permisos para tipos de vendedor y pedidos
-- =====================================================

USE adaev;

INSERT IGNORE INTO permissions (code, module, action, description) VALUES
  ('sales:read_all',        'sales', 'read_all',        'Ver todas las ventas de todos los vendedores'),
  ('sales:void_all',        'sales', 'void_all',        'Anular cualquier venta'),
  ('sales:prepare',         'sales', 'prepare',         'Ver cola de pedidos y marcarlos como listos'),
  ('sales:confirm_delivery','sales', 'confirm_delivery','Confirmar entrega de pedido con código');

-- -----------------------------------------------------
-- Asignar a roles administrativos
-- -----------------------------------------------------

-- superadmin: ya tiene todos los permisos automáticamente via seed 004,
-- pero por si se ejecuta este seed después, lo aseguramos:
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'superadmin'
  AND p.code IN ('sales:read_all', 'sales:void_all', 'sales:prepare', 'sales:confirm_delivery');

-- admin: ve todas las ventas, pero NO anula (solo superadmin anula, según definimos)
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'admin'
  AND p.code = 'sales:read_all';

-- supervisor: ve todas las ventas
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'supervisor'
  AND p.code = 'sales:read_all';

-- cashier: puede preparar pedidos (rol genérico usado por bartender/independiente/mesero)
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'cashier'
  AND p.code IN ('sales:prepare', 'sales:confirm_delivery');