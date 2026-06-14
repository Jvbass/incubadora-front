import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";

// Importamos nuestros componentes de ayuda para el enrutamiento
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRedirect from "./RoleBasedRedirect";
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
const MentorDashboard = lazy(routeImports.mentorDashboard);
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
          <Route path="/dashboard" element={<DeveloperDashboard />} />
          <Route path="/mentor-dashboard" element={<MentorDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<EditProfilePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/projects/new" element={<CreateProjectPage />} />
          <Route path="/projects/:slug/edit" element={<EditProjectPage />} />
          <Route path="/project/:slug" element={<ProjectDetailPage />} />
          {/* Redirección legacy: notificaciones antiguas guardadas en la BD
              apuntan a /proyect/{slug} (typo corregido el 2026-06-12) */}
          <Route path="/proyect/:slug" element={<LegacyProjectRedirect />} />
          <Route path="/mentoring" element={<MentoringListPage />} />
          <Route path="/mentoring/new" element={<CreateMentorshipPage />} />
          <Route
            path="/mentoring/:slug/edit"
            element={<EditMentorshipPage />}
          />
          <Route path="/mentoring/:slug" element={<MentoringDetailPage />} />
          <Route path="/jobs" element={<JobsListPage />} />
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        </Route>

        {/* RUTA PARA PÁGINAS NO ENCONTRADAS (404) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
