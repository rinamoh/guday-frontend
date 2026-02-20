import { apiGet } from "./client";
import type { ServiceSummary, ServiceDetail } from "../types/service";

// export async function fetchServices(): Promise<ServiceSummary[]> {
//   const res = await apiGet<{ data: { services: ServiceSummary[] } }>(
//     "/services?page=1&limit=10"
//   );
//   return res.data.services;
// }

// export async function fetchServiceBySlug(
//   slug: string
// ): Promise<ServiceDetail> {
//   const res = await apiGet<{ data: ServiceDetail }>(
//     `/services/${slug}`
//   );
//   return res.data;
// }

import type {
  ServiceListResponse,
  ServiceBaseResponse,
  ServiceStepsResponse,
  ServiceDocumentsResponse,
  ServiceFaqsResponse,
} from '../types/service';

export async function fetchServices(params?: {
  page?: number;
  page_size?: number; // Changed from limit to page_size
  category_id?: string; // Changed from category to category_id
  target_audience?: string;
  is_online_available?: boolean;
  search?: string;
}): Promise<ServiceListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.page_size) searchParams.append('page_size', params.page_size.toString()); // Changed from limit
  if (params?.category_id) searchParams.append('category_id', params.category_id); // Changed from category
  if (params?.target_audience) searchParams.append('target_audience', params.target_audience);
  if (params?.is_online_available) searchParams.append('is_online_available', params.is_online_available.toString());
  if (params?.search) searchParams.append('search', params.search);

  const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
  return apiGet<ServiceListResponse>(`/services${query}`);
}



export async function fetchServiceBySlug(slug: string): Promise<ServiceBaseResponse> {
  return apiGet<ServiceBaseResponse>(`/services/${slug}`);
}

export async function fetchServiceSteps(slug: string): Promise<ServiceStepsResponse> {
  return apiGet<ServiceStepsResponse>(`/services/${slug}/steps`);
}

export async function fetchServiceDocuments(slug: string): Promise<ServiceDocumentsResponse> {
  return apiGet<ServiceDocumentsResponse>(`/services/${slug}/documents`);
}

export async function fetchServiceFaqs(slug: string): Promise<ServiceFaqsResponse> {
  return apiGet<ServiceFaqsResponse>(`/services/${slug}/faqs`);
}