// Describe la estructura del payload decodificado del JWT que recibimos del backend.
// El backend nos devuelve 'sub' (subject, que es el username) y 'role'.
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

export interface UserData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface ListProjects { 
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

export interface ProjectDetail {
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

/*
    private Integer id;
    private String title;
    private String description;
    private String repositoryUrl;
    private String projectUrl;
    private Timestamp createdAt;
    private String developerUsername;
    private Set<TechnologyDto> technologies;
    private String status;
    private Boolean isCollaborative;
    private Boolean needMentoring = false;
    private Byte developmentProgress;
*/

export interface Technology {
  id: number;
  name: string;
  techColor: string;
}
