import { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';

const useSocket = (eventName, callback) => {
  const context = useContext(SocketContext);

  useEffect(() => {
    if (!context?.socket || !eventName || !callback) return;

    context.socket.on(eventName, callback);

    return () => {
      context.socket.off(eventName, callback);
    };
  }, [context?.socket, eventName, callback]);

  return context;
};

export default useSocket;