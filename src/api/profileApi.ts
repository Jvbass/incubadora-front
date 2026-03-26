import apiService from "./apiService";
import type { ProfileResponse, ProfileUpdateRequest } from "../types";

/**
 * Obtiene el perfil del usuario autenticado.
 */
export const fetchUserProfile = async (): Promise<ProfileResponse> => {
  const { data } = await apiService.get<ProfileResponse>("/me/profile");
  return data;
};

/**
 * Actualiza el perfil del usuario autenticado.
 */
export const updateUserProfile = async (
  profileData: ProfileUpdateRequest
): Promise<ProfileResponse> => {
  const { data } = await apiService.put<ProfileResponse>(
    "/me/profile",
    profileData
  );
  return data;
};

/**
 * Obtiene el perfil público de un usuario por su slug.
 */
export const fetchPublicProfileBySlug = async (
  slug: string
): Promise<ProfileResponse> => {
  if (!slug) {
    throw new Error("El slug del perfil es requerido.");
  }
  const { data } = await apiService.get<ProfileResponse>(`/profiles/${slug}`);
  return data;
};
