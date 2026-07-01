import apiService from "./apiService";
import type { AdminReport, CreateReportRequest, ReportDetail, ReportStatus } from "../types";

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
 * [ADMIN] Detalle enriquecido de un reporte:
 * reporte base + historial de infracciones del autor + reportes similares + audit trail.
 */
export const fetchReportDetail = async (reportId: number): Promise<ReportDetail> => {
  const { data } = await apiService.get<ReportDetail>(`/admin/reports/${reportId}`);
  return data;
};

/**
 * [ADMIN] Reclama un reporte PENDING → lo pasa a IN_REVIEW.
 */
export const claimReport = async (reportId: number): Promise<AdminReport> => {
  const { data } = await apiService.post<AdminReport>(`/admin/reports/${reportId}/claim`);
  return data;
};

/**
 * [ADMIN] Resuelve un reporte (PENDING / IN_REVIEW / ESCALATED → RESOLVED).
 */
export const resolveReport = async (
  reportId: number,
  note?: string
): Promise<AdminReport> => {
  const { data } = await apiService.post<AdminReport>(
    `/admin/reports/${reportId}/resolve`,
    note ? { note } : {}
  );
  return data;
};

/**
 * [ADMIN] Rechaza un reporte → REJECTED.
 */
export const rejectReport = async (
  reportId: number,
  note?: string
): Promise<AdminReport> => {
  const { data } = await apiService.post<AdminReport>(
    `/admin/reports/${reportId}/reject`,
    note ? { note } : {}
  );
  return data;
};

/**
 * [ADMIN] Escala un reporte → ESCALATED.
 */
export const escalateReport = async (
  reportId: number,
  note?: string
): Promise<AdminReport> => {
  const { data } = await apiService.post<AdminReport>(
    `/admin/reports/${reportId}/escalate`,
    note ? { note } : {}
  );
  return data;
};

/**
 * [ADMIN] Envía una advertencia al autor del contenido reportado.
 * La nota es OBLIGATORIA (el backend valida @NotBlank).
 */
export const warnContentOwner = async (
  reportId: number,
  note: string
): Promise<AdminReport> => {
  const { data } = await apiService.post<AdminReport>(
    `/admin/reports/${reportId}/warn`,
    { note }
  );
  return data;
};

/**
 * [ADMIN] Restringe temporalmente al autor del contenido reportado:
 * no podrá comentar ni publicar hasta que venza la restricción.
 * Duración en horas (presets: 24 / 168 / 720). El backend valida durationHours >= 1.
 */
export const restrictUser = async (
  reportId: number,
  durationHours: number,
  note?: string
): Promise<AdminReport> => {
  const { data } = await apiService.post<AdminReport>(
    `/admin/reports/${reportId}/restrict`,
    note ? { durationHours, note } : { durationHours }
  );
  return data;
};

/**
 * [ADMIN] Oculta el contenido reportado (soft-hide); marca como REVIEWED
 * todos los reportes pendientes sobre ese contenido.
 */
export const hideReportedContent = async (reportId: number): Promise<void> => {
  await apiService.patch(`/admin/reports/${reportId}/hide-content`);
};

/**
 * [ADMIN] (Legacy) Marca un reporte como revisado o descartado, con mensaje opcional.
 * @deprecated Usar las acciones específicas (resolveReport, rejectReport, etc.) en su lugar.
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
