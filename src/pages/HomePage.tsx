import { useEffect, useState } from "react";
import type { ListProjects } from "../types";
import apiService from "../api/apiService";
import toast from "react-hot-toast";

const HomePage = () => {
  const [projects, setProjects] = useState<ListProjects[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiService.get<ListProjects[]>("/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error al cargar proyectos:", error);
        toast.error(
          "No se pudieron cargar los datos de la lista de proyectos."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  console.log(projects);

  const formatedDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  const formatedBoolanColaborativeData = (isCollaborative: boolean) => {
    return isCollaborative ? "Sí" : "No";
  };

  if (isLoading) {
    return <div className="p-8 h-screen w-max text-center font-bold">Cargando lsita de proyectos...</div>;
  }
  return(
  <div className="p-8 max-w-4xl mx-auto">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Lista de proyectos</h1>
    </div>
    <div className="mt-6">
      <ul className="space-y-4">
        {projects.map((project) => (
          <li key={project.id} className="p-4 border border-gray-200 rounded-lg">
            <h2 className="text-lg font-semibold">{project.title}</h2>
            <p className="text-gray-600">{project.developerUsername}</p>
            <p className="text-gray-600">{formatedDate(project.createdAt)}</p>
            <p className="text-gray-600">{formatedBoolanColaborativeData(project.isCollaborative)}</p>
            <p className="text-gray-600">{project.developmentProgress}</p>
            <p className="text-gray-600">{project.status}</p>
            
          </li>
        ))}
      </ul>
    </div>
  </div>
  
);
};

export default HomePage;
