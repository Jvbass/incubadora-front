import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import {
  X,
  ExternalLink,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  AlertCircle,
  EyeOff,
  Ban,
} from "lucide-react";
import {
  fetchReportDetail,
  claimReport,
  resolveReport,
  rejectReport,
  escalateReport,
  warnContentOwner,
  restrictUser,
  hideReportedContent,
} from "../../../api/reportApi";
import {
  REASON_LABELS,
  CONTENT_TYPE_LABELS,
  STATUS_LABELS,
  STATUS_BADGE,
  ACTION_TYPE_LABELS,
} from "../../reports/reportLabels";
import type { AdminReport, ReportDetail, ReportStatus } from "../../../types";

interface ReportDetailDrawerProps {
  reportId: number;
  onClose: () => void;
}

type ActiveAction = "resolve" | "reject" | "escalate" | "warn" | "restrict" | null;

const TERMINAL_STATUSES: ReportStatus[] = ["RESOLVED", "REJECTED"];
const ACTIVE_STATUSES: ReportStatus[] = ["PENDING", "IN_REVIEW", "ESCALATED"];

/** Presets de duración de restricción (en horas). */
const RESTRICTION_PRESETS: { label: string; hours: number }[] = [
  { label: "24 horas", hours: 24 },
  { label: "7 días", hours: 168 },
  { label: "30 días", hours: 720 },
];

const ReportDetailDrawer = ({ reportId, onClose }: ReportDetailDrawerProps) => {
  const queryClient = useQueryClient();
  const [activeAction, setActiveAction] = useState<ActiveAction>(null);
  const [note, setNote] = useState("");
  const [restrictHours, setRestrictHours] = useState<number>(
    RESTRICTION_PRESETS[0].hours
  );

  // Cerrar el drawer con la tecla Escape (a11y).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const {
    data: detail,
    isLoading,
    error,
  } = useQuery<ReportDetail>({
    queryKey: ["reportDetail", reportId],
    queryFn: () => fetchReportDetail(reportId),
    staleTime: 1000 * 30,
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["adminReports"] });
    queryClient.invalidateQueries({ queryKey: ["reportDetail", reportId] });
  };

  const onActionSuccess = (updated: AdminReport) => {
    invalidateAll();
    setActiveAction(null);
    setNote("");
    toast.success(`Acción realizada. Estado: ${STATUS_LABELS[updated.status]}`);
  };

  const onActionError = (err: AxiosError<{ message?: string }>) => {
    toast.error(
      err.response?.data?.message || "No se pudo completar la acción."
    );
  };

  const claimMutation = useMutation({
    mutationFn: () => claimReport(reportId),
    onSuccess: onActionSuccess,
    onError: onActionError,
  });

  const resolveMutation = useMutation({
    mutationFn: (n?: string) => resolveReport(reportId, n),
    onSuccess: onActionSuccess,
    onError: onActionError,
  });

  const rejectMutation = useMutation({
    mutationFn: (n?: string) => rejectReport(reportId, n),
    onSuccess: onActionSuccess,
    onError: onActionError,
  });

  const escalateMutation = useMutation({
    mutationFn: (n?: string) => escalateReport(reportId, n),
    onSuccess: onActionSuccess,
    onError: onActionError,
  });

  const warnMutation = useMutation({
    mutationFn: (n: string) => warnContentOwner(reportId, n),
    onSuccess: onActionSuccess,
    onError: onActionError,
  });

  const restrictMutation = useMutation({
    mutationFn: ({ hours, n }: { hours: number; n?: string }) =>
      restrictUser(reportId, hours, n),
    onSuccess: () => {
      invalidateAll();
      setActiveAction(null);
      setNote("");
      toast.success("Autor restringido temporalmente.");
    },
    onError: onActionError,
  });

  const hideMutation = useMutation({
    mutationFn: () => hideReportedContent(reportId),
    onSuccess: () => {
      invalidateAll();
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Contenido ocultado. Los reportes pendientes quedaron resueltos.");
    },
    onError: onActionError,
  });

  const isBusy =
    claimMutation.isPending ||
    resolveMutation.isPending ||
    rejectMutation.isPending ||
    escalateMutation.isPending ||
    warnMutation.isPending ||
    restrictMutation.isPending ||
    hideMutation.isPending;

  const handleConfirmAction = () => {
    if (!activeAction) return;
    if (activeAction === "warn") {
      if (!note.trim()) {
        toast.error("La nota es obligatoria para avisar al autor.");
        return;
      }
      warnMutation.mutate(note.trim());
    } else if (activeAction === "restrict") {
      restrictMutation.mutate({ hours: restrictHours, n: note.trim() || undefined });
    } else if (activeAction === "resolve") {
      resolveMutation.mutate(note.trim() || undefined);
    } else if (activeAction === "reject") {
      rejectMutation.mutate(note.trim() || undefined);
    } else if (activeAction === "escalate") {
      escalateMutation.mutate(note.trim() || undefined);
    }
  };

  const cancelAction = () => {
    setActiveAction(null);
    setNote("");
    setRestrictHours(RESTRICTION_PRESETS[0].hours);
  };

  const report = detail?.report;
  const currentStatus = report?.status;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Panel lateral */}
      <div
        data-testid="report-detail-drawer"
        className="fixed top-0 right-0 h-full w-[520px] z-40 bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
      >
        {/* Cabecera */}
        <div className="flex-shrink-0 px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-lg dark:text-text-light">
              Reporte #{reportId}
            </h3>
            {report && (
              <span
                data-testid="drawer-status-badge"
                className={`px-2 py-0.5 text-xs rounded-full font-medium ${STATUS_BADGE[report.status]}`}
              >
                {STATUS_LABELS[report.status]}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar panel"
            className="p-1 rounded-md text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo (con scroll) */}
        <div className="flex-grow overflow-y-auto p-5 space-y-5">
          {isLoading && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cargando detalles...
            </p>
          )}
          {error && (
            <p className="text-sm text-red-500">
              Error al cargar el detalle del reporte.
            </p>
          )}

          {detail && report && (
            <>
              {/* Contenido reportado */}
              <DrawerSection title="Contenido reportado">
                <InfoRow label="Tipo" value={CONTENT_TYPE_LABELS[report.contentType]} />
                <InfoRow label="Título">
                  {report.contentLink ? (
                    <Link
                      to={report.contentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      {report.contentLabel} <ExternalLink size={12} />
                    </Link>
                  ) : (
                    <span className="text-sm dark:text-gray-300">
                      {report.contentLabel}
                    </span>
                  )}
                </InfoRow>
                {report.contentAuthorUsername && (
                  <InfoRow label="Autor" value={report.contentAuthorUsername} />
                )}
              </DrawerSection>

              {/* Detalle del reporte */}
              <DrawerSection title="Detalle del reporte">
                <InfoRow label="Reportante" value={report.reporterUsername} />
                <InfoRow label="Motivo" value={REASON_LABELS[report.reason]} />
                <InfoRow label="Descripción">
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded p-2 leading-relaxed">
                    {report.description}
                  </p>
                </InfoRow>
                <InfoRow
                  label="Fecha"
                  value={new Date(report.createdAt).toLocaleString("es-ES")}
                />
              </DrawerSection>

              {/* Historial de infracciones del autor */}
              {detail.infractionHistory.length > 0 && (
                <DrawerSection
                  title={`Historial de infracciones (${detail.infractionHistory.length})`}
                >
                  <div className="space-y-1">
                    {detail.infractionHistory.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between text-sm p-2 rounded bg-gray-50 dark:bg-gray-800"
                      >
                        <span className="text-gray-700 dark:text-gray-300 truncate mr-2">
                          {r.contentLabel}
                        </span>
                        <span
                          className={`shrink-0 px-2 py-0.5 text-xs rounded-full ${STATUS_BADGE[r.status]}`}
                        >
                          {STATUS_LABELS[r.status]}
                        </span>
                      </div>
                    ))}
                  </div>
                </DrawerSection>
              )}

              {/* Reportes similares */}
              {detail.similarReports.length > 0 && (
                <DrawerSection
                  title={`Reportes similares (${detail.similarReports.length})`}
                >
                  <div className="space-y-1">
                    {detail.similarReports.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between text-sm p-2 rounded bg-gray-50 dark:bg-gray-800"
                      >
                        <span className="text-gray-700 dark:text-gray-300 truncate mr-2">
                          {r.contentLabel}
                        </span>
                        <span
                          className={`shrink-0 px-2 py-0.5 text-xs rounded-full ${STATUS_BADGE[r.status]}`}
                        >
                          {STATUS_LABELS[r.status]}
                        </span>
                      </div>
                    ))}
                  </div>
                </DrawerSection>
              )}

              {/* Audit trail */}
              <DrawerSection title="Registro de acciones">
                {detail.auditTrail.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sin acciones registradas.
                  </p>
                ) : (
                  <div className="space-y-2" data-testid="audit-trail">
                    {detail.auditTrail.map((action) => (
                      <div
                        key={action.id}
                        className="flex flex-col gap-0.5 p-2 rounded bg-gray-50 dark:bg-gray-800 text-sm"
                        data-action-type={action.actionType}
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-indigo-600 dark:text-cyan-400">
                            {ACTION_TYPE_LABELS[action.actionType] ?? action.actionType}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            por {action.adminUsername}
                          </span>
                          <span className="ml-auto text-xs text-gray-400 shrink-0">
                            {new Date(action.createdAt).toLocaleString("es-ES")}
                          </span>
                        </div>
                        {action.note && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 pl-2 border-l-2 border-indigo-300 dark:border-cyan-700 mt-1">
                            {action.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </DrawerSection>

              {/* Último mensaje al usuario (si existe) */}
              {report.adminMessage && (
                <DrawerSection title="Último mensaje al usuario">
                  <p className="text-sm text-indigo-700 dark:text-cyan-400 bg-indigo-50 dark:bg-cyan-900/20 rounded p-2">
                    {report.adminMessage}
                  </p>
                </DrawerSection>
              )}
            </>
          )}
        </div>

        {/* Footer con acciones */}
        {report && (
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
            {TERMINAL_STATUSES.includes(currentStatus!) ? (
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Este reporte está cerrado ({STATUS_LABELS[currentStatus!]}).
              </p>
            ) : (
              <>
                {/* Formulario de nota inline (aparece al seleccionar acción) */}
                {activeAction && (
                  <div className="space-y-2">
                    {activeAction === "restrict" && (
                      <div className="space-y-1.5">
                        <span className="block text-sm font-medium dark:text-gray-300">
                          Duración de la restricción
                        </span>
                        <div className="flex gap-2" data-testid="restrict-presets">
                          {RESTRICTION_PRESETS.map((preset) => (
                            <button
                              key={preset.hours}
                              type="button"
                              onClick={() => setRestrictHours(preset.hours)}
                              className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition-colors ${
                                restrictHours === preset.hours
                                  ? "bg-red-600 text-white border-red-600"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
                              }`}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <label className="block text-sm font-medium dark:text-gray-300">
                      {activeAction === "warn" ? (
                        <>
                          Nota para el autor{" "}
                          <span className="text-red-500">*</span>
                        </>
                      ) : (
                        "Nota (opcional)"
                      )}
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={2}
                      maxLength={500}
                      placeholder={
                        activeAction === "warn"
                          ? "Explica la advertencia al autor (requerido)..."
                          : "Motivo de la acción (opcional)..."
                      }
                      className="w-full rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-500 resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={cancelAction}
                        className="px-3 py-1.5 text-xs rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleConfirmAction}
                        disabled={
                          isBusy ||
                          (activeAction === "warn" && !note.trim())
                        }
                        className="px-3 py-1.5 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                      >
                        {isBusy ? "Procesando..." : "Confirmar"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Botones de acción (se ocultan cuando hay un activeAction) */}
                {!activeAction && (
                  <div className="flex flex-wrap gap-2">
                    {currentStatus === "PENDING" && (
                      <button
                        onClick={() => claimMutation.mutate()}
                        disabled={isBusy}
                        className="flex-1 min-w-[110px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        <Shield size={12} /> Reclamar
                      </button>
                    )}

                    {ACTIVE_STATUSES.includes(currentStatus!) && (
                      <>
                        <button
                          onClick={() => setActiveAction("resolve")}
                          disabled={isBusy}
                          className="flex-1 min-w-[110px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                        >
                          <CheckCircle size={12} /> Resolver
                        </button>
                        <button
                          onClick={() => setActiveAction("reject")}
                          disabled={isBusy}
                          className="flex-1 min-w-[110px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-md bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
                        >
                          <XCircle size={12} /> Rechazar
                        </button>
                        <button
                          onClick={() => setActiveAction("escalate")}
                          disabled={isBusy}
                          className="flex-1 min-w-[110px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-md bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 transition-colors"
                        >
                          <AlertTriangle size={12} /> Escalar
                        </button>
                        <button
                          onClick={() => setActiveAction("warn")}
                          disabled={isBusy}
                          className="flex-1 min-w-[110px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-md bg-yellow-600 text-white hover:bg-yellow-700 disabled:opacity-50 transition-colors"
                        >
                          <AlertCircle size={12} /> Avisar al autor
                        </button>
                        <button
                          onClick={() => setActiveAction("restrict")}
                          disabled={isBusy}
                          className="flex-1 min-w-[110px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-md bg-rose-700 text-white hover:bg-rose-800 disabled:opacity-50 transition-colors"
                        >
                          <Ban size={12} /> Restringir autor
                        </button>
                        <button
                          onClick={() => hideMutation.mutate()}
                          disabled={isBusy}
                          className="flex-1 min-w-[110px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          <EyeOff size={12} /> Ocultar contenido
                        </button>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

/* ---------- Componentes auxiliares locales ---------- */

const DrawerSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
      {title}
    </h4>
    {children}
  </div>
);

const InfoRow = ({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    {children ?? (
      <span className="text-sm font-medium dark:text-gray-200">{value}</span>
    )}
  </div>
);

export default ReportDetailDrawer;
