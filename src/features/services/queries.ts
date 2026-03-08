import { useQuery } from "@tanstack/react-query";
import {
  fetchServices,
  fetchServiceBySlug,
  fetchServiceSteps,
  fetchServiceDocuments,
  fetchServiceFaqs,
} from "../../api/services";
import type { PublicLanguage } from "../../utils/publicLanguage";

export function useServices(params?: {
  page?: number;
  page_size?: number;
  category_id?: string;
  target_audience?: string;
  is_online_available?: boolean;
  search?: string;
  language?: PublicLanguage;
}) {
  return useQuery({
    queryKey: ["services", params],
    queryFn: () => fetchServices(params),
  });
}

export function useService(slug: string, params?: { language?: PublicLanguage }) {
  return useQuery({
    queryKey: ["service", slug, params],
    queryFn: () => fetchServiceBySlug(slug, params),
    enabled: !!slug,
  });
}

export function useServiceSteps(slug: string, params?: { language?: PublicLanguage }) {
  return useQuery({
    queryKey: ["serviceSteps", slug, params],
    queryFn: () => fetchServiceSteps(slug, params),
    enabled: !!slug,
  });
}

export function useServiceDocuments(slug: string, params?: { language?: PublicLanguage }) {
  return useQuery({
    queryKey: ["serviceDocuments", slug, params],
    queryFn: () => fetchServiceDocuments(slug, params),
    enabled: !!slug,
  });
}

export function useServiceFaqs(slug: string, params?: { language?: PublicLanguage }) {
  return useQuery({
    queryKey: ["serviceFaqs", slug, params],
    queryFn: () => fetchServiceFaqs(slug, params),
    enabled: !!slug,
  });
}
