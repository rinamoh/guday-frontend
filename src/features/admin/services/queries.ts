import { useQuery } from '@tanstack/react-query';
import { getAdminServices } from '../../../api/adminServices';
import { hasAdminSession } from '../../../utils/adminSession';
import { type AdminLanguage } from '../../../utils/adminLanguage';

export function useAdminServices(params?: {
  page?: number;
  page_size?: number;
  status?: string;
  category_id?: string;
  search?: string;
  language?: AdminLanguage;
}) {
  return useQuery({
    queryKey: ['admin-services', params],
    queryFn: () => getAdminServices(params),
    enabled: hasAdminSession(),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
