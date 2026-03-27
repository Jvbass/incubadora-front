import { Routes, Route } from "react-router-dom";

// Importamos nuestros componentes de ayuda para el enrutamiento
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRedirect from "./RoleBasedRedirect";
import PublicRoute from "./PublicRoute";

// Importamos las páginas que vamos a usar en nuestras rutas
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import DeveloperDashboard from "../features/dashboard/pages/DeveloperDashboard";
import NotFound from "../pages/NotFound";
import HomePage from "../features/projects/pages/HomePage";
import AuthenticatedLayout from "../components/layout/AuthenticatedLayout";
import CreateProjectPage from "../features/projects/pages/CreateProjectPage";
import EditProjectPage from "../features/projects/pages/EditProjectPage";
import ProjectDetailPage from "../features/projects/pages/ProjectDetailPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import EditProfilePage from "../features/profile/pages/EditProfilePage";
import PortfolioPage from "../features/profile/pages/PortfolioPage";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import CreateMentorshipPage from "../features/mentoring/pages/CreateMentorshipPage";
import MentoringListPage from "../features/mentoring/pages/MentoringListPage";
import MentoringDetailPage from "../features/mentoring/pages/MentoringDetailPage";
import EditMentorshipPage from "../features/mentoring/pages/EditMentorshipPage";

const AppRouter = () => {
  return (
    <Routes>
      {/* RUTA DE ENTRADA - Maneja tanto usuarios autenticados como no autenticados */}
      <Route path="/" element={<RoleBasedRedirect />} />

      {/* RUTAS PÚBLICAS (para usuarios no logueados) */}
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

      {/* RUTA PÚBLICA — Portfolio de usuario (sin autenticación requerida) */}
      <Route path="/portfolio/:slug" element={<PortfolioPage />} />

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

      {/* RUTA DE ADMINISTRADOR */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <AdminDashboard />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      {/* RUTAS DE PERFIL */}
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
        path="/settings"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <EditProfilePage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      {/* RUTA DE INICIO */}
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

      {/* RUTAS DE PROYECTOS */}
      <Route
        path="/projects/new"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <CreateProjectPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:slug/edit"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <EditProjectPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/proyect/:slug"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <ProjectDetailPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      {/* RUTAS DE MENTORING */}
      <Route
        path="/mentoring"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <MentoringListPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentoring/new"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <CreateMentorshipPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentoring/:slug/edit"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <EditMentorshipPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentoring/:slug"
        element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <MentoringDetailPage />
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
