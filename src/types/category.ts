import type { ApiResponse } from "./api";
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryListResponse extends ApiResponse<Category[]> {}
export interface CategoryResponse extends ApiResponse<Category> {}