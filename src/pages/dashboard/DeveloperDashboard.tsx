import { useQuery } from "@tanstack/react-query";
import { fetchMyProjects, fetchUserData } from "../../api/queries";
import Loading from "../../components/ux/Loading";

import { Link } from "react-router-dom";
import { ProjectCard } from "../../components/ui/card/ProjectCard";
import type { ProjectSummary } from "../../types";
import { useState } from "react";
import ProjectDetailModal from "../../components/ui/modal/ProjectDetailModal";
import ProjectEditModal from "../../components/ui/modal/ProjectEditModal";

const DeveloperDashboard = () => {
  const [viewingProjectId, setViewingProjectId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectView = (projectId: string) => {
    setViewingProjectId(projectId);
    setIsModalOpen(true);
  };

  const handleProjectEdit = (projectId: string) => {
    setEditingProjectId(projectId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setViewingProjectId(null);
    setEditingProjectId(null);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
    staleTime: 1000 * 60 * 60,
  });

  const { data: projects } = useQuery<ProjectSummary[]>({
    queryKey: ["myProjects"],
    queryFn: fetchMyProjects,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  /** renderizado declarativo */
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="h-screen text-center flex items-center justify-center">
          <Loading message="perfil" />
        </div>
      );
    }

    if (isError) {
      return (
        <>
          <p className="text-red-500">
            Error al cargar el perfil: {error.message}
          </p>
          <a href="/">
            <span>volver</span>
          </a>
        </>
      );
    }

    if (!data) {
      return (
        <>
          <p>No se encontraron datos del perfil. Contacta al administrador.</p>
          <a href="/">
            <span>volver</span>
          </a>
        </>
      );
    }

    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold border-b pb-2">
          Información de tu Perfil
        </h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <strong>Usuario:</strong> {data.username}
          </p>
          <p>
            <strong>Email:</strong> {data.email}
          </p>
          <p>
            <strong>Nombre:</strong> {data.firstName}
          </p>
          <p>
            <strong>Apellido:</strong> {data.lastName}
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-2xl font-semibold">Mis Proyectos</h2>
            <Link
              to="/create-project"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              + Crear Proyecto
            </Link>
          </div>

          <ul className="space-y-4 mt-4">
            {projects?.map((project) => (
              <li key={project.id}>
                <ProjectCard
                  key={project.id}
                  project={project}
                  variant="compact"
                  onEdit={handleProjectEdit} // <--- Pasamos la función de editar
                  onDelete={(id) => console.log(`Borrar proyecto ${id}`)} // <--- Pasamos la función de borrar
                  onView={handleProjectView} // <--- Pasamos la función de ver
                />
              </li>
            ))}
          </ul>
        </div>
        
        {/* renderizando los modals */}
        {viewingProjectId && (
          <ProjectDetailModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            projectId={viewingProjectId}
          />
        )}
        {editingProjectId && (
          <ProjectEditModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            projectId={editingProjectId}
          />
        )}
      </div>
    );
  };

  return <div className="p-6">{renderContent()}</div>;
};

export default DeveloperDashboard;
