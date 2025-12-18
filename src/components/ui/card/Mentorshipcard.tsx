import {
  Clock,
  DollarSign,
  Users,
  Video,
  Edit,
  Trash2,
  Power,
  Pause,
} from "lucide-react";
import type { MentorshipSummary } from "../../../types";

interface MentorshipCardProps {
  mentorship: MentorshipSummary;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onToggleStatus?: (id: number, currentStatus: string) => void;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "active":
      return "text-green-600 bg-green-50 border-green-200";
    case "paused":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "inactive":
      return "text-gray-600 bg-gray-50 border-gray-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "active":
      return "Activa";
    case "paused":
      return "Pausada";
    case "inactive":
      return "Inactiva";
    default:
      return status;
  }
};

const getPlatformIcon = (platform: string) => {
  // Puedes personalizar los iconos según la plataforma
  return <Video size={16} />;
};

export const MentorshipCard = ({
  mentorship,
  onEdit,
  onDelete,
  onToggleStatus,
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
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{mentorship.durationMinutes} min</span>
            </div>
            <div className="flex items-center gap-1">
              {getPlatformIcon(mentorship.platform)}
              <span className="capitalize">{mentorship.platform}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{mentorship.totalBookings} reservas</span>
            </div>
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
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Creada el{" "}
            {new Date(mentorship.createdAt).toLocaleDateString("es-ES")}
          </p>
        </div>

        {/* Estado y Acciones */}
        <div className="flex flex-col items-end gap-2 ml-4">
          {/* Badge de Estado */}
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyles(
              mentorship.status
            )}`}
          >
            {getStatusLabel(mentorship.status)}
          </span>

          {/* Botones de Acción */}
          <div className="flex gap-2">
            {onToggleStatus && (
              <button
                onClick={() => onToggleStatus(mentorship.id, mentorship.status)}
                className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                title={mentorship.status === "active" ? "Pausar" : "Activar"}
              >
                {mentorship.status === "active" ? (
                  <Pause size={18} />
                ) : (
                  <Power size={18} />
                )}
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(mentorship.id)}
                className="p-2 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                title="Editar"
              >
                <Edit size={18} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(mentorship.id)}
                className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                title="Eliminar"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
