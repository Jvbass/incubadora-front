import apiService from "./apiService";
import type {
  CreateMentorshipRequest,
  MentorshipSummaryResponse,
  MentorshipDetailResponse,
  MentoringPublicDetailResponse,
  PagedMentoringResponse,
} from "../types";

/**
 * Crea una nueva mentoría.
 */
export const createMentorship = async (
  mentorshipData: CreateMentorshipRequest
): Promise<CreateMentorshipRequest> => {
  const { data } = await apiService.post<CreateMentorshipRequest>(
    "/mentorships",
    mentorshipData
  );
  return data;
};

/**
 * Obtiene la lista de mentorías del mentor autenticado.
 */
export const fetchMyMentorships = async (): Promise<MentorshipSummaryResponse[]> => {
  const { data } = await apiService.get<MentorshipSummaryResponse[]>(
    "/mentorships/my-mentorships"
  );
  return data;
};

/**
 * Obtiene los detalles completos de una mentoría por su ID.
 */
export const fetchMentorshipById = async (
  mentorshipId: number
): Promise<MentorshipDetailResponse> => {
  const { data } = await apiService.get<MentorshipDetailResponse>(
    `/mentorships/${mentorshipId}`
  );
  return data;
};

/**
 * Actualiza una mentoría por su ID.
 */
export const updateMentorshipById = async (
  mentorshipId: number,
  mentorshipData: CreateMentorshipRequest
): Promise<MentorshipDetailResponse> => {
  const { data } = await apiService.put<MentorshipDetailResponse>(
    `/mentorships/${mentorshipId}`,
    mentorshipData
  );
  return data;
};

/**
 * Elimina una mentoría por su ID.
 */
export const deleteMentorship = async (mentorshipId: number): Promise<void> => {
  await apiService.delete(`/mentorships/${mentorshipId}`);
};

/**
 * Obtiene el listado paginado de mentorías publicadas.
 */
export const fetchPublishedMentorings = async ({
  page = 0,
  size = 10,
  tag,
}: {
  page?: number;
  size?: number;
  tag?: string;
}): Promise<PagedMentoringResponse> => {
  const params: Record<string, string | number> = { page, size };
  if (tag) params.tag = tag;
  const { data } = await apiService.get<PagedMentoringResponse>(
    "/mentorings",
    { params }
  );
  return data;
};

/**
 * Obtiene el detalle público de una mentoría por su slug.
 */
export const fetchMentoringBySlug = async (
  slug: string
): Promise<MentoringPublicDetailResponse> => {
  const { data } = await apiService.get<MentoringPublicDetailResponse>(
    `/mentorings/${slug}`
  );
  return data;
};

/**
 * Cambia el estado de una mentoría (activa/inactiva/pausada).
 */
export const updateMentorshipStatus = async (
  mentorshipId: number,
  status: "active" | "inactive" | "paused"
): Promise<MentorshipSummaryResponse> => {
  const { data } = await apiService.patch<MentorshipSummaryResponse>(
    `/mentorships/${mentorshipId}/status`,
    { status }
  );
  return data;
};
