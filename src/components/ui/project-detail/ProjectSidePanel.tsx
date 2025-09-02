import type { ProjectDetailResponse, FeedbackResponse } from "../../../types";
import {
  Star,
  ExternalLink,
  Github,
  Users,
  Lightbulb,
  TrendingUp,
  Flag,
} from "lucide-react";
import { useProjectRating } from "../../../hooks/useProjectRating";

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

  return (
    <aside>
      <div className="p-6 w-76 bg-white dark:bg-bg-dark text-gray-800 dark:text-text-light rounded-lg shadow-md space-y-6 fixed top-26 right-5">
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

        {/* Botones de acción */}
        <div className="space-y-3 text-accent-900 dark:text-cta-300">
          <h3 className="text-xl font-semibold border-b  dark:border-text-light border-gray-200 pb-3 text-gray-800 dark:text-text-light">
            Acciones
          </h3>

          <div className="flex items-center justify-start gap-2 w-full hover:text-cta-600 transition ease-in-out duration-200">
            <a
              href={project.projectUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink size={18} />
              <span>Proyecto desplegado</span>
            </a>
          </div>
          <div className="flex items-center justify-start gap-2 w-full hover:text-cta-600 transition ease-in-out duration-200">
            <a
              href={project.projectUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github size={18} />
              <span>Repositorio</span>
            </a>
          </div>
          <div className="flex items-center justify-start gap-2 w-full hover:text-cta-900 transition ease-in-out duration-200">
            <a
              href={project.projectUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Flag size={18} />
              <span>Reportar</span>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};
