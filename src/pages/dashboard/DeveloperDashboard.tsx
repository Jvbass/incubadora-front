import { useQuery } from "@tanstack/react-query";
import { fetchMyProjects, fetchUserProfile } from "../../api/queries";
import Loading from "../../components/ux/Loading";

import { Link } from "react-router-dom";
import { ProjectCard } from "../../components/ui/card/ProjectCard";
import type { ProjectSummary } from "../../types";
import { useState } from "react";
import ProjectDetailModal from "../../components/ui/modal/ProjectDetailModal";
import ProjectEditModal from "../../components/ui/modal/ProjectEditModal";

const DeveloperDashboard = () => {
  const [viewingProjectSlug, setViewingProjectSlug] = useState<string | null>(
    null
  );
  const [editingProjectSlug, setEditingProjectSlug] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectView = (projectSlug: string) => {
    setViewingProjectSlug(projectSlug);
    setIsModalOpen(true);
  };

  const handleProjectEdit = (projectSlug: string) => {
    setEditingProjectSlug(projectSlug);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setViewingProjectSlug(null);
    setEditingProjectSlug(null);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
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
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="p-6 bg-white text-text-main dark:bg-bg-dark dark:text-text-light rounded-lg shadow-md mb-5 ">
          <div className="flex justify-between items-center border-b border-gray-500 pb-2">
            <h2 className="text-2xl font-semibold">Información de tu Perfil</h2>
            {/* --- Botones ver y editar perfil--- */}
            <div>
              <Link
                to="/profile/edit"
                className="px-4 py-2 m-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Editar Perfil
              </Link>
              <Link
                to="/profile"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Ver Perfil Completo
              </Link>
            </div>
          </div>
          <div className="mt-4 grSlug grSlug-cols-1 md:grSlug-cols-2 gap-4">
            <p>
              <strong>Nombre:</strong> {data.firstName}
            </p>
            <p>
              <strong>Apellido:</strong> {data.lastName}
            </p>
            <p>
              <strong>Email:</strong> {data.email}
            </p>
            <p>
              <strong>Slug:</strong> /{data.slug}
            </p>
          </div>
        </div>

        <div className="p-6 bg-white text-text-main dark:bg-bg-dark dark:text-text-light rounded-lg shadow-md mb-5">
          <div className="flex justify-between items-center border-b pb-2 mb-4 border-gray-500">
            <h2 className="text-2xl font-semibold">Mis Proyectos</h2>
            <Link
              to="/create-project"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              + Crear Proyecto
            </Link>
          </div>

          {/*Lista de proyectos */}
          <ul className="space-y-4 mt-4">
            {projects?.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                variant="compact"
                onEdit={handleProjectEdit} // <--- Pasamos la función de editar
                onView={handleProjectView} // <--- Pasamos la función de ver
                //onDelete={handleProjectDelete} // <--- borrar pendiente*
              />
            ))}
          </ul>
        </div>

        {/* renderizando los modals */}
        {viewingProjectSlug && (
          <ProjectDetailModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            projectSlug={viewingProjectSlug}
          />
        )}
        {editingProjectSlug && (
          <ProjectEditModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            projectSlug={editingProjectSlug}
          />
        )}

        <div className="p-6 bg-white text-text-main dark:bg-bg-dark dark:text-text-light rounded-lg shadow-md mb-5">
          <h2 className="text-2xl font-semibold border-b border-gray-500 pb-2">
            Feedbacks
          </h2>
          <div className=" mt-4  gap-4">
            <div>
              <h3> Feedbacks enviados</h3>
              <ul>
                {data.feedbackGiven.map((feedback) => (
                  <li key={feedback.id}>
                    {feedback.relatedProjectTitle}
                    {
                      <span className="text-gray-500">
                        - {feedback.feedbackDescription} - {feedback.rating}⭐
                      </span>
                    }
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white text-text-main dark:bg-bg-dark dark:text-text-light rounded-lg shadow-md mb-5">
          <h2 className="text-2xl font-semibold border-b  border-gray-500 pb-2">
            Reconocimientos/Kudos
          </h2>
          <ul>
            {data.kudosReceived.map((kudo) => (
              <li key={kudo.id}>
                <span className="text-gray-500">{kudo.message}</span> -
                {kudo.senderUsername}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return <div className="p-8 mx-auto">{renderContent()}</div>;
};

export default DeveloperDashboard;
