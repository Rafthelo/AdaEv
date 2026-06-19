import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';

const Topbar = ({ title, onMenuClick }) => {
  const { user, logout }    = useAuth();
  const navigate            = useNavigate();
  const [menuOpen, setMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const goToProfile = () => {
    setMenu(false);
    navigate('/profile');
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-3 sm:px-6 gap-2 transition-colors">
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-2xl px-1 shrink-0"
          aria-label="Abrir menú"
        >
          ☰
        </button>
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">{title}</h2>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={toggleTheme}
          className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl px-2 shrink-0"
          aria-label="Cambiar tema"
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <div className="relative shrink-0">
          <button
            onClick={() => setMenu(!menuOpen)}
            className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </div>
            <span className="font-medium hidden sm:inline">{user?.first_name} {user?.last_name}</span>
            <span className="text-gray-400 hidden sm:inline">▾</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{user?.username}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={goToProfile}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Mi perfil
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;