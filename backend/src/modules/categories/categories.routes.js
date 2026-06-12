const router                = require('express').Router();
const categoriesController  = require('./categories.controller');
const authMiddleware        = require('../../middlewares/auth.middleware');
const { requirePermission } = require('../../middlewares/permission.middleware');
const { PERMISSIONS }       = require('../../constants/permissions.constants');

router.get('/',
  authMiddleware,
  requirePermission(PERMISSIONS.CATEGORIES_READ),
  categoriesController.getAll
);

router.get('/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.CATEGORIES_READ),
  categoriesController.getById
);

router.post('/',
  authMiddleware,
  requirePermission(PERMISSIONS.CATEGORIES_CREATE),
  categoriesController.create
);

router.put('/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.CATEGORIES_UPDATE),
  categoriesController.update
);

router.patch('/:id/deactivate',
  authMiddleware,
  requirePermission(PERMISSIONS.CATEGORIES_DELETE),
  categoriesController.deactivate
);

module.exports = router;