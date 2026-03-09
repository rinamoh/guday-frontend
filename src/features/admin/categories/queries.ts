import { useQuery } from '@tanstack/react-query';
import { getAdminCategories, getAdminCategory } from '../../../api/adminCategories';
import { hasAdminSession } from '../../../utils/adminSession';
import { type AdminLanguage } from '../../../utils/adminLanguage';

export function useAdminCategories(params?: { language?: AdminLanguage }) {
  return useQuery({
    queryKey: ['admin-categories', params?.language ?? 'en'],
    queryFn: () => getAdminCategories({ language: params?.language }),
    enabled: hasAdminSession(),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useAdminCategory(id: string, params?: { language?: AdminLanguage }) {
  return useQuery({
    queryKey: ['admin-category', id, params?.language ?? 'en'],
    queryFn: () => getAdminCategory(id, { language: params?.language }),
    enabled: hasAdminSession() && !!id,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
