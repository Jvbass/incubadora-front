import type { ReportContentType, ReportReason, ReportStatus } from "../../types";

/** Etiquetas en español de los motivos de reporte (espejo del enum del back). */
export const REASON_LABELS: Record<ReportReason, string> = {
  SPAM: "Spam o publicidad",
  CONTENIDO_INAPROPIADO: "Contenido inapropiado u ofensivo",
  PLAGIO: "Plagio o infracción de propiedad intelectual",
  INFORMACION_FALSA: "Información falsa o engañosa",
  OTRO: "Otro motivo",
};

export const CONTENT_TYPE_LABELS: Record<ReportContentType, string> = {
  PROJECT: "Proyecto",
  FEEDBACK: "Feedback",
  FEEDBACK_COMMENT: "Comentario",
  KUDO_COMMENT: "Comentario de kudo",
};

/** Etiquetas en español de los cinco estados de un reporte. */
export const STATUS_LABELS: Record<ReportStatus, string> = {
  PENDING: "Pendiente",
  IN_REVIEW: "En revisión",
  RESOLVED: "Resuelto",
  REJECTED: "Rechazado",
  ESCALATED: "Escalado",
};

/** Clases Tailwind para el badge de estado en modo claro y oscuro. */
export const STATUS_BADGE: Record<ReportStatus, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  IN_REVIEW:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  RESOLVED:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  REJECTED:
    "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  ESCALATED:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
};

/**
 * Etiquetas en español de los tipos de acción de moderación
 * (mirrors de ModerationActionType del back).
 */
export const ACTION_TYPE_LABELS: Record<string, string> = {
  CLAIM: "Reclamado",
  RESOLVE: "Resuelto",
  REJECT: "Rechazado",
  ESCALATE: "Escalado",
  WARN: "Advertencia al autor",
  HIDE_CONTENT: "Contenido ocultado",
};
