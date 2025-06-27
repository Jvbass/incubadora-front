import apiService from './apiService';
import type { DashboardData, ListProjects, ProjectFormInput } from '../types'; // Asumiendo que tienes estos tipos

/**
 * todas las funciones que llaman a la API
 */

// Obtiene la información para el dashboard del usuario logeado
export const fetchDashboardData = async (): Promise<DashboardData> => {
  const { data } = await apiService.get<DashboardData>('/dashboard');
  return data;
};

// Obtiene la lista de todos los proyectos.
export const fetchProjects = async (): Promise<ListProjects[]> => {
  // El backend devuelve un ListProjects para la lista
  const { data } = await apiService.get<ListProjects[]>('/projects');
  return data;
};

export const createProject = async (projectData: ProjectFormInput): Promise<ProjectFormInput> => {
  // El backend devuelve un ProjectResponseDto al crear
  const { data } = await apiService.post<ProjectFormInput>('/projects', projectData);
  return data;
};

