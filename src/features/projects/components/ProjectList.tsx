import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProjects } from "../../../api/projectApi";
import type { SortByType } from "../../../types";
import { ListSkeleton } from "../../../components/ux/Skeleton";
import { ProjectCard } from "./ProjectCard";

interface ProjectListProps {
  title: string;
  sortBy: SortByType; // "LATEST" | "MOST_FEEDBACK" | "TOP_RATED"
}

export const ProjectList = ({ title, sortBy }: ProjectListProps) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["projects", sortBy],
    queryFn: ({ pageParam }) => fetchProjects({ pageParam, sortBy }),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.pageNumber + 1;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
  });

  if (status === "pending") {
    return <ListSkeleton rows={3} />;
  }

  if (status === "error") {
    return (
      <div className="text-red-600">
        Error al cargar la lista: {error.message}
      </div>
    );
  }

  const allProjects = data.pages.flatMap((page) => page.content ?? []);

  return (
    <section>
      <h2 className="text-xl text-zinc-900 dark:text-zinc-50 mb-6 font-semibold">
        {title}
      </h2>
      {allProjects.length === 0 ? (
        <p className="text-text-soft dark:text-text-light text-sm">
          No hay proyectos disponibles aún.
        </p>
      ) : (
      <ul className="space-y-4">
        {allProjects.map((project) => (
              <li
                key={project.id}
                className="block hover:opacity-90 transition-opacity"
              >
                <ProjectCard project={project} variant="full" />
              </li>
        ))}
      </ul>
      )}
      <div className="flex items-center justify-center mt-6">
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="border border-border rounded-full p-1.5 w-full text-center text-text-soft dark:text-text-light
                         hover:text-brand-300 hover:border-brand-300 hover:bg-brand-100 ease-in transition-all duration-200
                         disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isFetchingNextPage ? "Cargando..." : "Mostrar más"}
          </button>
        )}
      </div>
    </section>
  );
};
