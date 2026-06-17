import { createContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children, addToast, user }) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) return;

    const socketUrl = `${window.location.protocol}//${window.location.hostname}:3000`;

    socketRef.current = io(socketUrl, {
      auth:       { token },
      transports: ['websocket', 'polling'],
    });
    setSocket(socketRef.current);
    const sock = socketRef.current;

    sock.on('connect', () => {
      setConnected(true);
      if (user?.assigned_event_id) {
        sock.emit('join:event', user.assigned_event_id);
      }
    });

    sock.on('disconnect', () => setConnected(false));

    // Si el token fue rechazado (expirado/inválido), reconectar con el token actual
    sock.on('connect_error', (err) => {
      setConnected(false);
      if (err.message === 'auth_error' || err.message?.includes('auth')) {
        const freshToken = sessionStorage.getItem('accessToken');
        if (freshToken && freshToken !== token) {
          sock.auth = { token: freshToken };
          sock.connect();
        }
      }
    });

    sock.on('inventory:low_stock', (data) => {
      if (user?.permissions?.includes('inventory:read')) {
        addToast(`⚠️ Stock bajo: ${data.productName} (${data.current} unidades)`, 'warning');
      }
    });

    sock.on('order:created', (data) => {
      if (user?.seller_type === 'bartender') {
        addToast(`🔔 Nuevo pedido #${data.saleId} recibido`, 'info');
      }
    });

    sock.on('order:ready', (data) => {
      if (user?.seller_type === 'waiter') {
        addToast(`✅ Pedido #${data.saleId} listo. Pide el código al bartender.`, 'success');
      }
    });

    // Reintentar conexión cada 5 minutos con el token vigente, por si quedó desincronizado
    const refreshInterval = setInterval(() => {
      const currentToken = sessionStorage.getItem('accessToken');
      if (currentToken && sock.auth?.token !== currentToken) {
        sock.auth = { token: currentToken };
        sock.disconnect().connect();
      }
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(refreshInterval);
      sock.disconnect();
    };
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const joinEvent  = (eventId) => socketRef.current?.emit('join:event', eventId);
  const leaveEvent = (eventId) => socketRef.current?.emit('leave:event', eventId);

  return (
    <SocketContext.Provider value={{ socket, connected, joinEvent, leaveEvent }}>
      {children}
    </SocketContext.Provider>
  );
};