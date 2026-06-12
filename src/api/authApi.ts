import apiService from "./apiService";
import type { LoginRequest, RegisterRequest, RegisterResponse } from "../types";

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
 * Registra un nuevo usuario. La cuenta queda pendiente de verificación de
 * email (el back ya no devuelve token en el registro).
 */
export const registerUser = async (
  userData: RegisterRequest
): Promise<RegisterResponse> => {
  const { data } = await apiService.post<RegisterResponse>(
    "/auth/register",
    userData
  );
  return data;
};

/**
 * Valida el código de 6 dígitos enviado al email.
 */
export const verifyEmail = async (payload: {
  email: string;
  code: string;
}): Promise<void> => {
  await apiService.post("/auth/verify-email", payload);
};

/**
 * Reenvía (regenera) el código de verificación.
 */
export const resendVerificationCode = async (email: string): Promise<void> => {
  await apiService.post("/auth/resend-verification", { email });
};

