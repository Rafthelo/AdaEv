import { createContext, useState, useEffect, useCallback } from 'react';
import { login as loginApi, logout as logoutApi, getMe } from '../api/endpoints/auth.api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Silently refresh on mount
  useEffect(() => {
    const init = async () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        if (token) {
          const { data } = await getMe();
          setUser(data.data);
        }
      } catch {
        sessionStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await loginApi(credentials);
    sessionStorage.setItem('accessToken', data.data.accessToken);
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // ignorar error
    } finally {
      sessionStorage.removeItem('accessToken');
      setUser(null);
    }
  }, []);

  const hasPermission = useCallback((permission) => {
    return user?.permissions?.includes(permission) ?? false;
  }, [user]);

  const hasRole = useCallback((role) => {
    return user?.roles?.includes(role) ?? false;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};