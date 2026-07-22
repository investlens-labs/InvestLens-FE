import type { NewsFilters } from '@/lib/api/types'

export const queryKeys = {
  me: ['me'] as const,
  portfolio: ['portfolio'] as const,
  instruments: (query: string, market?: string, type?: string, limit = 50) => ['instruments', query, market, type, limit] as const,
  instrumentDetail: (id: string) => ['instruments', 'detail', id] as const,
  instrumentChart: (id: string, range: string) => ['instruments', 'chart', id, range] as const,
  instrumentNews: (id: string, language: string, page: number, size: number) => ['instruments', 'news', id, language, page, size] as const,
  instrumentNewsSentiment: (id: string) => ['instruments', 'news', 'sentiment', id] as const,
  news: (filters: NewsFilters) => ['news', filters] as const,
  newsDetail: (id: string) => ['news', id] as const,
}
