import { apiClient } from './client'
import type {
  AddPortfolioRequest,
  ChartRange,
  FeedItem,
  Instrument,
  InstrumentChart,
  InstrumentNewsParams,
  InstrumentSearchParams,
  LoginRequest,
  NewsDetail,
  NewsFilters,
  PageResponse,
  PortfolioItem,
  SignupRequest,
  TokenResponse,
  User,
} from './types'

export const toQuery = (params: Record<string, string | number | undefined>) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.set(key, String(value))
  })
  const result = query.toString()
  return result ? `?${result}` : ''
}

export const authApi = {
  signup: (payload: SignupRequest) => apiClient.post<User>('/auth/signup', payload, { auth: false }),
  login: (payload: LoginRequest) => apiClient.post<TokenResponse>('/auth/login', payload, { auth: false }),
  me: () => apiClient.get<User>('/users/me'),
}

export const instrumentApi = {
  search: ({ query = '', market, type, limit = 50 }: InstrumentSearchParams = {}) =>
    apiClient.get<Instrument[]>(`/instruments${toQuery({ query, market, type, limit })}`),
  get: (instrumentId: string) => apiClient.get<Instrument>(`/instruments/${instrumentId}`),
  chart: (instrumentId: string, range: ChartRange) =>
    apiClient.get<InstrumentChart>(`/instruments/${instrumentId}/chart${toQuery({ range })}`),
  news: (instrumentId: string, { page = 0, size = 20 }: InstrumentNewsParams = {}) =>
    apiClient.get<PageResponse<FeedItem>>(`/instruments/${instrumentId}/news${toQuery({ page, size })}`, { timeoutMs: 160_000 }),
}

export const portfolioApi = {
  list: () => apiClient.get<PortfolioItem[]>('/portfolio'),
  add: (payload: AddPortfolioRequest) => apiClient.post<PortfolioItem>('/portfolio', payload),
  remove: (portfolioItemId: string) => apiClient.delete(`/portfolio/${portfolioItemId}`),
}

export const newsApi = {
  feed: (filters: NewsFilters) =>
    apiClient.get<PageResponse<FeedItem>>(`/news${toQuery(filters as Record<string, string | number | undefined>)}`),
  detail: (newsId: string) => apiClient.get<NewsDetail>(`/news/${newsId}`),
}
