import { apiGet } from "./client";
import type {
  ServiceListResponse,
  ServiceBaseResponse,
  ServiceStepsResponse,
  ServiceDocumentsResponse,
  ServiceFaqsResponse,
} from "../types/service";
import type { PublicLanguage } from "../utils/publicLanguage";

function withLanguageQuery(path: string, language?: PublicLanguage) {
  if (!language) return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}language=${encodeURIComponent(language)}`;
}

export async function fetchServices(params?: {
  page?: number;
  page_size?: number;
  category_id?: string;
  target_audience?: string;
  is_online_available?: boolean;
  search?: string;
  language?: PublicLanguage;
}): Promise<ServiceListResponse> {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.append("page", String(params.page));
  if (params?.page_size) searchParams.append("page_size", String(params.page_size));
  if (params?.category_id) searchParams.append("category_id", params.category_id);
  if (params?.target_audience) searchParams.append("target_audience", params.target_audience);
  if (typeof params?.is_online_available === "boolean") {
    searchParams.append("is_online_available", String(params.is_online_available));
  }
  if (params?.search) searchParams.append("search", params.search);
  if (params?.language) searchParams.append("language", params.language);

  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
  return apiGet<ServiceListResponse>(`/services${query}`);
}

export async function fetchServiceBySlug(
  slug: string,
  params?: { language?: PublicLanguage }
): Promise<ServiceBaseResponse> {
  return apiGet<ServiceBaseResponse>(withLanguageQuery(`/services/${slug}`, params?.language));
}

export async function fetchServiceSteps(
  slug: string,
  params?: { language?: PublicLanguage }
): Promise<ServiceStepsResponse> {
  return apiGet<ServiceStepsResponse>(withLanguageQuery(`/services/${slug}/steps`, params?.language));
}

export async function fetchServiceDocuments(
  slug: string,
  params?: { language?: PublicLanguage }
): Promise<ServiceDocumentsResponse> {
  return apiGet<ServiceDocumentsResponse>(withLanguageQuery(`/services/${slug}/documents`, params?.language));
}

export async function fetchServiceFaqs(
  slug: string,
  params?: { language?: PublicLanguage }
): Promise<ServiceFaqsResponse> {
  return apiGet<ServiceFaqsResponse>(withLanguageQuery(`/services/${slug}/faqs`, params?.language));
}
