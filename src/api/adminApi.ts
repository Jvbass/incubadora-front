import apiService from "./apiService";
import type { MentorRequest } from "../types";

/**
 * [DEV] Solicita el ascenso de rol a mentor.
 */
export const requestMentorUpgrade = async (): Promise<void> => {
  await apiService.post("/mentor-requests");
};

/**
 * [ADMIN] Obtiene la lista de solicitudes por estado (PENDING por defecto).
 */
export const fetchMentorRequests = async (
  status: "PENDING" | "APPROVED" | "REJECTED" = "PENDING"
): Promise<MentorRequest[]> => {
  const { data } = await apiService.get<MentorRequest[]>(
    "/admin/mentor-requests",
    { params: { status } }
  );
  return data;
};

/**
 * [ADMIN] Aprueba o rechaza una solicitud de ascenso a mentor.
 * Si la decisión es "reject", el motivo (reason) es obligatorio.
 */
export const decideMentorRequest = async ({
  requestId,
  decision,
  reason,
}: {
  requestId: number;
  decision: "approve" | "reject";
  reason?: string;
}): Promise<MentorRequest> => {
  const { data } = await apiService.patch<MentorRequest>(
    `/admin/mentor-requests/${requestId}`,
    { decision, reason }
  );
  return data;
};
