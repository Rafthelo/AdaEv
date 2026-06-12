const env = require('./environment');

const corsOptions = {
  origin: (origin, callback) => {
    const whitelist = env.frontendUrl.split(',');
    if (!origin || whitelist.includes(origin)) {
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