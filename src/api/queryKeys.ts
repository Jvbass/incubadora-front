/**
 * Claves de query centralizadas para TanStack React Query.
 * Úsalas en lugar de strings literales para evitar inconsistencias.
 */
export const queryKeys = {
  // Auth / usuario
  userData: () => ["userData"] as const,

  // Perfil
  userProfile: () => ["userProfile"] as const,
  publicProfile: (slug: string) => ["publicProfile", slug] as const,
  portfolio: (slug: string) => ["portfolio", slug] as const,
  profile: (slug: string | undefined) => ["profile", slug] as const,

  // Proyectos
  projects: (sortBy?: string) =>
    sortBy ? (["projects", sortBy] as const) : (["projects"] as const),
  myProjects: () => ["myProjects"] as const,
  projectDetail: (slug: string | undefined) =>
    ["projectDetail", slug] as const,

  // Mentorías (gestión del mentor)
  myMentorships: () => ["myMentorships"] as const,
  mentorship: (id: number | null) => ["mentorship", id] as const,

  // Mentorings (catálogo público)
  mentoringsList: (page: number, tag?: string) =>
    ["mentorings", "list", page, tag] as const,
  mentoringDetail: (slug: string | undefined) =>
    ["mentorings", "detail", slug] as const,

  // Feedback y comentarios
  feedback: (projectSlug: string | undefined) =>
    ["feedback", projectSlug] as const,
  comments: (feedbackId: number) => ["comments", feedbackId] as const,
  categories: () => ["categories"] as const,

  // Notificaciones
  notifications: () => ["notifications"] as const,
  notificationsUnreadCount: () => ["notifications", "unread-count"] as const,

  // Admin
  mentorRequests: (filter?: string) =>
    filter
      ? (["mentorRequests", filter] as const)
      : (["mentorRequests"] as const),

  // Tecnologías
  technologies: () => ["technologies"] as const,
};
