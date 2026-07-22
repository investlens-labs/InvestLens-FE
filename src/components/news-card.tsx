import { ChevronRight, Clock3 } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import type { FeedItem } from '@/lib/api/types'
import { formatDate } from '@/lib/format'
import { ImpactBadge } from './impact-badge'

export function NewsCard({ news }: { news: FeedItem }) {
  const locale = useLocale()
  const common = useTranslations('common')
  const t = useTranslations('news')
  const primaryImpact = news.impacts?.[0]
  const displayTitle = news.localized ? (news.translatedTitle || news.title) : news.title
  return (
    <article className="surface group p-4 transition hover:border-brand-500/40 hover:bg-brand-50/25 hover:shadow-[0_4px_14px_rgba(15,23,42,0.06)] dark:hover:bg-brand-700/5">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-brand-700 dark:text-brand-100">{news.source || common('unknownSource')}</span>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1"><Clock3 aria-hidden className="size-3.5" />{formatDate(news.publishedAt, locale)}</span>
        {news.analysisStatus === 'PENDING' && <span className="rounded bg-amber-50 px-1.5 py-0.5 text-amber-700 dark:bg-amber-950 dark:text-amber-300">{t('analysisPending')}</span>}
      </div>
      <Link href={`/news/${news.id}`} className="block rounded-md focus-visible:outline-offset-4">
        <div className="mt-2 flex items-start justify-between gap-4">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-6 text-slate-950 group-hover:text-brand-700 group-hover:underline dark:text-slate-100 dark:group-hover:text-brand-100">
            {displayTitle}
          </h3>
          <ChevronRight aria-hidden className="mt-1 size-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
        </div>
        {news.localized
          ? <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{news.summary || t('summaryPending')}</p>
          : <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-300">{t('translationUnavailable')}</p>}
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {primaryImpact ? (
          <>
            <Link href={`/instruments/${primaryImpact.instrumentId}`} className="rounded-md bg-slate-900 px-2 py-1 font-mono text-xs font-bold tracking-wide text-white underline-offset-2 transition group-hover:underline hover:bg-brand-600 focus-visible:outline-offset-2 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-brand-100">{primaryImpact.ticker}</Link>
            {primaryImpact.aiAnalyzed ? <ImpactBadge direction={primaryImpact.direction} score={primaryImpact.score} /> : <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">{t('aiPending')}</span>}
            {primaryImpact.aiAnalyzed && primaryImpact.reason && <span className="line-clamp-1 min-w-0 text-xs text-slate-500">{primaryImpact.reason}</span>}
            {news.impacts.length > 1 && <span className="text-xs text-slate-500">{t('moreInstruments', { count: news.impacts.length - 1 })}</span>}
          </>
        ) : <span className="text-xs text-slate-500">{t('impactPending')}</span>}
      </div>
    </article>
  )
}
