import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createProject, fetchTechnologies } from "../../../api/projectApi";
import type { CreateProjectRequest, ImageUploadResponse } from "../../../types";
import { useMemo, useState } from "react";
import MultiSelect from "./MultiSelect";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import apiService from "../../../api/apiService";
import ImageUpload from "../../../components/ui/ImageUpload";

import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { useEffectiveTheme } from "../../../hooks/useEffectiveTheme";
import { useActiveFieldStore } from "../../../hooks/useActiveField";

// Wizard de creación de proyecto en 4 pasos (rediseño v2, SDD §12.3 R5).
// Mismo payload y mutación que ProjectForm (que se conserva para edición).
// OJO E2E: se mantienen los ids #title/#subtitle/#status y el botón final
// "Publicar Proyecto".

const TITLE_MAX = 50;
const SUBTITLE_MAX = 100;

const STEPS = [
  { label: "Básicos" },
  { label: "Contenido" },
  { label: "Detalles" },
  { label: "Revisión" },
] as const;

// Campos que valida cada paso antes de avanzar
const STEP_FIELDS: (keyof CreateProjectRequest)[][] = [
  ["title", "subtitle", "repositoryUrl", "projectUrl"],
  ["description"],
  ["technologyIds"],
  [],
];

const inputClass =
  "mt-1 block w-full bg-transparent placeholder:text-slate-400 text-slate-700 dark:placeholder:text-gray-400 dark:text-text-light text-sm border border-gray-300 dark:border-border rounded-md px-3 py-2 transition duration-200 ease focus:outline-none focus:border-cta-600 dark:focus:border-cta-300 hover:border-cta-300 focus:shadow-sm";

const labelClass =
  "block text-sm font-medium text-text-main dark:text-text-light";

const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

const ProjectWizard = () => {
  const [step, setStep] = useState(0);
  const effectiveTheme = useEffectiveTheme();
  const { setActiveField } = useActiveFieldStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Imagen diferida: se selecciona en el wizard y se sube DESPUÉS de crear el proyecto
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null);

  const { data: technologies, isLoading: isLoadingTechs } = useQuery({
    queryKey: ["technologies"],
    queryFn: fetchTechnologies,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const technologyOptions = useMemo(
    () =>
      technologies?.map((tech) => ({ value: tech.id, label: tech.name })) || [],
    [technologies]
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectRequest>({
    defaultValues: {
      status: "pending",
      isCollaborative: false,
      needMentoring: false,
      developmentProgress: 10,
      technologyIds: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["myProjects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      // Si hay una imagen pendiente, subirla ahora que tenemos el slug
      if (pendingImageFile && data.slug) {
        try {
          const formData = new FormData();
          formData.append("file", pendingImageFile);
          await apiService.post<ImageUploadResponse>(
            `/projects/${data.slug}/image`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          toast.success(`Proyecto "${data.title}" creado con imagen exitosamente!`);
        } catch {
          // El proyecto ya fue creado; solo avisar al usuario que la imagen falló
          toast.error(
            `Proyecto creado, pero no se pudo subir la imagen. Podés agregarla desde "Editar proyecto".`,
            { duration: 6000 }
          );
        }
      } else {
        toast.success(`Proyecto "${data.title}" creado exitosamente!`);
      }

      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(`Error al crear el proyecto: ${error.message}`);
    },
  });

  const onSubmit: SubmitHandler<CreateProjectRequest> = (data) => {
    createMutation.mutate(data);
  };

  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  // Valores para la revisión final
  const values = watch();
  const titleLength = values.title?.length ?? 0;
  const subtitleLength = values.subtitle?.length ?? 0;
  const selectedTechNames = technologyOptions
    .filter((o) => values.technologyIds?.includes(o.value))
    .map((o) => o.label);

  const statusLabel =
    values.status === "published"
      ? "Publicar"
      : values.status === "archived"
        ? "Archivar"
        : "Borrador";

  return (
    <div className="md:col-span-3">
      {/* Stepper */}
      <ol className="flex items-center gap-2 sm:gap-4 mb-6 select-none">
        {STEPS.map((s, i) => {
          const isDone = i < step;
          const isCurrent = i === step;
          return (
            <li key={s.label} className="flex items-center gap-2 sm:gap-4">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={`flex items-center gap-2 ${
                  i < step ? "cursor-pointer" : "cursor-default"
                }`}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span
                  className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border transition-colors ${
                    isCurrent
                      ? "bg-cta-600 border-cta-600 text-white"
                      : isDone
                        ? "bg-cta-100 dark:bg-cta-900/40 border-cta-600 text-cta-600 dark:text-cta-300"
                        : "border-gray-300 dark:border-border text-text-soft"
                  }`}
                >
                  {isDone ? <Check size={14} /> : i + 1}
                </span>
                <span
                  className={`hidden sm:block text-sm font-medium ${
                    isCurrent
                      ? "text-text-main dark:text-text-light"
                      : "text-text-soft"
                  }`}
                >
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <span className="w-6 sm:w-10 h-px bg-gray-300 dark:bg-border" />
              )}
            </li>
          );
        })}
      </ol>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 bg-bg-light dark:bg-bg-dark rounded-lg shadow-md space-y-6 border border-zinc-300 dark:border-border"
      >
        {/* ============ PASO 1: Básicos ============ */}
        {step === 0 && (
          <section className="space-y-4">
            <h3 className="text-xl font-semibold border-b border-gray-200 dark:border-border pb-2 text-text-main dark:text-text-light">
              Información General
            </h3>
            <div>
              <label htmlFor="title" className={labelClass}>
                Título del Proyecto <span className="text-xs">*</span>
              </label>
              <input
                id="title"
                type="text"
                maxLength={TITLE_MAX}
                {...register("title", {
                  required: "El título es obligatorio",
                  maxLength: {
                    value: TITLE_MAX,
                    message: `El título no puede exceder los ${TITLE_MAX} caracteres`,
                  },
                })}
                onFocus={() => setActiveField("title")}
                onBlur={() => setActiveField(null)}
                className={inputClass}
              />
              <div className="flex justify-between items-start mt-1">
                {errors.title ? (
                  <p className="text-xs text-cta-600 dark:text-cta-300">
                    {errors.title.message}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-text-soft">
                  {titleLength}/{TITLE_MAX}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="subtitle" className={labelClass}>
                Subtitulo del proyecto <span className="text-xs">*</span>
              </label>
              <input
                type="text"
                id="subtitle"
                maxLength={SUBTITLE_MAX}
                {...register("subtitle", {
                  maxLength: {
                    value: SUBTITLE_MAX,
                    message: `El subtítulo no puede exceder los ${SUBTITLE_MAX} caracteres`,
                  },
                })}
                onFocus={() => setActiveField("subtitle")}
                onBlur={() => setActiveField(null)}
                className={inputClass}
              />
              <div className="flex justify-between items-start mt-1">
                {errors.subtitle ? (
                  <p className="text-xs text-cta-600 dark:text-cta-300">
                    {errors.subtitle.message}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-text-soft">
                  {subtitleLength}/{SUBTITLE_MAX}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="repositoryUrl" className={labelClass}>
                  URL del Repositorio
                </label>
                <input
                  placeholder="https://github.com/username/project"
                  type="url"
                  id="repositoryUrl"
                  {...register("repositoryUrl", {
                    pattern: {
                      value: urlPattern,
                      message:
                        "La url debe contener el protocolo https://, http:// o ftp://",
                    },
                  })}
                  onFocus={() => setActiveField("repositoryUrl")}
                  onBlur={() => setActiveField(null)}
                  className={inputClass}
                />
                {errors.repositoryUrl && (
                  <p className="text-xs text-cta-600 dark:text-cta-300 mt-1">
                    {errors.repositoryUrl.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="projectUrl" className={labelClass}>
                  URL del Proyecto Desplegado
                </label>
                <input
                  placeholder="https://username.github.io/project"
                  type="url"
                  id="projectUrl"
                  {...register("projectUrl", {
                    pattern: {
                      value: urlPattern,
                      message: "Por favor, ingresa una URL válida",
                    },
                  })}
                  onFocus={() => setActiveField("projectUrl")}
                  onBlur={() => setActiveField(null)}
                  className={inputClass}
                />
                {errors.projectUrl && (
                  <p className="text-xs text-cta-600 dark:text-cta-300 mt-1">
                    {errors.projectUrl.message}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ============ PASO 2: Contenido ============ */}
        {step === 1 && (
          <section className="space-y-4">
            <h3 className="text-xl font-semibold border-b border-gray-200 dark:border-border pb-2 text-text-main dark:text-text-light">
              Cuenta tu proyecto
            </h3>
            <div>
              <label htmlFor="description" className={labelClass}>
                Descripción <span className="text-xs">*</span>
              </label>
              <Controller
                name="description"
                control={control}
                rules={{
                  required: "La descripción es obligatoria",
                  maxLength: {
                    value: 15000,
                    message: `La descripción no puede exceder los 15000 caracteres`,
                  },
                }}
                render={({ field }) => (
                  <div className="mt-1" data-color-mode={effectiveTheme}>
                    <MDEditor
                      onFocus={() => setActiveField("description")}
                      style={{
                        whiteSpace: "pre-wrap",
                        backgroundColor:
                          effectiveTheme === "dark" ? "#1d2025" : "#f3f4f6",
                      }}
                      value={field.value}
                      onChange={field.onChange}
                      height={420}
                      previewOptions={{
                        style: {
                          backgroundColor:
                            effectiveTheme === "dark" ? "#131519" : "#ecececff",
                        },
                        rehypePlugins: [[rehypeSanitize]],
                      }}
                      textareaProps={{
                        placeholder:
                          "Describe los objetivos, funcionalidades y el estado actual de tu proyecto...",
                      }}
                    />
                  </div>
                )}
              />
              {errors.description && (
                <p className="text-xs text-cta-600 dark:text-cta-300 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </section>
        )}

        {/* ============ PASO 3: Tecnologías y opciones ============ */}
        {step === 2 && (
          <section className="space-y-6">
            <h3 className="text-xl font-semibold border-b border-gray-200 dark:border-border pb-2 text-text-main dark:text-text-light">
              Detalles Técnicos
            </h3>
            <div>
              <label className={`${labelClass} mb-1`}>
                Tecnologías
                <span className="text-xs">
                  {" "}
                  * (Lenguajes, Frameworks, Herramientas)
                </span>
              </label>
              <div
                onFocus={() => setActiveField("technologyIds")}
                onBlur={() => setActiveField(null)}
              >
                <Controller
                  name="technologyIds"
                  control={control}
                  rules={{
                    validate: (value) =>
                      value.length > 0 ||
                      "Debes seleccionar al menos una tecnología",
                  }}
                  render={({ field }) => (
                    <MultiSelect
                      field={field}
                      options={technologyOptions}
                      isLoading={isLoadingTechs}
                      placeholder="Escribe para buscar tecnologías..."
                    />
                  )}
                />
              </div>
              {errors.technologyIds && (
                <p className="text-xs text-cta-600 dark:text-cta-300 mt-2">
                  {errors.technologyIds.message}
                </p>
              )}
            </div>

            <div>
              <label className={`${labelClass} mb-2`}>
                Estado del Proyecto <span className="text-xs">*</span>
              </label>
              <select
                id="status"
                {...register("status")}
                onFocus={() => setActiveField("status")}
                onBlur={() => setActiveField(null)}
                className={`${inputClass} dark:bg-bg-dark`}
              >
                <option value="pending">Borrador</option>
                <option value="published">Publicar</option>
                <option value="archived">Archivar</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="flex items-center space-x-2 text-sm font-medium text-text-main dark:text-text-light cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isCollaborative")}
                  onFocus={() => setActiveField("isCollaborative")}
                  onBlur={() => setActiveField(null)}
                  className="rounded border-gray-300 text-cta-600 focus:ring-cta-600"
                />
                <span>Busco colaboradores</span>
              </label>
              <label className="flex items-center space-x-2 text-sm font-medium text-text-main dark:text-text-light cursor-pointer">
                <input
                  type="checkbox"
                  {...register("needMentoring")}
                  onFocus={() => setActiveField("needMentoring")}
                  onBlur={() => setActiveField(null)}
                  className="rounded border-gray-300 text-cta-600 focus:ring-cta-600"
                />
                <span>Busco mentor</span>
              </label>
            </div>

            <div>
              <label className={`${labelClass} mb-2`}>
                Progreso del desarrollo:
                <span> {values.developmentProgress}%</span>
              </label>
              <Controller
                name="developmentProgress"
                control={control}
                render={({ field }) => (
                  <input
                    type="range"
                    min="0"
                    max="100"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                    onFocus={() => setActiveField("developmentProgress")}
                    onBlur={() => setActiveField(null)}
                    className="w-full h-2 bg-gray-200 dark:bg-bg-hoverdark rounded-lg appearance-none cursor-pointer accent-cta-600"
                  />
                )}
              />
            </div>

            {/* Imagen del proyecto (modo diferido: se sube tras crear) */}
            <div>
              <p className={`${labelClass} mb-1`}>Imagen del proyecto (opcional)</p>
              <p className="text-xs text-text-soft mb-2">
                Se sube automáticamente al publicar el proyecto.
              </p>
              <ImageUpload
                deferred
                label=""
                aspectHint="4:3, 800×600"
                currentImageUrl={pendingImagePreview}
                maxSizeMB={1}
                onFileSelected={(file) => {
                  setPendingImageFile(file);
                  setPendingImagePreview(URL.createObjectURL(file));
                }}
              />
            </div>
          </section>
        )}

        {/* ============ PASO 4: Revisión ============ */}
        {step === 3 && (
          <section className="space-y-4">
            <h3 className="text-xl font-semibold border-b border-gray-200 dark:border-border pb-2 text-text-main dark:text-text-light">
              Revisa antes de publicar
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-text-main dark:text-text-light">
                  Título
                </dt>
                <dd className="text-text-soft dark:text-text-light/80">
                  {values.title || "—"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-text-main dark:text-text-light">
                  Subtítulo
                </dt>
                <dd className="text-text-soft dark:text-text-light/80">
                  {values.subtitle || "—"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-text-main dark:text-text-light">
                  Descripción
                </dt>
                <dd className="text-text-soft dark:text-text-light/80 whitespace-pre-wrap line-clamp-6">
                  {values.description || "—"}
                </dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <dt className="font-semibold text-text-main dark:text-text-light">
                    Repositorio
                  </dt>
                  <dd className="text-text-soft break-all">
                    {values.repositoryUrl || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-text-main dark:text-text-light">
                    Desplegado
                  </dt>
                  <dd className="text-text-soft break-all">
                    {values.projectUrl || "—"}
                  </dd>
                </div>
              </div>
              <div>
                <dt className="font-semibold text-text-main dark:text-text-light">
                  Tecnologías
                </dt>
                <dd className="flex flex-wrap gap-2 mt-1">
                  {selectedTechNames.length > 0 ? (
                    selectedTechNames.map((name) => (
                      <span
                        key={name}
                        className="px-2 py-0.5 text-xs rounded-md border border-cta-300 text-cta-600 dark:text-cta-300"
                      >
                        {name}
                      </span>
                    ))
                  ) : (
                    <span className="text-text-soft">—</span>
                  )}
                </dd>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <dt className="font-semibold text-text-main dark:text-text-light">
                    Estado
                  </dt>
                  <dd className="text-text-soft">{statusLabel}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-text-main dark:text-text-light">
                    Progreso
                  </dt>
                  <dd className="text-text-soft">
                    {values.developmentProgress}%
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-text-main dark:text-text-light">
                    Colaboradores
                  </dt>
                  <dd className="text-text-soft">
                    {values.isCollaborative ? "Sí" : "No"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-text-main dark:text-text-light">
                    Mentoría
                  </dt>
                  <dd className="text-text-soft">
                    {values.needMentoring ? "Sí" : "No"}
                  </dd>
                </div>
              </div>
              {/* Preview de la imagen seleccionada */}
              <div>
                <dt className="font-semibold text-text-main dark:text-text-light">
                  Imagen
                </dt>
                {pendingImagePreview ? (
                  <img
                    src={pendingImagePreview}
                    alt="Preview de la imagen del proyecto"
                    className="mt-2 max-h-32 rounded-md border border-border object-cover"
                  />
                ) : (
                  <dd className="text-text-soft">Sin imagen (opcional)</dd>
                )}
              </div>
            </dl>
          </section>
        )}

        {/* ============ Navegación del wizard ============ */}
        <div className="flex justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="flex items-center gap-1 px-5 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-border text-text-main dark:text-text-light hover:bg-gray-100 dark:hover:bg-bg-hoverdark transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft size={16} />
            Atrás
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-1 px-6 py-2 text-sm font-semibold text-white bg-cta-600 rounded-md hover:bg-cta-900 transition-colors cursor-pointer"
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || createMutation.isPending}
              className="px-6 py-2 text-sm font-semibold text-white bg-cta-600 rounded-md hover:bg-cta-900 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {createMutation.isPending ? "Guardando..." : "Publicar Proyecto"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProjectWizard;
