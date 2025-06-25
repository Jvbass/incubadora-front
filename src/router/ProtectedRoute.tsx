
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Este componente envuelve las rutas que queremos proteger.
// React.ReactNode es un tipo que representa cualquier tipo de contenido react válido.
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation(); // Obtiene la ruta actual

  // Si aún estamos cargando y verificando el estado de autenticación,
  // mostramos un mensaje para evitar un "parpadeo" en la UI.
  if (isLoading) {
    return <div>Verificando autenticación...</div>;
  }

  // Si el usuario no está autenticado, lo redirigimos a la página de login.
  // Guardamos la ubicación original para poder redirigirlo de vuelta después del login.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  

  // Si el usuario está autenticado, renderizamos el componente hijo (la página protegida).
  return <>{children}</>;
};

export default ProtectedRoute;