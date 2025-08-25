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
      : fetchUserProfile,//si no hay slug, se busca el perfil propio
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="p-6 bg-white rounded-lg shadow-md mb-8 border border-gray-200">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-6">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                `${profile.firstName} ${profile.lastName}`
              )}&background=1e3a8a&color=f3f4f6&size=128&rounded=true&font-size=0.33`}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-lg text-gray-600">
                {profile.headline || "Sin Headline"}
              </p>
              {profile.techStack.map((tech) => (
                <span
                  key={tech.id}
                  className="px-2 py-0.5 rounded-full border border-border text-text-soft dark:text-gray-400"
                  style={{ borderColor: tech.techColor }}
                >
                  {tech.name}
                </span>
              ))}
              <br />
              {profile.languages.map((lang) => (
                <span
                  key={lang.id}
                  className="px-2 py-0.5 text-text-soft dark:text-gray-400"
                >
                  {lang.language} ({lang.proficiency})
                </span>
              ))}
              <br />
              {profile.socialLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center gap-2 mt-2 text-sm text-gray-500"
                >
                  <span>{link.platform}:</span>
                  <a
                    href={link.url}
                    className="text-indigo-600 hover:underline"
                  >
                    {link.url}
                  </a>
                </div>
              ))}
            </div>
          </div>
          {isOwnProfile && (
            <Link
              to="/profile/edit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Editar Perfil
            </Link>
          )}
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section className="p-6 bg-white rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Rocket size={20} /> Proyectos Publicados (
              {profile.projects.length})
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
          <section className="p-6 bg-white rounded-lg shadow-md border">
            <div className="flex justify-baseline items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-1 me-2">
                <Heart size={20} /> Kudos Recibidos
              </h3>
              <span>
                {profile.kudosReceived.length === 0 ? (
                  isOwnProfile ? (
                    "No has recibido kudos aún."
                  ) : (
                    <div className="flex justify-center">
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
            </div>

            {profile.kudosReceived.map((kudo) => (
              <div
                key={kudo.id}
                className="mt-4 p-4 bg-gray-50 rounded-md border"
              >
                <p className="text-gray-700">{kudo.message}</p>
                <div className="mt-2 text-sm text-gray-500">
                  Dado por {kudo.senderUsername} el{" "}
                  {new Date(kudo.createdAt).toLocaleDateString()}
                </div>
                <div className="mt-2">Proyecto: {kudo.relatedProjectTitle}</div>
              </div>
            ))}

            {!isOwnProfile ? (
              <div className="mt-6 p-4 bg-white rounded-md border">
                <h4 className="text-lg font-semibold mb-2">Enviar un Kudo</h4>
                <textarea
                  className="w-full p-2 border rounded mb-2"
                  placeholder={`Escribe un mensaje para ${profile.firstName}...`}
                  rows={3}
                />
                <div className="mb-2">
                  <label className="block text-sm text-gray-600 mb-1">
                    Proyecto relacionado (opcional):
                  </label>
                  <select className="w-full p-2 border rounded">
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
            ) : profile.kudosReceived.length }
          </section>

          {/* Feedbacks */}
          <section className="p-6 bg-white rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare size={20} /> Feedback Dado (
              {profile.feedbackGiven.length === 0
                ? isOwnProfile
                  ? "No has realizado feedback aún."
                  : "Este usuario no ha realizado feedback aún."
                : profile.feedbackGiven.length}
              )
            </h2>

            {profile.feedbackGiven.map((feedback) => (
              <div
                key={feedback.id}
                className="mt-4 p-4 bg-gray-50 rounded-md border"
              >
                <p className="text-gray-700">{feedback.feedbackDescription}</p>
                <div className="mt-2 text-sm text-gray-500">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </div>
                <div className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                  {feedback.rating} <Star size={13} className="inline" />
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
