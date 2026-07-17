export type InstrumentType = 'STOCK' | 'ETF'
export type Market = 'KR' | 'US'
export type ChartRange = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y'
export type ImpactDirection = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
export type AnalysisStatus = 'PENDING' | 'COMPLETED' | 'FAILED'

export interface SignupRequest { email: string; password: string }
export interface LoginRequest { email: string; password: string }
export interface AddPortfolioRequest { instrumentId: string }

export interface User {
  id: string
  email: string
  role: 'USER' | 'ADMIN'
}

export interface TokenResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface Instrument {
  id: string
  ticker: string
  companyName: string
  type: InstrumentType
  market: Market
  logoUrl: string | null
  logoAttributionUrl: string | null
}

export interface PortfolioItem {
  id: string
  instrumentId: string
  ticker: string
  companyName: string
  type: InstrumentType
  createdAt: string
}

export interface InstrumentSearchParams {
  query?: string
  market?: Market
  type?: InstrumentType
  limit?: number
}

export interface ChartPoint {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface InstrumentChart {
  instrumentId: string
  ticker: string
  range: ChartRange
  interval: string
  currency: string
  timezone: string
  currentPrice: number
  previousClose: number
  change: number
  changeRate: number
  exchangeDataDelayedBy: number
  points: ChartPoint[]
}

export interface Impact {
  instrumentId: string
  ticker: string
  companyName: string
  instrumentType: string
  direction: ImpactDirection
  score: number
  reason: string
}

export interface FeedItem {
  id: string
  source: string
  originalUrl: string
  title: string
  translatedTitle: string | null
  summary: string | null
  marketContext: string | null
  analysisStatus: AnalysisStatus
  publishedAt: string
  impacts: Impact[]
}

export interface NewsDetail {
  id: string
  source: string
  originalUrl: string
  originalTitle: string
  originalContent: string
  translatedTitle: string
  translatedContent: string
  summary: string
  marketContext: string
  analysisStatus: AnalysisStatus
  modelName: string
  publishedAt: string
  impacts: Impact[]
  disclaimer: string
}

export interface PageResponse<T> {
  totalElements: number
  totalPages: number
  size: number
  content: T[]
  number: number
  numberOfElements: number
  last: boolean
  first: boolean
  empty: boolean
}

export interface NewsFilters {
  direction?: ImpactDirection
  minScore?: number
  page?: number
  size?: number
}

export interface InstrumentNewsParams {
  page?: number
  size?: number
}
