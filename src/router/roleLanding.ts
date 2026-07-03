// Mapa centralizado: rol → ruta de inicio (single source of truth).
// Consumido por RoleBasedRedirect.tsx y RoleProtectedRoute.tsx.
export type Role = 'DEV' | 'MENTOR' | 'ADMINISTRATOR' | 'RECRUITER';

const ROLE_LANDING_MAP: Record<Role, string> = {
  DEV: '/home',
  MENTOR: '/dashboard',
  ADMINISTRATOR: '/admin',
  RECRUITER: '/recruiter-dashboard',
};

/**
 * Returns the landing path for the given role.
 * Falls back to '/profile' for unknown/null roles — authenticated users must NOT
 * be sent to /login because PublicRoute would bounce them back creating a loop.
 */
export function roleLandingPath(role: string): string {
  return ROLE_LANDING_MAP[role?.toUpperCase() as Role] ?? '/profile';
}
