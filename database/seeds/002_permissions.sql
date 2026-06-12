-- =====================================================
-- Seed 002: Permisos atómicos del sistema
-- =====================================================

USE adaev;

INSERT IGNORE INTO permissions (code, module, action, description) VALUES
  -- Events
  ('events:read',        'events',     'read',    'Ver listado y detalle de eventos'),
  ('events:create',      'events',     'create',  'Crear nuevos eventos'),
  ('events:update',      'events',     'update',  'Editar eventos existentes'),
  ('events:delete',      'events',     'delete',  'Eliminar o desactivar eventos'),

  -- Categories
  ('categories:read',    'categories', 'read',    'Ver categorías'),
  ('categories:create',  'categories', 'create',  'Crear categorías'),
  ('categories:update',  'categories', 'update',  'Editar categorías'),
  ('categories:delete',  'categories', 'delete',  'Eliminar categorías'),

  -- Products
  ('products:read',      'products',   'read',    'Ver catálogo de productos'),
  ('products:create',    'products',   'create',  'Agregar nuevos productos'),
  ('products:update',    'products',   'update',  'Editar productos existentes'),
  ('products:delete',    'products',   'delete',  'Eliminar o desactivar productos'),

  -- Inventory
  ('inventory:read',     'inventory',  'read',    'Ver stock actual'),
  ('inventory:adjust',   'inventory',  'adjust',  'Realizar ajustes de inventario'),

  -- Sales
  ('sales:read',         'sales',      'read',    'Ver historial de ventas'),
  ('sales:create',       'sales',      'create',  'Registrar nuevas ventas'),
  ('sales:void',         'sales',      'void',    'Anular ventas'),

  -- Cash Register
  ('cash:read',          'cash',       'read',    'Ver sesiones y movimientos de caja'),
  ('cash:open',          'cash',       'open',    'Abrir sesión de caja'),
  ('cash:close',         'cash',       'close',   'Cerrar sesión de caja'),
  ('cash:movement',      'cash',       'movement','Registrar movimientos de caja'),

  -- Audit
  ('audit:read',         'audit',      'read',    'Ver registros de auditoría'),

  -- Users
  ('users:manage',       'users',      'manage',  'Crear, editar y desactivar usuarios'),

  -- Roles
  ('roles:manage',       'roles',      'manage',  'Gestionar roles y asignar permisos'),

  -- Dashboard
  ('dashboard:view',     'dashboard',  'view',    'Acceder al panel de control');