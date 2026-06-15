const router                = require('express').Router();
const salesController       = require('./sales.controller');
const authMiddleware        = require('../../middlewares/auth.middleware');
const { requirePermission } = require('../../middlewares/permission.middleware');
const validate              = require('../../middlewares/validate.middleware');
const { PERMISSIONS }       = require('../../constants/permissions.constants');
const { createSaleSchema, voidSaleSchema } = require('./sales.validation');

router.get('/',
  authMiddleware,
  requirePermission(PERMISSIONS.SALES_READ),
  salesController.getAll
);

router.get('/stats',
  authMiddleware,
  requirePermission(PERMISSIONS.SALES_READ),
  salesController.getStats
);
router.get('/pending-orders',
  authMiddleware,
  requirePermission(PERMISSIONS.SALES_PREPARE),
  salesController.getPendingOrders
);
router.get('/ready-orders',
  authMiddleware,
  requirePermission(PERMISSIONS.SALES_PREPARE),
  salesController.getReadyOrders
);
router.patch('/:id/ready',
  authMiddleware,
  requirePermission(PERMISSIONS.SALES_PREPARE),
  salesController.markReady
);

router.patch('/:id/deliver',
  authMiddleware,
  requirePermission(PERMISSIONS.SALES_CONFIRM_DELIVERY),
  salesController.confirmDelivery
);
router.get('/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.SALES_READ),
  salesController.getById
);

router.post('/',
  authMiddleware,
  requirePermission(PERMISSIONS.SALES_CREATE),
  validate(createSaleSchema),
  salesController.create
);

router.patch('/:id/void',
  authMiddleware,
  requirePermission(PERMISSIONS.SALES_VOID),
  validate(voidSaleSchema),
  salesController.voidSale
);

module.exports = router;