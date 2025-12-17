import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { fetchPublicProfileBySlug, fetchUserProfile } from "../../api/queries";
import Loading from "../../components/ux/Loading";
import { ProjectCard } from "../../components/ui/card/ProjectCard";
import {
  BriefcaseBusiness,
  GraduationCap,
  Heart,
  Mail,
  MessageSquare,
  Rocket,
  Star,
  UserRoundCheck,
} from "lucide-react";
import type { ProjectSummary } from "../../types";
import { useState } from "react";
import GiveKudoModal from "../../components/ui/modal/GiveKudoModal";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();

  const [isKudoModalOpen, setIsKudoModalOpen] = useState(false);

  // Hook #1: Obtiene y cachea el perfil del usuario autenticado.
  // Usaremos este dato para saber el slug del usuario actual y compararlo.
  const { data: ownProfileData } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 60, // Cachear por 1 hora, ya que no cambia a menudo
    refetchOnWindowFocus: false,
  });

  // Hook #2: Obtiene el perfil que se debe mostrar en la página.
  // Puede ser el perfil público (si hay slug) o el propio (si no hay slug).
  const isPublicProfileView = !!slug;
  /*** Hook #2: Obtiene el perfil que se debe mostrar en la página. ***/
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: isPublicProfileView ? ["publicProfile", slug] : ["userProfile"],
    queryFn: isPublicProfileView //si hay slug, se busca el perfil público
      ? () => fetchPublicProfileBySlug(slug!)
      : fetchUserProfile, //si no hay slug, se busca el perfil propio
    staleTime: 1000 * 60 * 20, // 20 minutos de caché para perfiles visitados
  });

  // La comparación con el slug del perfil del propio usuario,
  // obtenido del primer hook.
  const isOwnProfile = !isPublicProfileView || ownProfileData?.slug === slug;

  // copiar correo
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profile?.email || "");
      toast.success("Email copiado", {
        position: "top-center",
      });
    } catch (err) {
      toast.error("Error al copiar" + err);
    }
  };

  if (isLoading) {
    return <Loading message="Cargando perfil..." />;
  }

  if (isError) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">
          Error al cargar el perfil: {error.message}
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <p>No se encontró el perfil.</p>
      </div>
    );
  }

  if (!isOwnProfile && !profile.publicProfile) {
    return (
      <div className="text-center p-8">
        <p>Este perfil es privado.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 lg:p-8">
      <header className="p-8 mb-8 min-h-64">
        <div className="flex flex-col-reverse md:flex-row items-center md:items-start gap-8">
          {/* Texto */}
          <div className="w-full md:w-3/4 flex flex-col gap-4 ">
            {/* Nombre y título */}
            <div>
              <span className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-text-light text-center md:text-left">
                Hola! Soy {profile.firstName} {profile.lastName}
              </span>
              <p className="text-lg md:text-xl dark:text-gray-300 text-gray-600 text-left mt-3">
                {profile.headline || "Desarrollador"}
              </p>
            </div>

            {/* stack */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {profile.techStack.map((tech) => (
                <div
                  key={tech.id}
                  style={{
                    borderColor: tech.techColor,
                    backgroundColor: tech.techColor + "2A", // Opacidad
                  }}
                  className="px-2 py-0.5 border-1 text-xs font-small rounded-md flex items-center text-text-dark dark:text-text-light"
                >
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>

            {/* Idiomas */}
            <div className="flex justify-center md:justify-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              {profile.languages.map((lang) => (
                <span
                  key={lang.id}
                  className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-800"
                >
                  {lang.language} ({lang.proficiency})
                </span>
              ))}
            </div>

            {/* Redes */}
            <div className="flex md:justify-start justify-center gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Contáctame:</span>
              <span
                onClick={copyToClipboard}
                className="cursor-pointer hover:scale-110 hover:text-cta-600 transition-all duration-300"
              >
                <Mail size={20} />{" "}
              </span>

              {profile.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  className="text-indigo-600 hover:underline text-sm"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
          {/* Imagen */}
          <div className="relative w-full md:w-1/4 flex items-center justify-center md:justify-end align-center flex-col">
            <img
              src="https://mitsloanreview.mx/wp-content/uploads/2024/02/quien-es-julian-assange.jpg"
              alt="Avatar"
              className="w-32 h-32 object-cover md:w-40 md:h-40 rounded-full shadow-md"
            />
            {/* mostrar el rol del usuario */}
            <span className="absolute bottom-12 left-40 w-full text-3xl">
              ✔️
            </span>

            <div className="flex items-center mt-3">
              <div className="relative inline-flex overflow-hidden rounded-full p-[1px]">
                <div className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#9EC4F5_0%,#21554E_50%,#9EC4F5_100%)]"></div>
                <div className="inline-flex items-center justify-center w-full px-3 py-1 text-sm text-black-600 bg-bg-soft rounded-full  dark:bg-gray-800 dark:text-white/80 backdrop-blur-3xl whitespace-nowrap">
                  <span>Disponible para trabajar</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón editar */}
        {isOwnProfile && (
          <Link
            to="/profile/edit"
            className="fixed bottom-2 right-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Editar Perfil
          </Link>
        )}
      </header>

      <main className="max-w-4xl mx-auto p-3 sm:p-6 lg:p-8 md:col-span-2 space-y-8">
        {/* Experiencia laboral */}
        {profile.workExperiences.length > 0 && (
          <section className="container">
            <div className="flex flex-col justify-baseline items-left mb-4 text-text-main dark:text-text-light">
              <h3 className="text-3xl font-semibold flex items-center gap-1 me-2">
                <BriefcaseBusiness size={20} /> Experiencia laboral{" "}
              </h3>
              <div className="relative border-l border-gray-700 ml-4 mt-4">
                {profile?.workExperiences.map((exp) => (
                  <div key={exp.id} className="mb-10 ml-6 ">
                    {/* Punto en la línea */}
                    <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-cta-600 "></span>

                    {/* Contenido */}
                    <h4 className="text-lg font-bold dark:text-cta-300 text-cta-600">
                      {exp.position}
                    </h4>
                    <p className="text-gray-800 dark:text-gray-200 font-semibold">
                      {exp.companyName}
                    </p>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {exp.startYear} -{" "}
                      {exp.endYear ? exp.endYear : "Actualmente"}
                    </span>
                    <p className="mt-2 text-gray-800 dark:text-gray-200 max-w-2xl">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Proyectos */}
        {profile.projects.length > 0 && (
          <section className="container">
            <div className="flex text-3xl justify-baseline items-center mb-4 text-text-main dark:text-text-light">
              <h3 className="ml-2 font-semibold flex items-center gap-1 me-2">
                <Rocket size={20} />
                Proyectos{" "}
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 ">
                {profile.projects.length === 0 ? (
                  isOwnProfile ? (
                    "Aún no tienes proyectos publicados."
                  ) : (
                    <div className="flex justify-center ">
                      <Link to="/home" className="text-cta-600 hover:underline">
                        {profile.firstName} Aún no ha publicado proyectos
                      </Link>
                    </div>
                  )
                ) : (
                  `${profile.projects.length}`
                )}
              </div>
            </div>
            {profile.projects.length === 0 ? (
              <p className="text-gray-500 mt-4">
                {isOwnProfile
                  ? "Aún no tienes proyectos publicados."
                  : "Este usuario no tiene proyectos publicados."}
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {profile.projects.map((project: ProjectSummary) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    variant="full"
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Kudos */}
        {profile.kudosReceived.length > 0 && (
          <section className="container">
            <div className="flex justify-baseline items-center mb-4 text-text-main dark:text-text-light">
              <Heart size={20} />
              <h3 className="ml-2 text-3xl font-semibold flex gap-1 me-2">
                Kudos Recibidos
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-400 ">
                {profile.kudosReceived.length === 0 ? (
                  isOwnProfile ? (
                    "No has recibido kudos aún."
                  ) : (
                    <div className="flex ">
                      <span className="text-cta-600">
                        {profile.firstName} no tiene kudos publicados.
                      </span>
                    </div>
                  )
                ) : (
                  `${profile.kudosReceived.length}`
                )}
              </span>
              {/*  mostrar el botón solo si NO es el perfil propio */}
              {!isOwnProfile && (
                <div className="flex w-auto justify-center ms-auto text-sm text-gray-500">
                  <span
                    onClick={() => setIsKudoModalOpen(true)}
                    className="px-4 py-2 text-sm font-medium text-cta-600 border border-cta-600 rounded-full hover:bg-brand-900 flex items-center gap-2 hover:cursor-pointer transition-all duration-200"
                  >
                    <Heart size={16} />
                    Reconoce a {profile.firstName}
                  </span>
                </div>
              )}
            </div>

            {profile.kudosReceived.map((kudo) => (
              <div
                key={kudo.id}
                className="flex justify-between mt-4 p-4 rounded-md dark:text-gray-300 border transition-all duration-200 bg-bg-light dark:bg-bg-dark border-divider dark:border-gray-700 hover:shadow-md hover:border-border dark:hover:border-gray-600"
              >
                <div>
                  <p className="text-gray-700 dark:text-gray-200">
                    {kudo.message}
                  </p>
                  <div className="mt-2 text-sm text-gray-500">
                    Dado por {kudo.senderUsername} el{" "}
                    {new Date(kudo.createdAt).toLocaleDateString()}
                  </div>
                  {kudo.relatedProjectTitle && (
                    <div className="mt-2">
                      Proyecto: {kudo.relatedProjectTitle}
                    </div>
                  )}
                </div>
                {!kudo.isPublic && (
                  <div className="text-gray-700 dark:text-gray-200 text-sm">
                    {kudo.isPublic ? "Publico" : "Privado"}
                  </div>
                )}
              </div>
            ))}

            <GiveKudoModal
              isOpen={isKudoModalOpen}
              onClose={() => setIsKudoModalOpen(false)}
              profile={profile}
            />
          </section>
        )}

        {/* Feedbacks */}
        <section className="container">
          <div className="flex text-3xl justify-baseline items-center mb-4 text-text-main dark:text-text-light">
            <MessageSquare size={20} />
            <h3 className="ml-2 font-semibold flex gap-1 me-2">
              Feedback realizados
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400 ">
              {profile.feedbackGiven.length === 0
                ? isOwnProfile
                  ? "No has realizado feedback aún."
                  : "Este usuario no ha realizado feedback aún."
                : profile.feedbackGiven.length}
            </span>
          </div>

          {profile.feedbackGiven.map((feedback) => (
            <div
              key={feedback.id}
              className="mt-4 p-4 bg-gray-50 dark:bg-bg-dark rounded-md "
            >
              <h3 className="text-lg text-text-main dark:text-text-light">
                {feedback.relatedProjectTitle}
              </h3>
              <p className="text-gray-700">{feedback.feedbackDescription}</p>
              <div className="mt-2 text-sm text-gray-500">
                {new Date(feedback.createdAt).toLocaleDateString()}
              </div>

              <div className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                {feedback.rating} <Star size={13} className="inline" />
              </div>
              <div className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                {feedback.projectId}
              </div>
            </div>
          ))}
        </section>

        {/* Certificados */}
        {profile.certificates.length > 0 && (
          <section className="container">
            <div className="flex text-3xl justify-baseline items-center mb-4 text-text-main dark:text-text-light">
              <GraduationCap size={20} />
              <h3 className="ml-2 font-semibold flex gap-1 me-2">
                Certificados
              </h3>
            </div>
            <div className="flex justify-center flex-wrap gap-4">
              {profile.certificates.map((certificate) => (
                <a
                  key={certificate.id}
                  href={certificate.certificateUrl}
                  target="_blank"
                  className="flex flex-col items-center gap-2 max-w-40 hover:cursor-pointer hover:scale-105 transition-all duration-300"
                >
                  <img
                    src={certificate.imageUrl}
                    alt={certificate.name}
                    className="w-30 h-30 object-cover rounded-full ring-3 ring-cta-600 dark:ring-cta-300"
                  />
                  <p className="dark:text-text-light text-text-main text-center text-sm ">
                    {certificate.name}
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Sobre mí */}
        <section className="container">
          <div className="flex text-3xl justify-baseline items-center mb-4 text-text-main dark:text-text-light">
            <UserRoundCheck size={20} />
            <h3 className="ml-2 font-semibold flex gap-1 me-2">Sobre mí</h3>
          </div>
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4">
            <p className="mt-2 text-gray-800 dark:text-gray-200 max-w-2/3 text-pretty">
              {profile.bio}
            </p>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/04/Julian_Assange_26C3.jpg"
              alt=""
              className="w-full h-auto object-cover max-h-48 max-w-1/3 rounded-lg rotate-4 hover:scale-110 hover:rotate-2 transition-all duration-300 ring-3 ring-gray-200 dark:ring-gray-700 "
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;
