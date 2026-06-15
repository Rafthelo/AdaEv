import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Topbar = ({ title }) => {
  const { user, logout }    = useAuth();
  const navigate            = useNavigate();
  const [menuOpen, setMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const goToProfile = () => {
    setMenu(false);
    navigate('/profile');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

      <div className="relative">
        <button
          onClick={() => setMenu(!menuOpen)}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </span>
          </div>
          <span className="font-medium">{user?.first_name} {user?.last_name}</span>
          <span className="text-gray-400">▾</span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-800">{user?.username}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={goToProfile}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              Mi perfil
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;