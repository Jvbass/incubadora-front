import { Package, ClipboardPen, Brain, Egg, Briefcase } from "lucide-react";
import { NavLink } from "react-router-dom";
import { routeImports } from "../../router/routeImports";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// Sidebar-rail izquierda (rediseño v2, SDD §12.3 R2): iconos w-16 que expanden
// a w-48 en hover (desktop); drawer overlay en móvil controlado desde la
// hamburguesa de la barra superior. Acento rojo para hover/activo.
export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const itemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center w-full p-2 rounded-lg transition-colors cursor-pointer border-l-2 ${
      isActive
        ? "border-cta-600 text-cta-300 bg-bg-hoverdark/60"
        : "border-transparent text-text-light hover:text-cta-300 hover:bg-bg-hoverdark"
    }`;

  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 top-14 bg-gray-950/60 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar (siempre dark: superficie carbón) */}
      <aside
        className={`
        fixed top-14 bottom-0 left-0 border-r border-border
        w-48 md:w-16 md:hover:w-48 bg-bg-dark dark:bg-bg-dark flex flex-col py-4 z-40
        transition-all duration-300 ease-in-out group overflow-hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Navigation icons */}
        <nav className="flex flex-col space-y-2 items-start w-full px-2">
          <div className="flex items-center w-full p-2 text-text-soft cursor-not-allowed rounded-lg border-l-2 border-transparent">
            <Package size={20} className="flex-shrink-0" />
            <span className="ml-3 md:opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Productos
            </span>
          </div>

          <NavLink
            to="/home"
            className={itemClass}
            onClick={onClose}
            onMouseEnter={() => routeImports.home()}
            onFocus={() => routeImports.home()}
          >
            <ClipboardPen size={20} className="flex-shrink-0" />
            <span className="ml-3 md:opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Proyectos
            </span>
          </NavLink>

          <NavLink
            to="/mentoring"
            className={itemClass}
            onClick={onClose}
            onMouseEnter={() => routeImports.mentoringList()}
            onFocus={() => routeImports.mentoringList()}
          >
            <Brain size={20} className="flex-shrink-0" />
            <span className="ml-3 md:opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Mentorías
            </span>
          </NavLink>

          <NavLink
            to="/jobs"
            className={itemClass}
            onClick={onClose}
            onMouseEnter={() => routeImports.jobsList()}
            onFocus={() => routeImports.jobsList()}
          >
            <Briefcase size={20} className="flex-shrink-0" />
            <span className="ml-3 md:opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Empleos
            </span>
          </NavLink>

          <div className="flex items-center w-full p-2 text-text-soft cursor-not-allowed rounded-lg border-l-2 border-transparent">
            <Egg size={20} className="flex-shrink-0" />
            <span className="ml-3 md:opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Blog
            </span>
          </div>
        </nav>
      </aside>
    </>
  );
}
