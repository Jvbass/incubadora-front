import apiService from "./apiService";
import type {
  UserData,
  ListProjects,
  ProjectFormInput,
  Technology,
  LoginRequest,
  RegisterRequest,
  ProjectDetail,
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
): Promise<UserData> => {
  const { data } = await apiService.post<UserData>("/auth/register", userData);
  return data;
};

/**
 * Obtiene la información del usuario logeado.
 */
export const fetchUserData = async (): Promise<UserData> => {
  const { data } = await apiService.get<UserData>("/dashboard");
  return data;
};

/**
 * Obtiene la lista de todos los proyectos.
 */
export const fetchProjects = async (): Promise<ListProjects[]> => {
  // El backend devuelve un ListProjects para la lista
  const { data } = await apiService.get<ListProjects[]>("/projects");
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
export const fetchMyProjects = async (): Promise<ListProjects[]> => {
  const { data } = await apiService.get<ListProjects[]>(
    "/projects/my-projects"
  );
  return data;
};

/**
* Obtiene los detalles completos de un proyecto por su ID.
*/
export const fetchProjectById = async (projectId: string): Promise<ProjectDetail> => {
  const { data } = await apiService.get<ProjectDetail>(`/projects/${projectId}`);
  return data;
};

/**
 * Actualiza un proyecto por su ID.
 */
export const updateProjectById = async (projectId: string, projectData: ProjectFormInput): Promise<ProjectFormInput> => {
  const { data } = await apiService.put<ProjectFormInput>(`/projects/${projectId}`, projectData);
  return data;
};
