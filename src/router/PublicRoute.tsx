// src/router/PublicRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Este componente es el opuesto a ProtectedRoute.
// Envuelve las rutas que solo deben ser visibles para usuarios NO autenticados.
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Igual que en ProtectedRoute, esperamos si la autenticación está en proceso.
  if (isLoading) {
    return <div>Verificando autenticación...</div>;
  }

  // Si el usuario SÍ está autenticado, no debe ver esta página (ej. Login).
  // Lo redirigimos a la ruta raíz para que RoleBasedRedirect lo lleve a su dashboard.
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si no está autenticado, le permitimos ver el componente hijo (la página pública).
  return <>{children}</>;
};

export default PublicRoute;