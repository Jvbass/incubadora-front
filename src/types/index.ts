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

export interface UserProfileResponse {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

/*===================================================
* projects
===================================================*/
export interface ProjectSummary {
  id: number;
  slug: string;
  title: string;
  developerUsername: string;
  createdAt: string;
  technologies: Technology[];
  isCollaborative: boolean;
  needMentoring: boolean;
  status: string;
  developmentProgress: number;
}

export interface ProjectFormInput {
  title: string;
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