import apiService from "./apiService";
import type { ProjectSummary } from "../types";

export interface FollowStatus {
  following: boolean;
  followers: number;
}

export interface FollowedUser {
  firstName: string;
  lastName: string;
  slug: string;
  avatarUrl: string | null;
}

// ─── Usuarios ────────────────────────────────────────────────────────────────
export const getUserFollowStatus = async (slug: string): Promise<FollowStatus> =>
  (await apiService.get<FollowStatus>(`/follows/users/${slug}/status`)).data;

export const followUser = async (slug: string): Promise<FollowStatus> =>
  (await apiService.post<FollowStatus>(`/follows/users/${slug}`)).data;

export const unfollowUser = async (slug: string): Promise<FollowStatus> =>
  (await apiService.delete<FollowStatus>(`/follows/users/${slug}`)).data;

export const getFollowedUsers = async (): Promise<FollowedUser[]> =>
  (await apiService.get<FollowedUser[]>(`/follows/me/users`)).data;

// ─── Proyectos ───────────────────────────────────────────────────────────────
export const getProjectFollowStatus = async (slug: string): Promise<FollowStatus> =>
  (await apiService.get<FollowStatus>(`/follows/projects/${slug}/status`)).data;

export const followProject = async (slug: string): Promise<FollowStatus> =>
  (await apiService.post<FollowStatus>(`/follows/projects/${slug}`)).data;

export const unfollowProject = async (slug: string): Promise<FollowStatus> =>
  (await apiService.delete<FollowStatus>(`/follows/projects/${slug}`)).data;

export const getFollowedProjects = async (): Promise<ProjectSummary[]> =>
  (await apiService.get<ProjectSummary[]>(`/follows/me/projects`)).data;
