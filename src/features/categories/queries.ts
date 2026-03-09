import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchCategoryBySlug } from '../../api/categories';
import type { PublicLanguage } from '../../utils/publicLanguage';

export function useCategories(params?: { language?: PublicLanguage }) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => fetchCategories(params),
  });
}

export function useCategory(slug: string, params?: { language?: PublicLanguage }) {
  return useQuery({
    queryKey: ['category', slug, params],
    queryFn: () => fetchCategoryBySlug(slug, params),
    enabled: !!slug,
  });
}
