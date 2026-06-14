import { Briefcase, MapPin, DollarSign, Archive, Rocket } from "lucide-react";
import type { JobOffer } from "../../../types";

interface JobOfferCardProps {
  offer: JobOffer;
  onPublish?: (id: number) => void;
  onClose?: (id: number) => void;
  onEdit?: (offer: JobOffer) => void;
}

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "text-yellow-700 bg-yellow-50 border-yellow-200",
  PUBLISHED: "text-green-600 bg-green-50 border-green-200",
  CLOSED: "text-gray-600 bg-gray-50 border-gray-200",
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicada",
  CLOSED: "Cerrada",
};

export const JobOfferCard = ({
  offer,
  onPublish,
  onClose,
  onEdit,
}: JobOfferCardProps) => {
  return (
    <div className="p-4 bg-white dark:bg-bg-dark rounded-lg border border-gray-300 dark:border-gray-700 hover:shadow-md transition-shadow space-y-2">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base dark:text-text-light truncate">
            {offer.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {offer.company}
          </p>
        </div>
        <span
          className={`px-2 py-0.5 text-xs font-semibold rounded-full border shrink-0 ${
            STATUS_STYLES[offer.status] ?? STATUS_STYLES.CLOSED
          }`}
        >
          {STATUS_LABELS[offer.status] ?? offer.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <MapPin size={14} /> {offer.location}
        </span>
        {offer.salaryRange && (
          <span className="flex items-center gap-1">
            <DollarSign size={14} /> {offer.salaryRange}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
        {offer.description}
      </p>

      {(onPublish || onClose || onEdit) && (
        <div className="flex gap-2 justify-end pt-1">
          {onEdit && (
            <button
              onClick={() => onEdit(offer)}
              className="px-3 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Editar
            </button>
          )}
          {onClose && offer.status !== "CLOSED" && (
            <button
              onClick={() => onClose(offer.id)}
              className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
              title="Cerrar oferta"
            >
              <Archive size={16} />
            </button>
          )}
          {onPublish && offer.status !== "PUBLISHED" && (
            <button
              onClick={() => onPublish(offer.id)}
              className="p-1.5 text-gray-500 hover:text-green-500 transition-colors"
              title="Publicar"
            >
              <Rocket size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
