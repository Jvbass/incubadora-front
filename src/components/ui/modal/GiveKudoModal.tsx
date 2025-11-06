import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { KudoPost, ProjectSummary } from "../../../types";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { postKudo } from "../../../api/queries";
import toast from "react-hot-toast";
import { queryClient } from "../../../main";

interface GiveKudoModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    firstName: string;
    slug?: string;
    projects: ProjectSummary[];
  };
}

export default function GiveKudoModal({
  isOpen,
  onClose,
  profile,
}: GiveKudoModalProps) {
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<KudoPost>();

  const kudoPostMutation = useMutation({
    mutationFn: (data: KudoPost) => postKudo(data),
    onSuccess: () => {
      // Invalidamos las queries para refrescar los datos en toda la app
      queryClient.invalidateQueries({ queryKey: ["profile", profile.slug] });
      onClose(); // Cerramos el modal
      // mostramos modal de éxito
      setIsSuccessOpen(true);
      setTimeout(() => {
        setIsSuccessOpen(false);
      }, 6000);
    },
    onError: (error) => {
      toast.error(`Error al registrar el kudo: ${error.message}`);
      console.error(error);
    },
  });

  const onSubmit: SubmitHandler<KudoPost> = (data) => {
    if (!profile.slug) {
      toast.error("El perfil no tiene un slug válido");
      return;
    }

    kudoPostMutation.mutate({
      ...data,
      receiverSlug: profile.slug,
    });
    reset();
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          {/* Fondo oscuro */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          {/* Contenedor modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white dark:bg-bg-dark p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-semibold mb-4 dark:text-text-light">
                  Enviar un Kudo a {profile.firstName}
                </Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Textarea */}
                  <textarea
                    {...register("message")}
                    className="w-full p-2 rounded mb-3 border border-gray-300 dark:border-gray-600 dark:bg-bg-dark"
                    placeholder={`Escribe un mensaje para ${profile.firstName}...`}
                    rows={3}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.message.message}
                    </p>
                  )}

                  {/* Select de proyectos */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                      Proyecto relacionado (opcional):
                    </label>
                    <select
                      {...register("relatedProjectId")}
                      className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-bg-dark"
                    >
                      <option value="">Selecciona un proyecto</option>
                      {profile.projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                      onClick={onClose}
                    >
                      Cancelar
                    </button>
                    <button
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      type="submit"
                      disabled={isSubmitting || kudoPostMutation.isPending}
                    >
                      {kudoPostMutation.isPending
                        ? "Enviando..."
                        : "Enviar Kudo"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      {/* Modal de éxito */}
      <Transition appear show={isSuccessOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsSuccessOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm rounded-xl bg-white dark:bg-bg-dark p-6 text-center shadow-xl transition-all">
                <Dialog.Title className="text-lg font-semibold mb-2 dark:text-text-light">
                  🎉 Kudo enviado con éxito
                </Dialog.Title>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  El kudo ha sido enviado y está a la espera que{" "}
                  <span className="font-medium">{profile.firstName}</span> lo
                  apruebe y publique.
                </p>
                <button
                  onClick={() => setIsSuccessOpen(false)}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Cerrar
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
