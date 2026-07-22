import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { FeedItem } from '@/lib/api/types'
import { RelatedNewsItem } from './instrument-news'

const news: FeedItem = {
  id: 'news-1', source: 'Reuters', originalUrl: 'https://example.com/original', title: 'Original title', translatedTitle: '번역 제목', summary: null, marketContext: null,
  language: 'ko', localized: true, localizationModel: 'gemini-2.5-flash', analysisStatus: 'COMPLETED', publishedAt: '2026-07-17T00:00:00Z', impacts: [{ instrumentId: 'instrument-1', ticker: 'AAPL', companyName: 'Apple', instrumentType: 'STOCK', direction: 'POSITIVE', score: 4, reason: '실적 개선', aiAnalyzed: true, analysisModel: 'gemini-2.5-flash', upProbability: 68, downProbability: 12, neutralProbability: 20 }],
}

describe('RelatedNewsItem', () => {
  it('번역 제목을 우선 표시하고 원문을 안전한 새 탭 링크로 연다', () => {
    render(<RelatedNewsItem news={news} />)

    const link = screen.getByRole('link', { name: /번역 제목/ })
    expect(link).toHaveAttribute('href', news.originalUrl)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByText('긍정 · 4점')).toBeInTheDocument()
    expect(screen.getByText('실적 개선')).toBeInTheDocument()
    expect(screen.getByText('68%')).toBeInTheDocument()
    expect(screen.getByText('12%')).toBeInTheDocument()
    expect(screen.getByText('20%')).toBeInTheDocument()
  })

  it('fallback 영향은 방향과 점수 대신 분석 준비 상태를 표시한다', () => {
    render(<RelatedNewsItem news={{ ...news, localized: false, impacts: [{ ...news.impacts[0], aiAnalyzed: false }] }} />)

    expect(screen.getByText('Original title')).toBeInTheDocument()
    expect(screen.getByText('원문 기사 · 번역을 사용할 수 없습니다.')).toBeInTheDocument()
    expect(screen.getByText('AI 분석 준비 중')).toBeInTheDocument()
    expect(screen.queryByText('긍정 · 4점')).not.toBeInTheDocument()
    expect(screen.queryByText('68%')).not.toBeInTheDocument()
  })
})
