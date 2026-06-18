import apiService from "./apiService";
import type { FeedbackResponse, FeedbackRequest, Category } from "../types";

/**
 * Obtiene todos los feedbacks para un proyecto específico.
 */
export const fetchFeedbackForProject = async (
  projectSlug: string
): Promise<FeedbackResponse[]> => {
  const { data } = await apiService.get<FeedbackResponse[]>(
    `/projects/${projectSlug}/feedback`
  );
  return data;
};

/**
 * Envía un nuevo feedback para un proyecto.
 */
export const createFeedbackForProject = async ({
  projectSlug,
  feedbackData,
}: {
  projectSlug: string;
  feedbackData: FeedbackRequest;
}): Promise<FeedbackResponse> => {
  const { data } = await apiService.post<FeedbackResponse>(
    `/projects/${projectSlug}/feedback`,
    feedbackData
  );
  return data;
};

/**
 * Actualiza un feedback existente por su ID.
 */
export const updateFeedback = async ({
  feedbackId,
  feedbackData,
}: {
  feedbackId: number;
  feedbackData: FeedbackRequest;
}): Promise<FeedbackResponse> => {
  const { data } = await apiService.put<FeedbackResponse>(
    `/feedback/${feedbackId}`,
    feedbackData
  );
  return data;
};

/**
 * Borra un feedback por su ID.
 */
export const deleteFeedback = async (feedbackId: number): Promise<void> => {
  await apiService.delete(`/feedback/${feedbackId}`);
};

/** Upvote / quitar upvote de un feedback (G-03). Devuelve el feedback actualizado. */
export const upvoteFeedback = async (feedbackId: number): Promise<FeedbackResponse> =>
  (await apiService.post<FeedbackResponse>(`/feedback/${feedbackId}/upvote`)).data;

export const removeFeedbackUpvote = async (feedbackId: number): Promise<FeedbackResponse> =>
  (await apiService.delete<FeedbackResponse>(`/feedback/${feedbackId}/upvote`)).data;

/**
 * Obtiene la lista de categorías de feedback.
 * El backend envuelve la respuesta en ApiResponse: {success, message, data}.
 */
export const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await apiService.get<
    { data: Category[] } | Category[]
  >("/categories");
  return Array.isArray(data) ? data : data.data ?? [];
};
