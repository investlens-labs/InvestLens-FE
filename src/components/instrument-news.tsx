'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { AlertTriangle, ChevronLeft, ChevronRight, Clock3, ExternalLink, Newspaper } from 'lucide-react'
import { useState } from 'react'
import { ImpactBadge } from '@/components/impact-badge'
import { StatusState } from '@/components/ui/status-state'
import { instrumentApi } from '@/lib/api/services'
import type { FeedItem } from '@/lib/api/types'
import { formatDate } from '@/lib/format'
import { queryKeys } from '@/lib/query-keys'

const PAGE_SIZE = 20

export function InstrumentNews({ instrumentId, ticker }: { instrumentId: string; ticker: string }) {
  const [page, setPage] = useState(0)
  const news = useQuery({
    queryKey: queryKeys.instrumentNews(instrumentId, page, PAGE_SIZE),
    queryFn: () => instrumentApi.news(instrumentId, { page, size: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  })

  return (
    <section id="instrument-news" aria-labelledby="instrument-news-title" className="mt-4 scroll-mt-[72px]">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="instrument-news-title" className="flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white"><Newspaper className="size-4 text-brand-600" />{ticker} 관련 뉴스</h2>
          <p className="mt-1 text-xs text-slate-500">최근 90일 기사와 종목 영향 분석 {news.data ? `· ${news.data.totalElements.toLocaleString()}건` : ''}</p>
        </div>
        {news.isFetching && !news.isLoading && <span role="status" className="text-xs text-slate-500">뉴스 갱신 중...</span>}
      </div>

      {news.isLoading ? <InstrumentNewsSkeleton />
        : news.isError ? <StatusState compact icon={AlertTriangle} title="관련 뉴스를 수집하지 못했습니다" description="외부 뉴스 제공처의 응답이 지연되었을 수 있습니다. 잠시 후 다시 시도해 주세요." actionLabel="다시 시도" onAction={() => void news.refetch()} />
        : !news.data?.content.length ? <StatusState compact title="아직 관련 뉴스가 없습니다" description="최근 90일 동안 수집된 기사가 없습니다. 새로운 기사가 확인되면 이곳에 표시됩니다." />
        : (
          <>
            <div className={`surface divide-y divide-slate-100 overflow-hidden transition-opacity dark:divide-slate-800 ${news.isFetching ? 'opacity-60' : ''}`}>
              {news.data.content.map((item) => <RelatedNewsItem key={item.id} news={item} />)}
            </div>
            {news.data.totalPages > 1 && (
              <nav className="mt-4 flex items-center justify-center gap-3" aria-label={`${ticker} 관련 뉴스 페이지`}>
                <button type="button" className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800" disabled={news.data.first || news.isFetching} onClick={() => setPage((current) => Math.max(0, current - 1))}><ChevronLeft className="size-4" />이전</button>
                <span className="min-w-20 text-center text-xs text-slate-500"><strong className="text-slate-800 dark:text-slate-200">{news.data.number + 1}</strong> / {news.data.totalPages}</span>
                <button type="button" className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800" disabled={news.data.last || news.isFetching} onClick={() => setPage((current) => current + 1)}>다음<ChevronRight className="size-4" /></button>
              </nav>
            )}
          </>
        )}
    </section>
  )
}

export function RelatedNewsItem({ news }: { news: FeedItem }) {
  const displayTitle = news.translatedTitle || news.title

  return (
    <article className="group p-4 transition hover:bg-brand-50/30 dark:hover:bg-brand-700/5">
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
        <span className="font-semibold text-brand-700 dark:text-brand-100">{news.source || '출처 미상'}</span>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1"><Clock3 className="size-3" />{formatDate(news.publishedAt)}</span>
        {news.analysisStatus === 'PENDING' && <span className="rounded bg-amber-50 px-1.5 py-0.5 font-medium text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">영향 분석 중</span>}
        {news.analysisStatus === 'FAILED' && <span className="rounded bg-red-50 px-1.5 py-0.5 font-medium text-red-700 dark:bg-red-950/50 dark:text-red-300">분석 실패</span>}
      </div>
      <a href={news.originalUrl} target="_blank" rel="noopener noreferrer" className="mt-1.5 flex items-start justify-between gap-4 rounded-md focus-visible:outline-offset-4">
        <span className="min-w-0">
          <span className="line-clamp-2 text-sm font-semibold leading-6 text-slate-950 group-hover:text-brand-700 group-hover:underline dark:text-slate-100 dark:group-hover:text-brand-100">{displayTitle}</span>
          <span className="mt-1 block line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-400">{news.summary || '기사 영향 분석을 준비하고 있습니다.'}</span>
        </span>
        <ExternalLink aria-hidden className="mt-1 size-4 shrink-0 text-slate-400 group-hover:text-brand-600" />
      </a>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {news.impacts.length ? news.impacts.slice(0, 3).map((impact) => <span key={`${impact.ticker}-${impact.direction}`} className="inline-flex items-center gap-1"><span className="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300">{impact.ticker}</span><ImpactBadge direction={impact.direction} score={impact.score} /></span>) : <span className="text-xs text-slate-500">영향 분석 대기</span>}
      </div>
    </article>
  )
}

function InstrumentNewsSkeleton() {
  return (
    <div className="surface p-4" role="status" aria-label="관련 뉴스 수집 중">
      <p className="mb-4 text-xs text-slate-500">첫 조회에서는 최근 기사를 수집하므로 1~2분 정도 걸릴 수 있습니다.</p>
      <div className="space-y-5">{[1, 2, 3].map((item) => <div key={item} className="animate-pulse space-y-2"><div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-800" /><div className="h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-800" /><div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800/70" /></div>)}</div>
    </div>
  )
}
