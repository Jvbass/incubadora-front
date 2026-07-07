import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Controller,
  useFieldArray,
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Check, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { updateUserProfile } from "../../../api/profileApi";
import { fetchTechnologies } from "../../../api/projectApi";
import MultiSelect from "../../projects/components/MultiSelect";
import { buildUpdateRequest } from "../hooks/useInlineProfileEdit";
import type {
  ProfileResponse,
  ProfileUpdateRequest,
  Technology,
} from "../../../types";

interface ProfileWizardProps {
  profile: ProfileResponse;
}

// Wizard de onboarding de perfil en 4 pasos (profile-wizard SDD, WU2).
// Mismo patrón que ProjectWizard: un solo <form>, un solo useForm, validación
// por paso con trigger(), y un único PUT /profile disparado desde el paso
// final. "Omitir por ahora" está siempre disponible y no persiste nada (R4).
const STEPS = [
  { label: "Básicos" },
  { label: "Stack" },
  { label: "Trayectoria" },
  { label: "Revisión" },
] as const;

// Campos que valida cada paso antes de avanzar (R2)
const STEP_FIELDS: (keyof ProfileUpdateRequest)[][] = [
  ["headline", "bio"],
  ["techStackIds", "languages"],
  ["workExperiences", "certificates", "socialLinks"],
  [],
];

const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

const inputClass =
  "mt-1 block w-full bg-transparent placeholder:text-slate-400 text-slate-700 dark:placeholder:text-gray-400 dark:text-text-light text-sm border border-gray-300 dark:border-border rounded-md px-3 py-2 transition duration-200 ease focus:outline-none focus:border-cta-600 dark:focus:border-cta-300 hover:border-cta-300 focus:shadow-sm";

const labelClass =
  "block text-sm font-medium text-text-main dark:text-text-light";

const cardClass =
  "p-4 border border-gray-300 dark:border-border rounded-md space-y-2 relative";

const ProfileWizard = ({ profile }: ProfileWizardProps) => {
  const [step, setStep] = useState(0);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // R5: guarda sincrónica contra doble submit (un doble click real dispara
  // dos eventos "submit" antes de que el re-render con `disabled` aplique).
  const hasSubmittedRef = useRef(false);

  const { data: technologies, isLoading: isLoadingTechs } = useQuery({
    queryKey: ["technologies"],
    queryFn: fetchTechnologies,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const technologyOptions = useMemo(
    () =>
      technologies?.map((tech: Technology) => ({
        value: tech.id,
        label: tech.name,
      })) || [],
    [technologies]
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateRequest>({
    defaultValues: buildUpdateRequest(profile),
  });

  // D4/T2.6: re-sembrar el form si el perfil base cambia (mirror EditProfilePage:112-126)
  useEffect(() => {
    reset(buildUpdateRequest(profile));
  }, [profile, reset]);

  const {
    fields: workFields,
    append: appendWork,
    remove: removeWork,
  } = useFieldArray({ control, name: "workExperiences" });

  const {
    fields: certificateFields,
    append: appendCertificate,
    remove: removeCertificate,
  } = useFieldArray({ control, name: "certificates" });

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({ control, name: "socialLinks" });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({ control, name: "languages" });

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    // T2.8 (D2) — el fix de cache dual: el wizard se lanza DESDE y vuelve
    // AL dashboard, así que hay que escribir/invalidar tanto "userProfile"
    // (perfil propio, /settings, Navbar) como "userData" (dashboard), en
    // ese orden, antes de invalidar las vistas públicas derivadas.
    onSuccess: (updated) => {
      queryClient.setQueryData(["userProfile"], updated);
      queryClient.setQueryData(["userData"], updated);
      queryClient.invalidateQueries({ queryKey: ["profileBySlug"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      toast.success("Perfil actualizado");
      navigate("/dashboard");
    },
    onError: (error) => {
      hasSubmittedRef.current = false; // permitir reintentar tras un error
      toast.error(`Error al guardar: ${error.message}`);
    },
  });

  // R5: único PUT posible, disparado solo por el submit del paso final.
  const onSubmit: SubmitHandler<ProfileUpdateRequest> = (formValues) => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    mutation.mutate({ ...buildUpdateRequest(profile), ...formValues });
  };

  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  // R4: omitir no dispara mutate() nunca; el marcador de onboarding se
  // conecta en WU3 (T3.3) una vez exista useOnboardingBanner().
  const handleSkip = () => {
    navigate("/dashboard");
  };

  const values = watch();
  const selectedTechNames = technologyOptions
    .filter((o) => values.techStackIds?.includes(o.value))
    .map((o) => o.label);

  return (
    <div>
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
        className="p-6 bg-bg-light dark:bg-bg-dark rounded-lg shadow-md space-y-6 border border-divider dark:border-border"
      >
        {/* ============ PASO 1: Básicos ============ */}
        {step === 0 && (
          <section className="space-y-4" data-testid="profile-wizard-step-basics">
            <h3 className="text-xl font-semibold border-b border-gray-200 dark:border-border pb-2 text-text-main dark:text-text-light">
              Información Básica
            </h3>
            <div>
              <label htmlFor="headline" className={labelClass}>
                Titular Profesional
              </label>
              <input
                id="headline"
                type="text"
                {...register("headline")}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="bio" className={labelClass}>
                Biografía
              </label>
              <textarea
                id="bio"
                rows={5}
                {...register("bio")}
                className={inputClass}
              />
            </div>
          </section>
        )}

        {/* ============ PASO 2: Stack ============ */}
        {step === 1 && (
          <section className="space-y-6" data-testid="profile-wizard-step-stack">
            <h3 className="text-xl font-semibold border-b border-gray-200 dark:border-border pb-2 text-text-main dark:text-text-light">
              Stack e Idiomas
            </h3>
            <div>
              <label className={`${labelClass} mb-1`}>Tecnologías</label>
              <Controller
                name="techStackIds"
                control={control}
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

            <div className="space-y-3">
              <label className={labelClass}>Idiomas</label>
              {languageFields.map((field, index) => (
                <div key={field.id} className={cardClass}>
                  <input
                    placeholder="Idioma"
                    {...register(`languages.${index}.language`)}
                    className={inputClass}
                  />
                  <select
                    {...register(`languages.${index}.proficiency`)}
                    className={`${inputClass} dark:bg-bg-dark`}
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
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendLanguage({ language: "", proficiency: "" })}
                className="text-sm text-cta-600 hover:underline cursor-pointer"
              >
                + Añadir Idioma
              </button>
            </div>
          </section>
        )}

        {/* ============ PASO 3: Trayectoria ============ */}
        {step === 2 && (
          <section className="space-y-6" data-testid="profile-wizard-step-trajectory">
            <h3 className="text-xl font-semibold border-b border-gray-200 dark:border-border pb-2 text-text-main dark:text-text-light">
              Trayectoria
            </h3>

            <div className="space-y-3">
              <label className={labelClass}>Experiencia Laboral</label>
              {workFields.map((field, index) => (
                <div key={field.id} className={cardClass}>
                  <input
                    placeholder="Empresa"
                    {...register(`workExperiences.${index}.companyName`)}
                    className={inputClass}
                  />
                  <input
                    placeholder="Cargo"
                    {...register(`workExperiences.${index}.position`)}
                    className={inputClass}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Año inicio"
                      min={1950}
                      max={new Date().getFullYear()}
                      {...register(`workExperiences.${index}.startYear`, {
                        setValueAs: (v) =>
                          v === "" || v == null ? undefined : Number(v),
                      })}
                      className={`${inputClass} w-32`}
                    />
                    <span className="text-sm text-text-soft">—</span>
                    <input
                      type="number"
                      placeholder="Año fin"
                      min={1950}
                      max={new Date().getFullYear() + 1}
                      {...register(`workExperiences.${index}.endYear`, {
                        setValueAs: (v) =>
                          v === "" || v == null ? undefined : Number(v),
                      })}
                      className={`${inputClass} w-32`}
                    />
                    <span className="text-xs text-text-soft">
                      (vacío = Actualmente)
                    </span>
                  </div>
                  <textarea
                    placeholder="Descripción de tus tareas"
                    {...register(`workExperiences.${index}.description`)}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => removeWork(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
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
                className="text-sm text-cta-600 hover:underline cursor-pointer"
              >
                + Añadir Experiencia
              </button>
            </div>

            <div className="space-y-3">
              <label className={labelClass}>Certificaciones</label>
              {certificateFields.map((field, index) => (
                <div key={field.id} className={cardClass}>
                  <input
                    placeholder="Nombre de la certificación"
                    {...register(`certificates.${index}.name`)}
                    className={inputClass}
                  />
                  <input
                    placeholder="URL de la imagen"
                    {...register(`certificates.${index}.imageUrl`)}
                    className={inputClass}
                  />
                  <input
                    placeholder="URL de la certificación"
                    {...register(`certificates.${index}.certificateUrl`)}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => removeCertificate(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
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
                className="text-sm text-cta-600 hover:underline cursor-pointer"
              >
                + Añadir Certificación
              </button>
            </div>

            <div className="space-y-3">
              <label className={labelClass}>Redes Sociales</label>
              {socialFields.map((field, index) => (
                <div key={field.id} className={cardClass}>
                  <input
                    placeholder="Plataforma (ej: LinkedIn, Twitter)"
                    {...register(`socialLinks.${index}.platform`)}
                    className={inputClass}
                  />
                  <input
                    placeholder="https://..."
                    {...register(`socialLinks.${index}.url`, {
                      pattern: {
                        value: urlPattern,
                        message:
                          "La url debe contener el protocolo https://, http:// o ftp://",
                      },
                    })}
                    className={inputClass}
                  />
                  {errors.socialLinks?.[index]?.url && (
                    <p className="text-xs text-cta-600 dark:text-cta-300">
                      {errors.socialLinks[index]?.url?.message}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => removeSocial(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendSocial({ platform: "", url: "" })}
                className="text-sm text-cta-600 hover:underline cursor-pointer"
              >
                + Añadir Red Social
              </button>
            </div>
          </section>
        )}

        {/* ============ PASO 4: Revisión ============ */}
        {step === 3 && (
          <section className="space-y-4" data-testid="profile-wizard-step-review">
            <h3 className="text-xl font-semibold border-b border-gray-200 dark:border-border pb-2 text-text-main dark:text-text-light">
              Revisa antes de guardar
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-text-main dark:text-text-light">
                  Titular
                </dt>
                <dd className="text-text-soft dark:text-text-light/80">
                  {values.headline || "—"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-text-main dark:text-text-light">
                  Biografía
                </dt>
                <dd className="text-text-soft dark:text-text-light/80 whitespace-pre-wrap line-clamp-6">
                  {values.bio || "—"}
                </dd>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <dt className="font-semibold text-text-main dark:text-text-light">
                    Idiomas
                  </dt>
                  <dd className="text-text-soft">
                    {values.languages?.length ?? 0} cargado(s)
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-text-main dark:text-text-light">
                    Experiencia
                  </dt>
                  <dd className="text-text-soft">
                    {values.workExperiences?.length ?? 0} cargada(s)
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-text-main dark:text-text-light">
                    Certificaciones
                  </dt>
                  <dd className="text-text-soft">
                    {values.certificates?.length ?? 0} cargada(s)
                  </dd>
                </div>
              </div>
              <div>
                <dt className="font-semibold text-text-main dark:text-text-light">
                  Redes Sociales
                </dt>
                <dd className="flex flex-wrap gap-2 mt-1">
                  {values.socialLinks && values.socialLinks.length > 0 ? (
                    values.socialLinks.map((link, i) => (
                      <span
                        key={`${link.platform}-${i}`}
                        className="px-2 py-0.5 text-xs rounded-md border border-cta-300 text-cta-600 dark:text-cta-300"
                      >
                        {link.platform || "—"}
                      </span>
                    ))
                  ) : (
                    <span className="text-text-soft">—</span>
                  )}
                </dd>
              </div>
            </dl>
          </section>
        )}

        {/* ============ Navegación del wizard ============ */}
        <div className="flex justify-between items-center gap-4 pt-2">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            data-testid="profile-wizard-back"
            className="flex items-center gap-1 px-5 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-border text-text-main dark:text-text-light hover:bg-gray-100 dark:hover:bg-bg-hoverdark transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft size={16} />
            Atrás
          </button>

          <div className="flex items-center gap-4">
            {/* R4: siempre disponible, en cualquier paso; no persiste nada. */}
            <button
              type="button"
              onClick={handleSkip}
              data-testid="profile-wizard-skip"
              className="text-sm font-medium text-text-soft hover:text-text-main dark:hover:text-text-light hover:underline cursor-pointer"
            >
              Omitir por ahora
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                data-testid="profile-wizard-next"
                className="flex items-center gap-1 px-6 py-2 text-sm font-semibold text-white bg-cta-600 rounded-md hover:bg-cta-900 transition-colors cursor-pointer"
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || mutation.isPending}
                data-testid="profile-wizard-submit"
                className="px-6 py-2 text-sm font-semibold text-white bg-cta-600 rounded-md hover:bg-cta-900 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {mutation.isPending ? "Guardando..." : "Guardar"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileWizard;
