'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { PageHeading } from '@/components/page-heading'
import { Button } from '@/components/ui/button'
import { ErrorState, StatusState } from '@/components/ui/status-state'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { instrumentApi, portfolioApi } from '@/lib/api/services'
import type { Instrument, InstrumentType } from '@/lib/api/types'
import { queryKeys } from '@/lib/query-keys'

export default function SearchPage() {
  const queryClient = useQueryClient()
  const [keyword, setKeyword] = useState('')
  const [type, setType] = useState<InstrumentType | ''>('')
  const debouncedKeyword = useDebouncedValue(keyword.trim())
  const instruments = useQuery({ queryKey: queryKeys.instruments(debouncedKeyword, type), queryFn: () => instrumentApi.search(debouncedKeyword, type || undefined) })
  const portfolio = useQuery({ queryKey: queryKeys.portfolio, queryFn: portfolioApi.list })
  const addMutation = useMutation({
    mutationFn: portfolioApi.add,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.portfolio }),
  })
  const portfolioIds = new Set(portfolio.data?.map((item) => item.instrumentId))

  return (
    <>
      <PageHeading eyebrow="Discover" title="종목 검색" description="티커 또는 기업명으로 검색하고 포트폴리오에 추가하세요." />
      <div className="surface mb-4 flex flex-col gap-3 p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search aria-hidden className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <label htmlFor="instrument-search" className="sr-only">티커 또는 종목명 검색</label>
          <input id="instrument-search" className="field pl-9" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="예: NVDA, NVIDIA" autoComplete="off" />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-slate-400" aria-hidden />
          <label htmlFor="instrument-type" className="sr-only">종목 유형</label>
          <select id="instrument-type" className="field min-w-32" value={type} onChange={(event) => setType(event.target.value as InstrumentType | '')}>
            <option value="">전체 유형</option><option value="STOCK">주식</option><option value="ETF">ETF</option>
          </select>
        </div>
      </div>

      {instruments.isLoading ? <SearchSkeleton />
        : instruments.isError ? <ErrorState onRetry={() => void instruments.refetch()} />
        : !instruments.data?.length ? <StatusState title="검색 결과가 없습니다" description="티커 철자나 종목 유형을 바꿔 다시 검색해 보세요." />
        : (
          <div className="surface overflow-hidden">
            <div className="grid grid-cols-[90px_minmax(0,1fr)_80px_110px] border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/70 max-sm:hidden">
              <span>티커</span><span>종목명</span><span>유형</span><span className="text-right">관리</span>
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {instruments.data.map((instrument) => <InstrumentRow key={instrument.id} instrument={instrument} added={portfolioIds.has(instrument.id)} pending={addMutation.isPending && addMutation.variables?.instrumentId === instrument.id} onAdd={() => addMutation.mutate({ instrumentId: instrument.id })} />)}
            </ul>
            <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-2.5 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">총 {instruments.data.length}개 종목</div>
          </div>
        )}
      {addMutation.isError && <div role="alert" className="fixed bottom-4 right-4 rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-red-600 shadow-xl dark:border-red-900 dark:bg-slate-900">종목을 추가하지 못했습니다. 이미 등록된 종목인지 확인해 주세요.</div>}
    </>
  )
}

function InstrumentRow({ instrument, added, pending, onAdd }: { instrument: Instrument; added: boolean; pending: boolean; onAdd: () => void }) {
  return (
    <li className="grid items-center gap-2 px-4 py-3 sm:grid-cols-[90px_minmax(0,1fr)_80px_110px]">
      <strong className="font-mono text-sm text-slate-950 dark:text-white">{instrument.ticker}</strong>
      <span className="truncate text-sm text-slate-700 dark:text-slate-300">{instrument.companyName}</span>
      <span className="w-fit rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{instrument.type}</span>
      <Button variant={added ? 'ghost' : 'secondary'} className="justify-self-start sm:justify-self-end" icon={added ? Check : Plus} disabled={added} loading={pending} onClick={onAdd}>{added ? '추가됨' : '추가'}</Button>
    </li>
  )
}

function SearchSkeleton() {
  return <div className="surface divide-y divide-slate-100 dark:divide-slate-800">{[1, 2, 3, 4, 5].map((item) => <div key={item} className="flex items-center gap-4 p-4"><div className="h-4 w-14 animate-pulse rounded bg-slate-200 dark:bg-slate-800" /><div className="h-4 flex-1 animate-pulse rounded bg-slate-200 dark:bg-slate-800" /><div className="h-8 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" /></div>)}</div>
}
