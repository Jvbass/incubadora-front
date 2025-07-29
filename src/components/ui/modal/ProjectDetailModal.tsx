import { useQuery } from "@tanstack/react-query";
import { fetchProjectById } from "../../../api/queries";
import Loading from "../../ux/Loading";
import { useEffect } from "react";
import type { ProjectModalProps } from "../../../types";
import { Link } from "react-router-dom";

const ProjectDetailModal = ({
  projectSlug,
  isOpen,
  onClose,
}: ProjectModalProps) => {
  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["projectDetail", projectSlug],
    queryFn: () => fetchProjectById(projectSlug!),
    enabled: !!projectSlug,
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  //  useEffect para controlar el scroll ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Función de limpieza para restaurar el scroll si el componente se desmonta
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const formatedDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  const formatedBoolanColaborativeData = (isCollaborative: boolean) => {
    return isCollaborative ? "Sí" : "No";
  };

  const formatedBoolanMentoringData = (needMentoring: boolean) => {
    return needMentoring ? "Sí" : "No";
  };

  if (!isOpen) return null;

  return (
    // Backdrop semitransparente clickeable para cerrar
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm transition-opacity duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-11/12 rounded-lg bg-gray-800 text-white shadow-2xl transform transition-all duration-200 ease-in-out scale-95 opacity-0 animate-scale-in max-h-[95vh] max-w-[90vw]"
      >
        {/* Header del Modal */}
        <div className="flex-shrink-0 p-4 border-b border-gray-700 flex justify-between items-start">
          <h2 className="text-3xl font-bold text-cyan-400">
            {project?.title || "Cargando..."}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white cursor-pointer text-2xl"
          >
            &times; {/* x para cerrar */}
          </button>
        </div>

        <div className="flex-grow p-6 overflow-y-auto">
          {isLoading && (
            <div className="flex justify-center p-10">
              <Loading message="Cargando proyecto..." />
            </div>
          )}
          {isError && (
            <div className="text-red-500">Error: {error?.message}</div>
          )}
          {project && (
            <div>
              <p className="text-sm text-gray-400 mb-4">
                por {project.developerUsername}
              </p>
              <div className="flex mb-4">
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cyan-400 hover:underline  "
                >
                  Ver Repositorio
                </a>
              </div>
              <div className="flex mb-4">
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cyan-400 hover:underline  "
                >
                  Ver Proyecto Desplegado
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <span className="font-semibold block text-gray-500">
                    Busca Mentor
                  </span>
                  <span>
                    {formatedBoolanMentoringData(project.needMentoring)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold block text-gray-500">
                    Es Colaborativo
                  </span>
                  <span>
                    {formatedBoolanColaborativeData(project.isCollaborative)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold block text-gray-500">
                    Progreso
                  </span>
                  <span>{project.developmentProgress}%</span>
                </div>
                <div>
                  <span className="font-semibold block text-gray-500">
                    Creado
                  </span>
                  <span>{formatedDate(project.createdAt)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                  <span
                    key={tech.id}
                    className="px-3 py-1 text-xs rounded-full bg-gray-700 text-cyan-300"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>

              <h3 className="font-semibold text-lg text-gray-300 mb-2">
                Descripción
              </h3>
              <p className="text-gray-300 whitespace-pre-wrap text-base break-words">
                {project.description}
              </p>
              <div className="flex justify-end mt-4">
                <Link
                  to={`/feedback/${project.id}`}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
                >
                  dar Feedback
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
