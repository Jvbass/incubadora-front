import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import { fetchProjects } from "../../../api/queries";
import type { SortByType } from "../../../types";
import Loading from "../../ux/Loading";
import { ProjectCard } from "../card/ProjectCard";

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
    // Pasamos el sortBy a la función de fetch
    queryFn: ({ pageParam }) => fetchProjects({ pageParam, sortBy }),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.pageNumber + 1;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
  });

  if (status === "pending") {
    return <Loading message={`Cargando ${title.toLowerCase()}...`} />;
  }

  if (status === "error") {
    return (
      <div className="text-red-600">
        Error al cargar la lista: {error.message}
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-2xl text-zinc-900 dark:text-zinc-50 mb-4 font-semibold">
        {title}
      </h2>
      <ul className="space-y-4">
        {data.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.content.map((project) => (
              <li
                key={project.id}
                className="block hover:opacity-90 transition-opacity"
              >
                <ProjectCard project={project} variant="full" />
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
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
