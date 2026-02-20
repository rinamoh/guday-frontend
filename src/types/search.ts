import type { ServiceSummary } from './service';

export interface SearchParams {
  q: string;
  category_id?: string;
  limit?: number;
}

export interface SearchResponse {
  data: ServiceSummary[];
  total: number;
  query: string;
}