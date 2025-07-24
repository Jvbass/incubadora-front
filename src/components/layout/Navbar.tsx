import { Link } from "react-router-dom";
import NotificationBell from "./NotificationBell"; // <-- 1. Importar
import { CirclePlus } from "lucide-react";
import { useAuthZustand } from "../../hooks/useAuthZustand";

const Navbar = () => {
  const { user, logout } = useAuthZustand();

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
            <Link
              to="/home"
              className="text-sm font-medium text-gray-400 cursor-not-allowed"
            >
              Productos
            </Link>
            <Link
              to="/home"
              className="text-sm font-medium text-gray-800 hover:text-indigo-600"
            >
              Proyectos
            </Link>
            <Link
              to="/home"
              className="text-sm font-medium text-gray-400 cursor-not-allowed"
            >
              Mentorías
            </Link>
            <Link
              to="/home"
              className="text-sm font-medium text-gray-400 cursor-not-allowed"
            >
              Blog
            </Link>

            <Link
              to="/create-project"
              className="text-sm font-medium text-gray-800 hover:text-indigo-600 rounded-full border-1 px-2 py-1 flex items-center "
            >
              <CirclePlus className="mr-1" /> Crear
            </Link>

            {/* 2. Añadir el componente de notificación */}
            <NotificationBell />

            

            <div className="h-8 border-l border-gray-300"></div>

            {/* User Profile Dropdown */}
            <div className="relative group">
              <div className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                {/* Avatar */}
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.username || "User"
                  )}&background=6366f1&color=ffffff&size=32&rounded=true`}
                  alt={user?.username}
                  className="w-8 h-8 rounded-lg"
                />
                {/* User Info */}
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.username}
                  </p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                  >
                    Mi Espacio
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
