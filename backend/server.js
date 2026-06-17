const http            = require('http');
const { Server }      = require('socket.io');
const app             = require('./src/app');
const { initSocket }  = require('./src/config/socket');
const env             = require('./src/config/environment');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:      env.frontendUrl.split(','),
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