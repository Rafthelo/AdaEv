import { NavLink } from 'react-router-dom';
import usePermissions from '../../hooks/usePermissions';

const navItems = [
  { to: '/dashboard',     label: 'Dashboard',    permission: 'dashboard:view', icon: '📊' },
  { to: '/events',        label: 'Eventos',      permission: 'events:read',    icon: '🎯' },
  { to: '/products',      label: 'Productos',    permission: 'products:read',  icon: '📦' },
  { to: '/categories',    label: 'Categorías',   permission: 'categories:read', icon: '🏷️' },
  { to: '/inventory',     label: 'Inventario',   permission: 'inventory:read', icon: '🏪' },
  { to: '/sales',         label: 'Ventas',       permission: 'sales:read',     icon: '💰' },
  { to: '/cash-register', label: 'Caja',         permission: 'cash:read',      icon: '🏧' },
  { to: '/users',         label: 'Usuarios',     permission: 'users:manage',   icon: '👥' },
  { to: '/roles',         label: 'Roles',        permission: 'roles:manage',   icon: '🔑' },
  { to: '/audit',         label: 'Auditoría',    permission: 'audit:read',     icon: '📋' },
];

const Sidebar = () => {
  const { can } = usePermissions();

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">AdaEv</h1>
            <p className="text-gray-400 text-xs">Gestión de Eventos</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          if (!can(item.permission)) return null;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-700">
        <p className="text-gray-500 text-xs text-center">AdaEv v1.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;