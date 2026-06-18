import { Link, useLocation } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import { LayoutDashboard, Lightbulb, Menu, User, X } from "lucide-react";
import { useAuthZustand } from "../../hooks/useAuthZustand";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useState, useEffect, useRef } from "react";
import { routeImports } from "../../router/routeImports";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../../api/profileApi";
import AvatarUsuario from "../ui/AvatarUsuario";

interface NavbarProps {
  /** Abre/cierra la sidebar en móvil (la hamburguesa vive en esta barra). */
  onToggleMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

// Título de la sección según la ruta actual (F-03). Los títulos dinámicos
// (ej. "Proyecto {título}") requerirán un store de page-title (follow-up).
const getSectionTitle = (pathname: string): string => {
  if (pathname.startsWith("/projects/new")) return "Nuevo proyecto";
  if (pathname.startsWith("/project/")) return "Proyecto";
  if (pathname.startsWith("/mentoring/new")) return "Nueva mentoría";
  if (pathname === "/mentoring") return "Mentorías";
  if (pathname.startsWith("/mentoring/")) return "Mentoría";
  if (pathname.startsWith("/portfolio") || pathname.startsWith("/profile")) return "Perfil";
  if (pathname.startsWith("/admin")) return "Panel";
  if (pathname.startsWith("/mentor-dashboard")) return "Panel";
  if (pathname.startsWith("/dashboard")) return "Panel";
  if (pathname.startsWith("/home")) return "Proyectos";
  return "";
};

// Barra superior full-width (rediseño v2, SDD §12.3 R2).
// OJO contrato E2E: un solo img[alt] dentro de <nav> (el avatar), el primer
// <button> del nav debe ser la campana de notificaciones, y los textos
// "Crear", "Panel", "Mi Perfil" y "Cerrar Sesión" no deben cambiar.
const Navbar = ({ onToggleMenu, isMobileMenuOpen = false }: NavbarProps) => {
  const { user, logout } = useAuthZustand();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Obtiene el perfil para acceder al avatar real del usuario autenticado.
  // staleTime alto para no generar requests innecesarios en cada re-render.
  const { data: perfil } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const dashboardHref =
    user?.role === "ADMINISTRATOR" ? "/admin" : "/dashboard";
  const prefetchDashboard =
    user?.role === "ADMINISTRATOR"
      ? routeImports.adminDashboard
      : routeImports.developerDashboard;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { pathname } = useLocation();
  const sectionTitle = getSectionTitle(pathname);

  return (
    <nav className="fixed top-0 inset-x-0 h-14 z-50 flex items-center justify-between gap-2 px-3 sm:px-5 bg-bg-light dark:bg-bg-dark border-b border-divider dark:border-border shadow-sm">
      {/* Izquierda: logo + links de navegación (desktop) */}
      <div className="flex items-center min-w-0 pl-10 md:pl-0">
        <Link to="/home" className="flex items-center gap-2 shrink-0">
          {/* Decorativo a propósito (sin alt): el único img[alt] del nav es el avatar */}
          <img
            src="/images/logo-main.png"
            aria-hidden="true"
            className="w-9 h-9 rounded-full bg-gray-200 p-0.5"
          />
          <span className="hidden sm:block font-bold tracking-tight text-text-main dark:text-text-light">
            incubadora<span className="text-cta-600 dark:text-cta-300">.dev</span>
          </span>
        </Link>

        {/* Título de la sección actual — reemplaza los links Proyectos/Mentorías (F-02/F-03) */}
        {sectionTitle && (
          <span className="hidden md:block ml-8 text-sm font-semibold text-text-soft dark:text-text-light truncate">
            {sectionTitle}
          </span>
        )}
      </div>

      {/* Derecha: acciones + avatar */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Link
          to="/projects/new"
          onMouseEnter={() => routeImports.createProject()}
          onFocus={() => routeImports.createProject()}
          className="flex items-center gap-1 text-sm font-semibold rounded-md py-1.5 px-2.5 border transition duration-200 text-cta-600 border-cta-600 hover:bg-cta-600 hover:text-white dark:text-cta-300 dark:border-cta-300 dark:hover:bg-cta-600 dark:hover:border-cta-600 dark:hover:text-white"
        >
          <Lightbulb strokeWidth={2} size={18} />
          <span className="hidden sm:inline">Crear</span>
        </Link>

        {/* Componente de notificación (primer <button> del nav — contrato E2E) */}
        <NotificationBell iconSize={22} color="text-text-main" />

        {/* Componente de cambio de tema */}
        <ThemeSwitcher iconSize={22} color="text-text-main" />

        <div className="h-7 border-l border-divider dark:border-border mx-1 hidden sm:block" />

        {/* Perfil del usuario / Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 cursor-pointer p-1.5 rounded-md transition-colors duration-200 text-text-main dark:text-text-light hover:bg-gray-100 dark:hover:bg-bg-hoverdark"
          >
            {/* Avatar real del usuario o inicial como fallback */}
            <AvatarUsuario
              src={perfil?.avatarThumbnailUrl ?? perfil?.avatarUrl}
              nombre={user?.username || "User"}
              tamano="w-8 h-8"
            />
            <div className="text-right hidden lg:block">
              <span className="block text-sm font-medium leading-tight">
                {user?.username}
              </span>
              <span className="block text-xs text-text-soft leading-tight">
                {user?.role}
              </span>
            </div>
          </div>

          {/* Dropdown Menu */}
          <div
            className={`absolute text-left right-0 mt-2 w-48 rounded-md bg-bg-light dark:bg-bg-dark border border-divider dark:border-border shadow-lg transition-all duration-200 z-50
              ${
                isMenuOpen
                  ? "opacity-100 visible"
                  : "opacity-0 invisible pointer-events-none"
              }`}
          >
            <div className="py-2">
              <Link
                to={dashboardHref}
                onMouseEnter={() => prefetchDashboard()}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-sm text-text-main dark:text-text-light hover:text-cta-600 dark:hover:text-cta-300 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-bg-hoverdark flex justify-between items-center"
              >
                <span>Panel</span>
                <LayoutDashboard size={18} />
              </Link>
              <Link
                to="/profile"
                onMouseEnter={() => routeImports.profile()}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-sm text-text-main dark:text-text-light hover:text-cta-600 dark:hover:text-cta-300 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-bg-hoverdark flex justify-between items-center"
              >
                <span>Mi Perfil</span>
                <User size={18} />
              </Link>

              <div className="border-t border-divider dark:border-border my-1"></div>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-cta-600 dark:text-cta-300 transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-cta-900/30"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Hamburguesa móvil: visualmente a la izquierda (absolute), pero al
            final del DOM para que la campana siga siendo el primer botón del nav */}
        {onToggleMenu && (
          <button
            onClick={onToggleMenu}
            aria-label="Abrir menú de navegación"
            className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-text-main dark:text-text-light hover:bg-gray-100 dark:hover:bg-bg-hoverdark"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
