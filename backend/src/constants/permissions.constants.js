const PERMISSIONS = {
  // Events
  EVENTS_READ:    'events:read',
  EVENTS_CREATE:  'events:create',
  EVENTS_UPDATE:  'events:update',
  EVENTS_DELETE:  'events:delete',
  EVENTS_SUMMARY: 'events:summary',

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
  SALES_READ_ALL: 'sales:read_all',
  SALES_VOID_ALL: 'sales:void_all',
  SALES_PREPARE: 'sales:prepare',
  SALES_CONFIRM_DELIVERY: 'sales:confirm_delivery',
  
  // Custody
  CUSTODY_CREATE: 'custody:create',
  CUSTODY_READ:   'custody:read',
  CUSTODY_RETURN: 'custody:return',
  CUSTODY_MANAGE: 'custody:manage',

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

  // Gestion financiera
  FINANCE_READ:          'finance:read',
  FINANCE_CREATE:        'finance:create',
  FINANCE_DELETE:        'finance:delete',
  FINANCE_SUMMARY:       'finance:summary',
  ORGANIZATIONS_READ:    'organizations:read',
  ORGANIZATIONS_MANAGE:  'organizations:manage',
};

module.exports = { PERMISSIONS };