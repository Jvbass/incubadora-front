import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../api/queries";
import type { ListProjects } from "../types";
import Loading from "../components/ux/Loading";
import { ProjectCard } from "../components/ui/card/ProjectCard";
import { useState } from "react";
import ProjectDetailModal from "../components/ui/modal/ProjectDetailModal";
import "../index.css"

const HomePage = () => {
  const [selectedProject, setSelectedProject] = useState<ListProjects | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery<ListProjects[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 60,
  });

  const handleProjectClick = (project: ListProjects) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

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
              <div
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className="cursor-pointer hover:opacity-90 transition-opacity"
              >
                <ProjectCard
                  key={project.id}
                  project={project}
                  variant="full"
                />
              </div>
            ))}
          </ul>
        </div>
        {selectedProject && (
          <ProjectDetailModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            projectId={selectedProject.id.toString()}
          />
        )}
      </div>
    );
  };

  return <div className="p-6">{renderContent()}</div>;
};

export default HomePage;
