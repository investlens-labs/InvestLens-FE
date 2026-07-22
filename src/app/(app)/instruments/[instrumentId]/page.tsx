'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, BarChart3, Globe2, Plus, Tag, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { InstrumentLogo, LogoAttribution } from '@/components/instrument-logo'
import { Button } from '@/components/ui/button'
import { ErrorState, LoadingState, StatusState } from '@/components/ui/status-state'
import { InstrumentChart } from '@/components/instrument-chart'
import { InstrumentNews } from '@/components/instrument-news'
import { ScrollToNewsButton } from '@/components/scroll-to-news-button'
import { ApiError } from '@/lib/api/client'
import { instrumentApi, portfolioApi } from '@/lib/api/services'
import { queryKeys } from '@/lib/query-keys'

export default function InstrumentDetailPage() {
  const { instrumentId } = useParams<{ instrumentId: string }>()
  const t = useTranslations('instrument')
  const common = useTranslations('common')
  const queryClient = useQueryClient()
  const instrument = useQuery({
    queryKey: queryKeys.instrumentDetail(instrumentId),
    queryFn: () => instrumentApi.get(instrumentId),
    enabled: Boolean(instrumentId),
  })
  const portfolio = useQuery({ queryKey: queryKeys.portfolio, queryFn: portfolioApi.list })
  const refreshPortfolioData = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.portfolio })
    void queryClient.invalidateQueries({ queryKey: ['news'] })
  }
  const addMutation = useMutation({
    mutationFn: portfolioApi.add,
    onSuccess: refreshPortfolioData,
  })
  const removeMutation = useMutation({ mutationFn: portfolioApi.remove, onSuccess: refreshPortfolioData })

  if (instrument.isLoading) return <LoadingState label={t('loading')} />
  if (instrument.error instanceof ApiError && instrument.error.status === 404) {
    return <StatusState title={t('notFoundTitle')} description={t('notFoundDescription')} />
  }
  if (instrument.isError) return <ErrorState onRetry={() => void instrument.refetch()} />
  if (!instrument.data) return null

  const data = instrument.data
  const portfolioItem = portfolio.data?.find((item) => item.instrumentId === data.id)
  const isAdded = Boolean(portfolioItem)
  const portfolioPending = addMutation.isPending || removeMutation.isPending

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/search" className="mb-4 inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"><ArrowLeft className="size-4" />{t('backToSearch')}</Link>
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="surface overflow-hidden">
          <header className="border-b border-slate-200 p-5 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-md px-2 py-1 text-xs font-bold ${data.market === 'KR' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' : 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'}`}>{data.market === 'KR' ? t('krMarket') : t('usMarket')}</span>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{data.type === 'STOCK' ? `${common('stock')} · STOCK` : common('etf')}</span>
            </div>
            <div className="mt-4 flex items-start gap-4">
              <InstrumentLogo companyName={data.companyName} ticker={data.ticker} logoUrl={data.logoUrl} size={48} />
              <div className="min-w-0"><h1 className="truncate text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{data.companyName}</h1><p className="mt-1 font-mono text-sm font-bold tracking-wide text-brand-600">{data.ticker}</p></div>
            </div>
          </header>
          <InstrumentChart instrumentId={data.id} />
          <div className="p-5">
            <h2 className="text-sm font-semibold text-slate-950 dark:text-white">{t('info')}</h2>
            <dl className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              <InfoRow icon={BarChart3} label={t('ticker')} value={data.ticker} mono />
              <InfoRow icon={Globe2} label={t('market')} value={data.market === 'KR' ? t('krValue') : t('usValue')} />
              <InfoRow icon={Tag} label={t('type')} value={data.type === 'STOCK' ? t('stockValue') : t('etfValue')} />
            </dl>
            <p className="mt-3 text-xs leading-5 text-slate-500">{t('sourceNote')}</p>
          </div>
        </section>

        <aside className="surface p-4 lg:sticky lg:top-20">
          <h2 className="text-sm font-semibold text-slate-950 dark:text-white">{t('portfolio')}</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">{t('portfolioDescription')}</p>
          <Button className="mt-4 w-full" variant={isAdded ? 'danger' : 'primary'} icon={isAdded ? Trash2 : Plus} disabled={portfolio.isLoading || portfolioPending} loading={portfolioPending} onClick={() => portfolioItem ? removeMutation.mutate(portfolioItem.id) : addMutation.mutate({ instrumentId: data.id })}>{isAdded ? t('remove') : t('add')}</Button>
          {(addMutation.isError || removeMutation.isError) && <p role="alert" className="mt-2 text-xs text-red-600">{t('portfolioFailed')}</p>}
          <Link href="/dashboard" className="mt-2 inline-flex h-9 w-full items-center justify-center rounded-lg text-xs font-semibold text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-700/10">{t('viewPersonalizedNews')}</Link>
        </aside>
      </div>
      <InstrumentNews key={data.id} instrumentId={data.id} ticker={data.ticker} />
      <ScrollToNewsButton />
      <div className="mt-4 text-right"><LogoAttribution url={data.logoAttributionUrl} /></div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value, mono }: { icon: typeof BarChart3; label: string; value: string; mono?: boolean }) {
  return <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center px-3.5 py-3"><dt className="flex items-center gap-2 text-xs font-medium text-slate-500"><Icon className="size-3.5" />{label}</dt><dd className={`text-right text-sm font-semibold text-slate-800 dark:text-slate-200 ${mono ? 'font-mono' : ''}`}>{value}</dd></div>
}
