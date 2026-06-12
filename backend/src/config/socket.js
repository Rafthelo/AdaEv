const jwt = require('jsonwebtoken');
const env = require('./environment');

let io;

const initSocket = (socketIO) => {
  io = socketIO;

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('AUTH_REQUIRED'));
    try {
      const payload = jwt.verify(token, env.jwt.secret);
      socket.user = payload;
      next();
    } catch {
      next(new Error('AUTH_INVALID'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} — user: ${socket.user?.username}`);

    socket.on('join:event', (eventId) => {
      socket.join(`event:${eventId}`);
    });

    socket.on('leave:event', (eventId) => {
      socket.leave(`event:${eventId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};

module.exports = { initSocket, getIO };