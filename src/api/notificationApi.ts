import apiService from "./apiService";
import type { Notification } from "../types";

/**
 * Obtiene todas las notificaciones del usuario autenticado.
 */
export const fetchNotifications = async (): Promise<Notification[]> => {
  const { data } = await apiService.get<Notification[]>("/notifications");
  return data;
};

/**
 * Marca una notificación específica como leída.
 */
export const markNotificationAsRead = async (
  notificationId: number
): Promise<Notification> => {
  const { data } = await apiService.patch<Notification>(
    `/notifications/${notificationId}/read`
  );
  return data;
};

/**
 * Marca todas las notificaciones del usuario como leídas.
 */
export const markAllNotificationsAsRead = async (): Promise<Notification[]> => {
  const { data } = await apiService.post<Notification[]>(
    "/notifications/read-all"
  );
  return data;
};
