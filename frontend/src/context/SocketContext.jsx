import { createContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children, addToast, user }) => {
  const socketRef           = useRef(null);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const token = sessionStorage.getItem('accessToken');

  useEffect(() => {
    if (!token) return;

    socketRef.current = io('http://localhost:3000', {
      auth:       { token },
      transports: ['websocket', 'polling'],
    });
   setSocket(socketRef.current);
    const socket = socketRef.current;

    socket.on('connect', () => {
      setConnected(true);
      // Unirse automáticamente al evento asignado
      if (user?.assigned_event_id) {
        socket.emit('join:event', user.assigned_event_id);
      }
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', () => setConnected(false));

    socket.on('inventory:low_stock', (data) => {
      if (user?.permissions?.includes('inventory:read')) {
        addToast(`⚠️ Stock bajo: ${data.productName} (${data.current} unidades)`, 'warning');
      }
    });

    socket.on('order:created', (data) => {
      if (user?.seller_type === 'bartender') {
        addToast(`🔔 Nuevo pedido #${data.saleId} recibido`, 'info');
      }
    });

    socket.on('order:ready', (data) => {
      if (user?.seller_type === 'waiter') {
        addToast(`✅ Pedido #${data.saleId} listo. Pide el código al bartender.`, 'success');
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const joinEvent  = (eventId) => socketRef.current?.emit('join:event', eventId);
  const leaveEvent = (eventId) => socketRef.current?.emit('leave:event', eventId);

  return (
    <SocketContext.Provider value={{ socket, connected, joinEvent, leaveEvent }}>
      {children}
    </SocketContext.Provider>
  );
};