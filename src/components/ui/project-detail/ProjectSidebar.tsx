import type { ProjectDetailResponse, FeedbackResponse } from "../../../types";
import {
  Star,
  ExternalLink,
  Github,
  Users,
  Lightbulb,
} from "lucide-react";

interface ProjectSidebarProps {
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
    <div className="flex items-center gap-2 text-gray-600">
      {icon}
      <span>{label}</span>
    </div>
    <span className="font-bold text-gray-800">{value}</span>
  </div>
);

export const ProjectSidebar = ({
  project,
  feedbackList,
}: ProjectSidebarProps) => {
  // Calculamos el rating promedio
  const averageRating =
    feedbackList && feedbackList.length > 0
      ? (
          feedbackList.reduce((acc, f) => acc + f.rating, 0) /
          feedbackList.length
        ).toFixed(1)
      : "N/A";

  return (
    <aside className="sticky top-8">
      <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200 space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3">
          Detalles
        </h3>

        {/* Información clave */}
        <div className="space-y-3">
          <InfoRow
            icon={<Star size={16} />}
            label="Rating Promedio"
            value={averageRating}
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
        </div>

        {/* Botones de acción */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <a
            href={project.projectUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            <ExternalLink size={18} />
            Visitar Proyecto
          </a>
          <a
            href={project.repositoryUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md bg-gray-800 text-white font-semibold hover:bg-gray-900 transition-colors"
          >
            <Github size={18} />
            Ver Repositorio
          </a>
        </div>
      </div>
    </aside>
  );
};
