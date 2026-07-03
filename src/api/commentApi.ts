import apiService from "./apiService";
import type { CommentRequest, CommentResponse } from "../types";

/**
 * Obtiene todos los comentarios para un feedback.
 */
export const fetchCommentsForFeedback = async (
  feedbackId: number
): Promise<CommentResponse[]> => {
  const { data } = await apiService.get<CommentResponse[]>(
    `/feedback/${feedbackId}/comments`
  );
  return data;
};

/**
 * Crea un nuevo comentario para un feedback.
 */
export const createComment = async ({
  feedbackId,
  commentData,
}: {
  feedbackId: number;
  commentData: CommentRequest;
}): Promise<CommentResponse> => {
  const { data } = await apiService.post<CommentResponse>(
    `/feedback/${feedbackId}/comments`,
    commentData
  );
  return data;
};

/**
 * Actualiza un comentario existente por su ID.
 */
export const updateComment = async ({
  commentId,
  commentData,
}: {
  commentId: number;
  commentData: CommentRequest;
}): Promise<CommentResponse> => {
  const { data } = await apiService.put<CommentResponse>(
    `/comments/${commentId}`,
    commentData
  );
  return data;
};

/**
 * Borra un comentario por su ID.
 */
export const deleteComment = async (commentId: number): Promise<void> => {
  await apiService.delete(`/comments/${commentId}`);
};
