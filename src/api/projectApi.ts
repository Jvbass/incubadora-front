import apiService from "./apiService";
import type {
  ProjectSummary,
  CreateProjectRequest,
  Technology,
  ProjectDetailResponse,
  PagedResponse,
  SortByType,
} from "../types";

interface FetchProjectsParams {
  pageParam?: number;
  sortBy: SortByType;
}

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
 * Obtiene una lista paginada de proyectos.
 */
export const fetchProjects = async ({
  pageParam = 0,
  sortBy,
}: FetchProjectsParams): Promise<PagedResponse<ProjectSummary>> => {
  const { data } = await apiService.get<BackendPagedResponse<ProjectSummary>>(
    "/projects",
    {
      params: {
        page: pageParam,
        size: 4,
        sortBy: sortBy,
      },
    }
  );
  return {
    content: data.data,
    pageNumber: data.meta.currentPage,
    pageSize: data.meta.pageSize,
    totalElements: data.meta.totalElements,
    totalPages: data.meta.totalPages,
    last: !data.meta.hasNext,
  };
};

/**
 * Crea un nuevo proyecto. El backend devuelve el proyecto creado con su slug.
 */
export const createProject = async (
  projectData: CreateProjectRequest
): Promise<ProjectDetailResponse> => {
  const { data } = await apiService.post<ProjectDetailResponse>(
    "/projects",
    projectData
  );
  return data;
};

/**
 * Obtiene la lista de todas las tecnologías disponibles.
 */
export const fetchTechnologies = async (): Promise<Technology[]> => {
  const { data } = await apiService.get<Technology[]>("/technologies");
  return data;
};

/**
 * Obtiene la lista de proyectos del usuario autenticado.
 */
export const fetchMyProjects = async (): Promise<ProjectSummary[]> => {
  const { data } = await apiService.get<ProjectSummary[]>(
    "/projects/my-projects"
  );
  return data;
};

/**
 * Obtiene los detalles completos de un proyecto por su slug.
 */
export const fetchProjectById = async (
  projectSlug: string
): Promise<ProjectDetailResponse> => {
  const { data } = await apiService.get<ProjectDetailResponse>(
    `/projects/${projectSlug}`
  );
  return data;
};

/**
 * Actualiza un proyecto por su slug.
 */
export const updateProjectById = async (
  projectSlug: string,
  projectData: CreateProjectRequest
): Promise<CreateProjectRequest> => {
  const { data } = await apiService.put<CreateProjectRequest>(
    `/projects/${projectSlug}`,
    projectData
  );
  return data;
};

/**
 * Cambia solo el estado de un proyecto (F-15). Puede degradar el rol mentor.
 */
export const updateProjectStatus = async (
  projectSlug: string,
  status: string
): Promise<ProjectDetailResponse> => {
  const { data } = await apiService.patch<ProjectDetailResponse>(
    `/projects/${projectSlug}/status`,
    { status }
  );
  return data;
};

/**
 * Un mentor se ofrece a mentorear el proyecto (notifica al dueño).
 */
export const offerMentoring = async (
  projectSlug: string,
  message: string
): Promise<void> => {
  await apiService.post(`/projects/${projectSlug}/mentoring-offers`, {
    message,
  });
};

/**
 * Solicita colaborar en un proyecto colaborativo (notifica al dueño).
 */
export const requestCollaboration = async (
  projectSlug: string,
  message: string
): Promise<void> => {
  await apiService.post(`/projects/${projectSlug}/collaboration-requests`, {
    message,
  });
};
