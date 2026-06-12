import { createContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children, token }) => {
  const socketRef           = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io('http://localhost:3000', {
      auth:       { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('connect', () => {
      setConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      setConnected(false);
    });

    socketRef.current.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token]);

  const joinEvent = (eventId) => {
    socketRef.current?.emit('join:event', eventId);
  };

  const leaveEvent = (eventId) => {
    socketRef.current?.emit('leave:event', eventId);
  };

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, joinEvent, leaveEvent }}>
      {children}
    </SocketContext.Provider>
  );
};