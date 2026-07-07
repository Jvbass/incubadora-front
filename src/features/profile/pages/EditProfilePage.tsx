import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useForm,
  useFieldArray,
  Controller,
  type SubmitHandler,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchUserProfile, updateUserProfile } from "../../../api/profileApi";
import { fetchTechnologies } from "../../../api/projectApi";
import {
  PROFILE_VISIBILITY_OPTIONS,
  type ImageUploadResponse,
  type ProfileUpdateRequest,
  type Technology,
} from "../../../types";
import Loading from "../../../components/ux/Loading";
import MultiSelect from "../../projects/components/MultiSelect";
import ImageUpload from "../../../components/ui/ImageUpload";
import { useEffect, useMemo } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

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
    watch,
    formState: { isSubmitting },
  } = useForm<ProfileUpdateRequest>({
    defaultValues: {
      headline: "",
      bio: "",
      slug: "",
      profileVisibility: "INCUBADORA",
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
        profileVisibility: profileData.profileVisibility,
        socialLinks: profileData.socialLinks.map(({ ...rest }) => rest), // Omitir 'id'
        techStackIds: profileData.techStack.map((tech) => tech.id),
        workExperiences: profileData.workExperiences.map(({ ...rest }) => rest),
        languages: profileData.languages.map(({ ...rest }) => rest),
        certificates: profileData.certificates.map(({ ...rest }) => rest),
      });
    }
  }, [profileData, reset]);

  // Modo de visibilidad seleccionado actualmente (para mostrar advertencias)
  const visibility = watch("profileVisibility");

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

  // D2/D8 (profile-wizard SDD): invalida ambas claves de caché del perfil —
  // "userProfile" (esta página, /profile, Navbar) y "userData" (dashboard) —
  // para que el dashboard no quede mostrando un avatar/banner desactualizado.
  const invalidateProfile = () => {
    queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    queryClient.invalidateQueries({ queryKey: ["userData"] });
  };

  const handleAvatarUpload = (_urls: ImageUploadResponse) => {
    toast.success("Avatar actualizado correctamente.");
    invalidateProfile();
  };

  const handleAvatarDelete = () => {
    toast.success("Avatar eliminado.");
    invalidateProfile();
  };

  const handleBioImageUpload = (_urls: ImageUploadResponse) => {
    toast.success("Imagen de banner actualizada correctamente.");
    invalidateProfile();
  };

  const handleBioImageDelete = () => {
    toast.success("Imagen de banner eliminada.");
    invalidateProfile();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Imágenes del perfil (se guardan inmediatamente, fuera del form principal) */}
      <div className="p-6 bg-bg-light dark:bg-bg-dark text-text-main dark:text-text-light rounded-lg shadow-md border border-divider dark:border-border space-y-6">
        <h2 className="text-xl font-bold text-text-main dark:text-text-light">Imágenes del perfil</h2>
        <ImageUpload
          label="Avatar"
          aspectHint="1:1, 400×400"
          currentImageUrl={profileData?.avatarUrl}
          endpoint="/profile/avatar"
          deleteEndpoint="/profile/avatar"
          onUploadSuccess={handleAvatarUpload}
          onDeleteSuccess={handleAvatarDelete}
        />
        <ImageUpload
          label="Imagen de banner"
          aspectHint="3:1, 1200×400"
          currentImageUrl={profileData?.bioImageUrl}
          endpoint="/profile/bio-image"
          deleteEndpoint="/profile/bio-image"
          onUploadSuccess={handleBioImageUpload}
          onDeleteSuccess={handleBioImageDelete}
        />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 bg-bg-light dark:bg-bg-dark text-text-main dark:text-text-light rounded-lg shadow-md space-y-8 border border-divider dark:border-border"
      >
        <h1 className="text-2xl font-bold text-text-main dark:text-text-light">Editar Perfil</h1>

        {/* Información Básica */}
        <section className="space-y-4">
          <div>
            <label htmlFor="headline">Titular Profesional</label>
            <input
              id="headline"
              {...register("headline")}
              className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-bg-light dark:bg-bg-dark text-text-main dark:text-text-light rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="slug">Slug</label>
            <input
              id="slug"
              {...register("slug")}
              className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-bg-light dark:bg-bg-dark text-text-main dark:text-text-light rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="bio">Biografía</label>
            <textarea
              id="bio"
              rows={5}
              {...register("bio")}
              className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-bg-light dark:bg-bg-dark text-text-main dark:text-text-light rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="profileVisibility">Visibilidad del perfil</label>
            <select
              id="profileVisibility"
              {...register("profileVisibility")}
              className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-bg-light dark:bg-bg-dark text-text-main dark:text-text-light rounded-md shadow-sm"
            >
              {PROFILE_VISIBILITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-text-soft dark:text-gray-400">
              {
                PROFILE_VISIBILITY_OPTIONS.find(
                  (option) => option.value === visibility
                )?.description
              }
            </p>
            {visibility === "PUBLIC" && (
              <div
                data-testid="visibility-public-warning"
                className="mt-2 flex items-start gap-2 p-2 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
              >
                <AlertTriangle
                  size={16}
                  className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
                />
                <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                  Con visibilidad Pública, cualquier persona en internet podrá
                  ver tus datos personales y proyectos, incluso sin tener una
                  cuenta.
                </p>
              </div>
            )}
            {visibility === "PRIVATE" && (
              <div
                data-testid="visibility-private-warning"
                className="mt-2 flex items-start gap-2 p-2 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
              >
                <AlertTriangle
                  size={16}
                  className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
                />
                <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                  Con visibilidad Privada, otros devs no podrán darte
                  reconocimientos (kudos) y los reclutadores no verán tu
                  portafolio.
                </p>
              </div>
            )}
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
                className="block w-full border-gray-300 dark:border-gray-700 bg-bg-light dark:bg-bg-dark text-text-main dark:text-text-light rounded-md"
              />
              <input
                {...register(`workExperiences.${index}.position`)}
                placeholder="Cargo"
                className="block w-full border-gray-300 dark:border-gray-700 bg-bg-light dark:bg-bg-dark text-text-main dark:text-text-light rounded-md"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  {...register(`workExperiences.${index}.startYear`, {
                    setValueAs: (v) =>
                      v === "" || v == null ? undefined : Number(v),
                  })}
                  placeholder="Año inicio"
                  min={1950}
                  max={new Date().getFullYear()}
                  className="w-32 border-gray-300 dark:border-gray-700 bg-bg-light dark:bg-bg-dark text-text-main dark:text-text-light rounded-md"
                />
                <span className="text-sm text-gray-500">—</span>
                <input
                  type="number"
                  {...register(`workExperiences.${index}.endYear`, {
                    setValueAs: (v) =>
                      v === "" || v == null ? undefined : Number(v),
                  })}
                  placeholder="Año fin"
                  min={1950}
                  max={new Date().getFullYear() + 1}
                  className="w-32 border-gray-300 dark:border-gray-700 bg-bg-light dark:bg-bg-dark text-text-main dark:text-text-light rounded-md"
                />
                <span className="text-xs text-gray-500">
                  (vacío = Actualmente)
                </span>
              </div>
              <textarea
                {...register(`workExperiences.${index}.description`)}
                placeholder="Descripción de tus tareas"
                className="block w-full border-gray-300 dark:border-gray-700 bg-bg-light dark:bg-bg-dark text-text-main dark:text-text-light rounded-md"
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
            <div
              key={field.id}
              className="p-4 border rounded-md space-y-2 relative"
            >
              <input
                {...register(`socialLinks.${index}.platform`)}
                placeholder="Plataforma (ej: LinkedIn, Twitter)"
                className="block w-full border-gray-300 dark:border-gray-700 bg-bg-light dark:bg-bg-dark text-text-main dark:text-text-light rounded-md"
              />
              <input
                {...register(`socialLinks.${index}.url`)}
                placeholder="URL del perfil"
                className="block w-full border-gray-300 dark:border-gray-700 bg-bg-light dark:bg-bg-dark text-text-main dark:text-text-light rounded-md"
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
            <div
              key={field.id}
              className="p-4 border rounded-md space-y-2 relative"
            >
              <input
                {...register(`languages.${index}.language`)}
                placeholder="Idioma"
                className="block w-full border-gray-300 dark:border-gray-700 bg-bg-light dark:bg-bg-dark text-text-main dark:text-text-light rounded-md"
              />
              <select
                {...register(`languages.${index}.proficiency`)}
                className="block w-full border-gray-300 dark:border-gray-700 bg-bg-light dark:bg-bg-dark text-text-main dark:text-text-light rounded-md"
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
            <div
              key={field.id}
              className="p-4 border rounded-md space-y-2 relative"
            >
              <input
                {...register(`certificates.${index}.name`)}
                placeholder="Nombre de la certificación"
                className="block w-full border-gray-300 dark:border-gray-700 bg-bg-light dark:bg-bg-dark text-text-main dark:text-text-light rounded-md"
              />
              <input
                {...register(`certificates.${index}.imageUrl`)}
                placeholder="URL de la imagen"
                className="block w-full border-gray-300 dark:border-gray-700 bg-bg-light dark:bg-bg-dark text-text-main dark:text-text-light rounded-md"
              />
              <input
                {...register(`certificates.${index}.certificateUrl`)}
                placeholder="URL de la certificación"
                className="block w-full border-gray-300 dark:border-gray-700 bg-bg-light dark:bg-bg-dark text-text-main dark:text-text-light rounded-md"
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
            onClick={() =>
              appendCertificate({ name: "", imageUrl: "", certificateUrl: "" })
            }
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
