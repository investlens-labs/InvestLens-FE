'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { ErrorState, StatusState } from '@/components/ui/status-state'
import { NewsSkeleton } from '@/components/ui/skeleton'
import { newsApi } from '@/lib/api/services'
import type { ImpactDirection, NewsFilters } from '@/lib/api/types'
import { queryKeys } from '@/lib/query-keys'
import { NewsCard } from './news-card'

const directions: Array<{ value: ImpactDirection | ''; label: string }> = [
  { value: '', label: '전체 방향' },
  { value: 'POSITIVE', label: '↗ 긍정' },
  { value: 'NEUTRAL', label: '→ 중립' },
  { value: 'NEGATIVE', label: '↘ 부정' },
]

export function NewsFeed({ initialSize = 10 }: { initialSize?: number }) {
  const [direction, setDirection] = useState<ImpactDirection | ''>('')
  const [minScore, setMinScore] = useState<number | ''>('')
  const [page, setPage] = useState(0)
  const filters: NewsFilters = { direction: direction || undefined, minScore: minScore || undefined, page, size: initialSize }
  const query = useQuery({ queryKey: queryKeys.news(filters), queryFn: () => newsApi.feed(filters) })

  const updateDirection = (value: ImpactDirection | '') => { setDirection(value); setPage(0) }
  const updateScore = (value: number | '') => { setMinScore(value); setPage(0) }

  return (
    <section aria-labelledby="news-feed-title">
      <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 id="news-feed-title" className="text-base font-semibold text-slate-950 dark:text-white">맞춤 뉴스 피드</h2>
          <p className="mt-0.5 text-xs text-slate-500">포트폴리오 관련 최신 분석 {query.data ? `${query.data.totalElements.toLocaleString()}건` : ''}</p>
        </div>
        <div className="flex items-center gap-2" aria-label="뉴스 필터">
          <SlidersHorizontal aria-hidden className="hidden size-4 text-slate-400 sm:block" />
          <label className="sr-only" htmlFor="direction">영향 방향</label>
          <select id="direction" className="field h-9 w-auto min-w-28 py-0" value={direction} onChange={(event) => updateDirection(event.target.value as ImpactDirection | '')}>
            {directions.map((item) => <option key={item.label} value={item.value}>{item.label}</option>)}
          </select>
          <label className="sr-only" htmlFor="score">최소 영향 점수</label>
          <select id="score" className="field h-9 w-auto min-w-28 py-0" value={minScore} onChange={(event) => updateScore(event.target.value ? Number(event.target.value) : '')}>
            <option value="">전체 점수</option>
            {[5, 4, 3, 2, 1].map((score) => <option key={score} value={score}>{score}점 이상</option>)}
          </select>
        </div>
      </div>

      {query.isLoading ? <div className="grid gap-3"><NewsSkeleton /><NewsSkeleton /><NewsSkeleton /></div>
        : query.isError ? <ErrorState onRetry={() => void query.refetch()} />
        : !query.data?.content.length ? <StatusState title="조건에 맞는 뉴스가 없습니다" description="필터를 낮추거나 포트폴리오에 관심 종목을 추가해 보세요." />
        : (
          <>
            <div className="grid gap-3">{query.data.content.map((news) => <NewsCard key={news.id} news={news} />)}</div>
            {query.data.totalPages > 1 && (
              <nav className="mt-4 flex items-center justify-center gap-3" aria-label="뉴스 페이지">
                <button className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900" disabled={query.data.first || query.isFetching} onClick={() => setPage((current) => current - 1)}><ChevronLeft className="size-4" />이전</button>
                <span className="min-w-20 text-center text-xs text-slate-500"><strong className="text-slate-800 dark:text-slate-200">{query.data.number + 1}</strong> / {query.data.totalPages}</span>
                <button className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900" disabled={query.data.last || query.isFetching} onClick={() => setPage((current) => current + 1)}>다음<ChevronRight className="size-4" /></button>
              </nav>
            )}
          </>
        )}
    </section>
  )
}
