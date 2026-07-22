import { BarChart3, Sparkles } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import type { InstrumentNewsSentiment } from '@/lib/api/types'

const sentimentItems = [
  { key: 'upPercentage', labelKey: 'up', barClass: 'bg-red-500', textClass: 'text-red-600 dark:text-red-400' },
  { key: 'downPercentage', labelKey: 'down', barClass: 'bg-blue-500', textClass: 'text-blue-600 dark:text-blue-400' },
  { key: 'neutralPercentage', labelKey: 'neutral', barClass: 'bg-slate-400', textClass: 'text-slate-600 dark:text-slate-300' },
] as const

const safePercentage = (value: number) => Math.min(100, Math.max(0, value))

export function InstrumentSentiment({ sentiment }: { sentiment: InstrumentNewsSentiment }) {
  const t = useTranslations('sentiment')
  const newsT = useTranslations('news')
  const locale = useLocale()
  const number = new Intl.NumberFormat(locale)
  if (!sentiment.aiAnalyzed) {
    return (
      <div className="mb-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/70">
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-white text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-300"><Sparkles className="size-4" aria-hidden /></span>
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t('pendingTitle')}</h3>
          <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{t('pendingDescription')}</p>
        </div>
      </div>
    )
  }

  return (
    <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" aria-labelledby="instrument-sentiment-title">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 id="instrument-sentiment-title" className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white"><BarChart3 className="size-4 text-brand-600" aria-hidden />{t('title')}</h3>
          <p className="mt-1 text-xs text-slate-500">{t('summary', { related: number.format(sentiment.relatedArticleCount), analyzed: number.format(sentiment.analyzedArticleCount) })}</p>
        </div>
        {sentiment.analysisModel && <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">AI · {sentiment.analysisModel}</span>}
      </div>

      <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" role="img" aria-label={t('aria', { up: sentiment.upPercentage, down: sentiment.downPercentage, neutral: sentiment.neutralPercentage })}>
        {sentimentItems.map((item) => <span key={item.key} className={item.barClass} style={{ width: `${safePercentage(sentiment[item.key])}%` }} aria-hidden />)}
      </div>
      <dl className="mt-2 grid grid-cols-3 gap-2">
        {sentimentItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-1 text-xs">
            <dt className="flex items-center gap-1.5 text-slate-500"><span className={`size-2 rounded-full ${item.barClass}`} aria-hidden />{newsT(item.labelKey)}</dt>
            <dd className={`font-mono font-bold ${item.textClass}`}>{sentiment[item.key]}%</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 border-t border-slate-100 pt-3 text-[11px] leading-5 text-slate-500 dark:border-slate-800 dark:text-slate-400">{locale === 'ko' ? sentiment.disclaimer : newsT('defaultDisclaimer')}</p>
    </section>
  )
}

export function InstrumentSentimentSkeleton() {
  const t = useTranslations('sentiment')
  return (
    <div className="mb-4 animate-pulse rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900" role="status" aria-label={t('loadingAria')}>
      <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-2 h-3 w-64 max-w-full rounded bg-slate-100 dark:bg-slate-800/70" />
      <div className="mt-4 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800" />
    </div>
  )
}
