'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LoaderCircle, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useFormatter, useTranslations } from 'next-intl'
import { PageHeading } from '@/components/page-heading'
import { Button } from '@/components/ui/button'
import { ErrorState, LoadingState, StatusState } from '@/components/ui/status-state'
import { portfolioApi } from '@/lib/api/services'
import { queryKeys } from '@/lib/query-keys'

export default function PortfolioPage() {
  const t = useTranslations('portfolio')
  const common = useTranslations('common')
  const format = useFormatter()
  const queryClient = useQueryClient()
  const portfolio = useQuery({ queryKey: queryKeys.portfolio, queryFn: portfolioApi.list })
  const removeMutation = useMutation({
    mutationFn: portfolioApi.remove,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.portfolio })
      void queryClient.invalidateQueries({ queryKey: ['news'] })
    },
  })

  return (
    <>
      <PageHeading eyebrow={t('eyebrow')} title={t('title')} description={t('description')} action={<Link href="/search"><Button icon={Plus}>{t('addInstrument')}</Button></Link>} />
      {portfolio.isLoading ? <LoadingState label={t('loading')} />
        : portfolio.isError ? <ErrorState onRetry={() => void portfolio.refetch()} />
        : !portfolio.data?.length ? <StatusState title={t('emptyTitle')} description={t('emptyDescription')} actionLabel={t('addFirst')} onAction={() => { window.location.href = '/search' }} />
        : (
          <div className="surface overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60"><span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t('registered')}</span><span className="text-xs text-slate-500">{common('items', { count: portfolio.data.length })}</span></div>
            <div className="grid grid-cols-[90px_minmax(0,1fr)_80px_130px_64px] border-b border-slate-100 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-slate-400 max-md:hidden dark:border-slate-800"><span>{t('ticker')}</span><span>{t('company')}</span><span>{t('type')}</span><span>{t('registeredAt')}</span><span className="text-right">{t('delete')}</span></div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {portfolio.data.map((item) => (
                <li key={item.id} className="group grid grid-cols-[72px_minmax(0,1fr)_40px] items-center gap-3 px-4 py-3 transition hover:bg-brand-50/60 md:grid-cols-[90px_minmax(0,1fr)_80px_130px_64px] md:gap-2 dark:hover:bg-brand-700/10">
                  <Link href={`/instruments/${item.instrumentId}`} className="rounded font-mono text-sm font-bold text-slate-950 group-hover:underline hover:text-brand-700 dark:text-white dark:hover:text-brand-100">{item.ticker}</Link>
                  <span className="min-w-0">
                    <Link href={`/instruments/${item.instrumentId}`} className="block truncate rounded text-sm text-slate-700 group-hover:underline hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-100">{item.companyName}</Link>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500 md:hidden"><span>{item.type}</span><span aria-hidden>·</span><span>{format.dateTime(new Date(item.createdAt), { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></span>
                  </span>
                  <span className="hidden w-fit rounded bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 md:block dark:bg-slate-800 dark:text-slate-300">{item.type}</span>
                  <span className="hidden text-xs text-slate-500 md:block">{format.dateTime(new Date(item.createdAt), { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  <DeleteButton
                    ticker={item.ticker}
                    pending={removeMutation.isPending && removeMutation.variables === item.id}
                    disabled={removeMutation.isPending}
                    onClick={() => removeMutation.mutate(item.id)}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      {removeMutation.isError && <p role="alert" className="mt-3 text-sm text-red-600">{t('deleteFailed')}</p>}
    </>
  )
}

function DeleteButton({ ticker, pending, disabled, onClick }: { ticker: string; pending: boolean; disabled: boolean; onClick: () => void }) {
  const t = useTranslations('portfolio')
  return (
    <button
      type="button"
      aria-label={pending ? t('deletingLabel', { ticker }) : t('deleteLabel', { ticker })}
      aria-busy={pending}
      title={pending ? t('deleting') : t('deleteFromPortfolio')}
      disabled={disabled}
      onClick={onClick}
      className="grid size-9 justify-self-end place-items-center rounded-lg border border-transparent text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:border-red-900 dark:hover:bg-red-950/50 dark:hover:text-red-400"
    >
      {pending ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : <Trash2 aria-hidden className="size-4" />}
    </button>
  )
}
