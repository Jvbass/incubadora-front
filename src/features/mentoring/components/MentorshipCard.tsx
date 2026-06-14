import {
  Clock,
  DollarSign,
  Video,
  Edit,
  Archive,
  Rocket,
} from "lucide-react";
import type { MentorshipDetailResponse } from "../../../types";

interface MentorshipCardProps {
  mentorship: MentorshipDetailResponse;
  onEdit?: (slug: string) => void;
  onArchive?: (slug: string) => void;
  onPublish?: (slug: string) => void;
}

const getStatusStyles = (state: string) => {
  switch (state) {
    case "PUBLISHED":
      return "text-green-600 bg-green-50 border-green-200";
    case "DRAFT":
      return "text-yellow-700 bg-yellow-50 border-yellow-200";
    case "ARCHIVED":
      return "text-gray-600 bg-gray-50 border-gray-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

const getStatusLabel = (state: string) => {
  switch (state) {
    case "PUBLISHED":
      return "Publicada";
    case "DRAFT":
      return "Borrador";
    case "ARCHIVED":
      return "Archivada";
    default:
      return state;
  }
};

const getPlatformIcon = (_platform: string) => {
  return <Video size={16} />;
};

export const MentorshipCard = ({
  mentorship,
  onEdit,
  onArchive,
  onPublish,
}: MentorshipCardProps) => {
  return (
    <div className="bg-white text-text-main dark:bg-bg-dark dark:text-text-light p-4 rounded-lg border border-gray-400 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        {/* Información Principal */}
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">{mentorship.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {mentorship.specialty}
          </p>

          {/* Detalles */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-700 dark:text-gray-300">
            {mentorship.durationMinutes != null && (
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{mentorship.durationMinutes} min</span>
              </div>
            )}
            {mentorship.platform && (
              <div className="flex items-center gap-1">
                {getPlatformIcon(mentorship.platform)}
                <span className="capitalize">{mentorship.platform}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <DollarSign size={16} />
              <span>
                {mentorship.isFree
                  ? "Gratis"
                  : `$${mentorship.price?.toFixed(2) || "0.00"}`}
              </span>
            </div>
          </div>

          {/* Fecha de creación */}
          {mentorship.createdAt && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Creada el{" "}
              {new Date(mentorship.createdAt).toLocaleDateString("es-ES")}
            </p>
          )}
        </div>

        {/* Estado y Acciones */}
        <div className="flex flex-col items-end gap-2 ml-4">
          {/* Badge de Estado */}
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyles(
              mentorship.mentorshipState
            )}`}
          >
            {getStatusLabel(mentorship.mentorshipState)}
          </span>

          {/* Botones de Acción */}
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(mentorship.slug)}
                className="p-2 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                title="Editar"
              >
                <Edit size={18} />
              </button>
            )}
            {onArchive && mentorship.mentorshipState === "PUBLISHED" && (
              <button
                onClick={() => onArchive(mentorship.slug)}
                className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                title="Archivar"
              >
                <Archive size={18} />
              </button>
            )}
            {onPublish && mentorship.mentorshipState !== "PUBLISHED" && (
              <button
                onClick={() => onPublish(mentorship.slug)}
                className="p-2 text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                title="Publicar"
              >
                <Rocket size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
