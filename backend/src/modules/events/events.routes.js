const router                = require('express').Router();
const eventsController      = require('./events.controller');
const authMiddleware        = require('../../middlewares/auth.middleware');
const { requirePermission } = require('../../middlewares/permission.middleware');
const validate              = require('../../middlewares/validate.middleware');
const { PERMISSIONS }       = require('../../constants/permissions.constants');
const { createEventSchema, updateEventSchema, addProductSchema } = require('./events.validation');

router.get('/',
  authMiddleware,
  requirePermission(PERMISSIONS.EVENTS_READ),
  eventsController.getAll
);

router.get('/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.EVENTS_READ),
  eventsController.getById
);

router.post('/',
  authMiddleware,
  requirePermission(PERMISSIONS.EVENTS_CREATE),
  validate(createEventSchema),
  eventsController.create
);

router.put('/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.EVENTS_UPDATE),
  validate(updateEventSchema),
  eventsController.update
);

router.get('/:id/products',
  authMiddleware,
  requirePermission(PERMISSIONS.EVENTS_READ),
  eventsController.getEventProducts
);

router.post('/:id/products',
  authMiddleware,
  requirePermission(PERMISSIONS.EVENTS_UPDATE),
  validate(addProductSchema),
  eventsController.addProduct
);

router.delete('/:id/products/:productId',
  authMiddleware,
  requirePermission(PERMISSIONS.EVENTS_UPDATE),
  eventsController.removeProduct
);

module.exports = router;