import { BarChart3, Sparkles } from 'lucide-react'
import type { InstrumentNewsSentiment } from '@/lib/api/types'

const sentimentItems = [
  { key: 'upPercentage', label: '상승', barClass: 'bg-red-500', textClass: 'text-red-600 dark:text-red-400' },
  { key: 'downPercentage', label: '하락', barClass: 'bg-blue-500', textClass: 'text-blue-600 dark:text-blue-400' },
  { key: 'neutralPercentage', label: '중립', barClass: 'bg-slate-400', textClass: 'text-slate-600 dark:text-slate-300' },
] as const

const safePercentage = (value: number) => Math.min(100, Math.max(0, value))

export function InstrumentSentiment({ sentiment }: { sentiment: InstrumentNewsSentiment }) {
  if (!sentiment.aiAnalyzed) {
    return (
      <div className="mb-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/70">
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-white text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-300"><Sparkles className="size-4" aria-hidden /></span>
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">AI 종합 분석 준비 중</h3>
          <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">분석이 완료된 관련 기사가 쌓이면 상승·하락·중립 가능성의 평균을 표시합니다.</p>
        </div>
      </div>
    )
  }

  return (
    <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" aria-labelledby="instrument-sentiment-title">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 id="instrument-sentiment-title" className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white"><BarChart3 className="size-4 text-brand-600" aria-hidden />최근 기사 AI 반응 가능성</h3>
          <p className="mt-1 text-xs text-slate-500">관련 기사 {sentiment.relatedArticleCount.toLocaleString()}건 중 AI 분석 완료 {sentiment.analyzedArticleCount.toLocaleString()}건의 평균</p>
        </div>
        {sentiment.analysisModel && <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">AI · {sentiment.analysisModel}</span>}
      </div>

      <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" role="img" aria-label={`상승 ${sentiment.upPercentage}%, 하락 ${sentiment.downPercentage}%, 중립 ${sentiment.neutralPercentage}%`}>
        {sentimentItems.map((item) => <span key={item.key} className={item.barClass} style={{ width: `${safePercentage(sentiment[item.key])}%` }} aria-hidden />)}
      </div>
      <dl className="mt-2 grid grid-cols-3 gap-2">
        {sentimentItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-1 text-xs">
            <dt className="flex items-center gap-1.5 text-slate-500"><span className={`size-2 rounded-full ${item.barClass}`} aria-hidden />{item.label}</dt>
            <dd className={`font-mono font-bold ${item.textClass}`}>{sentiment[item.key]}%</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 border-t border-slate-100 pt-3 text-[11px] leading-5 text-slate-500 dark:border-slate-800 dark:text-slate-400">{sentiment.disclaimer}</p>
    </section>
  )
}

export function InstrumentSentimentSkeleton() {
  return (
    <div className="mb-4 animate-pulse rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900" role="status" aria-label="AI 종합 분석 불러오는 중">
      <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-2 h-3 w-64 max-w-full rounded bg-slate-100 dark:bg-slate-800/70" />
      <div className="mt-4 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800" />
    </div>
  )
}
