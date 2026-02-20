// src/api/search.ts
import { apiGet } from './client';

export async function searchServices(params: { q: string; category_id?: string; limit?: number }) {
  const searchParams = new URLSearchParams();
  searchParams.append('q', params.q);
  if (params.category_id) searchParams.append('category_id', params.category_id);
  if (params.limit) searchParams.append('limit', params.limit.toString());
  
  return apiGet(`/search?${searchParams.toString()}`);
}

