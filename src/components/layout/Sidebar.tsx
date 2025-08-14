import { Package, ClipboardPen, Brain, Egg, X } from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile */}
      {isOpen && (
        <div
          className="absolute inset-0 bg-gray-950/60 z-40 md:hidden"
          onClick={onClose}
        >
          <X className="text-white absolute top-20 right-4" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed md:fixed top-0 left-0 h-full
        w-48 md:w-16 hover:w-48 bg-bg-dark flex flex-col  py-4 z-50 
        transition-all duration-300 ease-in-out group 
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Logo and company name at top */}
        <Link
          to="/home"
          className="mb-8 flex items-center w-full px-2"
          onClick={onClose}
        >
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <div className="w-6 h-6 border-2 border-white rounded-full border-l-transparent " />
          </div>
          <span className="ml-3 text-white font-semibold md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Incubadora.dev
          </span>
        </Link>

        {/* Navigation icons */}
        <nav className="flex flex-col space-y-6 items-start w-full px-2">
          <div className="flex items-center w-full p-2 text-gray-400 cursor-not-allowed rounded-lg transition-colors">
            <Package size={20} className="flex-shrink-0" />
            <span className="ml-3 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Productos
            </span>
          </div>

          <Link
            to="/home"
            className="flex items-center w-full p-2 text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            onClick={onClose}
          >
            <ClipboardPen size={20} className="flex-shrink-0" />
            <span className="ml-3 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Proyectos
            </span>
          </Link>

          <div className="flex items-center w-full p-2 text-gray-400 cursor-not-allowed rounded-lg transition-colors">
            <Brain size={20} className="flex-shrink-0" />
            <span className="ml-3 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Mentorías
            </span>
          </div>

          <div className="flex items-center w-full p-2 text-gray-400 cursor-not-allowed rounded-lg transition-colors">
            <Egg size={20} className="flex-shrink-0" />
            <span className="ml-3 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Blog
            </span>
          </div>
        </nav>
      </div>
    </>
  );
}
