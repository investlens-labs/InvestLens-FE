'use client'

import { AlertTriangle, Inbox, LoaderCircle, RefreshCw, type LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
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

export function LoadingState({ label }: { label?: string }) {
  const t = useTranslations('status')
  return (
    <div className="surface flex min-h-52 flex-col items-center justify-center p-6 text-center" role="status">
      <LoaderCircle className="size-6 animate-spin text-brand-600" aria-hidden />
      <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">{label ?? t('loading')}</p>
      <p className="mt-1 text-xs text-slate-500">{t('coldStart')}</p>
    </div>
  )
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations('status')
  const common = useTranslations('common')
  return <StatusState title={t('errorTitle')} description={t('errorDescription')} icon={AlertTriangle} actionLabel={common('retry')} onAction={onRetry} />
}
