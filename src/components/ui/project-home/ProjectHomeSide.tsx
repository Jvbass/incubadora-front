import {
  Smartphone,
  Globe,
  Code,
  BookOpenText,
  Hammer,
  HandHeart,
} from "lucide-react";

// Componente para una fila de información en la sidebar

export const ProyectHomeSide = () => {
  return (
    <aside>
      <div className="mt-12 p-6 bg-white rounded-lg dark:bg-bg-dark shadow-md border border-divider dark:border-gray-700 space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-text-light border-b border-divider pb-3">
          Blog
        </h3>

        {/* Información clave */}

        <ul className="space-y-2">
          <li className="flex items-center space-x-2 text-gray-600">
            <Smartphone size={15} strokeWidth={0.5} />
            <span className="text-sm">Mobile</span>
          </li>
          <li className="flex items-center space-x-2 text-gray-600">
            <Globe size={15} strokeWidth={0.5} />{" "}
            <span className="text-sm">General</span>
          </li>
          <li className="flex items-center space-x-2 text-gray-600">
            <Code size={15} strokeWidth={0.5} />{" "}
            <span className="text-sm">Codigo</span>
          </li>
          <li className="flex items-center space-x-2 text-gray-600">
            <BookOpenText size={15} strokeWidth={0.5} />
            <span className="text-sm">Guias</span>
          </li>
          <li className="flex items-center space-x-2 text-gray-600">
            <Hammer size={15} strokeWidth={0.5} />
            <span className="text-sm">Herramientas</span>
          </li>
          <li className="flex items-center space-x-2 text-gray-600">
            <HandHeart size={15} strokeWidth={0.5} />
            <span className="text-sm">Social</span>
          </li>
        </ul>
      </div>
    </aside>
  );
};
