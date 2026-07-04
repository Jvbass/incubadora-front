/*===================================================
* Auth & User
===================================================*/
export interface DecodedToken {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

export interface User {
  username: string;
  role: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

/*===================================================
* Profile
===================================================*/

/** Modos de visibilidad del perfil/portafolio (matriz de acceso). */
export type ProfileVisibility =
  | "PUBLIC"
  | "INCUBADORA"
  | "APPLICANT"
  | "PRIVATE";

export interface ProfileVisibilityOption {
  value: ProfileVisibility;
  label: string;
  description: string;
}

/** Opciones del selector de visibilidad, con etiqueta y descripción corta. */
export const PROFILE_VISIBILITY_OPTIONS: ProfileVisibilityOption[] = [
  {
    value: "PUBLIC",
    label: "Público",
    description:
      "Cualquier persona en internet puede ver tu portafolio, incluso sin cuenta.",
  },
  {
    value: "INCUBADORA",
    label: "Solo Incubadora",
    description:
      "Solo usuarios logueados en la plataforma pueden ver tu portafolio.",
  },
  {
    value: "APPLICANT",
    label: "Postulante",
    description:
      "Cualquier reclutador de la plataforma puede ver tu portafolio (además de administradores).",
  },
  {
    value: "PRIVATE",
    label: "Privado",
    description: "Nadie más puede ver tu portafolio; solo vos.",
  },
];

export interface ProfileResponse {
  slug: string;
  firstName: string;
  lastName: string;
  headline: string;
  bio: string;
  avatarUrl?: string;
  avatarThumbnailUrl?: string;
  bioImageUrl?: string;
  email: string;
  profileVisibility: ProfileVisibility;
  techStack: Technology[];
  socialLinks: SocialLink[];
  workExperiences: WorkExperience[];
  languages: Language[];
  certificates: Certificate[];
  projects: ProjectSummary[];
  kudosReceived: KudoResponse[];
  feedbackGiven: FeedbackResponse[];
  kudosGiven: KudoResponse[];
  feedbackReceived: FeedbackResponse[];
  stats?: ProfileStats;
  role?: string;
}

export interface ProfileStats {
  totalProjects: number;
  totalFeedbacksGiven: number;
  totalFeedbacksReceived: number;
  totalKudosReceived: number;
  totalKudosGiven: number;
  avgProjectRating: number;
  score: number;
}

export interface ImageUploadResponse {
  imageUrl: string;
  thumbnailUrl: string | null;
}

export interface UserResponse {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
}

export interface WorkExperience {
  id: number;
  companyName: string;
  position: string;
  description: string;
  startYear: number;
  endYear?: number;
}

export interface Language {
  id: number;
  language: string;
  proficiency: string;
}

export interface Certificate {
  id: number;
  name: string;
  imageUrl: string;
  certificateUrl: string;
}

export interface ProfileUpdateRequest {
  headline: string;
  slug: string;
  bio: string;
  profileVisibility: ProfileVisibility;
  socialLinks: Omit<SocialLink, "id">[];
  techStackIds: number[];
  workExperiences: Omit<WorkExperience, "id">[];
  languages: Omit<Language, "id">[];
  certificates: Omit<Certificate, "id">[];
}

/*===================================================
* Projects
===================================================*/
export interface ProjectSummary {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  developerUsername: string;
  createdAt: string;
  technologies: Technology[];
  isCollaborative: boolean;
  needMentoring: boolean;
  status: string;
  developmentProgress: number;
  feedbackCount: number;
  averageRating: number;
  imageThumbnailUrl?: string;
}

export type SortByType = "LATEST" | "MOST_FEEDBACK" | "TOP_RATED";

export interface CreateProjectRequest {
  title: string;
  subtitle: string;
  description: string;
  repositoryUrl: string;
  projectUrl: string;
  technologyIds: number[];
  status: "pending" | "published" | "archived";
  isCollaborative: boolean;
  needMentoring: boolean;
  developmentProgress: number;
}

export interface ProjectDetailResponse {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  repositoryUrl: string;
  projectUrl: string;
  createdAt: string;
  developerUsername: string;
  developerSlug?: string;
  technologies: Technology[];
  status: string;
  isCollaborative: boolean;
  needMentoring: boolean;
  developmentProgress: number;
  imageUrl?: string;
  imageThumbnailUrl?: string;
  currentVersion?: string | null;
}

export interface Technology {
  id: number;
  name: string;
  techColor: string;
}

/*===================================================
 * Feedback
 *===================================================*/
export interface FeedbackResponse {
  id: number;
  feedbackDescription: string;
  rating: number;
  author: string;
  authorAvatarThumbnailUrl?: string;
  relatedProjectSlug: string;
  relatedProjectTitle: string;
  authorId: number;
  projectId: number;
  createdAt: string;
  updatedAt?: string;
  upvoteCount: number;
  upvotedByMe: boolean;
  markedByOwner: boolean;
  projectVersion?: string | null;
}

export interface FeedbackRequest {
  feedbackDescription: string;
  rating: number;
  categoryIds?: number[];
}

export interface Category {
  id: number;
  name: string;
}

/*===================================================
 * Reportes de contenido
 *===================================================*/

export type ReportContentType =
  | "PROJECT"
  | "FEEDBACK"
  | "FEEDBACK_COMMENT"
  | "KUDO_COMMENT";

export type ReportReason =
  | "SPAM"
  | "CONTENIDO_INAPROPIADO"
  | "PLAGIO"
  | "INFORMACION_FALSA"
  | "OTRO";

export interface CreateReportRequest {
  contentType: ReportContentType;
  contentId: number;
  reason: ReportReason;
  description: string;
}

export type ReportStatus =
  | "PENDING"
  | "IN_REVIEW"
  | "RESOLVED"
  | "REJECTED"
  | "ESCALATED";

/** Estado de la cuenta del autor del contenido reportado. */
export type AccountStatus = "ACTIVE" | "SUSPENDED" | "DELETED";

/** Vista admin de un reporte, con el contenido resuelto por el backend. */
export interface AdminReport {
  id: number;
  reporterUsername: string;
  contentType: ReportContentType;
  contentId: number;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  createdAt: string;
  contentLabel: string;
  contentLink: string | null;
  contentAuthorUsername: string | null;
  adminMessage?: string | null;
  contentAuthorAccountStatus: AccountStatus | null;
}

/** Entrada del registro de moderación (audit trail). */
export interface ModerationAction {
  id: number;
  actionType: string;
  adminUsername: string;
  note?: string | null;
  createdAt: string;
}

/** Detalle enriquecido de un reporte: reporte + historial + similares + audit trail. */
export interface ReportDetail {
  report: AdminReport;
  infractionHistory: AdminReport[];
  similarReports: AdminReport[];
  auditTrail: ModerationAction[];
}

/*===================================================
 * Jobs / Recruiter
 *===================================================*/

export type JobOfferStatus = "DRAFT" | "PUBLISHED" | "CLOSED";

export interface JobOffer {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  salaryRange: string | null;
  requirements: string | null;
  status: JobOfferStatus;
  recruiterUsername: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobOfferRequest {
  title: string;
  description: string;
  company: string;
  location: string;
  salaryRange?: string;
  requirements?: string;
}

/*===================================================
 * Kudos
 *===================================================*/

export interface KudoResponse {
  id: number;
  message: string;
  isPublic: boolean;
  createdAt: string;
  senderUsername: string;
  senderAvatarThumbnailUrl?: string;
  receiverUsername: string;
  relatedProjectSlug: string;
  relatedProjectTitle: string;
}

export interface KudoPost {
  receiverSlug: string;
  message: string;
  relatedProjectId?: number;
}

/*===================================================
 * Comments // Comentarios
 *===================================================*/
export interface CommentAuthor {
  username: string;
  slug?: string;
  avatarThumbnailUrl?: string;
}

export interface CommentResponse {
  id: number;
  content: string;
  author: CommentAuthor;
  createdAt: string;
  replies: CommentResponse[];
}

export interface CommentRequest {
  content: string;
  parentCommentId?: number;
}

/*===================================================
 * Notifications // Notificaciones
 *===================================================*/
export interface Notification {
  id: number;
  notificationType: string;
  message: string;
  link: string;
  createdAt: string;
  timeAgo: string;
  read: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

/*===================================================
 * Mentor Upgrade Request // Solicitud de mentor
 *===================================================*/

export interface MentorRequest {
  id: number;
  userSlug: string;
  username: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  publishedProjectCount: number;
  createdAt: string;
}

/*===================================================
 * Mentorship // Mentorias
 *===================================================*/

export interface ScheduleSlotRequest {
  dayOfWeek: string; // "MONDAY", "TUESDAY", etc.
  startTime: string; // "09:00"
  endTime: string; // "10:00"
}

export interface CreateMentorshipRequest {
  title: string;
  description: string;
  specialty: string;
  durationMinutes: number;
  platform: "zoom" | "meet" | "discord" | "teams" | "other";
  timezone: string;
  price?: number;
  isFree: boolean;
  tags?: string[];
  schedules: ScheduleSlotRequest[];
}

export interface MentorshipSummaryResponse {
  id: number;
  slug: string;
  mentorName: string;
  title: string;
  mentorshipState: "PUBLISHED" | "ARCHIVED";
  specialty: string;
  price?: number;
  isFree?: boolean;
  tags?: string[];
  imageUrl?: string;
  imageThumbnailUrl?: string;
}

export interface MentorshipDetailResponse extends MentorshipSummaryResponse {
  mentorId?: number;
  description: string;
  durationMinutes: number;
  platform: string;
  timezone: string;
  createdAt?: string;
  updatedAt?: string;
  schedules?: ScheduleSlotResponse[];
}

/*===================================================
 * Mentoring Public (published list/detail)
 *===================================================*/
export interface MentoringListItemResponse {
  id: number;
  slug: string;
  title: string;
  specialty: string;
  mentorName?: string;
  durationMinutes?: number;
  platform?: string;
  price?: number;
  isFree: boolean;
  mentorUsername: string;
  mentorSlug?: string;
  tags?: string[];
  sessionType?: "SINGLE" | "PACKAGE";
  createdAt?: string;
  imageThumbnailUrl?: string;
}

export interface MentoringPublicDetailResponse extends MentoringListItemResponse {
  description: string;
  timezone: string;
  schedules?: ScheduleSlotResponse[];
}

export interface PagedMentoringResponse {
  content: MentoringListItemResponse[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ScheduleSlotResponse {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

// Constantes para las opciones de plataforma
export const PLATFORM_OPTIONS = [
  { value: "zoom", label: "Zoom" },
  { value: "meet", label: "Google Meet" },
  { value: "discord", label: "Discord" },
  { value: "teams", label: "Microsoft Teams" },
  { value: "other", label: "Otra" },
] as const;

// Constantes para los días de la semana
export const DAYS_OF_WEEK = [
  { value: "MONDAY", label: "Lunes" },
  { value: "TUESDAY", label: "Martes" },
  { value: "WEDNESDAY", label: "Miércoles" },
  { value: "THURSDAY", label: "Jueves" },
  { value: "FRIDAY", label: "Viernes" },
  { value: "SATURDAY", label: "Sábado" },
  { value: "SUNDAY", label: "Domingo" },
] as const;
