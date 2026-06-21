const env = require('./environment');

// Acepta localhost y cualquier IP de red local privada (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
// en el puerto 5173, sin importar cuál sea la IP exacta del router/WiFi actual.
const LOCAL_NETWORK_PATTERN = /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}):5173$/;

const corsOptions = {
  origin: (origin, callback) => {
    const whitelist = env.frontendUrl.split(',');

    if (!origin || whitelist.includes(origin) || LOCAL_NETWORK_PATTERN.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials:     true,
  methods:         ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders:  ['Content-Type', 'Authorization'],
};

module.exports = corsOptions;