import {
  useForm,
  Controller,
  type SubmitHandler,
} from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";

import { useEffect, useState } from "react";
import { createMentorship, updateMentorshipBySlug } from "../../../api/mentoringApi";
import { useEffectiveTheme } from "../../../hooks/useEffectiveTheme";
import {
  type MentorshipDetailResponse,
  PLATFORM_OPTIONS,
  type CreateMentorshipRequest,
  type ImageUploadResponse,
} from "../../../types";
import ImageUpload from "../../../components/ui/ImageUpload";

interface MentorshipFormProps {
  mentorshipSlug?: string;
  initialData?: MentorshipDetailResponse;
  onClose?: () => void;
}

const MentorshipForm = ({
  mentorshipSlug,
  initialData,
  onClose,
}: MentorshipFormProps) => {
  const effectiveTheme = useEffectiveTheme();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateMentorshipRequest>({
    defaultValues: {
      title: "",
      description: "",
      specialty: "",
      durationMinutes: 60,
      platform: "zoom",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      price: 0,
      isFree: true,
    },
  });

  const isFree = watch("isFree");

  // Tags como texto separado por comas (se convierte a array al enviar)
  const [tagsInput, setTagsInput] = useState("");

  // Llenar el formulario con datos iniciales si es edición
  useEffect(() => {
    if (initialData) {
      setTagsInput((initialData.tags ?? []).join(", "));
      reset({
        title: initialData.title,
        description: initialData.description,
        specialty: initialData.specialty,
        durationMinutes: initialData.durationMinutes,
        platform: initialData.platform as any,
        timezone: initialData.timezone,
        price: initialData.price || 0,
        isFree: initialData.isFree,
      });
    }
  }, [initialData, reset]);

  const createMutation = useMutation({
    mutationFn: createMentorship,
    onSuccess: () => {
      toast.success("¡Mentoría creada exitosamente!");
      queryClient.invalidateQueries({ queryKey: ["myMentorships"] });
      navigate("/mentor-dashboard");
    },
    onError: (error: any) => {
      toast.error(`Error al crear la mentoría: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateMentorshipRequest) =>
      updateMentorshipBySlug(mentorshipSlug!, data),
    onSuccess: () => {
      toast.success("¡Mentoría actualizada exitosamente!");
      queryClient.invalidateQueries({ queryKey: ["myMentorships"] });
      queryClient.invalidateQueries({
        queryKey: ["mentorship", mentorshipSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ["mentorings", "detail", mentorshipSlug],
      });
      if (onClose) onClose();
    },
    onError: (error: any) => {
      toast.error(`Error al actualizar la mentoría: ${error.message}`);
    },
  });

  const onSubmit: SubmitHandler<CreateMentorshipRequest> = (data) => {
    // Si es gratuita se omite el precio: el backend rechaza price <= 0
    if (data.isFree) {
      data.price = undefined;
    }

    // Convertir el texto de tags a array (máx. 10, sin vacíos ni duplicados)
    data.tags = Array.from(
      new Set(
        tagsInput
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean)
      )
    ).slice(0, 10);

    if (mentorshipSlug) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 bg-white dark:bg-bg-dark rounded-lg shadow-md space-y-8 border border-gray-300 dark:border-gray-600"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-text-light">
          {mentorshipSlug ? "Editar Mentoría" : "Crear Nueva Mentoría"}
        </h1>

        {/* Información General */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-gray-300 dark:border-gray-600 pb-2 mb-4 text-gray-700 dark:text-text-light">
            Información General
          </h3>

          {/* Título */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-text-light"
            >
              Título <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              {...register("title", {
                required: "El título es obligatorio",
                maxLength: {
                  value: 255,
                  message: "El título no puede exceder los 255 caracteres",
                },
              })}
              className="mt-1 block w-full bg-transparent placeholder:text-slate-400 text-slate-700 dark:text-text-light text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 transition duration-200 ease focus:outline-none focus:border-blue-500 hover:border-blue-300"
              placeholder="Ej: Mentoría en React y TypeScript"
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Especialidad */}
          <div>
            <label
              htmlFor="specialty"
              className="block text-sm font-medium text-gray-700 dark:text-text-light"
            >
              Especialidad <span className="text-red-500">*</span>
            </label>
            <input
              id="specialty"
              type="text"
              {...register("specialty", {
                required: "La especialidad es obligatoria",
                maxLength: {
                  value: 255,
                  message:
                    "La especialidad no puede exceder los 255 caracteres",
                },
              })}
              className="mt-1 block w-full bg-transparent placeholder:text-slate-400 text-slate-700 dark:text-text-light text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 transition duration-200 ease focus:outline-none focus:border-blue-500 hover:border-blue-300"
              placeholder="Ej: Desarrollo Frontend, Arquitectura de Software"
            />
            {errors.specialty && (
              <p className="text-xs text-red-600 mt-1">
                {errors.specialty.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 dark:text-text-light"
            >
              Tags
            </label>
            <input
              id="tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="mt-1 block w-full bg-transparent placeholder:text-slate-400 text-slate-700 dark:text-text-light text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 transition duration-200 ease focus:outline-none focus:border-blue-500 hover:border-blue-300"
              placeholder="Ej: react, typescript, arquitectura (separados por comas, máx. 10)"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Los tags ayudan a que encuentren tu mentoría en el listado.
            </p>
          </div>

          {/* Descripción */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-text-light"
            >
              Descripción <span className="text-red-500">*</span>
            </label>
            <Controller
              name="description"
              control={control}
              rules={{
                required: "La descripción es obligatoria",
                maxLength: {
                  value: 15000,
                  message:
                    "La descripción no puede exceder los 15000 caracteres",
                },
              }}
              render={({ field }) => (
                <div className="mt-1" data-color-mode={effectiveTheme}>
                  <MDEditor
                    value={field.value}
                    onChange={field.onChange}
                    height={300}
                    previewOptions={{
                      rehypePlugins: [[rehypeSanitize]],
                    }}
                    textareaProps={{
                      placeholder:
                        "Describe qué aprenderán en esta mentoría, requisitos previos, metodología...",
                    }}
                  />
                </div>
              )}
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </section>

        {/* Detalles de la Sesión */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-gray-300 dark:border-gray-600 pb-2 mb-4 text-gray-700 dark:text-text-light">
            Detalles de la Sesión
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Duración */}
            <div>
              <label
                htmlFor="durationMinutes"
                className="block text-sm font-medium text-gray-700 dark:text-text-light"
              >
                Duración (minutos) <span className="text-red-500">*</span>
              </label>
              <input
                id="durationMinutes"
                type="number"
                {...register("durationMinutes", {
                  required: "La duración es obligatoria",
                  min: {
                    value: 15,
                    message: "La duración mínima es 15 minutos",
                  },
                  max: {
                    value: 480,
                    message: "La duración máxima es 480 minutos (8 horas)",
                  },
                })}
                className="mt-1 block w-full bg-transparent text-slate-700 dark:text-text-light text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              />
              {errors.durationMinutes && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.durationMinutes.message}
                </p>
              )}
            </div>

            {/* Plataforma */}
            <div>
              <label
                htmlFor="platform"
                className="block text-sm font-medium text-gray-700 dark:text-text-light"
              >
                Plataforma <span className="text-red-500">*</span>
              </label>
              <select
                id="platform"
                {...register("platform", {
                  required: "La plataforma es obligatoria",
                })}
                className="mt-1 block w-full bg-white dark:bg-bg-dark text-slate-700 dark:text-text-light text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              >
                {PLATFORM_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.platform && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.platform.message}
                </p>
              )}
            </div>
          </div>

          {/* Zona Horaria */}
          <div>
            <label
              htmlFor="timezone"
              className="block text-sm font-medium text-gray-700 dark:text-text-light"
            >
              Zona Horaria <span className="text-red-500">*</span>
            </label>
            <input
              id="timezone"
              type="text"
              {...register("timezone", {
                required: "La zona horaria es obligatoria",
              })}
              className="mt-1 block w-full bg-transparent text-slate-700 dark:text-text-light text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              placeholder="Ej: America/Santiago"
            />
            {errors.timezone && (
              <p className="text-xs text-red-600 mt-1">
                {errors.timezone.message}
              </p>
            )}
          </div>
        </section>

        {/* Precio */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold border-b border-gray-300 dark:border-gray-600 pb-2 mb-4 text-gray-700 dark:text-text-light">
            Precio
          </h3>

          <div className="flex items-center gap-2 mb-4">
            <input
              id="isFree"
              type="checkbox"
              {...register("isFree")}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <label
              htmlFor="isFree"
              className="text-sm font-medium text-gray-700 dark:text-text-light"
            >
              Esta mentoría es gratuita
            </label>
          </div>

          {!isFree && (
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 dark:text-text-light"
              >
                Precio (USD) <span className="text-red-500">*</span>
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                {...register("price", {
                  min: {
                    value: 0.01,
                    message: "El precio debe ser mayor a 0",
                  },
                })}
                className="mt-1 block w-full bg-transparent text-slate-700 dark:text-text-light text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
              />
              {errors.price && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
          )}
        </section>

        {/* Imagen de la mentoría — solo disponible en modo edición */}
        {mentorshipSlug && (
          <section className="space-y-4">
            <h3 className="text-xl font-semibold border-b border-gray-300 dark:border-gray-600 pb-2 mb-4 text-gray-700 dark:text-text-light">
              Imagen de la mentoría
            </h3>
            <ImageUpload
              label="Imagen representativa"
              aspectHint="4:3, 800×600"
              currentImageUrl={initialData?.imageUrl}
              endpoint={`/mentorings/${mentorshipSlug}/image`}
              deleteEndpoint={`/mentorings/${mentorshipSlug}/image`}
              onUploadSuccess={(_urls: ImageUploadResponse) => {
                toast.success("Imagen de mentoría actualizada.");
                queryClient.invalidateQueries({ queryKey: ["myMentorships"] });
                queryClient.invalidateQueries({
                  queryKey: ["mentorings", "detail", mentorshipSlug],
                });
              }}
              onDeleteSuccess={() => {
                toast.success("Imagen de mentoría eliminada.");
                queryClient.invalidateQueries({ queryKey: ["myMentorships"] });
                queryClient.invalidateQueries({
                  queryKey: ["mentorings", "detail", mentorshipSlug],
                });
              }}
            />
          </section>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting
              ? "Guardando..."
              : mentorshipSlug
              ? "Guardar Cambios"
              : "Crear Mentoría"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MentorshipForm;
