import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Flag } from "lucide-react";
import { fetchAdminReports } from "../../../api/reportApi";
import {
  REASON_LABELS,
  CONTENT_TYPE_LABELS,
  STATUS_LABELS,
  STATUS_BADGE,
} from "../../reports/reportLabels";
import type { AdminReport, ReportStatus } from "../../../types";
import ReportDetailDrawer from "./ReportDetailDrawer";

const STATUS_TABS: { label: string; value: ReportStatus }[] = [
  { label: "Pendientes", value: "PENDING" },
  { label: "En revisión", value: "IN_REVIEW" },
  { label: "Resueltos", value: "RESOLVED" },
  { label: "Rechazados", value: "REJECTED" },
  { label: "Escalados", value: "ESCALATED" },
];

const ReportsPanel = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ReportStatus>("PENDING");
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  const { data: reports, isLoading } = useQuery<AdminReport[]>({
    queryKey: ["adminReports", activeTab],
    queryFn: () => fetchAdminReports(activeTab),
    staleTime: 1000 * 60,
  });

  const handleTabChange = (status: ReportStatus) => {
    setActiveTab(status);
    setSelectedReportId(null);
  };

  const handleCloseDrawer = () => {
    setSelectedReportId(null);
    // Refrescar la pestaña activa para reflejar cambios de estado
    queryClient.invalidateQueries({ queryKey: ["adminReports", activeTab] });
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold dark:text-text-light flex items-center gap-2">
        <Flag size={20} /> Reportes de contenido
      </h2>

      {/* Tabs de estado */}
      <div className="flex gap-1 border-b border-gray-300 dark:border-gray-700 overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`px-3 py-2 text-sm font-medium rounded-t-md transition-colors whitespace-nowrap ${
              activeTab === tab.value
                ? "bg-white dark:bg-bg-dark text-indigo-600 dark:text-cyan-400 border border-b-0 border-gray-300 dark:border-gray-700"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {tab.label}
            {activeTab === tab.value && reports && reports.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-700 dark:bg-cyan-900/40 dark:text-cyan-300">
                {reports.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lista de triage */}
      {isLoading ? (
        <p className="p-4 text-gray-500 dark:text-gray-400">Cargando reportes...</p>
      ) : !reports || reports.length === 0 ? (
        <p className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md dark:text-gray-300">
          No hay reportes en esta categoría.
        </p>
      ) : (
        <div className="space-y-2">
          {reports.map((report) => (
            <button
              key={report.id}
              data-report-id={report.id}
              onClick={() => setSelectedReportId(report.id)}
              className={`w-full text-left p-4 bg-white dark:bg-bg-dark rounded-lg shadow border transition-colors cursor-pointer ${
                selectedReportId === report.id
                  ? "border-indigo-500 dark:border-cyan-500 ring-2 ring-indigo-200 dark:ring-cyan-900/50"
                  : "border-divider dark:border-gray-700 hover:border-indigo-300 dark:hover:border-gray-500"
              }`}
            >
              {/* Badges de estado y tipo */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 font-medium">
                  {REASON_LABELS[report.reason]}
                </span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {CONTENT_TYPE_LABELS[report.contentType]}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-medium ${STATUS_BADGE[report.status]}`}
                >
                  {STATUS_LABELS[report.status]}
                </span>
                <span className="text-xs text-gray-500 ml-auto">
                  {new Date(report.createdAt).toLocaleDateString("es-ES")}
                </span>
              </div>

              {/* Descripción resumida */}
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

              {report.description && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                  {report.description}
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Drawer de detalle (overlay fijo) */}
      {selectedReportId !== null && (
        <ReportDetailDrawer
          reportId={selectedReportId}
          onClose={handleCloseDrawer}
        />
      )}
    </section>
  );
};

export default ReportsPanel;
