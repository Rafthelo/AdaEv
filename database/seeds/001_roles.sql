-- =====================================================
-- Seed 001: Roles base del sistema
-- =====================================================

USE adaev;

INSERT IGNORE INTO roles (name, description) VALUES
  ('superadmin', 'Acceso total al sistema. No editable desde UI.'),
  ('admin',      'Gestión completa excepto configuración de sistema.'),
  ('supervisor', 'Ventas, inventario, caja y reportes.'),
  ('cashier',    'Registro de ventas y manejo de caja.'),
  ('viewer',     'Solo lectura general.');