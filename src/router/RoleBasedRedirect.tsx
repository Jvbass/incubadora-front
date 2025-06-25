import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Este componente no renderiza UI. Su única función es redirigir.
const RoleBasedRedirect = () => {
  const { user } = useAuth();

  // Mapeo de roles a las rutas de sus dashboards.
  const roleToPathMap: { [key: string]: string } = {
    'Desarrollador': '/home',
    'Administrador': '/admin',
    'Mentor': '/mentor',
    'Reclutador': '/recruiter',
  };

  // Obtenemos la ruta correspondiente al rol del usuario.
  // Si el rol no existe en nuestro mapa, lo mandamos al login por seguridad.
  const path = user ? roleToPathMap[user.role] || '/login' : '/login';

  // Usamos el componente Navigate de react-router-dom para hacer la redirección.
  return <Navigate to={path} replace />;
};

export default RoleBasedRedirect;