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

import { offerMentoring, requestCollaboration } from "../../../api/projectApi";

export type ProjectInteractionMode = "mentoring" | "collaboration";

interface ProjectInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectSlug: string;
  projectTitle: string;
  mode: ProjectInteractionMode;
}

interface InteractionForm {
  message: string;
}

const COPY: Record<
  ProjectInteractionMode,
  { title: string; placeholder: string; submit: string; success: string }
> = {
  mentoring: {
    title: "Ofrecer mentoría",
    placeholder:
      "Preséntate y cuenta cómo puedes ayudar como mentor en este proyecto...",
    submit: "Enviar oferta",
    success: "Oferta de mentoría enviada al dueño del proyecto.",
  },
  collaboration: {
    title: "Quiero colaborar",
    placeholder:
      "Responde brevemente: ¿Cómo puedes aportar al proyecto? ¿Qué experiencia tienes con estas tecnologías? ¿Cuál es tu disponibilidad?",
    submit: "Enviar solicitud",
    success: "Solicitud de colaboración enviada al dueño del proyecto.",
  },
};

const MAX_MESSAGE_LENGTH = 500;

export default function ProjectInteractionModal({
  isOpen,
  onClose,
  projectSlug,
  projectTitle,
  mode,
}: ProjectInteractionModalProps) {
  const copy = COPY[mode];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<InteractionForm>({ defaultValues: { message: "" } });

  const messageLength = watch("message")?.length ?? 0;

  const interactionMutation = useMutation({
    mutationFn: (message: string) =>
      mode === "mentoring"
        ? offerMentoring(projectSlug, message)
        : requestCollaboration(projectSlug, message),
    onSuccess: () => {
      toast.success(copy.success);
      reset();
      onClose();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data?.message || "No se pudo enviar el mensaje."
      );
    },
  });

  const onSubmit: SubmitHandler<InteractionForm> = (data) => {
    interactionMutation.mutate(data.message.trim());
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
                {copy.title}
              </DialogTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Proyecto: <span className="font-medium">{projectTitle}</span>
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <textarea
                  {...register("message", {
                    required: "El mensaje es obligatorio",
                    maxLength: {
                      value: MAX_MESSAGE_LENGTH,
                      message: `El mensaje no puede exceder los ${MAX_MESSAGE_LENGTH} caracteres`,
                    },
                  })}
                  maxLength={MAX_MESSAGE_LENGTH}
                  className="w-full p-2 rounded mb-1 border border-gray-300 dark:border-gray-600 dark:bg-bg-dark dark:text-text-light"
                  placeholder={copy.placeholder}
                  rows={5}
                />
                <div className="flex justify-between items-center mb-3">
                  {errors.message ? (
                    <p className="text-xs text-red-500">
                      {errors.message.message}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-gray-400">
                    {messageLength}/{MAX_MESSAGE_LENGTH}
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
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-300"
                    type="submit"
                    disabled={interactionMutation.isPending}
                  >
                    {interactionMutation.isPending
                      ? "Enviando..."
                      : copy.submit}
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
