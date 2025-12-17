import { Navigate } from "react-router-dom";
import { useAuthZustand } from "../hooks/useAuthZustand";
import Loading from "../components/ux/Loading";

// Redirigir al usuario segun su rol
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

  // Mapeo segun rol del usuario.
  const roleToPathMap: { [key: string]: string } = {
    dev: "/home",
    mentor: "/dashboard",
    administrator: "/admin",
    // reclutador: "/recruiter",
  };

  // Si el rol no existe en nuestro mapa, lo mandamos al login por seguridad.
  const path = user ? roleToPathMap[user.role] || "/login" : "/login";

  // Usamos el componente Navigate de react-router-dom para hacer la redirección.
  return <Navigate to={path} replace />;
};

export default RoleBasedRedirect;
