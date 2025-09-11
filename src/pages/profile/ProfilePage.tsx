import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { fetchPublicProfileBySlug, fetchUserProfile } from "../../api/queries";
import Loading from "../../components/ux/Loading";
import { ProjectCard } from "../../components/ui/card/ProjectCard";
import { Heart, MessageSquare, Rocket, Star } from "lucide-react";
import type { ProjectSummary } from "../../types";

const ProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();

  // Hook #1: Obtiene y cachea el perfil del usuario autenticado.
  // Usaremos este dato para saber el slug del usuario actual y compararlo.
  const { data: ownProfileData } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 60, // Cachear por 1 hora, ya que no cambia a menudo
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
            <div className="flex md:justify-start gap-4 mt-2">
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
          <div className="w-full md:w-1/4 flex justify-end">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                `${profile.firstName} ${profile.lastName}`
              )}&background=1e3a8a&color=f3f4f6&size=160&rounded=true&font-size=0.33`}
              alt="Avatar"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-md"
            />
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

      <main className="max-w-4xl mx-auto p-3 sm:p-6 lg:p-8">
        <div className="md:col-span-2 space-y-8">
          <section className="p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-text-main dark:text-text-light">
              <Rocket size={20} /> Mis Proyectos ({profile.projects.length})
            </h2>
            {profile.projects.length === 0 ? (
              <p className="text-gray-500 mt-4">
                {isOwnProfile
                  ? "No tienes proyectos publicados aún."
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

          {/* Kudos */}
          <section className="p-6">
            <div className="flex justify-baseline items-center mb-4 dark:text-text-light">
              <h3 className="text-lg font-semibold flex items-center gap-1 me-2">
                <Heart size={20} /> Kudos Recibidos
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-400 ">
                {profile.kudosReceived.length === 0 ? (
                  isOwnProfile ? (
                    "No has recibido kudos aún."
                  ) : (
                    <div className="flex justify-center ">
                      <Link to="/home" className="text-cta-600 hover:underline">
                        {profile.firstName} no ha recibido kudos aún, sé el
                        primero en dar uno!
                      </Link>
                    </div>
                  )
                ) : (
                  `(${profile.kudosReceived.length})`
                )}
              </span>
              {/* Condicional para mostrar el botón solo si NO es el perfil propio */}
              {!isOwnProfile && (
                <div className="flex w-auto justify-center ms-auto text-sm text-gray-500">
                  <Link
                    // TODO abre modal
                    to={`/give-kudos/${profile.slug}`}
                    className="px-4 py-2 text-sm font-medium text-cta-600 border border-cta-600 rounded-full hover:bg-brand-900 flex items-center gap-2"
                  >
                    <Heart size={16} />
                    Reconoce a {profile.firstName}
                  </Link>
                </div>
              )}
            </div>

            {profile.kudosReceived.map((kudo) => (
              <div
                key={kudo.id}
                className="mt-4 p-4 rounded-md dark:text-gray-300 border transition-all duration-200 bg-bg-light dark:bg-bg-dark border-divider dark:border-gray-700 hover:shadow-md hover:border-border dark:hover:border-gray-600"
              >
                <p className="text-gray-700 dark:text-gray-200">
                  {kudo.message}
                </p>
                <div className="mt-2 text-sm text-gray-500">
                  Dado por {kudo.senderUsername} el{" "}
                  {new Date(kudo.createdAt).toLocaleDateString()}
                </div>
                <div className="mt-2">Proyecto: {kudo.relatedProjectTitle}</div>
              </div>
            ))}

            
              <div className="mt-6 p-4 bg-gray-50 dark:bg-bg-dark  rounded-md ">
                <h4 className="text-lg font-semibold mb-2">Enviar un Kudo</h4>
                <textarea
                  className="w-full p-2  rounded mb-2"
                  placeholder={`Escribe un mensaje para ${profile.firstName}...`}
                  rows={3}
                />
                <div className="mb-2">
                  <label className="block text-sm text-gray-600 mb-1">
                    Proyecto relacionado (opcional):
                  </label>
                  <select className="w-full p-2  rounded">
                    <option>Selecciona un proyecto</option>
                    {profile.projects.map((project: ProjectSummary) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  type="button"
                >
                  Enviar Kudo
                </button>
              </div>
       
          </section>

          {/* Feedbacks */}
          <section className="p-6">
            <div className="flex justify-baseline items-center mb-4 dark:text-text-light">
            <h3 className="text-lg font-semibold flex items-center gap-1 me-2">
              <MessageSquare size={20} /> Feedback realizados
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400 ">
              (
              {profile.feedbackGiven.length === 0
                ? isOwnProfile
                  ? "No has realizado feedback aún."
                  : "Este usuario no ha realizado feedback aún."
                : profile.feedbackGiven.length}
              )
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
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
