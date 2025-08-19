import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useForm,
  useFieldArray,
  Controller,
  type SubmitHandler,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchUserProfile,
  updateUserProfile,
  fetchTechnologies,
} from "../../api/queries";
import type { ProfileUpdateRequest, Technology } from "../../types";
import Loading from "../../components/ux/Loading";
import MultiSelect from "../../components/ui/project-form/MultiSelect";
import { useEffect, useMemo } from "react";
import { Trash2 } from "lucide-react";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. Obtener los datos actuales del perfil para pre-rellenar el formulario
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    staleTime: Infinity, // No necesita re-fetch mientras el usuario edita
  });

  // 2. Obtener la lista de todas las tecnologías disponibles
  const { data: technologies, isLoading: isLoadingTechs } = useQuery({
    queryKey: ["technologies"],
    queryFn: fetchTechnologies,
    staleTime: 1000 * 60 * 60, // 1 hora
  });

  // Memoizar las opciones para el MultiSelect
  const technologyOptions = useMemo(() => {
    return (
      technologies?.map((tech: Technology) => ({
        value: tech.id,
        label: tech.name,
      })) || []
    );
  }, [technologies]);

  // 3. Configuración de React Hook Form
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateRequest>({
    defaultValues: {
      headline: "",
      bio: "",
      slug: "",
      publicProfile: true,
      socialLinks: [],
      techStackIds: [],
      workExperiences: [],
      languages: [],
      certificates: [],
    },
  });

  // Hooks para manejar los campos de array dinámicos
  const {
    fields: workFields,
    append: appendWork,
    remove: removeWork,
  } = useFieldArray({
    control,
    name: "workExperiences",
  });

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({
    control,
    name: "socialLinks",
  });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: "languages",
  });

  const {
    fields: certificateFields,
    append: appendCertificate,
    remove: removeCertificate,
  } = useFieldArray({
    control,
    name: "certificates",
  });

  // 4. Llenar el formulario con los datos del perfil una vez que carguen
  useEffect(() => {
    if (profileData) {
      reset({
        headline: profileData.headline,
        slug: profileData.slug,
        bio: profileData.bio,
        publicProfile: profileData.publicProfile,
        socialLinks: profileData.socialLinks.map(({ id, ...rest }) => rest), // Omitir 'id'
        techStackIds: profileData.techStack.map((tech) => tech.id),
        workExperiences: profileData.workExperiences.map(
          ({ id, ...rest }) => rest
        ),
        languages: profileData.languages.map(({ id, ...rest }) => rest),
        certificates: profileData.certificates.map(({ id, ...rest }) => rest),
      });
    }
  }, [profileData, reset]);

  // 5. Mutación para enviar los datos actualizados
  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.success("Perfil actualizado correctamente.");
      // Invalidar la query del perfil para que se refresque con los nuevos datos
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      navigate("/profile"); // Redirigir de vuelta a la página del perfil
    },
    onError: (error) => {
      toast.error(`Error al actualizar: ${error.message}`);
    },
  });

  const onSubmit: SubmitHandler<ProfileUpdateRequest> = (data) => {
    mutation.mutate(data);
  };

  if (isLoadingProfile || isLoadingTechs) {
    return <Loading message="Cargando formulario de edición..." />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 bg-white rounded-lg shadow-md space-y-8 border border-gray-200"
      >
        <h1 className="text-2xl font-bold text-gray-800">Editar Perfil</h1>

        {/* Información Básica */}
        <section className="space-y-4">
          <div>
            <label htmlFor="headline">Titular Profesional</label>
            <input
              id="headline"
              {...register("headline")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="slug">Slug</label>
            <input
              id="slug"
              {...register("slug")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="bio">Biografía</label>
            <textarea
              id="bio"
              rows={5}
              {...register("bio")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="publicProfile"
              type="checkbox"
              {...register("publicProfile")}
              className="rounded"
            />
            <label htmlFor="publicProfile">Hacer perfil público</label>
          </div>
        </section>

        {/* Tecnologías */}
        <section>
          <label>Stack Tecnológico</label>
          <Controller
            name="techStackIds"
            control={control}
            render={({ field }) => (
              <MultiSelect
                field={field}
                options={technologyOptions}
                isLoading={isLoadingTechs}
              />
            )}
          />
        </section>

        {/* Experiencia Laboral (usando useFieldArray) */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Experiencia Laboral</h2>
          {workFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border rounded-md space-y-2 relative"
            >
              <input
                {...register(`workExperiences.${index}.companyName`)}
                placeholder="Empresa"
                className="block w-full border-gray-300 rounded-md"
              />
              <input
                {...register(`workExperiences.${index}.position`)}
                placeholder="Cargo"
                className="block w-full border-gray-300 rounded-md"
              />
              <textarea
                {...register(`workExperiences.${index}.description`)}
                placeholder="Descripción de tus tareas"
                className="block w-full border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={() => removeWork(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              appendWork({
                companyName: "",
                position: "",
                description: "",
                startYear: new Date().getFullYear(),
              })
            }
            className="text-sm text-indigo-600 hover:underline"
          >
            + Añadir Experiencia
          </button>
        </section>

        {/* Redes Sociales */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Redes Sociales</h2>
          {socialFields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
              <input
                {...register(`socialLinks.${index}.platform`)}
                placeholder="Plataforma (ej: LinkedIn, Twitter)"
                className="block w-full border-gray-300 rounded-md"
              />
              <input
                {...register(`socialLinks.${index}.url`)}
                placeholder="URL del perfil"
                className="block w-full border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={() => removeSocial(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendSocial({ platform: "", url: "" })}
            className="text-sm text-indigo-600 hover:underline"
          >
            + Añadir Red Social
          </button>
        </section>

        {/* Idiomas */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Idiomas</h2>
          {languageFields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
              <input
                {...register(`languages.${index}.language`)}
                placeholder="Idioma"
                className="block w-full border-gray-300 rounded-md"
              />
              <select
                {...register(`languages.${index}.proficiency`)}
                className="block w-full border-gray-300 rounded-md"
              >
                <option value="">Selecciona el nivel</option>
                <option value="Básico">Básico</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
                <option value="Nativo">Nativo</option>
              </select>
              <button
                type="button"
                onClick={() => removeLanguage(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendLanguage({ language: "", proficiency: "" })}
            className="text-sm text-indigo-600 hover:underline"
          >
            + Añadir Idioma
          </button>
        </section>

        {/* Certificaciones */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Certificaciones</h2>
          {certificateFields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
              <input
                {...register(`certificates.${index}.name`)}
                placeholder="Nombre de la certificación"
                className="block w-full border-gray-300 rounded-md"
              />
              <input
                {...register(`certificates.${index}.imageUrl`)}
                placeholder="URL de la imagen"
                className="block w-full border-gray-300 rounded-md"
              />
              <input
                {...register(`certificates.${index}.certificateUrl`)}
                placeholder="URL de la certificación"
                className="block w-full border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={() => removeCertificate(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendCertificate({ name: "", imageUrl: "", certificateUrl: "" })}
            className="text-sm text-indigo-600 hover:underline"
          >
            + Añadir Certificación
          </button>
        </section>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-white bg-indigo-600 rounded-md disabled:opacity-50"
          >
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
