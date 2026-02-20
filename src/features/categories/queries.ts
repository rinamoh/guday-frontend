import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchCategoryBySlug } from '../../api/categories';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => fetchCategoryBySlug(slug),
    enabled: !!slug,
  });
}