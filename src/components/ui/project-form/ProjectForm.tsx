import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createProject, fetchTechnologies } from "../../../api/queries";
import type { ProjectFormInput } from "../../../types";
import { useMemo } from "react";
import MultiSelect from "./MultiSelect";

import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { useEffectiveTheme } from "../../../hooks/useEffectiveTheme";

const ProjectForm = () => {
  const effectiveTheme = useEffectiveTheme(); //hook para obtener el theme y aplicarlo al componente MDEditor
  // OBTENER DATOS DE TECNOLOGÍAS CON REACT QUERY ---
  const { data: technologies, isLoading: isLoadingTechs } = useQuery({
    queryKey: ["technologies"],
    queryFn: fetchTechnologies,
    staleTime: 1000 * 60 * 60, // Cachear por 1 hora
    refetchOnWindowFocus: false, // Opcional: Evita re-fetch al cambiar de pestaña
  });

  // FORMATEAR DATOS PARA REACT-SELECT ---
  // Usamos useMemo para evitar que este cálculo se repita en cada render.
  const technologyOptions = useMemo(() => {
    return (
      technologies?.map((tech) => ({
        value: tech.id,
        label: tech.name,
      })) || []
    );
  }, [technologies]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormInput>({
    defaultValues: {
      status: "pending",
      isCollaborative: false,
      needMentoring: false,
      developmentProgress: 10,
      technologyIds: [],
    },
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      toast.success(`Proyecto "${data.title}" creado exitosamente!`);
      queryClient.invalidateQueries({ queryKey: ["myProjects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(`Error al crear el proyecto: ${error.message}`);
    },
  });

  const onSubmit: SubmitHandler<ProjectFormInput> = (data) => {
    mutate(data);
  };

  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

  return (
    <div className="md:col-span-3 ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 bg-bg-light dark:bg-slate-800 rounded-lg shadow-md space-y-8 border border-zinc-300 dark:border-slate-600"
      >
        <section>
          <h3 className="text-xl font-semibold border-b border-border pb-2 mb-4  dark:text-brand-100 text-text-main">
            Información General
          </h3>
          <div className="space-y-4">
            {/* titulo */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium  dark:text-brand-100 text-text-main"
              >
                Título del Proyecto <span className=" text-xs ">*</span>
              </label>
              <input
                type="text"
                id="title"
                {...register("title", {
                  required: "El título es obligatorio",
                  maxLength: {
                    value: 50,
                    message: "El título no puede exceder los 50 caracteres",
                  },
                })}
                className="mt-1 block w-full bg-transparent placeholder:text-slate-400 text-slate-700 dark:placeholder:text-gray-400 dark:text-accent-100 text-sm border border-border rounded-md px-3 py-2 transition duration-200 ease focus:outline-none focus:border-blue-500 hover:border-blue-300 focus:shadow-sm"
              />
              {errors.title && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            {/* subttitulo */}
            <div>
              <label
                htmlFor="subtitle"
                className="block text-sm font-medium  dark:text-brand-100 text-text-main"
              >
                Título del Proyecto <span className=" text-xs ">*</span>
              </label>
              <input
                type="text"
                id="subtitle"
                {...register("subtitle", {
                  required: "El título es obligatorio",
                  maxLength: {
                    value: 100,
                    message: "El subtítulo no puede exceder los 100 caracteres",
                  },
                })}
                className="mt-1 block w-full bg-transparent placeholder:text-slate-400 text-slate-700 dark:placeholder:text-gray-400 dark:text-accent-100 text-sm border border-border rounded-md px-3 py-2 transition duration-200 ease focus:outline-none focus:border-blue-500 hover:border-blue-300 focus:shadow-sm"
              />
              {errors.subtitle && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.subtitle.message}
                </p>
              )}
            </div>

            {/* textarea de descripcion */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium dark:text-brand-100 text-text-main"
              >
                Descripción <span className="text-xs">*</span>
              </label>

              <Controller
                name="description"
                control={control}
                rules={{
                  required: "La descripción es obligatoria",
                  maxLength: {
                    value: 2000,
                    message: `La descripción no puede exceder los 2000 caracteres`,
                  },
                }}
                render={({ field }) => (
                  <div className="mt-1" data-color-mode={effectiveTheme}>
                    <MDEditor
                      style={{
                        whiteSpace: "pre-wrap",
                        backgroundColor:
                          effectiveTheme === "dark" ? "#1e293a" : "#f3f4f6",
                      }}
                      value={field.value}
                      onChange={field.onChange}
                      height={400}
                      previewOptions={{
                        style: {
                          backgroundColor:
                            effectiveTheme === "dark" ? "#0f172a" : "#f3f4f6",
                        },
                        // plugin rehypeSanitize.
                        // Esto procesará el HTML generado por el editor y eliminará cualquier
                        // etiqueta o atributo inseguro antes de mostrarlo en la vista previa.
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
                <p className="text-xs text-red-600 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* inputs para urls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="repositoryUrl"
                  className="block text-sm font-medium  dark:text-brand-100 text-text-main"
                >
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
                  className="mt-1 block w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-border rounded-md px-3 py-2 transition duration-200 ease focus:outline-none focus:border-blue-500 hover:border-blue-300 focus:shadow-sm  dark:placeholder:text-gray-400 dark:text-accent-100 "
                />
                {errors.repositoryUrl && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.repositoryUrl.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="projectUrl"
                  className="block text-sm font-medium  dark:text-brand-100 text-text-main"
                >
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
                  className="mt-1 block w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-border rounded-md px-3 py-2 transition duration-200 ease focus:outline-none focus:border-blue-500 hover:border-blue-300 focus:shadow-sm  dark:placeholder:text-gray-400 dark:text-accent-100 "
                />
                {errors.projectUrl && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.projectUrl.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 2 */}
        <section>
          <h3 className="text-xl font-semibold border-b border-border pb-2 mb-4  dark:text-brand-100 text-text-main">
            Detalles Técnicos
          </h3>

          {/* tecnologías */}
          <div className="space-y-6">
            <div>
              <div>
                <label className="block text-sm font-medium  dark:text-brand-100 text-text-main mb-1">
                  Tecnologías
                  <span className=" text-xs ">
                    * (Lenguajes, Frameworks, Herramientas)
                  </span>
                </label>
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
                <p className="text-xs text-red-600 mt-2">
                  {errors.technologyIds.message}
                </p>
              )}
            </div>
          </div>

          {/* checkbox para estado/mentoria/colaboradores */}
          <div className="grid grid-cols-1  gap-6 mt-7">
            <div>
              <label className="block text-sm font-medium  dark:text-brand-100 text-text-main mb-2">
                Estado del Proyecto <span className=" text-xs ">*</span>
              </label>
              <select
                id="status"
                {...register("status")}
                className="mt-1 block w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-border rounded-md px-3 py-2 transition duration-200 ease focus:outline-none focus:border-blue-500 hover:border-blue-300 focus:shadow-sm  dark:placeholder:text-gray-400 dark:text-accent-100 dark:bg-bg-dark"
              >
                <option value="pending">Borrador</option>
                <option value="published">Publicar</option>
                <option value="archived">Archivar</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <label className="flex items-center space-x-2 text-sm font-medium  dark:text-brand-100 text-text-main cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isCollaborative")}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span>Busco colaboradores</span>
              </label>
              <label className="flex items-center space-x-2 text-sm font-medium  dark:text-brand-100  text-text-main cursor-pointer">
                <input
                  type="checkbox"
                  {...register("needMentoring")}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span>Busco mentor</span>
              </label>
            </div>
          </div>

          {/* Progreso del desarrollo */}
          <div className="mt-7">
            <label className="block text-sm font-medium  dark:text-brand-100  text-text-main mb-2">
              Progreso del desarrollo:
              <Controller
                name="developmentProgress"
                control={control}
                render={({ field: { value } }) => <span> {value}%</span>}
              />
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
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              )}
            />
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? "Publicando..." : "Publicar Proyecto"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
