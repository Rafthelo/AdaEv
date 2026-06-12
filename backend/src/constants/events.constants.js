const EVENT_STATUS = {
  DRAFT:     'draft',
  ACTIVE:    'active',
  PAUSED:    'paused',
  CLOSED:    'closed',
  CANCELLED: 'cancelled',
};

const INVENTORY_MOVEMENT_TYPE = {
  IN:         'in',
  OUT:        'out',
  ADJUSTMENT: 'adjustment',
  RETURN:     'return',
};

const SALE_STATUS = {
  COMPLETED: 'completed',
  VOIDED:    'voided',
  PENDING:   'pending',
};

const CASH_MOVEMENT_TYPE = {
  OPEN:       'open',
  CLOSE:      'close',
  IN:         'in',
  OUT:        'out',
  ADJUSTMENT: 'adjustment',
};

const CASH_SESSION_STATUS = {
  OPEN:   'open',
  CLOSED: 'closed',
};

module.exports = {
  EVENT_STATUS,
  INVENTORY_MOVEMENT_TYPE,
  SALE_STATUS,
  CASH_MOVEMENT_TYPE,
  CASH_SESSION_STATUS,
};