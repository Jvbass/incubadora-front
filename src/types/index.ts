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

export interface LoginRequest {
  username: string;
  password: string;
}

/*===================================================
* Profile
===================================================*/

export interface ProfileResponse {
  slug: string;
  firstName: string;
  lastName: string;
  headline: string;
  bio: string;
  email: string;
  publicProfile: boolean;
  techStack: Technology[];
  socialLinks: SocialLink[];
  workExperiences: WorkExperience[];
  languages: Language[];
  certificates: Certificate[];
  projects: ProjectSummary[];
  kudosReceived: KudoResponse[];
  feedbackGiven: FeedbackResponse[];
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
  publicProfile: boolean;
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
  technologies: Technology[];
  status: string;
  isCollaborative: boolean;
  needMentoring: boolean;
  developmentProgress: number;
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
  relatedProjectSlug: string;
  relatedProjectTitle: string;
  authorId: number;
  projectId: number;
  createdAt: string;
  updatedAt?: string;
}

export interface FeedbackRequest {
  feedbackDescription: string;
  rating: number;
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
  notificationId: number;
  type: string;
  applicant: {
    username: string;
    slug: string;
  };
  message: string;
  status: string;
  approveLink: string;
  rejectLink: string;
  createdAt: string;
}

export interface RejectRequest {
  reason: string;
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
  schedules: ScheduleSlotRequest[];
}

export interface MentorshipSummary {
  id: number;
  title: string;
  specialty: string;
  durationMinutes: number;
  platform: string;
  price?: number;
  isFree: boolean;
  mentorUsername: string;
  createdAt: string;
  status: "active" | "inactive" | "paused";
  totalBookings: number;
}

export interface MentorshipDetailResponse extends MentorshipSummary {
  description: string;
  timezone: string;
  schedules: ScheduleSlotResponse[];
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
