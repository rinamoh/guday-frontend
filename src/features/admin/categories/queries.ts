import { useQuery } from '@tanstack/react-query';
import { getAdminCategories, getAdminCategory } from '../../../api/adminCategories';
import { hasAdminSession } from '../../../utils/adminSession';

export function useAdminCategories() {
  return useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => getAdminCategories(),
    enabled: hasAdminSession(),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useAdminCategory(id: string) {
  return useQuery({
    queryKey: ['admin-category', id],
    queryFn: () => getAdminCategory(id),
    enabled: hasAdminSession() && !!id,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
