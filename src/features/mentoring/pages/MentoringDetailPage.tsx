import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMentoringBySlug } from "../../../api/mentoringApi";
import Loading from "../../../components/ux/Loading";
import { Clock, DollarSign, Globe, Tag, Calendar } from "lucide-react";
import { DAYS_OF_WEEK, PLATFORM_OPTIONS } from "../../../types";
import { usePageTitle } from "../../../hooks/usePageTitle";

const MentoringDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: mentoring, isLoading, isError, error } = useQuery({
    queryKey: ["mentorings", "detail", slug],
    queryFn: () => fetchMentoringBySlug(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

  // Título contextual del navbar con el nombre real de la mentoría (F-03)
  usePageTitle(mentoring?.title ? `Mentoría: ${mentoring.title}` : null);

  if (isLoading) return <Loading message="Cargando mentoría..." />;

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-500">Error al cargar la mentoría: {error.message}</p>
      </div>
    );
  }

  if (!mentoring) return null;

  const platformLabel =
    PLATFORM_OPTIONS.find((p) => p.value === mentoring.platform)?.label ||
    mentoring.platform;

  const getDayLabel = (value: string) =>
    DAYS_OF_WEEK.find((d) => d.value === value)?.label || value;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Encabezado */}
      <div className="p-6 rounded-lg border border-divider dark:border-border bg-bg-light dark:bg-bg-dark">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-text-light mb-2">
          {mentoring.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{mentoring.specialty}</p>

        {/* Tags */}
        {mentoring.tags && mentoring.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {mentoring.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700"
              >
                <Tag size={11} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Métricas rápidas */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
            <DollarSign size={16} className="text-green-500" />
            <span className="font-semibold">
              {mentoring.isFree ? "Gratis" : `$${mentoring.price} USD`}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
            <Clock size={16} className="text-blue-500" />
            <span>{mentoring.durationMinutes} minutos</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
            <Globe size={16} className="text-purple-500" />
            <span>{platformLabel}</span>
          </div>
          {mentoring.sessionType && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {mentoring.sessionType === "SINGLE" ? "Sesión única" : "Paquete"}
            </span>
          )}
        </div>
      </div>

      {/* Descripción */}
      <div className="p-6 rounded-lg border border-divider dark:border-border bg-bg-light dark:bg-bg-dark">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-text-light mb-3">
          Sobre esta mentoría
        </h2>
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
          {mentoring.description}
        </div>
      </div>

      {/* Horarios */}
      {mentoring.schedules && mentoring.schedules.length > 0 && (
        <div className="p-6 rounded-lg border border-divider dark:border-border bg-bg-light dark:bg-bg-dark">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-text-light mb-3 flex items-center gap-2">
            <Calendar size={20} />
            Horarios disponibles
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Zona horaria: {mentoring.timezone}
          </p>
          <div className="space-y-2">
            {mentoring.schedules.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center gap-3 p-3 rounded-md bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-700 dark:text-gray-300"
              >
                <span className="font-medium w-24">{getDayLabel(slot.dayOfWeek)}</span>
                <span>{slot.startTime} – {slot.endTime}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info del mentor */}
      <div className="p-6 rounded-lg border border-divider dark:border-border bg-bg-light dark:bg-bg-dark">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-text-light mb-4">
          Mentor
        </h2>
        <div className="flex items-center gap-4">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              mentoring.mentorUsername
            )}&background=6366f1&color=ffffff&size=48&rounded=true`}
            alt={mentoring.mentorUsername}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-800 dark:text-text-light">
              {mentoring.mentorUsername}
            </p>
            {mentoring.mentorSlug && (
              <Link
                to={`/portfolio/${mentoring.mentorSlug}`}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Ver portfolio →
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-start">
        <Link
          to="/mentoring"
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          ← Volver a mentorías
        </Link>
      </div>
    </div>
  );
};

export default MentoringDetailPage;
