// src/components/layout/Navbar.tsx

import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Lado Izquierdo: Logo/Nombre de la App */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              Incubadora.dev
            </Link>
          </div>

          {/* Lado Derecho: Información del Usuario y Logout */}
          <div className="flex items-center">
            <div className="mr-4 text-right">
              <Link to="/dashboard">
                <p className="text-sm font-medium text-gray-800">Explorar</p>
              </Link>
            </div>
            <div className="mr-4 text-right">
              <Link to="/createproject">
                <p className="text-sm font-medium text-gray-800">Crear</p>
              </Link>
            </div>
            <div className="mr-4 text-right">
              <Link to="/dashboard">
                <p className="text-sm font-medium text-gray-800">Mi espacio</p>
              </Link>
            </div>
            <div className="mr-4 text-right">
              <Link to="/dashboard">
                <p className="text-sm font-medium text-gray-800">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </Link>
            </div>

            <div
              onClick={logout}
              className="text-xs text-red-600 hover:text-red-900 cursor-pointer"
            >
              Cerrar Sesión
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
