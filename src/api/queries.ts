import apiService from "./apiService";
import type {
  UserProfileResponse ,
  ProjectSummary,
  ProjectFormInput,
  Technology,
  LoginRequest,
  RegisterRequest,
  ProjectDetailResponse,
} from "../types";

/**
 * Inicia sesión de un usuario.
 */
export const loginUser = async (
  credentials: LoginRequest
): Promise<{ token: string }> => {
  const { data } = await apiService.post<{ token: string }>(
    "/auth/login",
    credentials
  );
  return data;
};

/**
 * Registra un nuevo usuario.
 */
export const registerUser = async (
  userData: RegisterRequest
): Promise<UserProfileResponse > => {
  const { data } = await apiService.post<UserProfileResponse >("/auth/register", userData);
  return data;
};

/**
 * Obtiene la información del usuario logeado.
 */
export const fetchUserData = async (): Promise<UserProfileResponse > => {
  const { data } = await apiService.get<UserProfileResponse >("/dashboard");
  return data;
};

/**
 * Obtiene la lista de todos los proyectos.
 */
export const fetchProjects = async (): Promise<ProjectSummary[]> => {
  // El backend devuelve un ProjectSummary para la lista
  const { data } = await apiService.get<ProjectSummary[]>("/projects");
  return data;
};

/**
 * Crea un nuevo proyecto.
 */
export const createProject = async (
  projectData: ProjectFormInput
): Promise<ProjectFormInput> => {
  // El backend devuelve un ProjectResponseDto al crear
  const { data } = await apiService.post<ProjectFormInput>(
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
 * Obtiene los detalles completos de un proyecto por su ID.
 */
export const fetchProjectById = async (
  projectId: string
): Promise<ProjectDetailResponse> => {
  const { data } = await apiService.get<ProjectDetailResponse>(
    `/projects/${projectId}`
  );
  return data;
};

/**
 * Actualiza un proyecto por su ID.
 */
export const updateProjectById = async (
  projectId: string,
  projectData: ProjectFormInput
): Promise<ProjectFormInput> => {
  const { data } = await apiService.put<ProjectFormInput>(
    `/projects/${projectId}`,
    projectData
  );
  return data;
};
