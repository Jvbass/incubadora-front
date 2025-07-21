import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import NotificationBell from "./NotificationBell"; // <-- 1. Importar

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/home" className="text-2xl font-bold text-indigo-600">
              Incubadora.dev
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* ... otros links ... */}
            <Link
              to="/home"
              className="text-sm font-medium text-gray-800 hover:text-indigo-600"
            >
              Explorar
            </Link>
            <Link
              to="/create-project"
              className="text-sm font-medium text-gray-800 hover:text-indigo-600"
            >
              Crear
            </Link>
            <Link
              to="/dashboard"
              className="text-sm font-medium text-gray-800 hover:text-indigo-600"
            >
              Mi Espacio
            </Link>

            {/* 2. Añadir el componente de notificación */}
            <NotificationBell />

            <div className="h-8 border-l border-gray-300"></div>

            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>

            <button
              onClick={logout}
              className="text-sm text-red-600 hover:underline"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
