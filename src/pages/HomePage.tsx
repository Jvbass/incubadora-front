import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../api/queries";
import type { ListProjects } from "../types";
import Loading from "../components/ui/ux/Loading";
import "../index.css";
import { ProjectCard } from "../components/ui/card/ProjectCard";

const HomePage = () => {
  const { data, isLoading, isError, error } = useQuery<ListProjects[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 60,
  });

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
        <div className="p-8 h-screen w-max text-center font-bold">
          Error al cargar lsita de proyectos: {error.message}
        </div>
      );
    }

    if (!data) {
      return (
        <div className="p-8 h-screen w-max text-center font-bold">
          No se encontraron proyectos
        </div>
      );
    }

    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Lista de proyectos</h1>
        </div>
        <div className="mt-6">
          <ul className="space-y-4 mt-4">
            {data?.map((project) => (
              <ProjectCard key={project.id} project={project} variant="full" />
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return <div className="p-6">{renderContent()}</div>;
};

export default HomePage;
