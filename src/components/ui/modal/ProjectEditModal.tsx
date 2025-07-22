import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProjectFormInput, ProjectModalProps } from "../../../types";
import {
  fetchProjectById,
  fetchTechnologies,
  updateProjectById,
} from "../../../api/queries";
import { useEffect, useMemo } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import MultiSelect from "../project-form/MultiSelect";
import Loading from "../../ux/Loading";

const ProjectEditModal = ({
  projectSlug,
  isOpen,
  onClose,
}: ProjectModalProps) => {
  const queryClient = useQueryClient();

  // Fetcheamos los datos del proyecto a editar para mostrarlos en los inputs
  const { data: projectData, isLoading: isLoadingProject } = useQuery({
    queryKey: ["projectDetail", projectSlug],
    queryFn: () => fetchProjectById(projectSlug!),
    enabled: !!projectSlug,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // fetch para obtener las tecnologias
  const { data: technologies, isLoading: isLoadingTechs } = useQuery({
    queryKey: ["technologies"],
    queryFn: fetchTechnologies,
    staleTime: 1000 * 60 * 5,
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
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormInput>();

  // Funcion para convertir el status a string
  const safeStatus = (status: string): "pending" | "published" | "archived" => {
    return status === "pending" ||
      status === "published" ||
      status === "archived"
      ? status
      : "pending"; //por defecto
  };
  // useEffect para rellenar los inputs con los datos del proyecto
  useEffect(() => {
    if (projectData) {
      // Mapeamos los IDs de las tecnologías para el MultiSelect
      const technologyIds = projectData.technologies.map((t) => t.id);
      reset({
        //reset para rellenar los inputs con los datos del proyecto
        ...projectData,
        technologyIds,
        status: safeStatus(projectData.status), // Convertimos el status a string
      });
    }
  }, [projectData, reset]);

  // mutation actualizar el proyecto
  const updateMutation = useMutation({
    mutationFn: (data: ProjectFormInput) =>
      updateProjectById(projectSlug!, data),
    onSuccess: (updatedProject) => {
      toast.success(`Proyecto "${updatedProject.title}" actualizado.`);
      // Invalidamos las queries para refrescar los datos en toda la app
      queryClient.invalidateQueries({ queryKey: ["myProjects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["projectDetail", projectSlug],
      });
      onClose(); // Cerramos el modal
    },
    onError: (error) => {
      toast.error(`Error al actualizar: ${error.message}`);
    },
  });

  const onSubmit: SubmitHandler<ProjectFormInput> = (data) => {
    updateMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-11/12 rounded-lg bg-gray-800 text-white shadow-2xl max-h-[95vh] max-w-2xl"
      >
        <div className="flex-shrink-0 p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-cyan-400">Editar Proyecto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white cursor-pointer text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="flex-grow p-6 overflow-y-auto">
          {isLoadingProject || isLoadingTechs ? (
            <div className="flex justify-center p-10">
              <Loading message="datos del formulario" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Título */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-300"
                >
                  Título
                </label>
                <input
                  {...register("title", {
                    required: "El título es obligatorio",
                  })}
                  className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2"
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300"
                >
                  Descripción
                </label>
                <textarea
                  {...register("description", {
                    required: "La descripción es obligatoria",
                  })}
                  rows={5}
                  className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2"
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Tecnologías */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tecnologías
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
                      placeholder="Escribe para buscar las tecnologías..."
                    />
                  )}
                />
                {errors.technologyIds && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.technologyIds.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Estado
                </label>
                <select
                  {...register("status")}
                  className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2"
                >
                  <option value="pending">Borrador</option>
                  <option value="published">Publicar</option>
                  <option value="archived">Archivar</option>
                </select>
              </div>

              {/* Checkboxes y Progreso */}
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...register("isCollaborative")} />
                  <span>Busco colaboradores</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...register("needMentoring")} />
                  <span>Busco mentor</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Progreso: {control._formValues.developmentProgress || 0}%
                </label>
                <input
                  type="range"
                  {...register("developmentProgress")}
                  className="w-full"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || updateMutation.isPending}
                  className="px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50"
                >
                  {updateMutation.isPending
                    ? "Guardando..."
                    : "Guardar Cambios"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectEditModal;
