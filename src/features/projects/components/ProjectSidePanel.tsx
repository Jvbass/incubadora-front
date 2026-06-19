import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { ProjectDetailResponse, FeedbackResponse } from "../../../types";
import {
  Star,
  ExternalLink,
  Github,
  Users,
  Lightbulb,
  TrendingUp,
  HeartHandshake,
  Tag,
} from "lucide-react";
import { useProjectRating } from "../../../hooks/useProjectRating";
import { useAuthStore } from "../../../stores/authStore";
import { updateProjectVersion } from "../../../api/projectApi";
import ProjectInteractionModal, {
  type ProjectInteractionMode,
} from "./ProjectInteractionModal";
import ReportFlagButton from "../../reports/components/ReportFlagButton";

// Mismo patrón de validación que el backend: vX.Y(.Z), máx. 30 caracteres.
const VERSION_PATTERN = /^v?\d+\.\d+(\.\d+)?$/;
const MAX_VERSION_LENGTH = 30;
const MAX_NOTE_LENGTH = 500;

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

// Editor de versión visible solo para el dueño del proyecto (G-02).
const VersionEditor = ({ project }: { project: ProjectDetailResponse }) => {
  const queryClient = useQueryClient();
  const [version, setVersion] = useState(project.currentVersion ?? "");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: { version: string; note?: string }) =>
      updateProjectVersion(project.slug, payload),
    onSuccess: () => {
      toast.success("Versión del proyecto actualizada");
      setNote("");
      queryClient.invalidateQueries({
        queryKey: ["projectDetail", project.slug],
      });
    },
    onError: (err: any) => {
      const status = err.response?.status;
      if (status === 403) {
        toast.error("No tienes permiso para cambiar la versión.");
      } else if (status === 400) {
        toast.error(
          err.response?.data?.message ||
            "La versión no es válida. Usa el formato vX.Y o X.Y.Z."
        );
      } else {
        toast.error(
          err.response?.data?.message || "No se pudo actualizar la versión."
        );
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = version.trim();

    if (!trimmed) {
      setError("Ingresa una versión.");
      return;
    }
    if (trimmed.length > MAX_VERSION_LENGTH) {
      setError(`Máximo ${MAX_VERSION_LENGTH} caracteres.`);
      return;
    }
    if (!VERSION_PATTERN.test(trimmed)) {
      setError("Formato inválido. Usa vX.Y o X.Y.Z (ej. v1.2 o 1.0.0).");
      return;
    }

    setError(null);
    mutation.mutate({
      version: trimmed,
      note: note.trim() ? note.trim() : undefined,
    });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold border-b dark:border-text-light border-gray-200 pb-3 text-gray-800 dark:text-text-light">
        Versión
      </h3>

      <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-200">
        <Tag size={16} />
        <span>
          Actual:{" "}
          <span className="font-medium text-gray-800 dark:text-text-light">
            {project.currentVersion ?? "Sin versión"}
          </span>
        </span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          maxLength={MAX_VERSION_LENGTH}
          placeholder="v1.0.0"
          aria-label="Nueva versión"
          className="w-full text-sm rounded-md border border-divider dark:border-gray-700 bg-bg-light dark:bg-bg-dark text-text-main dark:text-text-light px-2 py-1"
        />
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={MAX_NOTE_LENGTH}
          placeholder="Nota de la versión (opcional)"
          aria-label="Nota de la versión"
          rows={2}
          className="w-full text-sm rounded-md border border-divider dark:border-gray-700 bg-bg-light dark:bg-bg-dark text-text-main dark:text-text-light px-2 py-1 resize-none"
        />
        {error && (
          <p className="text-xs font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-cta-600 text-white rounded-md hover:bg-cta-700 transition duration-200 disabled:opacity-50"
        >
          <Tag size={16} />
          <span>
            {mutation.isPending ? "Guardando..." : "Actualizar versión"}
          </span>
        </button>
      </form>
    </div>
  );
};

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

        {/* Editor de versión (solo dueño) */}
        {isOwner && <VersionEditor project={project} />}

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

        {/* Reportar proyecto (discreto, oculto para el dueño) */}
        <div className="flex justify-end pt-1">
          <ReportFlagButton
            contentType="PROJECT"
            contentId={project.id}
            contentLabel={project.title}
            ownerUsername={project.developerUsername}
            label="Reportar"
            size={14}
          />
        </div>
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
