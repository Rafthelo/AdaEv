const router                = require('express').Router();
const inventoryController   = require('./inventory.controller');
const authMiddleware        = require('../../middlewares/auth.middleware');
const { requirePermission } = require('../../middlewares/permission.middleware');
const validate              = require('../../middlewares/validate.middleware');
const { PERMISSIONS }       = require('../../constants/permissions.constants');
const { adjustStockSchema, setMinStockSchema } = require('./inventory.validation');

router.get('/',
  authMiddleware,
  requirePermission(PERMISSIONS.INVENTORY_READ),
  inventoryController.getAll
);

router.get('/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.INVENTORY_READ),
  inventoryController.getById
);

router.post('/adjust',
  authMiddleware,
  requirePermission(PERMISSIONS.INVENTORY_ADJUST),
  validate(adjustStockSchema),
  inventoryController.adjust
);

router.patch('/:id/min-stock',
  authMiddleware,
  requirePermission(PERMISSIONS.INVENTORY_ADJUST),
  validate(setMinStockSchema),
  inventoryController.setMinStock
);

router.get('/:id/movements',
  authMiddleware,
  requirePermission(PERMISSIONS.INVENTORY_READ),
  inventoryController.getMovements
);

module.exports = router;