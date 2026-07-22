'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { ErrorState, StatusState } from '@/components/ui/status-state'
import { NewsSkeleton } from '@/components/ui/skeleton'
import { newsApi } from '@/lib/api/services'
import type { ImpactDirection, NewsFilters } from '@/lib/api/types'
import { queryKeys } from '@/lib/query-keys'
import { NewsCard } from './news-card'

const directions = [
  { value: '', labelKey: 'allDirections', marker: '' },
  { value: 'POSITIVE', labelKey: 'positive', marker: '↗ ' },
  { value: 'NEUTRAL', labelKey: 'neutral', marker: '→ ' },
  { value: 'NEGATIVE', labelKey: 'negative', marker: '↘ ' },
] as const satisfies ReadonlyArray<{ value: ImpactDirection | ''; labelKey: 'allDirections' | 'positive' | 'neutral' | 'negative'; marker: string }>

export const impactScoreOptions = Array.from({ length: 10 }, (_, index) => 10 - index)

export function NewsFeed({ initialSize = 10 }: { initialSize?: number }) {
  const t = useTranslations('news')
  const common = useTranslations('common')
  const locale = useLocale()
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
          <h2 id="news-feed-title" className="text-base font-semibold text-slate-950 dark:text-white">{t('feedTitle')}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{t('feedDescription', { count: query.data?.totalElements ?? 0 })}</p>
        </div>
        <div className="flex items-center gap-2" aria-label={t('filterLabel')}>
          <SlidersHorizontal aria-hidden className="hidden size-4 text-slate-400 sm:block" />
          <label className="sr-only" htmlFor="direction">{t('direction')}</label>
          <select id="direction" className="field h-9 w-auto min-w-28 py-0" value={direction} onChange={(event) => updateDirection(event.target.value as ImpactDirection | '')}>
            {directions.map((item) => <option key={item.value} value={item.value}>{item.marker}{t(item.labelKey)}</option>)}
          </select>
          <label className="sr-only" htmlFor="score">{t('minimumScore')}</label>
          <select id="score" className="field h-9 w-auto min-w-28 py-0" value={minScore} onChange={(event) => updateScore(event.target.value ? Number(event.target.value) : '')}>
            <option value="">{t('allScores')}</option>
            {impactScoreOptions.map((score) => <option key={score} value={score}>{t('scoreOrMore', { score: new Intl.NumberFormat(locale).format(score) })}</option>)}
          </select>
        </div>
      </div>

      {query.isLoading ? <div className="grid gap-3"><NewsSkeleton /><NewsSkeleton /><NewsSkeleton /></div>
        : query.isError ? <ErrorState onRetry={() => void query.refetch()} />
        : !query.data?.content.length ? <StatusState title={t('emptyTitle')} description={t('emptyDescription')} />
        : (
          <>
            <div className="grid gap-3">{query.data.content.map((news) => <NewsCard key={news.id} news={news} />)}</div>
            {query.data.totalPages > 1 && (
              <nav className="mt-4 flex items-center justify-center gap-3" aria-label={t('pagination')}>
                <button className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900" disabled={query.data.first || query.isFetching} onClick={() => setPage((current) => current - 1)}><ChevronLeft className="size-4" />{common('previous')}</button>
                <span className="min-w-20 text-center text-xs text-slate-500"><strong className="text-slate-800 dark:text-slate-200">{new Intl.NumberFormat(locale).format(query.data.number + 1)}</strong> / {new Intl.NumberFormat(locale).format(query.data.totalPages)}</span>
                <button className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900" disabled={query.data.last || query.isFetching} onClick={() => setPage((current) => current + 1)}>{common('next')}<ChevronRight className="size-4" /></button>
              </nav>
            )}
          </>
        )}
    </section>
  )
}
