const http            = require('http');
const { Server }      = require('socket.io');
const app             = require('./src/app');
const { initSocket }  = require('./src/config/socket');
const env             = require('./src/config/environment');

const server = http.createServer(app);

const LOCAL_NETWORK_PATTERN = /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}):5173$/;

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      const whitelist = env.frontendUrl.split(',');
      if (!origin || whitelist.includes(origin) || LOCAL_NETWORK_PATTERN.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

initSocket(io);

server.listen(env.port, '0.0.0.0', () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║           AdaEv Backend              ║');
  console.log('  ╠══════════════════════════════════════╣');
  console.log(`  ║  Puerto:   ${env.port}                      ║`);
  console.log(`  ║  Entorno:  ${env.nodeEnv}               ║`);
  console.log('  ║  Estado:   Corriendo ✓               ║');
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
});