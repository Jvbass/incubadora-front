import type { ListProjects } from "../../../types";

interface ProjectCardProps {
  project: ListProjects;
  variant: "full" | "compact";

  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ProjectCard = ({
  project,
  variant,
  onView,
  onEdit,
  onDelete,
}: ProjectCardProps) => {

  
  // Formateo de fechas y booleanos
  const formatedDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  const formatedBoolanColaborativeData = (isCollaborative: boolean) => {
    return isCollaborative ? "Colaborativo" : "No colaborativo";
  };

  const formatedBoolanMentoringData = (needMentoring: boolean) => {
    return needMentoring ? "Busca mentoría" : "No busca mentoría";
  };

  // Vista Detallada para el HomePage ---
  if (variant === "full") {
    return (
      <li className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
        
        <h2 className="text-xl font-bold text-gray-800">{project.title}</h2>
        <p className="text-sm text-gray-500 mb-4">
          Por {project.developerUsername}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="font-semibold text-gray-600">Progreso: </span>
            <span>{project.developmentProgress}%</span>
          </div>
          <div>
            <span className="font-semibold text-gray-600">Fecha: </span>
            <span>{formatedDate(project.createdAt)}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-600">Proyecto {formatedBoolanColaborativeData(project.isCollaborative)}
            </span>
          </div>
          <div>
            <span className="font-semibold text-gray-600">
           {formatedBoolanMentoringData(project.needMentoring)}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm font-semibold text-gray-600 self-center">
            Tecnologías:
          </span>
          {project.technologies.map((tech) => (
            <span
              key={tech.id}
              style={{
                color: tech.techColor,
                borderColor: tech.techColor,
                border: "1px solid",
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded-full"
            >
              {tech.name}
            </span>
          ))}
        </div>
        
      </li>
    );
  }

  // --- Vista Compacta para el Dashboard ---
  if (variant === "compact") {
    const statusStyles =
      project.status === "published"
        ? "bg-green-100 text-green-800"
        : "bg-yellow-100 text-yellow-800";

    return (
      <li className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
        {/* Información del Proyecto */}
        <div>
          <h3 className="font-bold text-gray-800">{project.title}</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech.id}
                className="px-2 py-0.5 text-xs font-semibold text-white rounded-full"
                style={{ backgroundColor: tech.techColor }}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        {/* Estado y Acciones */}
        <div className="text-right">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles}`}
          >
            {project.status}
          </span>
          <div className="mt-2 flex items-center gap-4">
            {/* El botón solo se renderiza si la función onEdit fue pasada como prop */}
            {onEdit && (
              <button
                onClick={() => onEdit(project.id.toString())}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Editar
              </button>
            )}
            {/* El botón solo se renderiza si la función onDelete fue pasada como prop */}
            {onDelete && (
              <button
                onClick={() => null}
                className="text-sm font-medium text-red-600 hover:text-red-800 cursor-pointer"
              >
                Borrar
              </button>
            )}
            {onView && (
              <button
                onClick={() => onView(project.id.toString())}
                className="text-sm font-medium text-red-600 hover:text-red-800 cursor-pointer"
              >
                Ver
              </button>
            )}
          </div>
        </div>
      </li>
    );
  }

  // Por si se pasa una variante no esperada, aunque TypeScript ayuda a prevenirlo.
  return null;
};
