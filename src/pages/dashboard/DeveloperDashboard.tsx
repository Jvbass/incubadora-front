import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../api/apiService';
import type { DashboardData } from '../../types';
import toast from 'react-hot-toast';

const DeveloperDashboard = () => {
  const { user, logout } = useAuth();
  
  // Estados para manejar la carga de datos y los datos en sí.
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect se ejecuta cuando el componente se monta.
  // Es el lugar perfecto para hacer llamadas a la API.
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Hacemos la llamada al endpoint protegido. El interceptor se encargará del token.
        const response = await apiService.get<DashboardData>('/dashboard'); //get viene de axios
        setData(response.data); // Guardamos los datos en el estado
      } catch (error) {
        // El interceptor de respuesta ya maneja los errores 401/403.
        // Aquí podemos manejar otros errores si es necesario.
        console.error("Error al cargar datos del dashboard:", error);
        toast.error('No se pudieron cargar los datos del dashboard.');
      } finally {
        // Pase lo que pase, dejamos de cargar.
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // El array vacío [] asegura que se ejecute solo una vez.

  // Renderizado condicional basado en el estado de carga
  if (isLoading) {
    return <div className="p-8">Cargando datos del dashboard...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard del Desarrollador</h1>
        <button
          onClick={logout}
          className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
        >
          Cerrar Sesión
        </button>
      </div>

      {data ? (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold border-b pb-2">Tu Información</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>Usuario:</strong> {data.username}</p>
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>Nombre:</strong> {data.firstName}</p>
            <p><strong>Apellido:</strong> {data.lastName}</p>
            <p><strong>Rol:</strong> {data.role}</p>
          </div>
        </div>
      ) : (
        <p className="text-red-500">No se pudo cargar la información del perfil.</p>
      )}

      {/* Aquí podrías añadir más componentes, como una lista de tus proyectos, etc. */}
    </div>
  );
};

export default DeveloperDashboard;
