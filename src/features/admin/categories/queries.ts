import { useQuery } from '@tanstack/react-query';
import { getAdminCategories, getAdminCategory } from '../../../api/adminCategories';

export function useAdminCategories() {
  const token = localStorage.getItem('admin_token');
  return useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => getAdminCategories(token!),
    enabled: !!token,
  });
}

export function useAdminCategory(id: string) {
  const token = localStorage.getItem('admin_token');
  return useQuery({
    queryKey: ['admin-category', id],
    queryFn: () => getAdminCategory(token!, id),
    enabled: !!token && !!id,
  });
}