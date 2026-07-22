import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'

type MarketIntelligencePreviewProps = {
  eyebrow: string
  signalLabel: string
  positiveLabel: string
  negativeLabel: string
  neutralLabel: string
  articleLabel: string
  articleCountLabel: string
  statusLabel: string
  scoreLabel: string
  news: [string, string, string]
}

const signals = [
  { ticker: 'AAPL', score: 8, direction: 'positive' as const },
  { ticker: '005930', score: 6, direction: 'negative' as const },
  { ticker: 'QQQ', score: 3, direction: 'neutral' as const },
]

const directionStyle = {
  positive: {
    icon: ArrowUpRight,
    className: 'bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300',
  },
  negative: {
    icon: ArrowDownRight,
    className: 'bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300',
  },
  neutral: {
    icon: Minus,
    className: 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300',
  },
}

export function MarketIntelligencePreview({
  eyebrow,
  signalLabel,
  positiveLabel,
  negativeLabel,
  neutralLabel,
  articleLabel,
  articleCountLabel,
  statusLabel,
  scoreLabel,
  news,
}: MarketIntelligencePreviewProps) {
  return (
    <figure
      aria-label={eyebrow}
      className="landing-enter landing-enter-delay-2 relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[#111a18] dark:shadow-black/30"
    >
      <div className="flex h-11 items-center gap-2 border-b border-slate-200/80 px-4 dark:border-white/10">
        <span className="size-2 rounded-full bg-brand-500" aria-hidden="true" />
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{eyebrow}</span>
        <span className="ml-auto text-[11px] font-medium text-brand-700 dark:text-brand-100">{statusLabel}</span>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_180px]">
        <div className="border-b border-slate-200/80 p-4 lg:border-r lg:border-b-0 dark:border-white/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{signalLabel}</p>
              <p className="mt-1 font-mono text-2xl font-semibold tracking-tight tabular-nums">62%</p>
            </div>
            <span className="inline-flex h-7 items-center gap-1 rounded-md bg-rose-50 px-2 text-xs font-bold text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
              <ArrowUpRight className="size-3.5" aria-hidden="true" /> {positiveLabel}
            </span>
          </div>

          <div className="mt-4 h-24 overflow-hidden" aria-hidden="true">
            <svg viewBox="0 0 420 96" className="h-full w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="signal-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgb(19 137 102)" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="rgb(19 137 102)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 80 C32 76 49 68 72 70 S108 45 137 53 S181 61 205 42 S249 51 276 33 S319 38 344 22 S386 25 420 8 L420 96 L0 96 Z" fill="url(#signal-area)" />
              <path className="landing-chart-line" pathLength={1} d="M0 80 C32 76 49 68 72 70 S108 45 137 53 S181 61 205 42 S249 51 276 33 S319 38 344 22 S386 25 420 8" fill="none" stroke="rgb(19 137 102)" strokeWidth="2.25" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>

          <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
            <div><span className="block text-slate-500 dark:text-slate-400">{positiveLabel}</span><strong className="font-mono text-rose-600 dark:text-rose-300">62%</strong></div>
            <div><span className="block text-slate-500 dark:text-slate-400">{neutralLabel}</span><strong className="font-mono text-slate-700 dark:text-slate-200">23%</strong></div>
            <div><span className="block text-slate-500 dark:text-slate-400">{negativeLabel}</span><strong className="font-mono text-blue-600 dark:text-blue-300">15%</strong></div>
          </div>
          <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5" aria-hidden="true">
            <span className="landing-bar landing-bar-positive bg-rose-500" />
            <span className="landing-bar landing-bar-neutral bg-slate-400" />
            <span className="landing-bar landing-bar-negative bg-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-slate-200/80 lg:grid-cols-1 lg:divide-x-0 lg:divide-y dark:divide-white/10">
          {signals.map(({ ticker, score, direction }) => {
            const DirectionIcon = directionStyle[direction].icon
            return (
              <div key={ticker} className="flex min-w-0 items-center gap-2.5 px-3 py-3.5">
                <span className={`grid size-7 shrink-0 place-items-center rounded-lg ${directionStyle[direction].className}`}>
                  <DirectionIcon className="size-3.5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <strong className="block truncate font-mono text-xs tracking-tight">{ticker}</strong>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400">{scoreLabel} {score}</span>
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <figcaption className="border-t border-slate-200/80 dark:border-white/10">
        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{articleLabel}</span>
          <span className="font-mono text-[10px] text-slate-400">{articleCountLabel}</span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-white/5">
          {news.map((item, index) => {
            const signal = signals[index]
            const DirectionIcon = directionStyle[signal.direction].icon
            return (
              <div key={item} className={`landing-news-row landing-news-delay-${index + 1} flex items-center gap-3 px-4 py-3`}>
                <span className={`grid size-7 shrink-0 place-items-center rounded-lg ${directionStyle[signal.direction].className}`}>
                  <DirectionIcon className="size-3.5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">{item}</span>
                <span className="shrink-0 font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">{signal.score}/10</span>
              </div>
            )
          })}
        </div>
      </figcaption>
    </figure>
  )
}
