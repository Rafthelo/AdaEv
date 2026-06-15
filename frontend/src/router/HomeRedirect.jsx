import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Orden de prioridad: a dónde mandar al usuario según el primer permiso que tenga
const PRIORITY_ROUTES = [
  { path: '/dashboard',     permission: 'dashboard:view' },
  { path: '/sales',         permission: 'sales:create' },
  { path: '/sales',         permission: 'sales:read' },
  { path: '/cash-register', permission: 'cash:read' },
  { path: '/custody',       permission: 'custody:read' },
  { path: '/events',        permission: 'events:read' },
  { path: '/products',      permission: 'products:read' },
  { path: '/inventory',     permission: 'inventory:read' },
  { path: '/users',         permission: 'users:manage' },
  { path: '/roles',         permission: 'roles:manage' },
  { path: '/audit',         permission: 'audit:read' },
];

const HomeRedirect = () => {
  const { hasPermission, loading } = useAuth();

  if (loading) return null;

  const target = PRIORITY_ROUTES.find((r) => hasPermission(r.permission));

  return <Navigate to={target ? target.path : '/login'} replace />;
};

export default HomeRedirect;