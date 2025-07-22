import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom"; // Importamos Link para la navegación
import { fetchProjects } from "../api/queries";
import type { ProjectSummary } from "../types";
import Loading from "../components/ux/Loading";
import { ProjectCard } from "../components/ui/card/ProjectCard";
import "../index.css";

const HomePage = () => {
  // Query para obtener la lista de todos los proyectos
  const { data, isLoading, isError, error } = useQuery<ProjectSummary[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 60, // Cache de 1 hora
  });

  // Función para renderizar el contenido principal de la página
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="h-screen text-center flex items-center justify-center">
          <Loading message="lista de proyectos" />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="p-8 h-screen w-full text-center font-bold">
          Error al cargar lista de proyectos: {error.message}
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="p-8 h-screen w-full text-center font-bold">
          No se encontraron proyectos
        </div>
      );
    }

    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Explora Proyectos</h1>
        </div>
        <div className="mt-6">
          <ul className="space-y-4 mt-4">
            {data?.map((project) => (
              // Envolvemos cada ProjectCard con un Link que dirige a la página de detalles
              <Link
                to={`/project/${project.slug}`}
                key={project.id}
                className="block  transition-opacity" // 'block' para que el enlace ocupe todo el espacio de la tarjeta
              >
                <ProjectCard
                  key={project.id}
                  project={project}
                  variant="full"
                />
              </Link>
            ))}
          </ul>
        </div>
        {/* Ya no se necesita el modal aquí */}
      </div>
    );
  };

  return <div className="p-6 bg-gray-50 min-h-screen">{renderContent()}</div>;
};

export default HomePage;
