import { ProyectHomeSide } from "../components/ui/project-home/ProjectHomeSide";
import { ProjectList } from "../components/ui/project-home/ProjectList";

const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
        <main className="lg:col-span-3 space-y-16">
          {/* Renderizamos cada lista con su propio título y criterio de ordenamiento */}
          <ProjectList title="Últimos Proyectos" sortBy="LATEST" />
          <ProjectList title="Más Populares" sortBy="MOST_FEEDBACK" />
          <ProjectList title="Mejor Calificados" sortBy="TOP_RATED" />
        </main>
        <ProyectHomeSide />
      </div>
    </div>
  );
};

export default HomePage;