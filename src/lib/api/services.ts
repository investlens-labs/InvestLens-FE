import { apiClient } from './client'
import type {
  AddPortfolioRequest,
  FeedItem,
  Instrument,
  InstrumentType,
  LoginRequest,
  NewsDetail,
  NewsFilters,
  PageResponse,
  PortfolioItem,
  SignupRequest,
  TokenResponse,
  User,
} from './types'

const toQuery = (params: Record<string, string | number | undefined>) => {
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
  search: (query = '', type?: InstrumentType) =>
    apiClient.get<Instrument[]>(`/instruments${toQuery({ query, type })}`),
  get: (instrumentId: string) => apiClient.get<Instrument>(`/instruments/${instrumentId}`),
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
