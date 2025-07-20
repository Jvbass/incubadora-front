import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCommentsForFeedback, createComment } from "../../../api/queries";
import type { CommentResponse } from "../../../types";
import Loading from "../../ux/Loading";
import { CommentNode } from "./CommentNode";
import { CommentForm } from "./CommentForm";
import toast from "react-hot-toast";

interface CommentThreadProps {
  feedbackId: number;
  comments?: CommentResponse[];
  isLoading?: boolean;
  isError?: boolean;
}

export const CommentThread = ({
  feedbackId,
  comments: propComments,
  isLoading: propIsLoading,
  isError: propIsError,
}: CommentThreadProps) => {
  const queryClient = useQueryClient();
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);

  // Use props if provided, otherwise fetch comments
  const {
    data: fetchedComments,
    isLoading: fetchIsLoading,
    isError: fetchIsError,
  } = useQuery<CommentResponse[]>({
    queryKey: ["comments", feedbackId],
    queryFn: () => fetchCommentsForFeedback(feedbackId),
    enabled: !propComments, // Only fetch if comments aren't provided as props
  });

  // Use prop values if available, otherwise use fetched values
  const comments = propComments || fetchedComments;
  const isLoading =
    propIsLoading !== undefined ? propIsLoading : fetchIsLoading;
  const isError = propIsError !== undefined ? propIsError : fetchIsError;

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      toast.success("Comentario publicado.");
      queryClient.invalidateQueries({ queryKey: ["comments", feedbackId] });
      setActiveReplyId(null); // Cierra cualquier formulario de respuesta abierto
    },
    onError: (error) => {
      toast.error(`Error al publicar: ${error.message}`);
      throw error;
    },
  });

  // --- Función para manejar NUEVOS COMENTARIOS (Nivel Superior) ---
  const handleNewCommentSubmit = async (formData: { content: string }) => {
    // Usamos mutateAsync para que devuelva una promesa
    await createCommentMutation.mutateAsync({
      feedbackId,
      commentData: { content: formData.content },
    });
  };

  // --- Funciones para manejar RESPUESTAS ---
  const handleReplyClick = (commentId: number) => {
    setActiveReplyId((prevId) => (prevId === commentId ? null : commentId));
  };

  const handleCancelReply = () => {
    setActiveReplyId(null);
  };

  const handleReplySubmit = async (formData: { content: string }) => {
    if (!activeReplyId) return;
    // Usamos mutateAsync también aquí
    await createCommentMutation.mutateAsync({
      feedbackId,
      commentData: {
        content: formData.content,
        parentCommentId: activeReplyId,
      },
    });
  };

  if (isLoading) return <Loading message="comentarios" />;
  if (isError)
    return (
      <p className="text-red-600">No se pudieron cargar los comentarios.</p>
    );

  return (
    <div className="mt-6 space-y-4">
      {/* Formulario para crear un comentario de Nivel Superior */}
      <div className="mt-6">
        <h4 className="text-md font-semibold text-gray-800 mb-2">
          Deja un comentario
        </h4>
        <CommentForm
          onSubmit={handleNewCommentSubmit}
          isSubmitting={
            createCommentMutation.isPending && activeReplyId === null
          }
        />
      </div>

      <div className="border-t border-gray-200 pt-4" />

      {/* Renderizado de los hilos de comentarios existentes */}
      {comments?.map((comment) => (
        <CommentNode
          key={comment.id}
          comment={comment}
          onReply={handleReplyClick}
          activeReplyId={activeReplyId}
          onCancelReply={handleCancelReply}
          onSubmitReply={handleReplySubmit}
          isSubmitting={
            createCommentMutation.isPending && activeReplyId === comment.id
          }
          level={1}
        />
      ))}
    </div>
  );
};
