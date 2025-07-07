import { useQuery } from "@tanstack/react-query";
import { fetchMyProjects } from "../../../api/queries";
import type { ListProjects } from "../../../types";
import Loading from "../ux/Loading";
import { Link } from "react-router-dom";
import { Suspense } from "react";

const MyProjectsList = () => {
  // Usamos una clave única ['myProjects'] para esta consulta
  const {
    data: projects,
    isLoading,
    isError,
    error,
  } = useQuery<ListProjects[]>({
    queryKey: ["myProjects"],
    queryFn: fetchMyProjects,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });
  console.log(projects);

  if (isLoading) {
    return <Loading message="proyectos" />;
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <p className="text-red-500">Error al cargar los proyectos: {error.message}</p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800">Aún no tienes proyectos</h3>
        <p className="text-gray-500 mt-2">¡Anímate a compartir tu primer trabajo con la comunidad!</p>
        <Link 
          to="/create-project" 
          className="mt-4 inline-block px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Crear Nuevo Proyecto
        </Link>
      </div>
    );
  }


  return (
    <div className="space-y-4">

      <Suspense fallback={<Loading message="proyectos" />}>
      {projects.map((project) => (
        <div key={project.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
          

          {/* Información del Proyecto */}
          <div>
            <h4 className="font-bold text-gray-800">{project.title}</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.technologies.slice(0, 4).map(tech => (
                <span 
                  key={tech.id} 
                  className="px-2 py-0.5 text-xs font-semibold text-white rounded-full"
                  style={{ backgroundColor: tech.techColor }}
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>


          {/* Estado y Acciones */}
          <div className="text-right">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              project.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {project.status}
            </span>
            <div className="mt-2">
              <button className="text-sm text-indigo-600 hover:underline">Editar</button>
              <span className="mx-2 text-gray-300">|</span>
              <button className="text-sm text-red-600 hover:underline">Borrar</button>
            </div>
          </div>

        </div>
      ))}
      </Suspense>
    </div>
  );
};


export default MyProjectsList;
