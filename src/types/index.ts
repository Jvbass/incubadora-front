// src/types/index.ts

// Describe la estructura del payload decodificado del JWT que recibimos del backend.
// El backend nos devuelve 'sub' (subject, que es el username) y 'role'.
export interface DecodedToken {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

// Representa al objeto de usuario que manejaremos en el frontend.
// Lo simplificamos para tener solo la información que necesitamos directamente.
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

export interface UserData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface ListProjects { // Renombrado para mayor claridad
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

export interface Technology {
  id: number;
  name: string;
  techColor: string;
}
