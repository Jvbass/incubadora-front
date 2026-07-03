import { useForm } from "react-hook-form";
import { useEffect } from "react";
import type { CreateJobOfferRequest, JobOffer } from "../../../types";

interface JobOfferFormProps {
  initialData?: JobOffer | null;
  onSubmit: (data: CreateJobOfferRequest) => void;
  onCancel?: () => void;
  isSubmitting: boolean;
}

const JobOfferForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: JobOfferFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateJobOfferRequest>({
    defaultValues: {
      title: "",
      description: "",
      company: "",
      location: "",
      salaryRange: "",
      requirements: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        company: initialData.company,
        location: initialData.location,
        salaryRange: initialData.salaryRange ?? "",
        requirements: initialData.requirements ?? "",
      });
    }
  }, [initialData, reset]);

  const inputClass =
    "mt-1 block w-full bg-transparent text-slate-700 dark:text-text-light text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-light">
          Título <span className="text-red-500">*</span>
        </label>
        <input
          {...register("title", { required: "El título es obligatorio", maxLength: 255 })}
          className={inputClass}
          placeholder="Ej: Desarrollador Full Stack"
        />
        {errors.title && (
          <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-text-light">
            Empresa <span className="text-red-500">*</span>
          </label>
          <input
            {...register("company", { required: "La empresa es obligatoria", maxLength: 255 })}
            className={inputClass}
            placeholder="Ej: Acme Corp"
          />
          {errors.company && (
            <p className="text-xs text-red-600 mt-1">{errors.company.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-text-light">
            Ubicación <span className="text-red-500">*</span>
          </label>
          <input
            {...register("location", { required: "La ubicación es obligatoria", maxLength: 255 })}
            className={inputClass}
            placeholder="Ej: Remoto / Santiago, Chile"
          />
          {errors.location && (
            <p className="text-xs text-red-600 mt-1">{errors.location.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-light">
          Rango salarial
        </label>
        <input
          {...register("salaryRange", { maxLength: 100 })}
          className={inputClass}
          placeholder="Ej: 3000-5000 USD mensual"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-light">
          Descripción <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("description", { required: "La descripción es obligatoria" })}
          rows={4}
          className={inputClass + " resize-none"}
          placeholder="Describe el rol, responsabilidades y el equipo..."
        />
        {errors.description && (
          <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-light">
          Requisitos
        </label>
        <textarea
          {...register("requirements")}
          rows={3}
          className={inputClass + " resize-none"}
          placeholder="Ej: 3 años de experiencia en React, inglés intermedio..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : initialData ? "Guardar cambios" : "Crear oferta"}
        </button>
      </div>
    </form>
  );
};

export default JobOfferForm;
