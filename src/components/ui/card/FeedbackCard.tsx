import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { FeedbackResponse, CommentResponse } from "../../../types";
import { CommentThread } from "../feedback-comment/CommentThread";
import { fetchCommentsForFeedback } from "../../../api/queries";
import { ChevronDown, ChevronUp, MessageSquareText } from "lucide-react";

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
  // Estado local para manejar la visibilidad de los comentarios
  const [commentsVisible, setCommentsVisible] = useState(false);

  // Fetch comments to get the count
  const {
    data: comments,
    isLoading: commentsLoading,
    isError: commentsError,
  } = useQuery<CommentResponse[]>({
    queryKey: ["comments", feedback.id],
    queryFn: () => fetchCommentsForFeedback(feedback.id),
  });

  // Calculate total comment count (including replies)
  const getTotalCommentCount = (comments: CommentResponse[]): number => {
    return comments.reduce((total, comment) => {
      return total + 1 + getTotalCommentCount(comment.replies || []);
    }, 0);
  };

  const commentCount = comments ? getTotalCommentCount(comments) : 0;

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
    <article className="bg-white p-5 rounded-lg shadow-md border border-gray-200 transition-all duration-300 ">
      {/* Encabezado de la tarjeta con autor y fecha */}
      <header className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-3">
          {/* Avatar Placeholder */}
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
            {feedback.author.charAt(0).toUpperCase()}
          </div>
          <span className="font-bold text-gray-800">{feedback.author}</span>
        </div>
        <time className="text-sm text-gray-500">{formattedDate}</time>
      </header>

      {/* Cuerpo de la tarjeta con la descripción y la calificación */}
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          {feedback.feedbackDescription}
        </p>
        <RatingDisplay rating={feedback.rating} />
      </div>

      {/* Footer con acciones y sección de comentarios */}
      <footer className="mt-6 pt-3 border-t border-gray-100">
        <div className="flex justify-end">
          <button
            className="cursor-pointer flex items-center space-x-2 text-sm font-semibold text-gray-600 hover:text-indigo-700 transition-colors"
            onClick={() => setCommentsVisible(!commentsVisible)}
          >
            <MessageSquareText size={16} />
            <span>Comentarios ({commentCount})</span>
            {/* Icono de flecha que rota 180 grados cuando está abierto */}
            {commentsVisible ? (
              <ChevronUp size={12} />
            ) : (
              <ChevronDown size={12} color="gray" />
            )}
          </button>
        </div>

        {/* Renderizado condicional del hilo de comentarios */}
        {commentsVisible && (
          <CommentThread
            feedbackId={feedback.id}
            comments={comments}
            isLoading={commentsLoading}
            isError={commentsError}
          />
        )}
      </footer>
    </article>
  );
};
