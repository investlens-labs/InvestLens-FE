import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import type { ImpactDirection } from '@/lib/api/types'
import { directionLabel } from '@/lib/format'

const config = {
  POSITIVE: { icon: ArrowUpRight, className: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800' },
  NEUTRAL: { icon: ArrowRight, className: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700' },
  NEGATIVE: { icon: ArrowDownRight, className: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-900' },
} satisfies Record<ImpactDirection, { icon: typeof ArrowRight; className: string }>

export function ImpactBadge({ direction, score, showScore = true }: { direction: ImpactDirection; score?: number; showScore?: boolean }) {
  const { icon: Icon, className } = config[direction]
  return (
    <span className={`inline-flex h-6 items-center gap-1 rounded-md px-2 text-xs font-semibold ring-1 ring-inset ${className}`}>
      <Icon aria-hidden className="size-3.5" />
      {directionLabel[direction]}{showScore && score ? ` · ${score}점` : ''}
    </span>
  )
}
