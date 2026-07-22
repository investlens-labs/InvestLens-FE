import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { ImpactDirection } from '@/lib/api/types'

const config = {
  POSITIVE: { icon: ArrowUpRight, className: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800' },
  NEUTRAL: { icon: ArrowRight, className: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700' },
  NEGATIVE: { icon: ArrowDownRight, className: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-900' },
} satisfies Record<ImpactDirection, { icon: typeof ArrowRight; className: string }>

const scoreKeys = {
  1: 'score1', 2: 'score2', 3: 'score3', 4: 'score4', 5: 'score5',
  6: 'score6', 7: 'score7', 8: 'score8', 9: 'score9', 10: 'score10',
} as const

const directionKeys = {
  POSITIVE: 'positive',
  NEUTRAL: 'neutral',
  NEGATIVE: 'negative',
} as const

export function ImpactBadge({ direction, score, showScore = true }: { direction: ImpactDirection; score?: number; showScore?: boolean }) {
  const t = useTranslations('impact')
  const { icon: Icon, className } = config[direction]
  const directionText = t(directionKeys[direction])
  const description = score && score in scoreKeys ? t(scoreKeys[score as keyof typeof scoreKeys]) : t('assessment')
  return (
    <span title={score ? t('title', { score, description }) : undefined} className={`inline-flex h-6 items-center gap-1 rounded-md px-2 text-xs font-semibold ring-1 ring-inset ${className}`}>
      <Icon aria-hidden className="size-3.5" />
      {showScore && score ? t('label', { direction: directionText, score }) : directionText}
    </span>
  )
}
