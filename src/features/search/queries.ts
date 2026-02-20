// src/features/search/queries.ts  
import { useQuery } from '@tanstack/react-query';
import { searchServices } from '../../api/search';

export function useSearch(params: { q: string; category_id?: string; limit?: number }) {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => searchServices(params),
    enabled: !!params.q,
  });
}