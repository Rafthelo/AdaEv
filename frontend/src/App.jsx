import { useContext } from 'react';
import { AuthProvider }         from './context/AuthContext';
import { AuthContext }          from './context/AuthContext';
import { NotificationProvider, useNotifications } from './components/common/NotificationCenter';
import { SocketProvider }       from './context/SocketContext';
import AppRouter                from './router/AppRouter';

const AppWithSocket = () => {
  const { user }     = useContext(AuthContext);
  const { addToast } = useNotifications();

  return (
    <SocketProvider addToast={addToast} user={user}>
      <AppRouter />
    </SocketProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppWithSocket />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;