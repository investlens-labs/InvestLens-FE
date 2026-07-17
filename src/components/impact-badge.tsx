import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import type { ImpactDirection } from '@/lib/api/types'
import { directionLabel } from '@/lib/format'

const config = {
  POSITIVE: { icon: ArrowUpRight, className: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800' },
  NEUTRAL: { icon: ArrowRight, className: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700' },
  NEGATIVE: { icon: ArrowDownRight, className: 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-900' },
} satisfies Record<ImpactDirection, { icon: typeof ArrowRight; className: string }>

export const impactScoreDescription: Record<number, string> = {
  1: '단순 언급 또는 영향 거의 없음',
  2: '간접적이고 제한적인 영향',
  3: '사업·수요·비용·규제에 의미 있는 영향',
  4: '실적이나 핵심 사업에 직접적인 큰 영향',
  5: '기업 전체에 치명적이거나 즉각적인 중대 영향',
}

export function ImpactBadge({ direction, score, showScore = true }: { direction: ImpactDirection; score?: number; showScore?: boolean }) {
  const { icon: Icon, className } = config[direction]
  return (
    <span title={score ? `${score}점: ${impactScoreDescription[score] ?? '영향도 평가'}` : undefined} className={`inline-flex h-6 items-center gap-1 rounded-md px-2 text-xs font-semibold ring-1 ring-inset ${className}`}>
      <Icon aria-hidden className="size-3.5" />
      {directionLabel[direction]}{showScore && score ? ` · ${score}점` : ''}
    </span>
  )
}
