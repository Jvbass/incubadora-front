import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchUserProfile } from "../../api/queries";
import Loading from "../../components/ux/Loading";
import {
  Briefcase,
  GraduationCap,
  Heart,
  Mail,
  MessageSquare,
  Network,
  Rocket,
} from "lucide-react";

const ProfilePage = () => {
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 15, // 15 minutos de caché
  });

  if (isLoading) {
    return <Loading message=" perfil..." />;
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
        <p>No se encontró tu perfil.</p>
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
                {profile.headline ? profile.headline : "Sin Headline"}
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

              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <Mail size={16} />
                <span>{profile.email}</span>
              </div>
            </div>
          </div>
          <Link
            to="/profile/edit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Editar Perfil
          </Link>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna Izquierda */}
        <div className="md:col-span-2 space-y-8">
          {/* Proyectos */}
          <section className="p-6 bg-white rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Rocket size={20} /> Proyectos Publicados (
              {profile.projects.length})
            </h2>
            {profile.projects.length === 0 ? (
              <p className="text-gray-500 mt-4">
                No tienes proyectos publicados aún.
              </p>
            ) : (
              <ul className="mt-4 space-y-4">
                {profile.projects.map((project: any) => (
                  <li
                    key={project.id}
                    className="p-4 bg-gray-50 rounded-md border hover:shadow transition"
                  >
                    <h3 className="text-lg font-semibold text-indigo-800">
                      {project.title}
                    </h3>
                    <p className="text-gray-700">{project.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      Publicado el{" "}
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                    <Link
                      to={`/project/${project.slug}`}
                      className="inline-block mt-2 text-indigo-600 hover:underline text-sm"
                    >
                      Ver detalles
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Feedbacks */}
          <section className="p-6 bg-white rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare size={20} /> Feedback Dado (
              {profile.feedbackGiven.length})
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
                <div className="mt-2 text-sm text-gray-500">
                  {feedback.projectId}
                </div>
              </div>
            ))}
          </section>

          {/* Kudos */}
          <section className="p-6 bg-white rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Heart size={20} /> Kudos Recibidos (
              {profile.kudosReceived.length})
            </h2>
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
                <div className="mt-2">
                  Proyecto:{" "}
                  {kudo.relatedProjectTitle}
                  </div>
              </div>
            ))}
          </section>
        </div>

        {/* Columna Derecha (Sidebar) */}
        <aside className="space-y-8">
          {/* Bio */}
          <section className="p-6 bg-white rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold mb-2">Sobre mí</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
          </section>

          {/* Social Links */}
          <section className="p-6 bg-white rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Network size={20} /> Redes
            </h2>
            {/* ... Lógica para mostrar links ... */}
          </section>

          {/* Experiencia */}
          <section className="p-6 bg-white rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Briefcase size={20} /> Experiencia
            </h2>
            {/* ... Lógica para mostrar experiencia ... */}
          </section>

          {/* Certificados */}
          <section className="p-6 bg-white rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <GraduationCap size={20} /> Certificados
            </h2>
            {/* ... Lógica para mostrar certificados ... */}
          </section>
        </aside>
      </main>
    </div>
  );
};

export default ProfilePage;
