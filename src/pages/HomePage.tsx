import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../api/queries";
import type { ListProjects } from "../types";
import Loading from "../components/ui/ux/Loading";
import "../index.css";

const HomePage = () => {
  const { data, isLoading, isError, error } = useQuery<ListProjects[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 60,
  });

  // ---Renderizando del contenido ---
  const formatedDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  const formatedBoolanColaborativeData = (isCollaborative: boolean) => {
    return isCollaborative ? "Sí" : "No";
  };

  const formatedBoolanMentoringData = (needMentoring: boolean) => {
    return needMentoring ? "Sí" : "No";
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="h-screen text-center flex items-center justify-center">
          <Loading message="lista de proyectos"/>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="p-8 h-screen w-max text-center font-bold">
          Error al cargar lsita de proyectos: {error.message}
        </div>
      );
    }

    if (!data) {
      return (
        <div className="p-8 h-screen w-max text-center font-bold">
          No se encontraron proyectos
        </div>
      );
    }

    console.log(data[0].technologies);

    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Lista de proyectos</h1>
        </div>
        <div className="mt-6">
          <ul className="space-y-4">
            {/* Mapeo de la lista de proyectos --- */}
            {data.map((project) => (
              <li
                key={project.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <h2 className="text-lg font-semibold">{project.title}</h2>
                <span>Desarrollador:</span>
                <p className="text-gray-600">{project.developerUsername}</p>
                <span>Fecha de creación:</span>
                <p className="text-gray-600">
                  {formatedDate(project.createdAt)}
                </p>
                <span>Es colaborativo:</span>
                <p className="text-gray-600">
                  {formatedBoolanColaborativeData(project.isCollaborative)}
                </p>
                <span>Progreso de desarrollo:</span>
                <p className="text-gray-600">{project.developmentProgress}%</p>
                <span>Estado:</span>
                <p className="text-gray-600">{project.status}</p>
                <span>Busco mentor:</span>
                <p className="text-gray-600">
                  {formatedBoolanMentoringData(project.needMentoring)}
                </p>
                <span>Technologias:</span>
                {/* === Renderizado de Tecnologías con Colores === */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech.id}
                      style={{ color: tech.techColor, borderColor: tech.techColor , border: "1px solid"}}
                      className="px-2.5 py-1 text-xs font-semibold rounded-full"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return renderContent();
};

export default HomePage;
