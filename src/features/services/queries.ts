import { useQuery } from '@tanstack/react-query';
import {
  fetchServices,
  fetchServiceBySlug,
  fetchServiceSteps,
  fetchServiceDocuments,
  fetchServiceFaqs,
} from '../../api/services';

export function useServices(params?: {
  page?: number;
  page_size?: number; // Changed from limit
  category_id?: string; // Changed from category
  target_audience?: string;
  is_online_available?: boolean;
  search?: string;
}) {
  return useQuery({
    queryKey: ['services', params],
    queryFn: () => fetchServices(params),
  });
}

export function useService(slug: string) {
  return useQuery({
    queryKey: ['service', slug],
    queryFn: () => fetchServiceBySlug(slug),
    enabled: !!slug,
  });
}

export function useServiceSteps(slug: string) {
  return useQuery({
    queryKey: ['serviceSteps', slug],
    queryFn: () => fetchServiceSteps(slug),
    enabled: !!slug,
  });
}

export function useServiceDocuments(slug: string) {
  return useQuery({
    queryKey: ['serviceDocuments', slug],
    queryFn: () => fetchServiceDocuments(slug),
    enabled: !!slug,
  });
}

export function useServiceFaqs(slug: string) {
  return useQuery({
    queryKey: ['serviceFaqs', slug],
    queryFn: () => fetchServiceFaqs(slug),
    enabled: !!slug,
  });
}