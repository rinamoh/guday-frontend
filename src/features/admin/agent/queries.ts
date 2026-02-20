import { useQuery } from '@tanstack/react-query';
import { listAdminAgents } from '../../../api/adminAgents';
import { hasAdminSession } from '../../../utils/adminSession';

export function useAdminAgents(params?: { category_id?: string; is_active?: boolean }) {
  return useQuery({
    queryKey: ['admin-agents', params],
    queryFn: () => listAdminAgents(params),
    enabled: hasAdminSession(),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
