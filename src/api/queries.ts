import apiService from "./apiService";
import type {
  UserProfileResponse,
  ProjectSummary,
  ProjectFormInput,
  Technology,
  LoginRequest,
  RegisterRequest,
  ProjectDetailResponse,
  FeedbackResponse,
  FeedbackRequest,
  CommentRequest,
  CommentResponse,
} from "../types";




/**=========================================
 *  USER QUERIES
 *=========================================*/

/**
 * Inicia sesión de un usuario.
 * @param credentials Objeto con las credenciales de inicio de sesión.
 * @returns codigo 200: token de autenticación
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
 * @param userData Datos del usuario a registrar.
 * @returns codigo 200: token de autenticación
 */
export const registerUser = async (
  userData: RegisterRequest
): Promise<UserProfileResponse> => {
  const { data } = await apiService.post<UserProfileResponse>(
    "/auth/register",
    userData
  );
  return data;
};

/**
 * Obtiene la información del usuario logeado.
 * @returns informacion del usuario logeado
 */
export const fetchUserData = async (): Promise<UserProfileResponse> => {
  const { data } = await apiService.get<UserProfileResponse>("/dashboard");
  return data;
};





/**=========================================
 *  PROJECTS QUERIES
 *=========================================*/

/**
 * Obtiene la lista de todos los proyectos.
 * @returns lista de proyectos
 */
export const fetchProjects = async (): Promise<ProjectSummary[]> => {
  // El backend devuelve un ProjectSummary para la lista
  const { data } = await apiService.get<ProjectSummary[]>("/projects");
  return data;
};

/**
 * Crea un nuevo proyecto.
 * @param projectData Datos del proyecto a crear.
 * @returns Datos del proyecto creado
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
 * @returns lista de tecnologías
 */
export const fetchTechnologies = async (): Promise<Technology[]> => {
  const { data } = await apiService.get<Technology[]>("/technologies");
  return data;
};

/**
 * Obtiene la lista de proyectos del usuario autenticado.
 * @returns lista de proyectos del usuario
 */
export const fetchMyProjects = async (): Promise<ProjectSummary[]> => {
  const { data } = await apiService.get<ProjectSummary[]>(
    "/projects/my-projects"
  );
  return data;
};

/**
 * Obtiene los detalles completos de un proyecto por su slug.
 * @param projectSlug Slug del proyecto a obtener.
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
 * @param projectSlug Slug del proyecto a actualizar.
 * @param projectData Datos actualizados del proyecto.
 */
export const updateProjectById = async (
  projectSlug: string,
  projectData: ProjectFormInput
): Promise<ProjectFormInput> => {
  const { data } = await apiService.put<ProjectFormInput>(
    `/projects/${projectSlug}`,
    projectData
  );
  return data;
};





/**=========================================
 *  FEEDBACK QUERIES
 *=========================================*/

/**
 * Obtiene en una lista todos los feedbacks para un proyecto específico.
 * @param projectSlug Slug del proyecto del que se obtendrán los feedbacks.
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
 * @param projectSlug Slug del proyecto al que se le enviará el feedback.
 * @param feedbackData Datos del feedback a enviar.
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
 * @param feedbackId ID del feedback a actualizar.
 * @param feedbackData Datos actualizados del feedback.
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
 * @param feedbackId ID del feedback a borrar.
 */
export const deleteFeedback = async (feedbackId: number): Promise<void> => {
  await apiService.delete(`/feedback/${feedbackId}`);
};



/**=========================================
 *  COMMENTS QUERIES
 *=========================================*/

/**
 * Obtiene todos los comentarios (y sus respuestas anidadas) para un feedback.
 * @param feedbackId ID del feedback del que se obtendrán los comentarios.
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
 * @param feedbackId ID del feedback al que se le añadirá el comentario.
 * @param commentData Datos del comentario a crear.
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
 * @param commentId ID del comentario a actualizar.
 * @param commentData Datos actualizados del comentario.
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
