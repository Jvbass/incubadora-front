import type { ProjectDetailResponse } from "../../../types";

interface ProjectMainContentProps {
  project: ProjectDetailResponse;
}

export const ProjectMainContent = ({ project }: ProjectMainContentProps) => {
  return (
    <section>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
        {project.title}
      </h1>
      <p className="mt-2 text-lg text-gray-500">
        Creado por
        <span className="font-semibold text-gray-700">
          {" " + project.developerUsername}
        </span>
      </p>

      {/* Usamos 'prose' de Tailwind para un estilo de texto agradable y automático */}
      <div className="mt-8 prose prose-lg max-w-none prose-p:text-gray-600 prose-headings:text-gray-800">
        <p>{project.description}</p>
      </div>
    </section>
  );
};
