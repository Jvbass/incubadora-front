import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createFeedbackForProject } from "../../../api/queries";
import type { FeedbackRequest } from "../../../types";
import { RocketSlider } from "../../ux/RocketSlider";

interface FeedbackFormProps {
  projectSlug: string;
}

export const FeedbackForm = ({ projectSlug }: FeedbackFormProps) => {
  const queryClient = useQueryClient();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackRequest>({
    defaultValues: {
      feedbackDescription: "",
      rating: 3, // valor inicial
    },
  });

  const mutation = useMutation({
    mutationFn: (feedbackData: FeedbackRequest) =>
      createFeedbackForProject({ projectSlug, feedbackData }),
    onSuccess: () => {
      toast.success("¡Gracias por tu feedback!.");
      queryClient.invalidateQueries({ queryKey: ["feedback", projectSlug] });
      reset();
    },
    onError: (error: any) => {
      const errorMessage = "No se pudo enviar tu feedback.";

      toast.error(errorMessage);
    },
  });

  const onSubmit: SubmitHandler<FeedbackRequest> = (data) => {
    const submissionData = { ...data, rating: Number(data.rating) };
    mutation.mutate(submissionData);
  };

  return (
    // Estructura y estilos inspirados en ProjectForm.tsx
    <div className="p-6 bg-white dark:bg-bg-dark rounded-lg shadow-md space-y-8 mt-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-4 text-gray-700 dark:text-text-light">
            Deja tu Feedback
          </h3>
          <div className="space-y-3">
            {/* Campo de Calificación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-text-light">
                Calificación <span className="text-xs">*</span>
              </label>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <RocketSlider
                    field={field}
                    control={control}
                    min={1}
                    max={5}
                  />
                )}
              />
            </div>

            {/* Campo de Descripción */}
            <div>
              <label
                htmlFor="feedbackDescription"
                className="block text-sm font-medium text-gray-700 dark:text-text-light"
              >
                Descripción <span className="text-xs">*</span>
              </label>
              <textarea
                id="feedbackDescription"
                {...register("feedbackDescription", {
                  required: "La descripción es obligatoria.",
                  minLength: {
                    value: 10,
                    message: "Debe tener al menos 10 caracteres.",
                  },
                  maxLength: {
                    value: 1000,
                    message: "Máximo 1000 caracteres.",
                  },
                })}
                rows={5}
                placeholder="¿Qué te pareció el proyecto? ¿Qué podría mejorar?"
                className="mt-1 block w-full bg-transparent placeholder:text-slate-400 text-slate-700 dark:text-text-light text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-blue-500 hover:border-blue-300 focus:shadow-sm"
              />
              {errors.feedbackDescription && (
                <p className="text-xs text-red-600  mt-1">
                  {errors.feedbackDescription.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Botón de Envío */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? "Enviando..." : "Enviar Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
};
