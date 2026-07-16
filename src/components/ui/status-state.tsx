import { AlertTriangle, Inbox, LoaderCircle, RefreshCw, type LucideIcon } from 'lucide-react'
import { Button } from './button'

interface StatusStateProps {
  title: string
  description: string
  icon?: LucideIcon
  actionLabel?: string
  onAction?: () => void
  compact?: boolean
}

export function StatusState({ title, description, icon: Icon = Inbox, actionLabel, onAction, compact }: StatusStateProps) {
  return (
    <div className={`surface flex flex-col items-center justify-center text-center ${compact ? 'min-h-44 p-5' : 'min-h-72 p-8'}`}>
      <span className="mb-3 grid size-10 place-items-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon aria-hidden className="size-5" />
      </span>
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
      <p className="mt-1 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
      {actionLabel && onAction && <Button className="mt-4" variant="secondary" icon={RefreshCw} onClick={onAction}>{actionLabel}</Button>}
    </div>
  )
}

export function LoadingState({ label = '데이터를 불러오는 중입니다.' }: { label?: string }) {
  return (
    <div className="surface flex min-h-52 flex-col items-center justify-center p-6 text-center" role="status">
      <LoaderCircle className="size-6 animate-spin text-brand-600" aria-hidden />
      <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
      <p className="mt-1 text-xs text-slate-500">무료 서버가 깨어나는 데 최대 1분 정도 걸릴 수 있어요.</p>
    </div>
  )
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return <StatusState title="정보를 불러오지 못했습니다" description="잠시 후 다시 시도해 주세요. 문제가 계속되면 네트워크 연결을 확인해 주세요." icon={AlertTriangle} actionLabel="다시 시도" onAction={onRetry} />
}
