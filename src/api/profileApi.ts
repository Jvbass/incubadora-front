import apiService from "./apiService";
import type { ProfileResponse, ProfileUpdateRequest } from "../types";

/**
 * Obtiene el perfil del usuario autenticado.
 */
export const fetchUserProfile = async (): Promise<ProfileResponse> => {
  const { data } = await apiService.get<ProfileResponse>("/profile");
  return data;
};

/**
 * Actualiza el perfil del usuario autenticado.
 */
export const updateUserProfile = async (
  profileData: ProfileUpdateRequest
): Promise<ProfileResponse> => {
  const { data } = await apiService.put<ProfileResponse>(
    "/profile",
    profileData
  );
  return data;
};

/**
 * Obtiene el perfil público de un usuario por su slug.
 * El backend lo expone como portfolio público.
 */
export const fetchPublicProfileBySlug = async (
  slug: string
): Promise<ProfileResponse> => {
  if (!slug) {
    throw new Error("El slug del perfil es requerido.");
  }
  const { data } = await apiService.get<ProfileResponse>(`/portfolio/${slug}`);
  return data;
};

/**
 * Obtiene el portfolio público de un usuario (sin autenticación requerida).
 */
export const fetchPublicPortfolio = async (
  slug: string
): Promise<ProfileResponse> => {
  if (!slug) {
    throw new Error("El slug del portfolio es requerido.");
  }
  const { data } = await apiService.get<ProfileResponse>(`/portfolio/${slug}`);
  return data;
};
