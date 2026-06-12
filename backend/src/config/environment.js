require('dotenv').config();

const required = [
  'PORT',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'JWT_SECRET',
  'FRONTEND_URL',
];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

module.exports = {
  port:     process.env.PORT || 3000,
  nodeEnv:  process.env.NODE_ENV || 'development',
  db: {
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT,
    name:     process.env.DB_NAME,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    poolMin:  parseInt(process.env.DB_POOL_MIN) || 2,
    poolMax:  parseInt(process.env.DB_POOL_MAX) || 10,
  },
  jwt: {
    secret:            process.env.JWT_SECRET,
    expiresIn:         process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn:  process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  frontendUrl:   process.env.FRONTEND_URL,
  bcryptRounds:  parseInt(process.env.BCRYPT_ROUNDS) || 12,
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    max:      parseInt(process.env.RATE_LIMIT_MAX) || 5,
  },
  adaos: {
    apiUrl:   process.env.ADAOS_API_URL || '',
    apiKey:   process.env.ADAOS_API_KEY || '',
    tenantId: process.env.ADAOS_TENANT_ID || '',
  },
};