import apiService from "./apiService";
import type { AdminReport, CreateReportRequest, ReportStatus } from "../types";

/**
 * Reporta un contenido (proyecto, feedback o comentario).
 * Backend: 204 OK | 404 contenido inexistente | 409 propio o ya reportado.
 */
export const createReport = async (
  report: CreateReportRequest
): Promise<void> => {
  await apiService.post("/reports", report);
};

/**
 * [ADMIN] Lista reportes por estado (PENDING por defecto).
 */
export const fetchAdminReports = async (
  status: ReportStatus = "PENDING"
): Promise<AdminReport[]> => {
  const { data } = await apiService.get<AdminReport[]>("/admin/reports", {
    params: { status },
  });
  return data;
};

/**
 * [ADMIN] Marca un reporte como revisado o descartado, con mensaje opcional.
 */
export const decideReport = async ({
  reportId,
  decision,
  adminMessage,
}: {
  reportId: number;
  decision: "review" | "dismiss";
  adminMessage?: string;
}): Promise<AdminReport> => {
  const { data } = await apiService.patch<AdminReport>(
    `/admin/reports/${reportId}`,
    { decision, adminMessage: adminMessage || undefined }
  );
  return data;
};

/**
 * [ADMIN] Oculta el contenido reportado (soft-hide); marca como REVIEWED
 * todos los reportes pendientes sobre ese contenido.
 */
export const hideReportedContent = async (
  reportId: number
): Promise<void> => {
  await apiService.patch(`/admin/reports/${reportId}/hide-content`);
};
