import { apiGet } from './client';
import type { CategoryListResponse, CategoryResponse } from '../types/category';

export async function fetchCategories(): Promise<CategoryListResponse> {
  return apiGet<CategoryListResponse>('/categories');
}

export async function fetchCategoryBySlug(slug: string): Promise<CategoryResponse> {
  return apiGet<CategoryResponse>(`/categories/${slug}`);
}