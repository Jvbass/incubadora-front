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

/**
 * Obtiene la lista de categorías de feedback.
 */
export const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await apiService.get<Category[]>("/categories");
  return data;
};
