import type { NewsFilters } from '@/lib/api/types'

export const queryKeys = {
  me: ['me'] as const,
  portfolio: ['portfolio'] as const,
  instruments: (query: string, type?: string) => ['instruments', query, type] as const,
  news: (filters: NewsFilters) => ['news', filters] as const,
  newsDetail: (id: string) => ['news', id] as const,
}
