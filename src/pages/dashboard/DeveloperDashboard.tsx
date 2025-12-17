import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchMyProjects,
  fetchUserProfile,
  requestMentorUpgrade,
} from "../../api/queries";
import Loading from "../../components/ux/Loading";
import { Cog, Eye, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { ProjectCard } from "../../components/ui/card/ProjectCard";
import type { ProjectSummary } from "../../types";
import { useState } from "react";
import Modal from "../../components/ui/modal/Modal";
import ProjectForm from "../../components/ui/project-form/ProjectForm";
import ProjectDetailPage from "../ProjectDetailPage";
import { Button } from "../../components/button/RoundedButton";
import { useAuthZustand } from "../../hooks/useAuthZustand";
import toast from "react-hot-toast";

const DeveloperDashboard = () => {
  const [viewingProjectSlug, setViewingProjectSlug] = useState<string | null>( // Estado para el proyecto que se está viendo
    null
  );
  const [editingProjectSlug, setEditingProjectSlug] = useState<string | null>( // Estado para el proyecto que se está editando
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient(); // Obtener el cliente de consulta

  const { user } = useAuthZustand();

  const handleProjectView = (projectSlug: string) => {
    setViewingProjectSlug(projectSlug);
    setEditingProjectSlug(null);
    setIsModalOpen(true);
  };

  const handleProjectEdit = (projectSlug: string) => {
    setEditingProjectSlug(projectSlug);
    setViewingProjectSlug(null);
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

  const requestMentorMutation = useMutation({
    mutationFn: requestMentorUpgrade,
    onSuccess: () => {
      toast.success(
        "Solicitud enviada. Recibirás una notificación con la respuesta del administrador."
      );
    },
    onError: (error: any) => {
      // Capturamos el error 403 (validación de proyectos o de 24 horas)
      const errorMessage =
        error.response?.data?.message ||
        "Ocurrió un error al enviar la solicitud.";
      toast.error(errorMessage);
    },
    onSettled: () => {
      // Invalida el perfil para que el botón refleje que hay una solicitud pendiente
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
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
        <div
          className="p-6 rounded-lg shadow-md mb-5 border transition-all duration-200 bg-bg-light dark:bg-bg-dark border-divider dark:border-border hover:shadow-md hover:border-border dark:hover:border-gray-500
        dark:hover:bg-bg-hoverdark dark:text-text-dark-text"
        >
          <div className="flex justify-between items-center border-b border-border pb-2">
            <div className="flex justify-center items-baseline gap-3">
              <h2 className="text-2xl font-semibold ">Mi Perfil</h2>
              <span className="text-xs text-yellow-800 dark:text-yellow-400">
                {data.publicProfile ? "Publico" : "Privado"}
              </span>
            </div>
            {/* --- Botones ver y editar perfil--- */}
            <div className="flex space-x-4">
              <Link to="/profile/edit">
                <Cog
                  size={23}
                  className=" hover:text-yellow-400 transition-all duration-200 text-sm"
                />
              </Link>
              <Link to="/profile">
                <Eye
                  size={23}
                  className=" hover:text-yellow-400 transition-all duration-200 text-sm"
                />
              </Link>
            </div>
          </div>
          <div className="mt-4 grid-cols-1 md:grid-cols-2 gap-4">
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
            <p>
              <strong>Rol:</strong> {user?.role}
            </p>
            <div>
              {/* Lógica para mostrar el botón de Solicitud */}
              {projects?.length < 3 && user?.role === "dev" && (
                <span className="text-xs text-red-400">
                  Publica 3 proyectos para poder cambiar tu rol a mentor
                </span>
              )}

              {/* Condición para mostrar el botón de solicitud */}
              {projects?.length >= 3 && user?.role === "dev" && (
                <Button
                  variant="outline"
                  className="text-xs text-red-400"
                  onClick={() => requestMentorMutation.mutate()} // Llamada a la mutación
                  disabled={requestMentorMutation.isPending} // Deshabilitar mientras está cargando
                >
                  {requestMentorMutation.isPending
                    ? "Enviando Solicitud..."
                    : "Solicitar Cambio A Mentor"}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div
          className="p-6 rounded-lg shadow-md mb-5 border transition-all duration-200 bg-bg-light dark:bg-bg-dark border-divider dark:border-border hover:shadow-md hover:border-border dark:hover:border-gray-500
        dark:hover:bg-bg-hoverdark dark:text-text-dark-text"
        >
          <div className="flex justify-between items-center border-b pb-2 mb-4 border-border">
            <h2 className="text-2xl font-semibold">Mis Proyectos</h2>
            <Link
              to="/create-project"
              className="text-sm font-semibold  shadow-sm flex items-center transition duration-200  hover:text-white border border-black hover:bg-yellow-500   rounded-lg  py-1 px-1.5 text-center  dark:border-white dark:hover:border-yellow-500  dark:hover:text-white dark:hover:bg-yellow-400"
            >
              <Lightbulb strokeWidth={2} size={23} /> <span>Crear</span>
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
                //onDelete={handleProjectDelete} // <--- TODO: borrar pendiente*
              />
            ))}
          </ul>
        </div>

        {/* renderizando los modals */}
        {/* renderizando los modals */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={
            editingProjectSlug ? "Editar Proyecto" : "Detalles del Proyecto"
          }
        >
          {viewingProjectSlug && (
            <ProjectDetailPage slug={viewingProjectSlug} />
          )}
          {editingProjectSlug && (
            <ProjectForm
              projectSlug={editingProjectSlug}
              onClose={handleCloseModal}
            />
          )}
        </Modal>

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
                <span className="text-gray-500">
                  - {kudo.relatedProjectTitle}
                </span>
                <span className="text-gray-500">
                  - {kudo.isPublic ? "Publico" : "Privado"}
                </span>
                {kudo.isPublic ? (
                  <Button variant="outline">Cambiar a privado</Button>
                ) : (
                  <Button variant="outline">Cambiar a publico</Button>
                )}
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
