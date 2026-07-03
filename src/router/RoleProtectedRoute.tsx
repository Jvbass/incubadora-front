import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthZustand } from '../hooks/useAuthZustand';
import Loading from '../components/ux/Loading';
import { roleLandingPath } from './roleLanding';

interface RoleProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

/**
 * Guarda de ruta por rol. Si el usuario autenticado no tiene un rol incluido
 * en allowedRoles, dispara un toast (dentro de useEffect, nunca durante el
 * render) y redirige al landing propio del usuario para evitar bucles.
 */
const RoleProtectedRoute = ({ allowedRoles, children }: RoleProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuthZustand();
  const location = useLocation();
  const toastFiredRef = useRef(false);

  // Evaluar condición de acceso no autorizado solo cuando la auth ya está lista
  const unauthorized = !isLoading && isAuthenticated && !!user && !allowedRoles.includes(user.role);

  useEffect(() => {
    if (unauthorized && !toastFiredRef.current) {
      toastFiredRef.current = true;
      toast.error('No autorizado');
    }
  }, [unauthorized]);

  if (isLoading) {
    return <Loading message="Verificando permisos" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated but user object not yet available — prevent silent bypass to children
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // El destino es siempre el landing propio del usuario → no puede generar bucle
    return <Navigate to={roleLandingPath(user.role)} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
