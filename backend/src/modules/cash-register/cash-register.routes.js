const router                = require('express').Router();
const cashController        = require('./cash-register.controller');
const authMiddleware        = require('../../middlewares/auth.middleware');
const { requirePermission } = require('../../middlewares/permission.middleware');
const validate              = require('../../middlewares/validate.middleware');
const { PERMISSIONS }       = require('../../constants/permissions.constants');
const {
  createRegisterSchema,
  openSessionSchema,
  closeSessionSchema,
  movementSchema,
} = require('./cash-register.validation');

// === Registers ===
router.get('/registers',
  authMiddleware,
  requirePermission(PERMISSIONS.CASH_READ),
  cashController.getAllRegisters
);

router.post('/registers',
  authMiddleware,
  requirePermission(PERMISSIONS.CASH_OPEN),
  validate(createRegisterSchema),
  cashController.createRegister
);

// === Sessions ===
router.get('/sessions',
  authMiddleware,
  requirePermission(PERMISSIONS.CASH_READ),
  cashController.getAllSessions
);

router.get('/sessions/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.CASH_READ),
  cashController.getSessionById
);

router.post('/sessions/open',
  authMiddleware,
  requirePermission(PERMISSIONS.CASH_OPEN),
  validate(openSessionSchema),
  cashController.openSession
);

router.patch('/sessions/:id/close',
  authMiddleware,
  requirePermission(PERMISSIONS.CASH_CLOSE),
  validate(closeSessionSchema),
  cashController.closeSession
);

// === Movements ===
router.post('/movements',
  authMiddleware,
  requirePermission(PERMISSIONS.CASH_MOVEMENT),
  validate(movementSchema),
  cashController.createMovement
);

router.get('/sessions/:id/movements',
  authMiddleware,
  requirePermission(PERMISSIONS.CASH_READ),
  cashController.getMovements
);

module.exports = router;