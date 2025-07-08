import { useQuery } from "@tanstack/react-query";
import { fetchProjectById } from "../../../api/queries";
import Loading from "../../ux/Loading";

interface ProjectDetailModalProps {
  projectId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailModal = ({
  projectId,
  isOpen,
  onClose,
}: ProjectDetailModalProps) => {
  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["projectDetail", projectId],
    queryFn: () => fetchProjectById(projectId!),
    enabled: !!projectId,
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (!isOpen) return null;

  return (
    // Backdrop semitransparente
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-xs transition-opacity duration-500"
    >
      {/* Contenedor del Modal */}
      <div
        onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal cierre el backdrop
        className="relative w-11/12 max-w-3xl rounded-lg bg-gray-800 text-white shadow-2xl transform transition-all duration-500 ease-in-out scale-95 opacity-0 animate-scale-in"
      >
        {/* Botón para cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white cursor-pointer"
        >
          <span className="text-2xl">X</span>
        </button>

        {/* Contenido del Modal */}
        <div className="p-8">
          {isLoading && (
            <div className="flex justify-center p-10">
              <Loading message="Cargando proyecto..." />
            </div>
          )}
          {isError && (
            <div className="text-red-500">Error: {error.message}</div>
          )}
          {project && (
            <div>
              <h2 className="text-3xl font-bold text-cyan-400 mb-2">
                {project.title}
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                por {project.developerUsername}
              </p>
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
              <p className="text-gray-300 whitespace-pre-wrap">
                {project.description}
              </p>
              {/* Aquí podrías añadir enlaces al repo, etc. */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
