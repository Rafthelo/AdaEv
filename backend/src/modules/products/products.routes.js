const router                = require('express').Router();
const productsController    = require('./products.controller');
const authMiddleware        = require('../../middlewares/auth.middleware');
const { requirePermission } = require('../../middlewares/permission.middleware');
const validate              = require('../../middlewares/validate.middleware');
const { PERMISSIONS }       = require('../../constants/permissions.constants');
const { createProductSchema, updateProductSchema } = require('./products.validation');

router.get('/',
  authMiddleware,
  requirePermission(PERMISSIONS.PRODUCTS_READ),
  productsController.getAll
);

router.get('/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.PRODUCTS_READ),
  productsController.getById
);

router.post('/',
  authMiddleware,
  requirePermission(PERMISSIONS.PRODUCTS_CREATE),
  validate(createProductSchema),
  productsController.create
);

router.put('/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.PRODUCTS_UPDATE),
  validate(updateProductSchema),
  productsController.update
);

router.patch('/:id/deactivate',
  authMiddleware,
  requirePermission(PERMISSIONS.PRODUCTS_DELETE),
  productsController.deactivate
);

module.exports = router;