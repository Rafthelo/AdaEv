const router                = require('express').Router();
const seminarController     = require('./seminar.controller');
const authMiddleware        = require('../../middlewares/auth.middleware');
const { requirePermission } = require('../../middlewares/permission.middleware');
const { PERMISSIONS }       = require('../../constants/permissions.constants');
const multer                = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
      'application/vnd.ms-excel', // xls
      'text/csv',
    ];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(xlsx|xls|csv)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos Excel (.xlsx, .xls) o CSV'));
    }
  },
});

// Temas
router.get('/topics',
  authMiddleware, requirePermission(PERMISSIONS.SEMINAR_READ),
  seminarController.getTopics
);

router.post('/topics',
  authMiddleware, requirePermission(PERMISSIONS.SEMINAR_CREATE),
  seminarController.createTopic
);

router.patch('/topics/:id/available',
  authMiddleware, requirePermission(PERMISSIONS.SEMINAR_UPDATE),
  seminarController.setTopicAvailable
);

router.delete('/topics/:id',
  authMiddleware, requirePermission(PERMISSIONS.SEMINAR_DELETE),
  seminarController.deleteTopic
);

// Inscripciones
router.get('/topics/:topicId/enrollments',
  authMiddleware, requirePermission(PERMISSIONS.SEMINAR_READ),
  seminarController.getEnrollments
);

router.post('/enrollments',
  authMiddleware, requirePermission(PERMISSIONS.SEMINAR_CREATE),
  seminarController.createEnrollment
);

router.post('/topics/:topicId/import',
  authMiddleware, requirePermission(PERMISSIONS.SEMINAR_CREATE),
  upload.single('file'),
  seminarController.bulkImport
);

router.get('/search',
  authMiddleware, requirePermission(PERMISSIONS.SEMINAR_READ),
  seminarController.searchByRu
);

router.put('/enrollments/:id',
  authMiddleware, requirePermission(PERMISSIONS.SEMINAR_UPDATE),
  seminarController.updateEnrollment
);

router.patch('/enrollments/deliver',
  authMiddleware, requirePermission(PERMISSIONS.SEMINAR_DELIVER),
  seminarController.deliverCertificates
);

router.delete('/enrollments/:id',
  authMiddleware, requirePermission(PERMISSIONS.SEMINAR_DELETE),
  seminarController.deleteEnrollment
);

module.exports = router;