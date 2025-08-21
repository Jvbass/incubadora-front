/*===================================================
* auth & user
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
* profile
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
  kudosReceived: KudosReceived[];
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
* projects
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

export interface ProjectFormInput {
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

export interface ProjectModalProps {
  projectSlug: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface Technology {
  id: number;
  name: string;
  techColor: string;
}

/*===================================================
 * feedback
 *===================================================*/
export interface FeedbackResponse {
  id: number;
  feedbackDescription: string;
  rating: number;
  author: string;
  authorId: number;
  projectId: number;
  createdAt: string;
  updatedAt?: string;
}

export interface FeedbackRequest {
  feedbackDescription: string;
  rating: number;
}

export interface KudosReceived {
  id: number;
  message: string;
  isPublic: boolean;
  createdAt: string;
  senderUsername: string;
  receiverUsername: string;
  relatedProjectSlug: string;
  relatedProjectTitle: string;
}

/*===================================================
 * comments
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
 * Notifications
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
