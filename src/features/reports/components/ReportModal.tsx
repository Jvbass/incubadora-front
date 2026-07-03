import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

import { createReport } from "../../../api/reportApi";
import type { ReportContentType, ReportReason } from "../../../types";
import { REASON_LABELS } from "../reportLabels";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: ReportContentType;
  contentId: number;
  /** Texto corto que identifica lo reportado (título del proyecto, autor del comentario...). */
  contentLabel: string;
}

interface ReportForm {
  reason: ReportReason | "";
  description: string;
}

const MAX_DESCRIPTION_LENGTH = 1000;

/**
 * Modal único de reporte para proyectos, feedback y comentarios:
 * select con los 5 motivos + descripción obligatoria.
 */
export default function ReportModal({
  isOpen,
  onClose,
  contentType,
  contentId,
  contentLabel,
}: ReportModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ReportForm>({
    defaultValues: { reason: "", description: "" },
  });

  const descriptionLength = watch("description")?.length ?? 0;

  const reportMutation = useMutation({
    mutationFn: (data: { reason: ReportReason; description: string }) =>
      createReport({ contentType, contentId, ...data }),
    onSuccess: () => {
      toast.success("Reporte enviado. Gracias por ayudar a la comunidad.");
      reset();
      onClose();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data?.message || "No se pudo enviar el reporte."
      );
    },
  });

  const onSubmit: SubmitHandler<ReportForm> = (data) => {
    if (!data.reason) return;
    reportMutation.mutate({
      reason: data.reason,
      description: data.description.trim(),
    });
  };

  return (
    <Transition appear show={isOpen}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Fondo oscuro */}
        <TransitionChild
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </TransitionChild>

        {/* Contenedor modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white dark:bg-bg-dark p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle className="text-lg font-semibold mb-1 dark:text-text-light">
                Reportar contenido
              </DialogTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Estás reportando:{" "}
                <span className="font-medium">{contentLabel}</span>
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <label
                  htmlFor="report-reason"
                  className="block text-sm font-medium text-gray-700 dark:text-text-light mb-1"
                >
                  Motivo del reporte
                </label>
                <select
                  id="report-reason"
                  {...register("reason", {
                    required: "Selecciona un motivo.",
                  })}
                  className="w-full p-2 rounded mb-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-bg-dark dark:text-text-light"
                >
                  <option value="">Selecciona un motivo...</option>
                  {(Object.keys(REASON_LABELS) as ReportReason[]).map(
                    (reason) => (
                      <option key={reason} value={reason}>
                        {REASON_LABELS[reason]}
                      </option>
                    )
                  )}
                </select>
                {errors.reason && (
                  <p className="text-xs text-red-500 mb-2">
                    {errors.reason.message}
                  </p>
                )}

                <label
                  htmlFor="report-description"
                  className="block text-sm font-medium text-gray-700 dark:text-text-light mb-1 mt-3"
                >
                  Describe el problema
                </label>
                <textarea
                  id="report-description"
                  {...register("description", {
                    required: "La descripción es obligatoria.",
                    maxLength: {
                      value: MAX_DESCRIPTION_LENGTH,
                      message: `La descripción no puede exceder los ${MAX_DESCRIPTION_LENGTH} caracteres`,
                    },
                  })}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  className="w-full p-2 rounded mb-1 border border-gray-300 dark:border-gray-600 dark:bg-bg-dark dark:text-text-light"
                  placeholder="Explica brevemente por qué reportas este contenido..."
                  rows={4}
                />
                <div className="flex justify-between items-center mb-3">
                  {errors.description ? (
                    <p className="text-xs text-red-500">
                      {errors.description.message}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-gray-400">
                    {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
                  </span>
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300"
                    type="submit"
                    disabled={reportMutation.isPending}
                  >
                    {reportMutation.isPending ? "Enviando..." : "Enviar reporte"}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
