import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteMentorship,
  fetchMentorshipById,
  fetchMyMentorships,
  fetchMyProjects,
  fetchUserProfile,
  requestMentorUpgrade,
  updateMentorshipStatus,
} from "../../api/queries";

import Loading from "../../components/ux/Loading";
import { Cog, Eye, Lightbulb, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { ProjectCard } from "../../components/ui/card/ProjectCard";

import type { ProjectSummary, MentorshipSummary } from "../../types";
import { useState } from "react";
import Modal from "../../components/ui/modal/Modal";
import ProjectForm from "../../components/ui/project-form/ProjectForm";
import ProjectDetailPage from "../ProjectDetailPage";

import { Button } from "../../components/button/RoundedButton";
import { useAuthZustand } from "../../hooks/useAuthZustand";
import toast from "react-hot-toast";
import { MentorshipCard } from "../../components/ui/card/Mentorshipcard";
import MentorshipForm from "../../components/ui/mentorship/MentorshipForm";

const MentorDashboard = () => {
  const [viewingProjectSlug, setViewingProjectSlug] = useState<string | null>(
    null
  );
  const [editingProjectSlug, setEditingProjectSlug] = useState<string | null>(
    null
  );
  const [editingMentorshipId, setEditingMentorshipId] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<"project" | "mentorship">(
    "project"
  );

  const queryClient = useQueryClient();
  const { user } = useAuthZustand();

  const handleProjectView = (projectSlug: string) => {
    setViewingProjectSlug(projectSlug);
    setEditingProjectSlug(null);
    setModalContent("project");
    setIsModalOpen(true);
  };

  const handleProjectEdit = (projectSlug: string) => {
    setEditingProjectSlug(projectSlug);
    setViewingProjectSlug(null);
    setModalContent("project");
    setIsModalOpen(true);
  };

  const handleMentorshipEdit = (mentorshipId: number) => {
    setEditingMentorshipId(mentorshipId);
    setModalContent("mentorship");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setViewingProjectSlug(null);
    setEditingProjectSlug(null);
    setEditingMentorshipId(null);
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

  const { data: mentorships, isLoading: isLoadingMentorships } = useQuery<
    MentorshipSummary[]
  >({
    queryKey: ["myMentorships"],
    queryFn: fetchMyMentorships,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: user?.role === "mentor" || user?.role === "administrator",
  });

  const { data: editingMentorshipData } = useQuery({
    queryKey: ["mentorship", editingMentorshipId],
    queryFn: () => fetchMentorshipById(editingMentorshipId!),
    enabled: !!editingMentorshipId,
  });

  const deleteMentorshipMutation = useMutation({
    mutationFn: deleteMentorship,
    onSuccess: () => {
      toast.success("Mentoría eliminada correctamente");
      queryClient.invalidateQueries({ queryKey: ["myMentorships"] });
    },
    onError: (error: any) => {
      toast.error(`Error al eliminar: ${error.message}`);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({
      mentorshipId,
      newStatus,
    }: {
      mentorshipId: number;
      newStatus: "active" | "inactive" | "paused";
    }) => updateMentorshipStatus(mentorshipId, newStatus),
    onSuccess: () => {
      toast.success("Estado actualizado");
      queryClient.invalidateQueries({ queryKey: ["myMentorships"] });
    },
    onError: (error: any) => {
      toast.error(`Error al actualizar estado: ${error.message}`);
    },
  });

  const handleMentorshipDelete = (mentorshipId: number) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta mentoría?")
    ) {
      deleteMentorshipMutation.mutate(mentorshipId);
    }
  };

  const handleToggleStatus = (mentorshipId: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    toggleStatusMutation.mutate({
      mentorshipId,
      newStatus: newStatus as "active" | "inactive" | "paused",
    });
  };

  const requestMentorMutation = useMutation({
    mutationFn: requestMentorUpgrade,
    onSuccess: () => {
      toast.success(
        "Solicitud enviada. Recibirás una notificación con la respuesta del administrador."
      );
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "Ocurrió un error al enviar la solicitud.";
      toast.error(errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen text-center flex items-center justify-center">
        <Loading message="perfil" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <p className="text-red-500">
          Error al cargar el perfil: {error.message}
        </p>
        <Link to="/" className="text-blue-600 hover:underline">
          Volver
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <p>No se encontraron datos del perfil. Contacta al administrador.</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Sección de Perfil */}
      <div className="p-6 rounded-lg shadow-md mb-5 border transition-all duration-200 bg-bg-light dark:bg-bg-dark border-divider dark:border-border hover:shadow-md hover:border-border dark:hover:border-gray-500 dark:hover:bg-bg-hoverdark dark:text-text-dark-text">
        <div className="flex justify-between items-center border-b border-border pb-2">
          <div className="flex justify-center items-baseline gap-3">
            <h2 className="text-2xl font-semibold">Mi Perfil</h2>
            <span className="text-xs text-yellow-800 dark:text-yellow-400">
              {data.publicProfile ? "Publico" : "Privado"}
            </span>
          </div>
          <div className="flex space-x-4">
            <Link to="/profile/edit">
              <Cog
                size={23}
                className="hover:text-yellow-400 transition-all duration-200"
              />
            </Link>
            <Link to="/profile">
              <Eye
                size={23}
                className="hover:text-yellow-400 transition-all duration-200"
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
        </div>
      </div>

      {/* Sección de Mentorías - Solo para mentores */}
      {(user?.role === "mentor" || user?.role === "administrator") && (
        <div className="p-6 rounded-lg shadow-md mb-5 border transition-all duration-200 bg-bg-light dark:bg-bg-dark border-divider dark:border-border hover:shadow-md hover:border-border dark:hover:border-gray-500 dark:hover:bg-bg-hoverdark dark:text-text-dark-text">
          <div className="flex justify-between items-center border-b pb-2 mb-4 border-border">
            <h2 className="text-2xl font-semibold">Mis Mentorías</h2>
            <Link
              to="/create-mentorship"
              className="text-sm font-semibold shadow-sm flex items-center transition duration-200 hover:text-white border border-black hover:bg-blue-500 rounded-lg py-1 px-1.5 text-center dark:border-white dark:hover:border-blue-500 dark:hover:text-white dark:hover:bg-blue-400"
            >
              <Brain strokeWidth={2} size={23} /> <span>Crear</span>
            </Link>
          </div>

          {isLoadingMentorships ? (
            <Loading message="mentorías" />
          ) : (
            <div className="space-y-4 mt-4">
              {mentorships && mentorships.length > 0 ? (
                mentorships.map((mentorship) => (
                  <MentorshipCard
                    key={mentorship.id}
                    mentorship={mentorship}
                    onEdit={handleMentorshipEdit}
                    onDelete={handleMentorshipDelete}
                    onToggleStatus={handleToggleStatus}
                  />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No tienes mentorías creadas aún. ¡Crea tu primera mentoría!
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Sección de Proyectos */}
      <div className="p-6 rounded-lg shadow-md mb-5 border transition-all duration-200 bg-bg-light dark:bg-bg-dark border-divider dark:border-border hover:shadow-md hover:border-border dark:hover:border-gray-500 dark:hover:bg-bg-hoverdark dark:text-text-dark-text">
        <div className="flex justify-between items-center border-b pb-2 mb-4 border-border">
          <h2 className="text-2xl font-semibold">Mis Proyectos</h2>
          <Link
            to="/create-project"
            className="text-sm font-semibold shadow-sm flex items-center transition duration-200 hover:text-white border border-black hover:bg-yellow-500 rounded-lg py-1 px-1.5 text-center dark:border-white dark:hover:border-yellow-500 dark:hover:text-white dark:hover:bg-yellow-400"
          >
            <Lightbulb strokeWidth={2} size={23} /> <span>Crear</span>
          </Link>
        </div>

        <ul className="space-y-4 mt-4">
          {projects?.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              variant="compact"
              onEdit={handleProjectEdit}
              onView={handleProjectView}
            />
          ))}
        </ul>
      </div>

      {/* Sección de Feedbacks */}
      <div className="p-6 bg-white text-text-main dark:bg-bg-dark dark:text-text-light rounded-lg shadow-md mb-5">
        <h2 className="text-2xl font-semibold border-b border-gray-500 pb-2">
          Feedbacks
        </h2>
        <div className="mt-4 gap-4">
          <div>
            <h3>Feedbacks enviados</h3>
            <ul>
              {data.feedbackGiven.map((feedback) => (
                <li key={feedback.id}>
                  {feedback.relatedProjectTitle}
                  <span className="text-gray-500">
                    - {feedback.feedbackDescription} - {feedback.rating}⭐
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Sección de Kudos */}
      <div className="p-6 bg-white text-text-main dark:bg-bg-dark dark:text-text-light rounded-lg shadow-md mb-5">
        <h2 className="text-2xl font-semibold border-b border-gray-500 pb-2">
          Reconocimientos/Kudos
        </h2>
        <ul>
          {data.kudosReceived.map((kudo) => (
            <li key={kudo.id}>
              <span className="text-gray-500">{kudo.message}</span> -
              {kudo.senderUsername}
              <span className="text-gray-500">
                {" "}
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

      {/* Modal para proyectos y mentorías */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          modalContent === "project"
            ? editingProjectSlug
              ? "Editar Proyecto"
              : "Detalles del Proyecto"
            : "Editar Mentoría"
        }
      >
        {modalContent === "project" && viewingProjectSlug && (
          <ProjectDetailPage slug={viewingProjectSlug} />
        )}
        {modalContent === "project" && editingProjectSlug && (
          <ProjectForm
            projectSlug={editingProjectSlug}
            onClose={handleCloseModal}
          />
        )}
        {modalContent === "mentorship" &&
          editingMentorshipId &&
          editingMentorshipData && (
            <MentorshipForm
              mentorshipId={editingMentorshipId}
              initialData={editingMentorshipData}
              onClose={handleCloseModal}
            />
          )}
      </Modal>
    </div>
  );
};

export default MentorDashboard;
