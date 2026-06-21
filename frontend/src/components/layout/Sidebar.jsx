import { NavLink } from 'react-router-dom';
import usePermissions from '../../hooks/usePermissions';

const navItems = [
  { to: '/dashboard',     label: 'Dashboard',       permission: 'dashboard:view',        icon: '📊' },
  { to: '/organizations', label: 'Organizaciones',  permission: 'organizations:read',    icon: '🏢' },
  { to: '/finance',       label: 'Finanzas',        permission: 'finance:read',          icon: '💵' },
  { to: '/events',        label: 'Eventos',         permission: 'events:read',           icon: '🎯' },
  { to: '/categories',    label: 'Categorías',      permission: 'categories:read',       icon: '🏷️' },
  { to: '/products',      label: 'Productos',       permission: 'products:read',         icon: '📦' },
  { to: '/inventory',     label: 'Inventario',      permission: 'inventory:read',        icon: '🏪' },
  { to: '/sales',         label: 'Ventas',          permission: 'sales:read',            icon: '💰' },
  { to: '/custody',       label: 'Custodia',        permission: 'custody:read',          icon: '🎫' },
  { to: '/seminar',       label: 'Participantes',   permission: 'seminar:read',          icon: '🎓' },
  { to: '/reports',       label: 'Reportes',        permission: 'sales:read_all',        icon: '📊' },
  { to: '/users',         label: 'Usuarios',        permission: 'users:manage',          icon: '👥' },
  { to: '/roles',         label: 'Roles',           permission: 'roles:manage',          icon: '🔑' },
  { to: '/audit',         label: 'Auditoría',       permission: 'audit:read',            icon: '📋' },
];

const Sidebar = ({ open = false, onClose = () => {} }) => {
  const { can } = usePermissions();

  return (
    <>
      {/* Overlay para móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 left-0 h-full lg:h-auto lg:min-h-screen
          w-64 bg-gray-900 text-white flex flex-col z-50
          transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">AdaEv</h1>
              <p className="text-gray-400 text-xs">Gestión de Eventos</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white text-xl">
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            if (!can(item.permission)) return null;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
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
    </>
  );
};

export default Sidebar;