import apiService from "./apiService";
import type { CreateJobOfferRequest, JobOffer } from "../types";

export const fetchPublishedJobs = async (): Promise<JobOffer[]> => {
  const { data } = await apiService.get<JobOffer[]>("/jobs");
  return data;
};

export const fetchMyJobOffers = async (): Promise<JobOffer[]> => {
  const { data } = await apiService.get<JobOffer[]>("/jobs/my-offers");
  return data;
};

export const createJobOffer = async (
  request: CreateJobOfferRequest
): Promise<JobOffer> => {
  const { data } = await apiService.post<JobOffer>("/jobs", request);
  return data;
};

export const updateJobOffer = async (
  id: number,
  request: CreateJobOfferRequest
): Promise<JobOffer> => {
  const { data } = await apiService.put<JobOffer>(`/jobs/${id}`, request);
  return data;
};

export const publishJobOffer = async (id: number): Promise<JobOffer> => {
  const { data } = await apiService.patch<JobOffer>(`/jobs/${id}/publish`);
  return data;
};

export const closeJobOffer = async (id: number): Promise<JobOffer> => {
  const { data } = await apiService.patch<JobOffer>(`/jobs/${id}/close`);
  return data;
};
