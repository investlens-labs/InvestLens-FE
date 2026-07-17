import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { FeedItem } from '@/lib/api/types'
import { RelatedNewsItem } from './instrument-news'

const news: FeedItem = {
  id: 'news-1', source: 'Reuters', originalUrl: 'https://example.com/original', title: 'Original title', translatedTitle: '번역 제목', summary: null, marketContext: null,
  analysisStatus: 'COMPLETED', publishedAt: '2026-07-17T00:00:00Z', impacts: [{ instrumentId: 'instrument-1', ticker: 'AAPL', companyName: 'Apple', instrumentType: 'STOCK', direction: 'POSITIVE', score: 4, reason: '실적 개선' }],
}

describe('RelatedNewsItem', () => {
  it('번역 제목을 우선 표시하고 원문을 안전한 새 탭 링크로 연다', () => {
    render(<RelatedNewsItem news={news} />)

    const link = screen.getByRole('link', { name: /번역 제목/ })
    expect(link).toHaveAttribute('href', news.originalUrl)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByText('긍정 · 4점')).toBeInTheDocument()
  })
})
