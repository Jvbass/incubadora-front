import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { Check, EyeOff, ExternalLink, Flag, MessageSquare, X } from "lucide-react";
import {
  fetchAdminReports,
  decideReport,
  hideReportedContent,
} from "../../../api/reportApi";
import {
  REASON_LABELS,
  CONTENT_TYPE_LABELS,
} from "../../reports/reportLabels";
import type { AdminReport, ReportStatus } from "../../../types";
import ReportActionModal from "./ReportActionModal";

type TabStatus = ReportStatus;

type PendingAction =
  | { type: "review" | "dismiss"; report: AdminReport }
  | { type: "hide"; report: AdminReport }
  | null;

const STATUS_TABS: { label: string; value: TabStatus }[] = [
  { label: "Pendientes", value: "PENDING" },
  { label: "Revisados", value: "REVIEWED" },
  { label: "Descartados", value: "DISMISSED" },
];

const STATUS_BADGE: Record<TabStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  REVIEWED: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  DISMISSED: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

const ReportsPanel = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabStatus>("PENDING");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const { data: reports, isLoading } = useQuery<AdminReport[]>({
    queryKey: ["adminReports", activeTab],
    queryFn: () => fetchAdminReports(activeTab),
    staleTime: 1000 * 60,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["adminReports"] });

  const onError = (error: AxiosError<{ message?: string }>) => {
    toast.error(error.response?.data?.message || "No se pudo completar la acción.");
  };

  const decideMutation = useMutation({
    mutationFn: decideReport,
    onSuccess: (data) => {
      invalidate();
      toast.success(
        data.status === "DISMISSED" ? "Reporte descartado." : "Reporte marcado como revisado."
      );
      setPendingAction(null);
    },
    onError,
  });

  const hideMutation = useMutation({
    mutationFn: hideReportedContent,
    onSuccess: () => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Contenido ocultado. Los reportes pendientes quedaron resueltos.");
      setPendingAction(null);
    },
    onError,
  });

  const isBusy = decideMutation.isPending || hideMutation.isPending;

  const handleModalConfirm = (adminMessage: string) => {
    if (!pendingAction) return;
    if (pendingAction.type === "hide") {
      hideMutation.mutate(pendingAction.report.id);
    } else {
      decideMutation.mutate({
        reportId: pendingAction.report.id,
        decision: pendingAction.type,
        adminMessage: adminMessage.trim() || undefined,
      });
    }
  };

  const modalConfig = pendingAction
    ? pendingAction.type === "review"
      ? { title: "Marcar como revisado", confirmLabel: "Confirmar revisión", confirmClass: "bg-emerald-600 hover:bg-emerald-700" }
      : pendingAction.type === "dismiss"
      ? { title: "Descartar reporte", confirmLabel: "Descartar", confirmClass: "bg-gray-500 hover:bg-gray-600" }
      : { title: "Ocultar contenido", confirmLabel: "Ocultar contenido", confirmClass: "bg-red-600 hover:bg-red-700" }
    : null;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold dark:text-text-light flex items-center gap-2">
        <Flag size={20} /> Reportes de contenido
      </h2>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-300 dark:border-gray-700">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
              activeTab === tab.value
                ? "bg-white dark:bg-bg-dark text-indigo-600 dark:text-cyan-400 border border-b-0 border-gray-300 dark:border-gray-700"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="p-4 text-gray-500 dark:text-gray-400">Cargando reportes...</p>
      ) : !reports || reports.length === 0 ? (
        <p className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md dark:text-gray-300">
          No hay reportes en esta categoría.
        </p>
      ) : (
        reports.map((report) => (
          <div
            key={report.id}
            className="p-4 bg-white dark:bg-bg-dark rounded-lg shadow border border-divider dark:border-gray-700 space-y-2"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 font-medium">
                {REASON_LABELS[report.reason]}
              </span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {CONTENT_TYPE_LABELS[report.contentType]}
              </span>
              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${STATUS_BADGE[report.status]}`}>
                {report.status === "PENDING" ? "Pendiente" : report.status === "REVIEWED" ? "Revisado" : "Descartado"}
              </span>
              <span className="text-xs text-gray-500 ml-auto">
                {new Date(report.createdAt).toLocaleDateString("es-ES")}
              </span>
            </div>

            <p className="text-sm dark:text-text-light">
              <span className="font-semibold">{report.reporterUsername}</span>{" "}
              reportó{" "}
              <span className="font-medium">"{report.contentLabel}"</span>
              {report.contentAuthorUsername && (
                <span className="text-gray-500 dark:text-gray-400">
                  {" "}de {report.contentAuthorUsername}
                </span>
              )}
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 rounded p-2">
              {report.description}
            </p>

            {report.adminMessage && (
              <p className="text-sm text-indigo-700 dark:text-cyan-400 bg-indigo-50 dark:bg-cyan-900/20 rounded p-2 flex items-start gap-2">
                <MessageSquare size={14} className="mt-0.5 shrink-0" />
                <span>{report.adminMessage}</span>
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {report.contentLink && (
                <Link
                  to={report.contentLink}
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                >
                  <ExternalLink size={12} /> Ver contenido
                </Link>
              )}

              {activeTab === "PENDING" && (
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => setPendingAction({ type: "review", report })}
                    disabled={isBusy}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <Check size={12} /> Revisado
                  </button>
                  <button
                    onClick={() => setPendingAction({ type: "dismiss", report })}
                    disabled={isBusy}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-md bg-gray-500 text-white hover:bg-gray-600 disabled:opacity-50"
                  >
                    <X size={12} /> Descartar
                  </button>
                  <button
                    onClick={() => setPendingAction({ type: "hide", report })}
                    disabled={isBusy}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    <EyeOff size={12} /> Ocultar contenido
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {pendingAction && modalConfig && (
        <ReportActionModal
          isOpen
          onClose={() => setPendingAction(null)}
          onConfirm={handleModalConfirm}
          title={modalConfig.title}
          confirmLabel={modalConfig.confirmLabel}
          confirmClass={modalConfig.confirmClass}
          isPending={isBusy}
        />
      )}
    </section>
  );
};

export default ReportsPanel;
