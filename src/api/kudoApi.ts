import apiService from "./apiService";
import type { KudoPost, KudoResponse } from "../types";

/**
 * Envía un kudo a un usuario.
 */
export const postKudo = async (kudoData: KudoPost): Promise<KudoResponse> => {
  const { data } = await apiService.post<KudoResponse>("/kudos", kudoData);
  return data;
};
