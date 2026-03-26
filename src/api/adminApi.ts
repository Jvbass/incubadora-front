import apiService from "./apiService";
import type { MentorRequest, RejectRequest } from "../types";

/**
 * [DEV] Solicita el ascenso de rol a mentor.
 */
export const requestMentorUpgrade = async (): Promise<void> => {
  await apiService.patch("/me/profile/request-mentor-upgrade");
};

/**
 * [ADMIN] Obtiene la lista de solicitudes pendientes.
 */
export const fetchMentorRequests = async (): Promise<MentorRequest[]> => {
  const { data } = await apiService.get<MentorRequest[]>(
    "/dashboard/admin/mentor-requests"
  );
  return data;
};

/**
 * [ADMIN] Aprueba una solicitud de ascenso a mentor.
 */
export const approveMentorUpgrade = async (
  userId: number
): Promise<{ token: string }> => {
  const { data } = await apiService.patch<{ token: string }>(
    `/admin/mentor-requests/${userId}/approve`
  );
  return data;
};

/**
 * [ADMIN] Rechaza una solicitud de ascenso a mentor.
 */
export const rejectMentorUpgrade = async ({
  notificationId,
  reason,
}: {
  notificationId: number;
  reason: string;
}): Promise<void> => {
  await apiService.patch(`/admin/mentor-requests/${notificationId}/reject`, {
    reason,
  } as RejectRequest);
};
