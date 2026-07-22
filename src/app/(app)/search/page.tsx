'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, ChevronRight, Plus, Search, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useEffect, useState, type KeyboardEvent } from 'react'
import { InstrumentLogo, LogoAttribution } from '@/components/instrument-logo'
import { PageHeading } from '@/components/page-heading'
import { Button } from '@/components/ui/button'
import { ErrorState, StatusState } from '@/components/ui/status-state'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { instrumentApi, portfolioApi } from '@/lib/api/services'
import type { Instrument, InstrumentType, Market } from '@/lib/api/types'
import { queryKeys } from '@/lib/query-keys'

export default function SearchPage() {
  const t = useTranslations('search')
  const common = useTranslations('common')
  const queryClient = useQueryClient()
  const [keyword, setKeyword] = useState('')
  const [market, setMarket] = useState<Market | ''>('')
  const [type, setType] = useState<InstrumentType | ''>('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const debouncedKeyword = useDebouncedValue(keyword.trim())
  const instruments = useQuery({
    queryKey: queryKeys.instruments(debouncedKeyword, market, type, 50),
    queryFn: () => instrumentApi.search({ query: debouncedKeyword, market: market || undefined, type: type || undefined, limit: 50 }),
  })
  const portfolio = useQuery({ queryKey: queryKeys.portfolio, queryFn: portfolioApi.list })
  const addMutation = useMutation({
    mutationFn: portfolioApi.add,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.portfolio }),
  })
  const portfolioIds = new Set(portfolio.data?.map((item) => item.instrumentId))
  const logoAttributionUrl = instruments.data?.find((item) => item.logoAttributionUrl)?.logoAttributionUrl ?? null

  useEffect(() => setActiveIndex(-1), [debouncedKeyword, market, type])

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const results = instruments.data ?? []
    if (!results.length) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) => current >= results.length - 1 ? 0 : current + 1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => current <= 0 ? results.length - 1 : current - 1)
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault()
      const selected = results[activeIndex]
      if (!portfolioIds.has(selected.id) && !addMutation.isPending) addMutation.mutate({ instrumentId: selected.id })
    } else if (event.key === 'Escape') {
      setActiveIndex(-1)
    }
  }

  return (
    <>
      <PageHeading eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />
      <div className="surface mb-4 flex flex-col gap-3 p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search aria-hidden className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <label htmlFor="instrument-search" className="sr-only">{t('inputLabel')}</label>
          <input id="instrument-search" className="field pl-9" value={keyword} onChange={(event) => setKeyword(event.target.value)} onKeyDown={handleSearchKeyDown} placeholder={t('placeholder')} autoComplete="off" aria-describedby="search-help" />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-slate-400" aria-hidden />
          <label htmlFor="instrument-market" className="sr-only">{t('market')}</label>
          <select id="instrument-market" className="field min-w-28" value={market} onChange={(event) => setMarket(event.target.value as Market | '')}>
            <option value="">{t('allMarkets')}</option><option value="KR">{common('korea')}</option><option value="US">{common('unitedStates')}</option>
          </select>
          <label htmlFor="instrument-type" className="sr-only">{t('type')}</label>
          <select id="instrument-type" className="field min-w-32" value={type} onChange={(event) => setType(event.target.value as InstrumentType | '')}>
            <option value="">{t('allTypes')}</option><option value="STOCK">{common('stock')}</option><option value="ETF">{common('etf')}</option>
          </select>
        </div>
        <p id="search-help" className="text-[11px] text-slate-500 sm:hidden">{t('keyboardHelp')}</p>
      </div>

      {instruments.isLoading ? <SearchSkeleton />
        : instruments.isError ? <ErrorState onRetry={() => void instruments.refetch()} />
        : !instruments.data?.length ? <StatusState title={t('emptyTitle')} description={t('emptyDescription')} />
        : (
          <div className="surface overflow-hidden">
            <div className="grid grid-cols-[132px_minmax(0,1fr)_72px_72px_178px] border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/70 max-sm:hidden">
              <span>{t('ticker')}</span><span>{t('company')}</span><span>{t('market')}</span><span>{t('type')}</span><span className="text-right">{t('manage')}</span>
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {instruments.data.map((instrument, index) => <InstrumentRow key={instrument.id} instrument={instrument} exactMatch={Boolean(debouncedKeyword) && instrument.ticker.toLocaleUpperCase() === debouncedKeyword.toLocaleUpperCase()} active={activeIndex === index} added={portfolioIds.has(instrument.id)} pending={addMutation.isPending && addMutation.variables?.instrumentId === instrument.id} onFocus={() => setActiveIndex(index)} onAdd={() => addMutation.mutate({ instrumentId: instrument.id })} />)}
            </ul>
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-4 py-2 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">
              <span>{t('total', { count: instruments.data.length })}</span>
              <LogoAttribution url={logoAttributionUrl} />
            </div>
          </div>
        )}
      {addMutation.isError && <div role="alert" className="fixed bottom-4 right-4 rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-red-600 shadow-xl dark:border-red-900 dark:bg-slate-900">{t('addFailed')}</div>}
    </>
  )
}

function InstrumentRow({ instrument, exactMatch, active, added, pending, onFocus, onAdd }: { instrument: Instrument; exactMatch: boolean; active: boolean; added: boolean; pending: boolean; onFocus: () => void; onAdd: () => void }) {
  const t = useTranslations('search')
  return (
    <li className={`group grid items-center gap-2 px-4 py-3 transition hover:bg-brand-50/60 sm:grid-cols-[132px_minmax(0,1fr)_72px_72px_178px] dark:hover:bg-brand-700/10 ${exactMatch ? 'bg-brand-50/70 dark:bg-brand-700/10' : active ? 'bg-slate-50 dark:bg-slate-800/50' : ''}`}>
      <Link href={`/instruments/${instrument.id}`} className="flex items-center gap-2 rounded font-mono text-sm font-bold text-slate-950 group-hover:underline hover:text-brand-700 dark:text-white dark:hover:text-brand-100"><InstrumentLogo companyName={instrument.companyName} ticker={instrument.ticker} logoUrl={instrument.logoUrl} /><span>{instrument.ticker}</span>{exactMatch && <span className="hidden rounded bg-brand-100 px-1.5 py-0.5 font-sans text-[10px] font-bold text-brand-700 no-underline lg:inline dark:bg-brand-700/30 dark:text-brand-100">{t('exactMatch')}</span>}</Link>
      <span className="min-w-0"><Link href={`/instruments/${instrument.id}`} className="block truncate rounded text-sm text-slate-700 group-hover:underline hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-100">{instrument.companyName}</Link><span className="mt-1 flex gap-1.5 sm:hidden"><MarketBadge market={instrument.market} /><TypeBadge type={instrument.type} /></span></span>
      <MarketBadge market={instrument.market} className="max-sm:hidden" />
      <TypeBadge type={instrument.type} className="max-sm:hidden" />
      <span className="flex items-center gap-1.5 justify-self-start sm:justify-self-end">
        <Link href={`/instruments/${instrument.id}`} className="inline-flex h-10 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white">{t('details')}<ChevronRight className="size-3.5" /></Link>
        <Button variant={added ? 'ghost' : 'secondary'} icon={added ? Check : Plus} disabled={added} loading={pending} onFocus={onFocus} onClick={onAdd}>{added ? t('added') : t('add')}</Button>
      </span>
    </li>
  )
}

function MarketBadge({ market, className = '' }: { market: Market; className?: string }) {
  return <span className={`w-fit rounded-md px-2 py-1 text-[11px] font-bold ${market === 'KR' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' : 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'} ${className}`}>{market}</span>
}

function TypeBadge({ type, className = '' }: { type: InstrumentType; className?: string }) {
  return <span className={`w-fit rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300 ${className}`}>{type}</span>
}

function SearchSkeleton() {
  return <div className="surface divide-y divide-slate-100 dark:divide-slate-800">{[1, 2, 3, 4, 5].map((item) => <div key={item} className="flex items-center gap-4 p-4"><div className="size-8 shrink-0 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" /><div className="h-4 w-14 animate-pulse rounded bg-slate-200 dark:bg-slate-800" /><div className="h-4 flex-1 animate-pulse rounded bg-slate-200 dark:bg-slate-800" /><div className="h-8 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" /></div>)}</div>
}
