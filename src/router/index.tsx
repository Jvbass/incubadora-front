import { Routes, Route } from "react-router-dom";

// Importamos nuestros componentes de ayuda para el enrutamiento
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRedirect from "./RoleBasedRedirect";

// --- Importamos los componentes de las PÁGINAS ---
// (Crearemos estos componentes placeholder en el siguiente paso)
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DeveloperDashboard from "../pages/dashboard/DeveloperDashboard";
import NotFound from "../pages/NotFound";
import PublicRoute from "./PublicRoute";
import HomePage from "../pages/HomePage";
import AuthenticatedLayout from "../components/layout/AuthenticatedLayout";
import CreateProjectPage from "../pages/dashboard/CreateProjectPage";
import ProjectDetailPage from "../pages/ProjectDetailPage";

const AppRouter = () => {
  return (
    <Routes>
      {/* RUTAS PÚBLICAS (AHORA PROTEGIDAS PARA USUARIOS LOGUEADOS) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* RUTA DE ENTRADA - Maneja tanto usuarios autenticados como no autenticados */}
      <Route
        path="/"
        element={<RoleBasedRedirect />}
      />
      {/* RUTAS DE DASHBOARDS PROTEGIDAS */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <DeveloperDashboard />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <HomePage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-project"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <CreateProjectPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/project/:projectSlug"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <ProjectDetailPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      {/* RUTA PARA PÁGINAS NO ENCONTRADAS (404) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
