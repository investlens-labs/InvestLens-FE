'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, ChevronRight, Plus, Search, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, type KeyboardEvent } from 'react'
import { PageHeading } from '@/components/page-heading'
import { Button } from '@/components/ui/button'
import { ErrorState, StatusState } from '@/components/ui/status-state'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { instrumentApi, portfolioApi } from '@/lib/api/services'
import type { Instrument, InstrumentType, Market } from '@/lib/api/types'
import { queryKeys } from '@/lib/query-keys'

export default function SearchPage() {
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
      <PageHeading eyebrow="Discover" title="종목 검색" description="티커 또는 기업명으로 검색하고 포트폴리오에 추가하세요." />
      <div className="surface mb-4 flex flex-col gap-3 p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search aria-hidden className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <label htmlFor="instrument-search" className="sr-only">티커 또는 종목명 검색</label>
          <input id="instrument-search" className="field pl-9" value={keyword} onChange={(event) => setKeyword(event.target.value)} onKeyDown={handleSearchKeyDown} placeholder="예: 삼성전자, 069500, AAPL, QQQ" autoComplete="off" aria-describedby="search-help" />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-slate-400" aria-hidden />
          <label htmlFor="instrument-market" className="sr-only">시장</label>
          <select id="instrument-market" className="field min-w-28" value={market} onChange={(event) => setMarket(event.target.value as Market | '')}>
            <option value="">전체 시장</option><option value="KR">한국</option><option value="US">미국</option>
          </select>
          <label htmlFor="instrument-type" className="sr-only">종목 유형</label>
          <select id="instrument-type" className="field min-w-32" value={type} onChange={(event) => setType(event.target.value as InstrumentType | '')}>
            <option value="">전체 유형</option><option value="STOCK">주식</option><option value="ETF">ETF</option>
          </select>
        </div>
        <p id="search-help" className="text-[11px] text-slate-500 sm:hidden">검색창에서 ↑↓로 결과를 선택하고 Enter로 추가할 수 있습니다.</p>
      </div>

      {instruments.isLoading ? <SearchSkeleton />
        : instruments.isError ? <ErrorState onRetry={() => void instruments.refetch()} />
        : !instruments.data?.length ? <StatusState title="검색 결과가 없습니다" description="티커 철자나 종목 유형을 바꿔 다시 검색해 보세요." />
        : (
          <div className="surface overflow-hidden">
            <div className="grid grid-cols-[100px_minmax(0,1fr)_72px_72px_178px] border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/70 max-sm:hidden">
              <span>티커</span><span>종목명</span><span>시장</span><span>유형</span><span className="text-right">관리</span>
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {instruments.data.map((instrument, index) => <InstrumentRow key={instrument.id} instrument={instrument} exactMatch={Boolean(debouncedKeyword) && instrument.ticker.toLocaleUpperCase() === debouncedKeyword.toLocaleUpperCase()} active={activeIndex === index} added={portfolioIds.has(instrument.id)} pending={addMutation.isPending && addMutation.variables?.instrumentId === instrument.id} onFocus={() => setActiveIndex(index)} onAdd={() => addMutation.mutate({ instrumentId: instrument.id })} />)}
            </ul>
            <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-2.5 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">총 {instruments.data.length}개 종목</div>
          </div>
        )}
      {addMutation.isError && <div role="alert" className="fixed bottom-4 right-4 rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-red-600 shadow-xl dark:border-red-900 dark:bg-slate-900">종목을 추가하지 못했습니다. 이미 등록된 종목인지 확인해 주세요.</div>}
    </>
  )
}

function InstrumentRow({ instrument, exactMatch, active, added, pending, onFocus, onAdd }: { instrument: Instrument; exactMatch: boolean; active: boolean; added: boolean; pending: boolean; onFocus: () => void; onAdd: () => void }) {
  return (
    <li className={`grid items-center gap-2 px-4 py-3 transition sm:grid-cols-[100px_minmax(0,1fr)_72px_72px_178px] ${exactMatch ? 'bg-brand-50/70 dark:bg-brand-700/10' : active ? 'bg-slate-50 dark:bg-slate-800/50' : ''}`}>
      <Link href={`/instruments/${instrument.id}`} className="flex items-center gap-2 rounded font-mono text-sm font-bold text-slate-950 hover:text-brand-700 dark:text-white dark:hover:text-brand-100"><span>{instrument.ticker}</span>{exactMatch && <span className="hidden rounded bg-brand-100 px-1.5 py-0.5 font-sans text-[10px] font-bold text-brand-700 lg:inline dark:bg-brand-700/30 dark:text-brand-100">정확히 일치</span>}</Link>
      <span className="min-w-0"><Link href={`/instruments/${instrument.id}`} className="block truncate rounded text-sm text-slate-700 hover:text-brand-700 hover:underline dark:text-slate-300 dark:hover:text-brand-100">{instrument.companyName}</Link><span className="mt-1 flex gap-1.5 sm:hidden"><MarketBadge market={instrument.market} /><TypeBadge type={instrument.type} /></span></span>
      <MarketBadge market={instrument.market} className="max-sm:hidden" />
      <TypeBadge type={instrument.type} className="max-sm:hidden" />
      <span className="flex items-center gap-1.5 justify-self-start sm:justify-self-end">
        <Link href={`/instruments/${instrument.id}`} className="inline-flex h-10 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white">상세<ChevronRight className="size-3.5" /></Link>
        <Button variant={added ? 'ghost' : 'secondary'} icon={added ? Check : Plus} disabled={added} loading={pending} onFocus={onFocus} onClick={onAdd}>{added ? '추가됨' : '추가'}</Button>
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
  return <div className="surface divide-y divide-slate-100 dark:divide-slate-800">{[1, 2, 3, 4, 5].map((item) => <div key={item} className="flex items-center gap-4 p-4"><div className="h-4 w-14 animate-pulse rounded bg-slate-200 dark:bg-slate-800" /><div className="h-4 flex-1 animate-pulse rounded bg-slate-200 dark:bg-slate-800" /><div className="h-8 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" /></div>)}</div>
}
