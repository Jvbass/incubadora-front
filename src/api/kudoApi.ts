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

/**
 * Edita el mensaje de un kudo enviado. Solo el emisor puede hacerlo.
 * El backend espera `@RequestBody String message`: se manda el string
 * crudo con Content-Type text/plain, no un objeto JSON. Cualquier edición
 * resetea el kudo a privado en el servidor, sin importar su estado previo.
 */
export const updateKudoMessage = async (
  kudoId: number,
  message: string
): Promise<KudoResponse> => {
  const { data } = await apiService.put<KudoResponse>(
    `/kudos/${kudoId}`,
    message,
    { headers: { "Content-Type": "text/plain" } }
  );
  return data;
};

/**
 * Elimina un kudo enviado. Solo el emisor puede hacerlo.
 */
export const deleteKudo = async (kudoId: number): Promise<void> => {
  await apiService.delete(`/kudos/${kudoId}`);
};
