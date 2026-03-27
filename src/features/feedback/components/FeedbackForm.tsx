import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createFeedbackForProject, fetchCategories } from "../../../api/feedbackApi";
import type { FeedbackRequest } from "../../../types";
import { InteractiveStarRating } from "../../../components/ux/InteractiveStarRating";
import { queryClient } from "../../../main";

interface FeedbackFormProps {
  projectSlug: string;
}

export const FeedbackForm = ({ projectSlug }: FeedbackFormProps) => {
  // Cargar categorías de feedback
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity,
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackRequest>({
    defaultValues: {
      feedbackDescription: "",
      rating: 0,
      categoryIds: [],
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
    onError: (_error: any) => {
      toast.error("No se pudo enviar tu feedback.");
    },
  });

  const onSubmit: SubmitHandler<FeedbackRequest> = (data) => {
    if (!data.rating || data.rating < 1) {
      toast.error("Debes seleccionar una calificación.");
      return;
    }
    if (!data.categoryIds || data.categoryIds.length === 0) {
      toast.error("Debes seleccionar al menos una categoría.");
      return;
    }
    mutation.mutate({ ...data, rating: Number(data.rating) });
  };

  return (
    <div className="p-6 bg-white dark:bg-bg-dark rounded-lg shadow-md space-y-8 mt-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-4 text-gray-700 dark:text-text-light">
            Deja tu Feedback
          </h3>
          <div className="space-y-4">
            {/* Calificación con estrellas interactivas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-text-light mb-2">
                Calificación <span className="text-red-500">*</span>
              </label>
              <Controller
                name="rating"
                control={control}
                rules={{ min: { value: 1, message: "Selecciona una calificación" } }}
                render={({ field }) => (
                  <InteractiveStarRating
                    value={field.value}
                    onChange={field.onChange}
                    size={32}
                  />
                )}
              />
              {errors.rating && (
                <p className="text-xs text-red-600 mt-1">{errors.rating.message}</p>
              )}
            </div>

            {/* Categorías */}
            {categories && categories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-text-light mb-2">
                  Categorías <span className="text-red-500">*</span>
                  <span className="ml-1 text-xs text-gray-500">(selecciona al menos una)</span>
                </label>
                <Controller
                  name="categoryIds"
                  control={control}
                  render={({ field }) => {
                    const selected: number[] = (field.value as number[]) || [];
                    const toggle = (id: number) => {
                      if (selected.includes(id)) {
                        field.onChange(selected.filter((v) => v !== id));
                      } else {
                        field.onChange([...selected, id]);
                      }
                    };
                    return (
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => {
                          const isSelected = selected.includes(category.id);
                          return (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => toggle(category.id)}
                              className={`px-3 py-1.5 rounded-full border text-sm transition-colors
                                ${isSelected
                                  ? "bg-indigo-600 text-white border-indigo-600"
                                  : "bg-white dark:bg-bg-dark text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-indigo-400"
                                }`}
                            >
                              {category.name}
                            </button>
                          );
                        })}
                      </div>
                    );
                  }}
                />
              </div>
            )}

            {/* Descripción */}
            <div>
              <label
                htmlFor="feedbackDescription"
                className="block text-sm font-medium text-gray-700 dark:text-text-light"
              >
                Descripción <span className="text-red-500">*</span>
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
                <p className="text-xs text-red-600 mt-1">
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
            disabled={isSubmitting || mutation.isPending}
            className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {mutation.isPending ? "Enviando..." : "Enviar Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
};
