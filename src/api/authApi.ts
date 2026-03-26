import apiService from "./apiService";
import type { LoginRequest, RegisterRequest, UserResponse } from "../types";

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
): Promise<UserResponse> => {
  const { data } = await apiService.post<UserResponse>(
    "/auth/register",
    userData
  );
  return data;
};

/**
 * Obtiene la información del usuario logeado.
 */
export const fetchUserData = async (): Promise<UserResponse> => {
  const { data } = await apiService.get<UserResponse>("/dashboard");
  return data;
};
