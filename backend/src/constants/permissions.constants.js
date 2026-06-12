const PERMISSIONS = {
  // Events
  EVENTS_READ:    'events:read',
  EVENTS_CREATE:  'events:create',
  EVENTS_UPDATE:  'events:update',
  EVENTS_DELETE:  'events:delete',

  // Categories
  CATEGORIES_READ:   'categories:read',
  CATEGORIES_CREATE: 'categories:create',
  CATEGORIES_UPDATE: 'categories:update',
  CATEGORIES_DELETE: 'categories:delete',

  // Products
  PRODUCTS_READ:   'products:read',
  PRODUCTS_CREATE: 'products:create',
  PRODUCTS_UPDATE: 'products:update',
  PRODUCTS_DELETE: 'products:delete',

  // Inventory
  INVENTORY_READ:   'inventory:read',
  INVENTORY_ADJUST: 'inventory:adjust',

  // Sales
  SALES_READ:   'sales:read',
  SALES_CREATE: 'sales:create',
  SALES_VOID:   'sales:void',

  // Cash Register
  CASH_OPEN:     'cash:open',
  CASH_CLOSE:    'cash:close',
  CASH_MOVEMENT: 'cash:movement',
  CASH_READ:     'cash:read',

  // Audit
  AUDIT_READ: 'audit:read',

  // Users
  USERS_MANAGE: 'users:manage',

  // Roles
  ROLES_MANAGE: 'roles:manage',

  // Dashboard
  DASHBOARD_VIEW: 'dashboard:view',
};

module.exports = { PERMISSIONS };