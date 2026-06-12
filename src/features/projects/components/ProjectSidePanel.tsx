import { useState } from "react";
import type { ProjectDetailResponse, FeedbackResponse } from "../../../types";
import {
  Star,
  ExternalLink,
  Github,
  Users,
  Lightbulb,
  TrendingUp,
  HeartHandshake,
} from "lucide-react";
import { useProjectRating } from "../../../hooks/useProjectRating";
import { useAuthStore } from "../../../stores/authStore";
import ProjectInteractionModal, {
  type ProjectInteractionMode,
} from "./ProjectInteractionModal";

interface ProjectSidePanelProps {
  project: ProjectDetailResponse;
  feedbackList: FeedbackResponse[] | undefined;
}

// Componente para una fila de información en la sidebar
const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-200">
      {icon}
      <span>{label}:</span>
    </div>
    <span className="font-medium text-sm text-gray-800 dark:text-text-light ">
      {value}
    </span>
  </div>
);

export const ProjectSidePanel = ({
  project,
  feedbackList,
}: ProjectSidePanelProps) => {
  const { averageRatingFormatted } = useProjectRating(feedbackList);
  const { user } = useAuthStore();
  const [interactionMode, setInteractionMode] =
    useState<ProjectInteractionMode | null>(null);

  const isOwner = user?.username === project.developerUsername;
  const isMentor = user?.role === "MENTOR" || user?.role === "ADMINISTRATOR";
  const canOfferMentoring = project.needMentoring && isMentor && !isOwner;
  const canCollaborate = project.isCollaborative && !isOwner;

  return (
    <aside className="lg:col-span-1">
      <div className="p-6 w-full bg-white dark:bg-bg-dark text-gray-800 dark:text-text-light rounded-lg shadow-md space-y-6 lg:sticky lg:top-24">
        <h3 className="text-xl font-semibold border-b border-gray-200 pb-3">
          Detalles
        </h3>

        {/* Información clave */}
        <div className="space-y-3">
          <InfoRow
            icon={<Star size={16} />}
            label="Rating"
            value={averageRatingFormatted}
          />
          <InfoRow
            icon={<Users size={16} />}
            label="Colaborativo"
            value={project.isCollaborative ? "Sí" : "No"}
          />
          <InfoRow
            icon={<Lightbulb size={16} />}
            label="Busca Mentor"
            value={project.needMentoring ? "Sí" : "No"}
          />
          <InfoRow
            icon={<TrendingUp size={16} />}
            label="Progreso"
            value={project.developmentProgress + "%"}
          />
        </div>

        {/* Botones de interacción (mentoría / colaboración) */}
        {(canOfferMentoring || canCollaborate) && (
          <div className="space-y-2">
            {canOfferMentoring && (
              <button
                onClick={() => setInteractionMode("mentoring")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
              >
                <Lightbulb size={18} />
                <span>Ofrecer mentoría</span>
              </button>
            )}
            {canCollaborate && (
              <button
                onClick={() => setInteractionMode("collaboration")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition duration-200"
              >
                <HeartHandshake size={18} />
                <span>Quiero colaborar</span>
              </button>
            )}
          </div>
        )}

        {/* Enlaces: visibles solo si el proyecto los tiene */}
        {(project.projectUrl || project.repositoryUrl) && (
          <div className="space-y-3 text-accent-900 dark:text-cta-300">
            <h3 className="text-xl font-semibold border-b  dark:border-text-light border-gray-200 pb-3 text-gray-800 dark:text-text-light">
              Enlaces
            </h3>

            {project.projectUrl && (
              <div className="flex items-center justify-start gap-2 w-full hover:text-cta-600 transition ease-in-out duration-200">
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink size={18} />
                  <span>Proyecto desplegado</span>
                </a>
              </div>
            )}
            {project.repositoryUrl && (
              <div className="flex items-center justify-start gap-2 w-full hover:text-cta-600 transition ease-in-out duration-200">
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github size={18} />
                  <span>Repositorio</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de interacción */}
      {interactionMode && (
        <ProjectInteractionModal
          isOpen={!!interactionMode}
          onClose={() => setInteractionMode(null)}
          projectSlug={project.slug}
          projectTitle={project.title}
          mode={interactionMode}
        />
      )}
    </aside>
  );
};
