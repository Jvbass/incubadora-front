import type { FeedbackResponse } from "../../../types";

// Un pequeño componente para mostrar la calificación de forma visual y numérica
const RatingDisplay = ({ rating }: { rating: number }) => {
  const percentage = (rating / 10) * 100;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
      <span className="text-xs font-semibold text-gray-600 mt-1 block text-right">
        Calificación: {rating}/10
      </span>
    </div>
  );
};

interface FeedbackCardProps {
  feedback: FeedbackResponse;
}

export const FeedbackCard = ({ feedback }: FeedbackCardProps) => {
  // Formateamos la fecha para que sea más legible
  const formattedDate = new Date(feedback.createdAt).toLocaleDateString(
    "es-ES",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <article className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
      {/* Encabezado de la tarjeta con autor y fecha */}
      <header className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          {/* Icono de usuario */}
          <span className="font-bold text-gray-800">{feedback.author}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {/* Icono de calendario */}
          <span>{formattedDate}</span>
        </div>
      </header>

      {/* Cuerpo de la tarjeta con la descripción y la calificación */}
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">{feedback.feedbackDescription}</p>
        <RatingDisplay rating={feedback.rating} />
      </div>
    </article>
  );
};
