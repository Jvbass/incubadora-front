import type { ReportContentType, ReportReason } from "../../types";

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
