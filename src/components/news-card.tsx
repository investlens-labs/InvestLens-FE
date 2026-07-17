import { ChevronRight, Clock3 } from 'lucide-react'
import Link from 'next/link'
import type { FeedItem } from '@/lib/api/types'
import { formatDate } from '@/lib/format'
import { ImpactBadge } from './impact-badge'

export function NewsCard({ news }: { news: FeedItem }) {
  const primaryImpact = news.impacts?.[0]
  return (
    <article className="surface group p-4 transition hover:border-brand-500/40 hover:bg-brand-50/25 hover:shadow-[0_4px_14px_rgba(15,23,42,0.06)] dark:hover:bg-brand-700/5">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-brand-700 dark:text-brand-100">{news.source || '출처 미상'}</span>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1"><Clock3 aria-hidden className="size-3.5" />{formatDate(news.publishedAt)}</span>
        {news.analysisStatus === 'PENDING' && <span className="rounded bg-amber-50 px-1.5 py-0.5 text-amber-700 dark:bg-amber-950 dark:text-amber-300">분석 중</span>}
      </div>
      <Link href={`/news/${news.id}`} className="block rounded-md focus-visible:outline-offset-4">
        <div className="mt-2 flex items-start justify-between gap-4">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-6 text-slate-950 group-hover:text-brand-700 dark:text-slate-100 dark:group-hover:text-brand-100">
            {news.translatedTitle || news.title}
          </h3>
          <ChevronRight aria-hidden className="mt-1 size-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{news.summary || '요약을 준비하고 있습니다.'}</p>
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {primaryImpact ? (
          <>
            <Link href={`/instruments/${primaryImpact.instrumentId}`} className="rounded-md bg-slate-900 px-2 py-1 font-mono text-xs font-bold tracking-wide text-white transition hover:bg-brand-600 focus-visible:outline-offset-2 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-brand-100">{primaryImpact.ticker}</Link>
            <ImpactBadge direction={primaryImpact.direction} score={primaryImpact.score} />
            {news.impacts.length > 1 && <span className="text-xs text-slate-500">외 {news.impacts.length - 1}개 종목</span>}
          </>
        ) : <span className="text-xs text-slate-500">연관 종목 분석 대기</span>}
      </div>
    </article>
  )
}
