import { Link } from "react-router-dom";
import NotificationBell from "./NotificationBell"; // <-- 1. Importar
import { Bookmark, Plus } from "lucide-react";
import { useAuthZustand } from "../../hooks/useAuthZustand";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { user, logout } = useAuthZustand();
  const [isScrolled, setIsScrolled] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`hover:bg-brand-300 hover:dark:bg-brand-900 transition-all duration-200 w-fit fixed right-0 rounded-bl-lg z-50 ${
        isScrolled
          ? "bg-white shadow-sm dark:bg-bg-dark"
          : "bg-bg-light dark:bg-bg-dark"
      }`}
    >
      <div className="w-full mx-auto px-3 sm:px-4">
        <div className="flex items-right h-14">
          <div className="flex items-center space-x-1">
            <Link
              to="/create-project"
              className="text-sm font-semibold  shadow-sm flex items-center transition duration-200 text-yellow-500 hover:text-white border border-yellow-500 hover:bg-yellow-500   rounded-lg  py-1 px-1.5 text-center me-2  dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 "
            >
              <Plus strokeWidth={2} size={23} />
              Crear
            </Link>

            {/* Componente de notificación */}
            <NotificationBell iconSize={23} color="text-text-main" />

            {/* Componente de cambio de tema */}
            <ThemeSwitcher iconSize={23} color="text-text-main" />

            {/* Proyectos guardados */}
            <span className="text-gray-400">
              <Bookmark className="cursor-not-allowed" size={23} />
            </span>

            <div className="h-8 border-l border-divider"></div>

            {/* Perfil del usuario / Dropdown */}
            <div className="relative group ">
              <div
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-text-light  hover:text-indigo-600 transition-colors"
              >
                <div className="flex items-right space-x-3 cursor-pointer p-2 rounded-lg transition-colors duration-200  text-text-main dark:text-brand-100 hover:text-brand-100">
                  {/* Avatar */}
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.username || "User"
                    )}&background=6366f1&color=ffffff&size=32&rounded=true`}
                    alt={user?.username}
                    className="w-7 h-7 rounded-lg"
                  />
                  {/* User Info */}
                  <div className="text-right">
                    <span className="text-sm font-medium ">
                      {user?.username}
                    </span>
                    {user?.role === "dev" && <p className="text-xs ">Dev</p>}
                  </div>
                </div>

                {/* Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-1 w-48 bg-bg-light dark:bg-bg-darker rounded-lg shadow-lg border-gray-200 transition-all duration-200 z-50 
          ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}
          md:group-hover:opacity-100 md:group-hover:visible`}
                >
                  <div className="py-2">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-text-light  hover:text-indigo-600 transition-colors"
                    >
                      Mi Espacio
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-text-light  hover:text-indigo-600 transition-colors"
                    >
                      Mi Perfil
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
      </div>
    </nav>
  );
};

export default Navbar;
