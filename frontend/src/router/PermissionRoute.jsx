import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PermissionRoute = ({ children, permission }) => {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (permission && !hasPermission(permission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso denegado</h2>
          <p className="text-gray-500">No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default PermissionRoute;