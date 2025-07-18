import { Edit, MessageSquare, Trash2 } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import type { CommentResponse } from "../../../types";

interface CommentCardProps {
  comment: CommentResponse;
  onReply: (commentId: number) => void;
  // Añadiremos las funciones de edición y borrado más adelante
  // onEdit: (commentId: number, currentContent: string) => void;
  // onDelete: (commentId: number) => void;
}

export const CommentCard = ({ comment, onReply }: CommentCardProps) => {
  const { user } = useAuth();

  const isOwner = user?.username === comment.author.username;

  const formattedDate = new Date(comment.createdAt).toLocaleDateString(
    "es-ES",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
  return (
    <article className="flex items-start space-x-3 py-4">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-600">
          {comment.author.username.charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-sm text-gray-800">
              {comment.author.username}
            </span>
            <span className="text-xs text-gray-500"> · {formattedDate}</span>
          </div>
          {isOwner && (
            <div className="flex items-center space-x-3">
              <button
                className="text-gray-500 hover:text-blue-600 transition-colors"
                title="Editar"
              >
                <Edit size={14} />
              </button>
              <button
                className="text-gray-500 hover:text-red-600 transition-colors"
                title="Borrar"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
        <p className="mt-1 text-gray-700 leading-relaxed">{comment.content}</p>
        <div className="mt-2">
          <button
            onClick={() => onReply(comment.id)} // <--- CAMBIO: Llama a onReply solo con el ID
            className="flex items-center space-x-1.5 text-xs text-gray-600 hover:text-indigo-700 font-semibold transition-colors"
          >
            <MessageSquare size={14} />
            <span>Responder</span>
          </button>
        </div>
      </div>
    </article>
  );
};