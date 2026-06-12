// Thunks de import por ruta (rediseño v2, SDD §12.3 R6).
// El router crea sus React.lazy() a partir de estos thunks y los links de
// navegación los reutilizan en onMouseEnter/onFocus para precargar el chunk
// de la ruta antes del click (Vite deduplica: mismo specifier = mismo chunk).
export const routeImports = {
  login: () => import("../features/auth/pages/LoginPage"),
  register: () => import("../features/auth/pages/RegisterPage"),
  verifyEmail: () => import("../features/auth/pages/VerifyEmailPage"),
  developerDashboard: () =>
    import("../features/dashboard/pages/DeveloperDashboard"),
  notFound: () => import("../pages/NotFound"),
  home: () => import("../features/projects/pages/HomePage"),
  createProject: () => import("../features/projects/pages/CreateProjectPage"),
  editProject: () => import("../features/projects/pages/EditProjectPage"),
  projectDetail: () => import("../features/projects/pages/ProjectDetailPage"),
  profile: () => import("../features/profile/pages/ProfilePage"),
  editProfile: () => import("../features/profile/pages/EditProfilePage"),
  portfolio: () => import("../features/profile/pages/PortfolioPage"),
  adminDashboard: () => import("../features/admin/pages/AdminDashboard"),
  createMentorship: () =>
    import("../features/mentoring/pages/CreateMentorshipPage"),
  mentoringList: () => import("../features/mentoring/pages/MentoringListPage"),
  mentoringDetail: () =>
    import("../features/mentoring/pages/MentoringDetailPage"),
  editMentorship: () =>
    import("../features/mentoring/pages/EditMentorshipPage"),
} as const;
