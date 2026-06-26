import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";

// Importamos nuestros componentes de ayuda para el enrutamiento
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRedirect from "./RoleBasedRedirect";
import RoleProtectedRoute from "./RoleProtectedRoute";
import PublicRoute from "./PublicRoute";
import AuthenticatedLayout from "../components/layout/AuthenticatedLayout";
import Loading from "../components/ux/Loading";
import { routeImports } from "./routeImports";

// Páginas con lazy loading (C9): cada ruta genera su propio chunk.
// Los thunks viven en routeImports.ts para poder precargarlos on-hover (R6).
const LoginPage = lazy(routeImports.login);
const RegisterPage = lazy(routeImports.register);
const VerifyEmailPage = lazy(routeImports.verifyEmail);
const DeveloperDashboard = lazy(routeImports.developerDashboard);
const NotFound = lazy(routeImports.notFound);
const HomePage = lazy(routeImports.home);
const CreateProjectPage = lazy(routeImports.createProject);
const EditProjectPage = lazy(routeImports.editProject);
const ProjectDetailPage = lazy(routeImports.projectDetail);
const ProfilePage = lazy(routeImports.profile);
const EditProfilePage = lazy(routeImports.editProfile);
const PortfolioPage = lazy(routeImports.portfolio);
const AdminDashboard = lazy(routeImports.adminDashboard);
const CreateMentorshipPage = lazy(routeImports.createMentorship);
const MentoringListPage = lazy(routeImports.mentoringList);
const MentoringDetailPage = lazy(routeImports.mentoringDetail);
const EditMentorshipPage = lazy(routeImports.editMentorship);
const RecruiterDashboard = lazy(routeImports.recruiterDashboard);
const JobsListPage = lazy(routeImports.jobsList);

const LegacyProjectRedirect = () => {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/project/${slug}`} replace />;
};

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

        {/* RUTAS PROTEGIDAS — layout persistente (R2): nav y sidebar no se
            desmontan al navegar; el Suspense del contenido vive en el layout */}
        <Route
          element={
            <ProtectedRoute>
              <AuthenticatedLayout />
            </ProtectedRoute>
          }
        >
          {/* DEV · MENTOR · ADMINISTRATOR */}
          <Route
            path="/dashboard"
            element={
              <RoleProtectedRoute allowedRoles={['DEV', 'MENTOR', 'ADMINISTRATOR']}>
                <DeveloperDashboard />
              </RoleProtectedRoute>
            }
          />
          {/* Fusión (F-16): el dashboard de mentor ahora es el unificado. */}
          <Route
            path="/mentor-dashboard"
            element={
              <RoleProtectedRoute allowedRoles={['DEV', 'MENTOR', 'ADMINISTRATOR']}>
                <DeveloperDashboard />
              </RoleProtectedRoute>
            }
          />

          {/* ADMINISTRATOR solo */}
          <Route
            path="/admin"
            element={
              <RoleProtectedRoute allowedRoles={['ADMINISTRATOR']}>
                <AdminDashboard />
              </RoleProtectedRoute>
            }
          />

          {/* Compartidas: cualquier usuario autenticado (sin restricción de rol) */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<EditProfilePage />} />

          {/* DEV · MENTOR · ADMINISTRATOR */}
          <Route
            path="/home"
            element={
              <RoleProtectedRoute allowedRoles={['DEV', 'MENTOR', 'ADMINISTRATOR']}>
                <HomePage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/projects/new"
            element={
              <RoleProtectedRoute allowedRoles={['DEV', 'MENTOR', 'ADMINISTRATOR']}>
                <CreateProjectPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/projects/:slug/edit"
            element={
              <RoleProtectedRoute allowedRoles={['DEV', 'MENTOR', 'ADMINISTRATOR']}>
                <EditProjectPage />
              </RoleProtectedRoute>
            }
          />

          {/* Compartidas */}
          <Route path="/project/:slug" element={<ProjectDetailPage />} />
          {/* Redirección legacy: notificaciones antiguas guardadas en la BD
              apuntan a /proyect/{slug} (typo corregido el 2026-06-12) */}
          <Route path="/proyect/:slug" element={<LegacyProjectRedirect />} />

          {/* DEV · MENTOR · ADMINISTRATOR */}
          <Route
            path="/mentoring"
            element={
              <RoleProtectedRoute allowedRoles={['DEV', 'MENTOR', 'ADMINISTRATOR']}>
                <MentoringListPage />
              </RoleProtectedRoute>
            }
          />

          {/* MENTOR · ADMINISTRATOR (más específico antes que /mentoring/:slug) */}
          <Route
            path="/mentoring/new"
            element={
              <RoleProtectedRoute allowedRoles={['MENTOR', 'ADMINISTRATOR']}>
                <CreateMentorshipPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/mentoring/:slug/edit"
            element={
              <RoleProtectedRoute allowedRoles={['MENTOR', 'ADMINISTRATOR']}>
                <EditMentorshipPage />
              </RoleProtectedRoute>
            }
          />

          {/* DEV · MENTOR · ADMINISTRATOR */}
          <Route
            path="/mentoring/:slug"
            element={
              <RoleProtectedRoute allowedRoles={['DEV', 'MENTOR', 'ADMINISTRATOR']}>
                <MentoringDetailPage />
              </RoleProtectedRoute>
            }
          />

          {/* Compartida */}
          <Route path="/jobs" element={<JobsListPage />} />

          {/* RECRUITER · ADMINISTRATOR */}
          <Route
            path="/recruiter-dashboard"
            element={
              <RoleProtectedRoute allowedRoles={['RECRUITER', 'ADMINISTRATOR']}>
                <RecruiterDashboard />
              </RoleProtectedRoute>
            }
          />
        </Route>

        {/* RUTA PARA PÁGINAS NO ENCONTRADAS (404) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
