import React from "react";
import type { ProjectSummary } from "../../../types";
import {
  CircleCheck,
  LoaderCircle,
  MessageSquare,
  Star,
  User,
} from "lucide-react";

interface ProjectCardProps {
  project: ProjectSummary;
  variant: "full" | "compact";
  onView?: (slug: string) => void;
  onEdit?: (slug: string) => void;
  onDelete?: (slug: string) => void;
}

const getStatusStyles = (status: string): string => {
  return status === "published"
    ? "text-red-400"
    : "text-gray-400";
};

export const ProjectCard = React.memo(
  ({ project, variant, onView, onEdit, onDelete }: ProjectCardProps) => {
    // Vista Detallada para el HomePage ---
    if (variant === "full") {
      return (
        <li className="flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 bg-bg-light dark:bg-bg-dark border-divider dark:border-gray-700 hover:shadow-md hover:border-border dark:hover:border-gray-600">
          {/* 1. Avatar del Proyecto */}
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              project.title
            )}&background=1e3a8a&color=f3f4f6&size=64&rounded=true&font-size=0.33`}
            alt={`Avatar de ${project.title}`}
            className="w-16 h-16 rounded-full flex-shrink-0"
          />

          {/* 2. Contenido Principal (Título, Descripción, Etiquetas) */}
          <div className="flex-grow">
            <h3 className="text-lg  text-text-main dark:text-text-light">
              {project.title}
            </h3>
            <p className="text-sm text-bg-dark dark:text-brand-100 truncate">
              {project.subtitle}
            </p>

            <p className="text-sm text-text-soft dark:text-gray-400 truncate flex items-center">
              <User size={16} className="mr-1" /> {project.developerUsername}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
              {/* Etiquetas de Tecnología */}
              {project.technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech.id}
                  className="px-2 py-0.5 rounded-full border border-border text-text-soft dark:text-gray-400"
                  style={{ borderColor: tech.techColor }}
                >
                  {tech.name}
                </span>
              ))}
              {/* Estado del Proyecto */}
              <div className="flex items-center gap-x-3 text-text-soft dark:text-gray-400">
                {project.isCollaborative && <span>• Colaborativo</span>}
                {project.needMentoring && <span>• Busca mentoría</span>}
              </div>
            </div>
          </div>

          {/* 3. Calificaciones, Rating y Fecha */}
          <div className="flex flex-col items-end align-baseline gap-2 flex-shrink-0 ml-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg border border-divider dark:border-gray-700 text-text-soft dark:text-text-light">
                <MessageSquare size={16} />
                <span>{project.feedbackCount}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg border border-divider dark:border-gray-700 text-text-soft dark:text-text-light">
                <Star size={16} className="text-cta-600" />
                <span>{project.averageRating.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-text-soft dark:text-gray-500">
              {project.developmentProgress === 100 ? (
                <>
                  <CircleCheck size={12} className="text-accent-600" />
                  <span className="text-green-600">Completado</span>
                </>
              ) : (
                <>
                  <LoaderCircle size={12} />
                  <span>{project.developmentProgress}%</span>
                </>
              )}
            </div>
          </div>
        </li>
      );
    }

    // --- Vista Compacta para el Dashboard ---
    if (variant === "compact") {
      const statusStyles = getStatusStyles(project.status);

      return (
        <li className="bg-white text-text-main dark:bg-bg-dark dark:text-text-light p-4 rounded-lg  border border-gray-400 flex justify-between">
          {/* Información del Proyecto */}
          <div>
            <h3 className="font-bold text-lg">{project.title}</h3>
            <h2 className="font-bold text-md">Rendimiento:</h2>
            <div className=" flex flex-col text-sm text-gray-700 dark:text-gray-200">
              <span className="font-stretch-expanded">
                Feedbacks: {project.feedbackCount}
              </span>
              <span className="font-stretch-expanded">
                Rating promedio: {project.averageRating}
              </span>
              <span className="font-mono">
                Progreso: {project.developmentProgress}%
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech.id}
                  className=" px-2 py-0.5 text-xs font-semibold text-white rounded-full"
                  style={{ backgroundColor: tech.techColor }}
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* Estado y Acciones */}
          <div className="flex flex-col justify-between items-center">
            <div className="flex">
              <span className={`px-2 py-0 text-xs font-semibold ${statusStyles}`}>
                {project.status}
              </span>
              {project.status == "published" ? (
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-red-400 opacity-100"></span>
                  {/* <span className="relative inline-flex size-0 rounded-full bg-red-500"></span> */}
                </span>
              ) : null}
            </div>

            <div className="mt-2 flex items-center gap-4">
              {/* El botón solo se renderiza si la función onEdit fue pasada como prop */}
              {onEdit && (
                <button
                  onClick={() => onEdit(project.slug)}
                  className="text-sm font-medium text-indigo-700 dark:text-indigo-300 hover:text-indigo-200 cursor-pointer"
                >
                  Editar
                </button>
              )}
              {/* El botón solo se renderiza si la función onDelete fue pasada como prop */}
              {onDelete && (
                <button
                  onClick={() => onDelete(project.slug)}
                  className="text-sm font-medium text-red-700 dark:text-red-400 hover:text-red-300 cursor-pointer"
                >
                  Borrar
                </button>
              )}
              {onView && (
                <button
                  onClick={() => onView(project.slug)}
                  className="text-sm font-medium text-red-700 dark:text-red-400 hover:text-red-300 cursor-pointer"
                >
                  Ver
                </button>
              )}
            </div>
          </div>
        </li>
      );
    }
    return null;
  }
);
