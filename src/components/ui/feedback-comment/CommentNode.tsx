import type { CommentResponse } from "../../../types";
import { CommentCard } from "../card/CommentCard";
import { CommentForm } from "./CommentForm";

interface CommentNodeProps {
  comment: CommentResponse;
  onReply: (commentId: number) => void;
  activeReplyId: number | null;
  onCancelReply: () => void;
  onSubmitReply: (data: { content: string }) => Promise<void>;
  isSubmitting: boolean;
  level: number; // Para controlar la profundidad del anidamiento
}

export const CommentNode = ({
  comment,
  onReply,
  activeReplyId,
  onCancelReply,
  onSubmitReply,
  isSubmitting,
  level,
}: CommentNodeProps) => {
  const hasReplies = comment.replies && comment.replies.length > 0;

  const isReplying = activeReplyId === comment.id;

  const indentationClass = level < 3 ? "pl-6" : "pl-0";

  return (
    <div className={`relative ${indentationClass}`}>
      {/* La línea vertical que conecta los comentarios del hilo */}
      {level < 4 && (
        <div className="absolute left-0 top-0 w-0.5 h-full bg-gray-200 -translate-x-3 mt-5" />
      )}

      <CommentCard comment={comment} onReply={onReply} />

      {/* AQUÍ ESTÁ LA LÓGICA CLAVE: El formulario se renderiza dentro del nodo correcto */}
      {isReplying && (
        <div className="mt-2">
          <CommentForm
            onSubmit={onSubmitReply}
            isSubmitting={isSubmitting}
            initialContent={`@${comment.author.username} `}
          />
        </div>
      )}

      {/* Renderizado recursivo para las respuestas */}
      {hasReplies && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              onReply={onReply}
              activeReplyId={activeReplyId}
              onCancelReply={onCancelReply}
              onSubmitReply={onSubmitReply}
              isSubmitting={isSubmitting}
              level={level + 1} // Incrementamos el nivel para los hijos
            />
          ))}
        </div>
      )}
    </div>
  );
};
