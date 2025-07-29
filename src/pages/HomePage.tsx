// External library imports
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

// Internal imports
import { fetchProjects } from "../api/queries";
import Loading from "../components/ux/Loading";
import { ProjectCard } from "../components/ui/card/ProjectCard";

// Types
import type { ProjectSummary } from "../types";

// Styles
import "../index.css";
import { ProyectHomeSide } from "../components/ui/project-home/ProjectHomeSide";

const HomePage = () => {
  // Query to fetch all published projects for homepage display
  const { data, isLoading, isError } = useQuery<ProjectSummary[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="h-screen text-center flex items-center justify-center">
          <Loading message="proyectos" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="p-8 h-screen w-full text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              No se pueden cargar los proyectos
            </h2>
            <p className="text-gray-600 mb-4">
              Tenemos problemas para cargar los proyectos. Intenta denuevo más
              tarde.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="p-8 h-screen w-full text-center font-bold">
          No se encontraron proyectos para mostrar
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-8">
        <main className="lg:col-span-3 space-y-12">
          <h1 className="text-2xl text-zinc-900 dark:text-zinc-50 mb-4 font-semibold">
            Últimos Proyectos
          </h1>
          <ul className="space-y-4 ">
            {data.map((project) => (
              <Link
                to={`/project/${project.slug}`}
                key={project.id}
                className="block hover:opacity-90 transition-opacity"
              >
                <ProjectCard project={project} variant="full" />
              </Link>
            ))}
          </ul>
          <div className="flex items-center justify-center mt-4 ">
            <Link
              to="/projects"
              className="border border-border rounded-full p-1.5 w-full text-center text-text-soft dark:text-text-light
              hover:text-brand-300 hover:border-brand-300  hover:bg-brand-100 ease-in transition-all duration-200 "
            >
              Cargar más
            </Link>
          </div>
        </main>
        <ProyectHomeSide />
      </div>
    </div>
  );
};

export default HomePage;
