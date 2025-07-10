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

export interface UserProfileResponse  {
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
  projectId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface Technology {
  id: number;
  name: string;
  techColor: string;
}

