import { Routes, Route } from "react-router-dom";

// Importamos nuestros componentes de ayuda para el enrutamiento
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRedirect from "./RoleBasedRedirect";
import PublicRoute from "./PublicRoute";

// Importamos las páginas que vamos a usar en nuestras rutas
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DeveloperDashboard from "../pages/dashboard/DeveloperDashboard";
import NotFound from "../pages/NotFound";
import HomePage from "../pages/HomePage";
import AuthenticatedLayout from "../components/layout/AuthenticatedLayout";
import CreateProjectPage from "../pages/dashboard/CreateProjectPage";
import ProjectDetailPage from "../pages/ProjectDetailPage";
import ProfilePage from "../pages/profile/ProfilePage";
import EditProfilePage from "../pages/profile/EditProfilePage";

const AppRouter = () => {
  return (
    <Routes>
      {/* RUTA DE ENTRADA - Maneja tanto usuarios autenticados como no autenticados */}
      <Route path="/" element={<RoleBasedRedirect />} />
      {/* RUTAS PÚBLICAS (PROTEGIDAS PARA USUARIOS LOGUEADOS) */}
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
      {/**
       * RUTAS DE PERFIL
       */}
      <Route
        path="/profile/:slug"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <ProfilePage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <ProfilePage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <EditProfilePage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      /** * RUTA DE INICIO */
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
