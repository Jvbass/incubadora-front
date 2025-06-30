import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../api/queries";

const HomePage = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 60,
  });

  const formatedDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  const formatedBoolanColaborativeData = (isCollaborative: boolean) => {
    return isCollaborative ? "Sí" : "No";
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-8 h-screen w-max text-center font-bold">
          Cargando lsita de proyectos...
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

    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Lista de proyectos</h1>
        </div>
        <div className="mt-6">
          <ul className="space-y-4">
            {data.map((project) => (
              <li
                key={project.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <h2 className="text-lg font-semibold">{project.title}</h2>
                <span>
                  Desarrollador: 
                </span>
                <p className="text-gray-600">{project.developerUsername}</p>
                <span>
                  Fecha de creación: 
                </span>
                <p className="text-gray-600">
                  {formatedDate(project.createdAt)}
                </p>
                <span>
                  Es colaborativo: 
                </span>
                <p className="text-gray-600">
                  {formatedBoolanColaborativeData(project.isCollaborative)}
                </p>
                <span>
                  Progreso de desarrollo: 
                </span>
                <p className="text-gray-600">{project.developmentProgress}</p>
                <span>
                  Estado: 
                </span>
                <p className="text-gray-600">{project.status}</p>
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
