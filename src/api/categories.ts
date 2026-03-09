import { apiGet } from './client';
import type { CategoryListResponse, CategoryResponse } from '../types/category';
import type { PublicLanguage } from '../utils/publicLanguage';

export async function fetchCategories(params?: { language?: PublicLanguage }): Promise<CategoryListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.language) searchParams.append('language', params.language);

  const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
  return apiGet<CategoryListResponse>(`/categories${query}`);
}

export async function fetchCategoryBySlug(
  slug: string,
  params?: { language?: PublicLanguage }
): Promise<CategoryResponse> {
  const searchParams = new URLSearchParams();
  if (params?.language) searchParams.append('language', params.language);

  const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
  return apiGet<CategoryResponse>(`/categories/${slug}${query}`);
}
