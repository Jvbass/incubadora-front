import { useQuery } from "@tanstack/react-query";
// Importamos la función de fetch que acabamos de crear
import { fetchUserData } from "../../api/queries";
import Loading from "../../components/ui/ux/Loading";
import MyProjectsList from "../../components/ui/dashboard/MyProjectsList";
import { Link } from "react-router-dom";

const DeveloperDashboard = () => {
  // Usamos el hook useQuery.
  const { data, isLoading, isError, error } = useQuery({
    // queryKey: Clave única para esta consulta. React Query la usa para cachear.
    queryKey: ["userData"],
    // queryFn: La función asíncrona que obtiene los datos.
    queryFn: fetchUserData,
    // staleTime: Le decimos a React Query que no considere estos datos "obsoletos"
    // durante 5 minutos. No habrá llamadas de red innecesarias en ese tiempo.
    staleTime: 1000 * 60 * 60,
  });

  /** renderizado declarativo */
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="h-screen text-center flex items-center justify-center">
          <Loading message="perfil" />
        </div>
      );
    }

    if (isError) {
      return (
        <>
          <p className="text-red-500">
            Error al cargar el perfil: {error.message}
          </p>
          <a href="/">
            <span>volver</span>
          </a>
        </>
      );
    }

    if (!data) {
      return (
        <>
          <p>No se encontraron datos del perfil. Contacta al administrador.</p>
          <a href="/">
            <span>volver</span>
          </a>
        </>
      );
    }

    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold border-b pb-2">
          Información de tu Perfil
        </h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <strong>Usuario:</strong> {data.username}
          </p>
          <p>
            <strong>Email:</strong> {data.email}
          </p>
          <p>
            <strong>Nombre:</strong> {data.firstName}
          </p>
          <p>
            <strong>Apellido:</strong> {data.lastName}
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-2xl font-semibold">Mis Proyectos</h2>
          <Link 
            to="/create-project" 
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            + Crear Proyecto
          </Link>
        </div>
        
        {/* --- 2. RENDERIZAR EL NUEVO COMPONENTE --- */}
        <MyProjectsList />
      </div>
      </div>
    );
  };

  return <div className="p-6">{renderContent()}</div>;
};

export default DeveloperDashboard;
