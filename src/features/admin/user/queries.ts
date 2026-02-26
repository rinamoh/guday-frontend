import { useQuery } from '@tanstack/react-query';
import { listAdminUsers, listUsersByCategory } from '../../../api/adminUsers';
import { hasAdminSession } from '../../../utils/adminSession';

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => listAdminUsers(),
    enabled: hasAdminSession(),
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useAdminUsersByCategory(categoryId?: string) {
  return useQuery({
    queryKey: ['admin-users-by-category', categoryId],
    queryFn: () => listUsersByCategory(categoryId!),
    enabled: hasAdminSession() && !!categoryId,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
