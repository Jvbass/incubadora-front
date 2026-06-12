import type { APIRequestContext } from '@playwright/test';
import { execSync } from 'node:child_process';
import { BASE_API_URL } from './constants';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface ProjectData {
  title: string;
  subtitle: string;
  description: string;
  status?: 'pending' | 'published' | 'archived';
  developmentProgress?: number;
  isCollaborative?: boolean;
  needMentoring?: boolean;
  technologyIds?: number[];
}

interface FeedbackData {
  feedbackDescription: string;
  rating: number;
  categoryIds: number[];
}

/**
 * Registra un nuevo usuario via API.
 */
export async function apiRegister(request: APIRequestContext, userData: RegisterData) {
  const response = await request.post(`${BASE_API_URL}/auth/register`, {
    data: userData,
  });
  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`apiRegister failed (${response.status()}): ${body}`);
  }
  return response.json();
}

/**
 * Lee el código de verificación de email directamente de la BD del backend
 * en Docker (C4 + D-14: sin SMTP, el código solo existe en la BD y en el log).
 */
export function getVerificationCode(email: string): string {
  return execSync(
    `docker exec incubadora-db mysql -uincubadora_user -pincubadora_pass incubadora_dev -N -e "SELECT code FROM email_verification_codes WHERE email='${email}'"`,
    { encoding: 'utf8' }
  )
    .replace(/mysql: \[Warning\].*\n?/, '')
    .trim();
}

/**
 * Verifica el email de una cuenta recién registrada (C4).
 */
export async function apiVerifyEmail(request: APIRequestContext, email: string) {
  const code = getVerificationCode(email);
  const response = await request.post(`${BASE_API_URL}/auth/verify-email`, {
    data: { email, code },
  });
  if (response.status() !== 204) {
    const body = await response.text();
    throw new Error(`apiVerifyEmail failed (${response.status()}): ${body}`);
  }
}

/**
 * Inicia sesión via API. Retorna el token JWT.
 */
export async function apiLogin(request: APIRequestContext, credentials: LoginCredentials): Promise<string> {
  const response = await request.post(`${BASE_API_URL}/auth/login`, {
    data: credentials,
  });
  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`apiLogin failed (${response.status()}): ${body}`);
  }
  const body = await response.json();
  return body.token;
}

/**
 * Registra, verifica el email (C4) y hace login, retornando el token JWT.
 */
export async function apiRegisterAndLogin(
  request: APIRequestContext,
  userData: RegisterData
): Promise<string> {
  await apiRegister(request, userData);
  await apiVerifyEmail(request, userData.email);
  return apiLogin(request, { username: userData.username, password: userData.password });
}

/**
 * Obtiene las tecnologías disponibles via API. Retorna un array de IDs.
 */
export async function apiGetTechnologies(request: APIRequestContext, token: string): Promise<number[]> {
  const response = await request.get(`${BASE_API_URL}/technologies`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok()) return [];
  const techs = await response.json();
  return Array.isArray(techs) ? techs.map((t: any) => t.id).slice(0, 2) : [];
}

/**
 * Crea un proyecto via API. Requiere token JWT.
 * Obtiene automáticamente al menos una tecnología si no se especifica.
 */
export async function apiCreateProject(
  request: APIRequestContext,
  token: string,
  projectData: ProjectData
) {
  // El backend requiere al menos una tecnología
  let technologyIds = projectData.technologyIds ?? [];
  if (technologyIds.length === 0) {
    technologyIds = await apiGetTechnologies(request, token);
  }

  const response = await request.post(`${BASE_API_URL}/projects`, {
    data: {
      status: 'pending',
      developmentProgress: 50,
      isCollaborative: false,
      needMentoring: false,
      ...projectData,
      technologyIds,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`apiCreateProject failed (${response.status()}): ${body}`);
  }
  return response.json();
}

/**
 * Crea feedback para un proyecto via API. Requiere token JWT.
 */
export async function apiCreateFeedback(
  request: APIRequestContext,
  token: string,
  projectSlug: string,
  feedbackData: FeedbackData
) {
  const response = await request.post(`${BASE_API_URL}/projects/${projectSlug}/feedback`, {
    data: feedbackData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`apiCreateFeedback failed (${response.status()}): ${body}`);
  }
  return response.json();
}

/**
 * Obtiene las categorías de feedback via API.
 */
export async function apiGetCategories(request: APIRequestContext, token: string) {
  const response = await request.get(`${BASE_API_URL}/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status() === 404) {
    return []; // endpoint no implementado aún en el backend
  }
  if (!response.ok()) {
    throw new Error(`apiGetCategories failed (${response.status()})`);
  }
  return response.json();
}

/**
 * Obtiene los proyectos del usuario autenticado via API.
 */
export async function apiGetMyProjects(request: APIRequestContext, token: string) {
  const response = await request.get(`${BASE_API_URL}/projects/my-projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok()) {
    throw new Error(`apiGetMyProjects failed (${response.status()})`);
  }
  return response.json();
}
