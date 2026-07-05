import apiService from "./apiService";
import type { KudoPost, KudoResponse } from "../types";

/**
 * Envía un kudo a un usuario.
 */
export const postKudo = async (kudoData: KudoPost): Promise<KudoResponse> => {
  const { data } = await apiService.post<KudoResponse>("/kudos", kudoData);
  return data;
};

/**
 * Publica o despublica un kudo recibido. Solo el receptor puede hacerlo.
 * `isPublic` se envía como query param (el backend espera `@RequestParam boolean isPublic`).
 */
export const toggleKudoVisibility = async (
  kudoId: number,
  isPublic: boolean
): Promise<KudoResponse> => {
  const { data } = await apiService.patch<KudoResponse>(
    `/kudos/${kudoId}/toggle-visibility`,
    null,
    { params: { isPublic } }
  );
  return data;
};
