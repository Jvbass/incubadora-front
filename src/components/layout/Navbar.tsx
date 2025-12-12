import { Link } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import { Bookmark, LayoutDashboard, Lightbulb, User } from "lucide-react";
import { useAuthZustand } from "../../hooks/useAuthZustand";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const { user, logout } = useAuthZustand();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`hover:bg-brand-300 hover:dark:bg-bg-hoverdark transition-all duration-200 w-fit fixed right-0 rounded-bl-lg z-50 ${
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
              <Lightbulb strokeWidth={2} size={23} />
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

            <div className="h-8 border-l border-border"></div>

            {/* Perfil del usuario / Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="block px-2 py-2 text-sm text-gray-700 dark:text-text-light "
              >
                <div className="flex items-right space-x-3 cursor-pointer p-2 rounded-lg transition-colors duration-200 text-text-main dark:text-brand-100  hover:text-yellow-500">
                  {/* Avatar */}
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.username || "User"
                    )}&background=6366f1&color=ffffff&size=32&rounded=true`}
                    alt={user?.username}
                    className="w-9 h-9 rounded-lg"
                  />
                  {/* User Info */}
                  <div className="text-right">
                    <span className="text-sm font-medium">
                      {user?.username}
                    </span>
                    <p className="text-xs">{user?.role}</p>
                  </div>
                </div>

                {/* Dropdown Menu */}
                <div
                  className={`absolute text-left right-0 mt-1 w-48 bg-bg-light dark:bg-bg-dark  shadow-lg  transition-all duration-200 z-50 
                    ${
                      isMenuOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible pointer-events-none"
                    }`}
                >
                  <div className="py-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className=" px-4 py-2 text-sm text-gray-700 dark:text-text-light hover:text-yellow-500 transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-bg-hoverdark dark:hover:text-yellow-400 flex justify-between items-center"
                    >
                      <span>Panel</span>
                      <LayoutDashboard size={18} />
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className=" px-4 py-2 text-sm text-gray-700 dark:text-text-light hover:text-yellow-500 transition-colors hover:bg-gray-50 dark:hover:bg-bg-hoverdark dark:hover:text-yellow-400 flex justify-between items-center"
                    >
                      <span>Mi Perfil</span>
                      <User size={18} />
                    </Link>

                    <div className="border-t border-border my-1"></div>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        logout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-cta-600 transition-colors cursor-pointer dark:hover:text-gray-50 hover:bg-gray-50 dark:hover:bg-red-900"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
