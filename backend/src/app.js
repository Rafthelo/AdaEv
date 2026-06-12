require('./config/environment');

const express         = require('express');
const helmet          = require('helmet');
const cors            = require('cors');
const cookieParser    = require('cookie-parser');
const corsOptions     = require('./config/cors');
const errorMiddleware = require('./middlewares/error.middleware');
const { generalLimiter } = require('./middlewares/rateLimiter.middleware');

const app = express();

// === Security ===
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());

// === Body Parsing ===
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// === General Rate Limiter ===
app.use('/api', generalLimiter);

// === Health Check ===
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status:    'ok',
      version:   '1.0.0',
      module:    'AdaEv',
      timestamp: new Date().toISOString(),
    },
  });
});

// === Routes ===
app.use('/api/v1/auth',  require('./modules/auth/auth.routes'));
app.use('/api/v1/users', require('./modules/users/users.routes'));
app.use('/api/v1/roles', require('./modules/roles/roles.routes'));
app.use('/api/v1/permissions', require('./modules/permissions/permissions.routes'));
app.use('/api/v1/categories', require('./modules/categories/categories.routes'));
app.use('/api/v1/products', require('./modules/products/products.routes'));
app.use('/api/v1/events', require('./modules/events/events.routes'));
app.use('/api/v1/inventory', require('./modules/inventory/inventory.routes'));
app.use('/api/v1/sales', require('./modules/sales/sales.routes'));
app.use('/api/v1/cash-registers', require('./modules/cash-register/cash-register.routes'));
app.use('/api/v1/dashboard', require('./modules/dashboard/dashboard.routes'));
app.use('/api/v1/audit', require('./modules/audit/audit.routes'));

// === Error Handler (siempre último) ===
app.use(errorMiddleware);

module.exports = app;