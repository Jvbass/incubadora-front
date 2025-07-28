import { Link } from "react-router-dom";
import NotificationBell from "./NotificationBell"; // <-- 1. Importar
import { Bookmark, Plus } from "lucide-react";
import { useAuthZustand } from "../../hooks/useAuthZustand";
import { ThemeSwitcher } from "./ThemeSwitcher";

const Navbar = () => {
  const { user, logout } = useAuthZustand();

  return (
    <nav className="bg-brand-600  dark:bg-brand-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link
              to="/home"
              className="text-2xl font-bold text-text-light hover:text-brand-900 dark:hover:text-brand-600 transition duration-300 "
            >
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
              className="text-sm font-medium text-text-light dark:text-amber-50  hover:text-brand-900 dark:hover:text-brand-300 cursor-pointer transition duration-300"
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
              className="text-sm font-medium text-gray-400 cursor-not-allowed "
            >
              Blog
            </Link>

            <Link
              to="/create-project"
              className="text-sm font-bold text-cta-600 hover:text-text-light shadow-lg hover:bg-indigo-400 rounded-full border-2 px-2 py-1 flex items-center transition duration-300"
            >
              <Plus className="mr-1" strokeWidth={2} /> Crear
            </Link>

            {/* Componente de notificación */}
            <NotificationBell />

            {/* Componente de cambio de tema */}
            <ThemeSwitcher />

            {/* Proyectos guardados */}
            <span className="text-gray-400">
              <Bookmark className="cursor-not-allowed" />
            </span>

            <div className="h-8 border-l border-divider"></div>

            {/* User Profile Dropdown */}
            <div className="relative group ">
              <div className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-indigo-400  transition-colors duration-400  text-text-light hover:text-brand-900 ">
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
                  <p className="text-sm font-medium ">{user?.username}</p>
                  <p className="text-xs text-brand-100">{user?.role}</p>
                </div>
              </div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-1 w-48 bg-bg-light dark:bg-bg-darker rounded-lg shadow-lg  border-gray-200 invisible group-hover:opacity-100  group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-text-light  hover:text-indigo-600 transition-colors"
                  >
                    Mi Espacio
                  </Link>
                  <div className="border-t border-brand-100 my-1"></div>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-cta-600  transition-colors cursor-pointer hover:text-cta-900"
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
