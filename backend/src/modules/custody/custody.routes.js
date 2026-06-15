const router                = require('express').Router();
const custodyController     = require('./custody.controller');
const authMiddleware        = require('../../middlewares/auth.middleware');
const { requirePermission } = require('../../middlewares/permission.middleware');
const { PERMISSIONS }       = require('../../constants/permissions.constants');
const multer                = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Solo se permiten imágenes JPG, PNG o WebP'));
  },
});

router.get('/',
  authMiddleware,
  requirePermission(PERMISSIONS.CUSTODY_READ),
  custodyController.getAll
);

router.get('/search',
  authMiddleware,
  requirePermission(PERMISSIONS.CUSTODY_READ),
  custodyController.searchByTicket
);

router.get('/:id',
  authMiddleware,
  requirePermission(PERMISSIONS.CUSTODY_READ),
  custodyController.getById
);

router.post('/',
  authMiddleware,
  requirePermission(PERMISSIONS.CUSTODY_CREATE),
  upload.single('photo'),
  custodyController.create
);

router.patch('/:id/return',
  authMiddleware,
  requirePermission(PERMISSIONS.CUSTODY_RETURN),
  custodyController.markReturned
);

router.patch('/:id/lost',
  authMiddleware,
  requirePermission(PERMISSIONS.CUSTODY_MANAGE),
  custodyController.markLost
);

module.exports = router;