import { Navigate } from "react-router-dom";
import { useAuthZustand } from "../hooks/useAuthZustand";
import Loading from "../components/ux/Loading";
import { roleLandingPath } from "./roleLanding";

const RoleBasedRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuthZustand();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading message="Redirigiendo" />
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redireccionar según rol del usuario (single source of truth en roleLanding.ts).
  const path = user ? roleLandingPath(user.role) : "/login";

  // Usamos el componente Navigate de react-router-dom para hacer la redirección.
  return <Navigate to={path} replace />;
};

export default RoleBasedRedirect;
