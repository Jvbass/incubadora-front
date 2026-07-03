import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchPublishedMentorings } from "../../../api/mentoringApi";
import { ListSkeleton } from "../../../components/ux/Skeleton";
import { Clock, DollarSign, Search, Tag } from "lucide-react";

const MentoringListPage = () => {
  const [page, setPage] = useState(0);
  const [tagInput, setTagInput] = useState("");
  const [activeTag, setActiveTag] = useState<string | undefined>(undefined);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["mentorings", "list", page, activeTag],
    queryFn: () => fetchPublishedMentorings({ page, size: 10, tag: activeTag }),
    staleTime: 1000 * 60 * 5,
  });

  const handleTagSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTag(tagInput.trim() || undefined);
    setPage(0);
  };

  const handleClearTag = () => {
    setTagInput("");
    setActiveTag(undefined);
    setPage(0);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <ListSkeleton rows={4} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-red-500">Error al cargar mentorías: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-text-light">
          Mentorías
        </h1>

        {/* Filtro por tag */}
        <form onSubmit={handleTagSearch} className="flex gap-2">
          <div className="relative">
            <Tag size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Filtrar por tag..."
              className="pl-8 pr-3 py-2 text-sm border border-gray-300 dark:border-border rounded-lg bg-white dark:bg-bg-dark text-gray-700 dark:text-text-light focus:outline-none focus:border-cta-600 dark:focus:border-cta-300"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-cta-600 text-white text-sm rounded-lg hover:bg-cta-900 cursor-pointer"
          >
            <Search size={16} />
          </button>
          {activeTag && (
            <button
              type="button"
              onClick={handleClearTag}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              ✕ {activeTag}
            </button>
          )}
        </form>
      </div>

      {/* Lista de mentorías */}
      {(data?.content?.length ?? 0) === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No se encontraron mentorías
          {activeTag ? ` para el tag "${activeTag}"` : ""}.
        </div>
      ) : (
        <div className="space-y-4">
          {(data?.content ?? []).map((mentoring) => (
            <Link
              key={mentoring.id}
              to={`/mentoring/${mentoring.slug}`}
              className="block p-5 rounded-lg border border-divider dark:border-border bg-bg-light dark:bg-bg-dark hover:shadow-md hover:border-cta-300 dark:hover:border-cta-600/70 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-grow min-w-0">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-text-light truncate">
                    {mentoring.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {mentoring.specialty}
                  </p>

                  {/* Tags */}
                  {mentoring.tags && mentoring.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {mentoring.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info lateral */}
                <div className="flex sm:flex-col items-center sm:items-end gap-3 flex-shrink-0">
                  {/* Precio */}
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <DollarSign size={14} className="text-green-500" />
                    <span className="text-gray-700 dark:text-text-light">
                      {mentoring.isFree ? "Gratis" : `$${mentoring.price}`}
                    </span>
                  </div>

                  {/* Duración */}
                  {mentoring.durationMinutes != null && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock size={13} />
                      <span>{mentoring.durationMinutes} min</span>
                    </div>
                  )}

                  {/* Tipo de sesión */}
                  {mentoring.sessionType && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {mentoring.sessionType === "SINGLE" ? "Sesión única" : "Paquete"}
                    </span>
                  )}
                </div>
              </div>

              {/* Mentor y fecha */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      mentoring.mentorUsername
                    )}&background=6366f1&color=ffffff&size=24&rounded=true`}
                    alt={mentoring.mentorUsername}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {mentoring.mentorUsername}
                  </span>
                </div>
                {mentoring.createdAt && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(mentoring.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Paginación */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-text-light transition-colors"
          >
            ← Anterior
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Página {data.pageNumber + 1} de {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={data.last}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-text-light transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

export default MentoringListPage;
