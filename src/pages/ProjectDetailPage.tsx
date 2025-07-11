import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProjectById, fetchFeedbackForProject } from "../api/queries";

// Importamos todos los componentes que hemos creado
import { ProjectMainContent } from "../components/ui/project-detail/ProjectMainContent";

import Loading from "../components/ux/Loading";
import { FeedbackCard } from "../components/ui/card/FeedbackCard";
import { FeedbackForm } from "../components/ui/feedback-form/FeedbackForm";
import { ProjectSidePanel } from "../components/ui/project-detail/ProjectSidePanel";

const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  // Query para obtener los detalles del proyecto
  const {
    data: project,
    isLoading: isLoadingProject,
    isError: isErrorProject,
  } = useQuery({
    queryKey: ["projectDetail", projectId],
    queryFn: () => fetchProjectById(projectId!),
    enabled: !!projectId, // La query solo se ejecuta si projectId existe
  });

  // Query para obtener la lista de feedbacks
  const {
    data: feedbackList,
    isLoading: isLoadingFeedback,
  } = useQuery({
    queryKey: ["feedback", projectId],
    queryFn: () => fetchFeedbackForProject(projectId!),
    enabled: !!projectId,
  });

  // --- Renderizado ---

  if (isLoadingProject) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loading message="Cargando detalles del proyecto..." />
      </div>
    );
  }

  if (isErrorProject || !project) {
    return (
      <div className="text-center mt-20 text-red-600">
        <h2 className="text-2xl font-bold">Error</h2>
        <p>No se pudo encontrar el proyecto.</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Volver a la página principal
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* --- Columna Izquierda (Contenido Principal) --- */}
          <main className="lg:col-span-2 space-y-12">
            <ProjectMainContent project={project} />
            <FeedbackForm projectId={projectId!} />

            {/* Lista de Feedbacks */}
            <section className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3">
                Feedback de la Comunidad ({feedbackList?.length || 0})
              </h3>
              {isLoadingFeedback ? (
                <Loading message="Cargando feedback..." />
              ) : (
                feedbackList?.map((feedback) => (
                  <FeedbackCard key={feedback.id} feedback={feedback} />
                ))
              )}
              {!isLoadingFeedback && feedbackList?.length === 0 && (
                <div className="text-center py-10 bg-white rounded-lg border border-dashed">
                  <p className="text-gray-500">
                    Aún no hay feedback para este proyecto. ¡Sé el primero!
                  </p>
                </div>
              )}
            </section>
          </main>

          {/* --- Columna Derecha (Sidebar) --- */}
          <ProjectSidePanel project={project} feedbackList={feedbackList} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
