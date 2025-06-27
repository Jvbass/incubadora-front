import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createProject } from "../../../api/queries";
import {
  availableTechnologies,
  availableTools,
} from "../../../utils/data/createProjectData";
import type { ProjectFormInput } from "../../../types";

const ProjectForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormInput>({
    defaultValues: {
      status: "pending",
      isCollaborative: false,
      developmentProgress: 10,
      technologyIds: [],
      toolIds: [],
    },
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      toast.success(`Proyecto "${data.title}" creado exitosamente!`);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(`Error al crear el proyecto: ${error.message}`);
    },
  });

  const onSubmit: SubmitHandler<ProjectFormInput> = (data) => {
    // React Hook Form nos da los IDs como strings, los convertimos a números
    const formattedData = {
      ...data,
      technologyIds: data.technologyIds.map((id) => Number(id)),
      toolIds: data.toolIds.map((id) => Number(id)),
    };
    mutate(formattedData);
  };

  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

  return (
    <main className="md:col-span-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 bg-white rounded-lg shadow-md space-y-8"
      >
        {/* SECCIÓN 1 */}
        <section>
          <h3 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-4 text-gray-700">
            Información General
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Título del Proyecto
              </label>
              <input
                type="text"
                id="title"
                {...register("title", {
                  required: "El título es obligatorio",
                  maxLength: {
                    value: 255,
                    message: "El título no puede exceder los 255 caracteres",
                  },
                })}
                className="mt-1 block w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-blue-500 hover:border-blue-300 focus:shadow-sm"
              />
              {errors.title && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Descripción
              </label>
              <textarea
                id="description"
                {...register("description", {
                  required: "La descripción es obligatoria",
                  maxLength: {
                    value: 500,
                    message:
                      "La descripción no puede exceder los 500 caracteres",
                  },
                })}
                rows={4}
                className="mt-1 block w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-blue-500 hover:border-blue-300 focus:shadow-sm"
              ></textarea>
              {errors.description && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="repositoryUrl"
                  className="block text-sm font-medium text-gray-700"
                >
                  URL del Repositorio
                </label>
                <input
                  type="url"
                  id="repositoryUrl"
                  {...register("repositoryUrl", {
                    pattern: {
                      value: urlPattern,
                      message: "Por favor, ingresa una URL válida",
                    },
                  })}
                  className="mt-1 block w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-blue-500 hover:border-blue-300 focus:shadow-sm"
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
                  className="block text-sm font-medium text-gray-700"
                >
                  URL del Proyecto Desplegado
                </label>
                <input
                  type="url"
                  id="projectUrl"
                  {...register("projectUrl", {
                    pattern: {
                      value: urlPattern,
                      message: "Por favor, ingresa una URL válida",
                    },
                  })}
                  className="mt-1 block w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-blue-500 hover:border-blue-300 focus:shadow-sm"
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
          <h3 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-4 text-gray-700">
            Detalles Técnicos
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tecnologías Utilizadas
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {availableTechnologies.map((tech) => (
                  <label
                    key={tech.id}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      value={tech.id}
                      {...register("technologyIds", {
                        validate: (value) =>
                          value.length > 0 ||
                          "Debes seleccionar al menos una tecnología",
                      })}
                      className="rounded border-gray-300 text-blue-500 shadow-sm focus:ring-blue-500"
                    />
                    <span>{tech.name}</span>
                  </label>
                ))}
              </div>
              {errors.technologyIds && (
                <p className="text-xs text-red-600 mt-2">
                  {errors.technologyIds.message}
                </p>
              )}
            </div>
            <div className="space-y-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Herramientas
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {availableTools.map((tool) => (
                  <label
                    key={tool.id}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      value={tool.id}
                      {...register("toolIds", {
                        validate: (value) =>
                          value.length > 0 ||
                          "Debes seleccionar al menos una herramienta",
                      })}
                      className="rounded border-gray-300 text-blue-500 shadow-sm focus:ring-blue-500"
                    />
                    <span>{tool.name}</span>
                  </label>
                ))}
              </div>
              {errors.toolIds && (
                <p className="text-xs text-red-600 mt-2">
                  {errors.toolIds.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-7">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado del Proyecto
              </label>
              <select
                id="status"
                {...register("status")}
                className="mt-1 block w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-blue-500 hover:border-blue-300 focus:shadow-sm"
              >
                <option value="pending">Borrador</option>
                <option value="published">Publicado</option>
                <option value="archived">Archivado</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isCollaborative")}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span>Busco colaboradores</span>
              </label>
            </div>
          </div>
          <div className="mt-7">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Progreso de Desarrollo:
              <Controller
                name="developmentProgress"
                control={control}
                render={({ field: { value } }) => <span>{value}%</span>}
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
    </main>
  );
};

export default ProjectForm;
