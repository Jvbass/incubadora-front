import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Importamos nuestros componentes de ayuda para el enrutamiento
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRedirect from "./RoleBasedRedirect";
import PublicRoute from "./PublicRoute";
import AuthenticatedLayout from "../components/layout/AuthenticatedLayout";
import Loading from "../components/ux/Loading";

// Páginas con lazy loading (C9): cada ruta genera su propio chunk,
// lo que reduce el bundle inicial (el editor markdown es especialmente pesado).
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("../features/auth/pages/RegisterPage"));
const VerifyEmailPage = lazy(() => import("../features/auth/pages/VerifyEmailPage"));
const DeveloperDashboard = lazy(() => import("../features/dashboard/pages/DeveloperDashboard"));
const NotFound = lazy(() => import("../pages/NotFound"));
const HomePage = lazy(() => import("../features/projects/pages/HomePage"));
const CreateProjectPage = lazy(() => import("../features/projects/pages/CreateProjectPage"));
const EditProjectPage = lazy(() => import("../features/projects/pages/EditProjectPage"));
const ProjectDetailPage = lazy(() => import("../features/projects/pages/ProjectDetailPage"));
const ProfilePage = lazy(() => import("../features/profile/pages/ProfilePage"));
const EditProfilePage = lazy(() => import("../features/profile/pages/EditProfilePage"));
const PortfolioPage = lazy(() => import("../features/profile/pages/PortfolioPage"));
const AdminDashboard = lazy(() => import("../features/admin/pages/AdminDashboard"));
const CreateMentorshipPage = lazy(() => import("../features/mentoring/pages/CreateMentorshipPage"));
const MentoringListPage = lazy(() => import("../features/mentoring/pages/MentoringListPage"));
const MentoringDetailPage = lazy(() => import("../features/mentoring/pages/MentoringDetailPage"));
const EditMentorshipPage = lazy(() => import("../features/mentoring/pages/EditMentorshipPage"));

const AppRouter = () => {
  return (
    <Suspense fallback={<Loading message="Cargando" />}>
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
      <Route
        path="/verify-email"
        element={
          <PublicRoute>
            <VerifyEmailPage />
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
    </Suspense>
  );
};

export default AppRouter;
