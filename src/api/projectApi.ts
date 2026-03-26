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

/**
 * Obtiene una lista paginada de proyectos.
 */
export const fetchProjects = async ({
  pageParam = 0,
  sortBy,
}: FetchProjectsParams): Promise<PagedResponse<ProjectSummary>> => {
  const { data } = await apiService.get<PagedResponse<ProjectSummary>>(
    "/projects",
    {
      params: {
        page: pageParam,
        size: 4,
        sortBy: sortBy,
      },
    }
  );
  return data;
};

/**
 * Crea un nuevo proyecto.
 */
export const createProject = async (
  projectData: CreateProjectRequest
): Promise<CreateProjectRequest> => {
  const { data } = await apiService.post<CreateProjectRequest>(
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
