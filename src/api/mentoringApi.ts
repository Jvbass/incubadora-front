import apiService from "./apiService";
import type {
  CreateMentorshipRequest,
  MentorshipSummaryResponse,
  MentorshipDetailResponse,
  MentoringPublicDetailResponse,
  PagedMentoringResponse,
} from "../types";

/** Forma cruda que emite el backend en /mentorings/published (getFree() → "free"). */
interface BackendMentoringSummary
  extends Omit<MentorshipSummaryResponse, "isFree"> {
  free?: boolean;
  isFree?: boolean;
  mentorUsername?: string;
}

/**
 * Crea una nueva mentoría.
 */
export const createMentorship = async (
  mentorshipData: CreateMentorshipRequest
): Promise<MentorshipDetailResponse> => {
  const { data } = await apiService.post<MentorshipDetailResponse>(
    "/mentorings",
    mentorshipData
  );
  return data;
};

/**
 * Obtiene la lista de mentorías del mentor autenticado.
 */
export const fetchMyMentorships = async (): Promise<
  MentorshipDetailResponse[]
> => {
  const { data } = await apiService.get<MentorshipDetailResponse[]>(
    "/mentorings/my-mentorings"
  );
  return data;
};

/**
 * Actualiza una mentoría por su slug.
 */
export const updateMentorshipBySlug = async (
  slug: string,
  mentorshipData: CreateMentorshipRequest
): Promise<MentorshipDetailResponse> => {
  const { data } = await apiService.put<MentorshipDetailResponse>(
    `/mentorings/${slug}`,
    mentorshipData
  );
  return data;
};

/**
 * Archiva una mentoría por su slug (soft delete).
 */
export const archiveMentorship = async (slug: string): Promise<void> => {
  await apiService.patch(`/mentorings/${slug}/archive`);
};

/**
 * Re-publica una mentoría archivada por su slug.
 */
export const publishMentorship = async (slug: string): Promise<void> => {
  await apiService.patch(`/mentorings/${slug}/publish`);
};

/** Envoltorio paginado estándar del backend ({success, message, data, meta}). */
interface BackendPagedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * Obtiene el listado paginado de mentorías publicadas, con filtro
 * opcional por tag (GET /mentorings?page=&size=&tag=).
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
  const { data } = await apiService.get<
    BackendPagedResponse<BackendMentoringSummary>
  >("/mentorings", { params });
  const content = data.data.map((m) => ({
    ...m,
    isFree: m.isFree ?? m.free ?? false,
    mentorUsername: m.mentorUsername ?? m.mentorName,
  }));
  return {
    content,
    pageNumber: data.meta.currentPage,
    pageSize: data.meta.pageSize,
    totalElements: data.meta.totalElements,
    totalPages: data.meta.totalPages,
    last: !data.meta.hasNext,
  };
};

/**
 * Obtiene el detalle de una mentoría por su slug.
 */
export const fetchMentoringBySlug = async (
  slug: string
): Promise<MentoringPublicDetailResponse> => {
  const { data } = await apiService.get<MentoringPublicDetailResponse>(
    `/mentorings/${slug}`
  );
  return {
    ...data,
    mentorUsername: data.mentorUsername ?? data.mentorName,
  };
};
