'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, BarChart3, Check, Globe2, Plus, Tag } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ErrorState, LoadingState, StatusState } from '@/components/ui/status-state'
import { ApiError } from '@/lib/api/client'
import { instrumentApi, portfolioApi } from '@/lib/api/services'
import { queryKeys } from '@/lib/query-keys'

export default function InstrumentDetailPage() {
  const { instrumentId } = useParams<{ instrumentId: string }>()
  const queryClient = useQueryClient()
  const instrument = useQuery({
    queryKey: queryKeys.instrumentDetail(instrumentId),
    queryFn: () => instrumentApi.get(instrumentId),
    enabled: Boolean(instrumentId),
  })
  const portfolio = useQuery({ queryKey: queryKeys.portfolio, queryFn: portfolioApi.list })
  const addMutation = useMutation({
    mutationFn: portfolioApi.add,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.portfolio })
      void queryClient.invalidateQueries({ queryKey: ['news'] })
    },
  })

  if (instrument.isLoading) return <LoadingState label="종목 상세 정보를 불러오는 중입니다." />
  if (instrument.error instanceof ApiError && instrument.error.status === 404) {
    return <StatusState title="종목을 찾을 수 없습니다" description="삭제되었거나 올바르지 않은 종목 주소입니다." />
  }
  if (instrument.isError) return <ErrorState onRetry={() => void instrument.refetch()} />
  if (!instrument.data) return null

  const data = instrument.data
  const isAdded = portfolio.data?.some((item) => item.instrumentId === data.id) ?? false

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/search" className="mb-4 inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"><ArrowLeft className="size-4" />종목 검색으로</Link>
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="surface overflow-hidden">
          <header className="border-b border-slate-200 p-5 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-md px-2 py-1 text-xs font-bold ${data.market === 'KR' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' : 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'}`}>{data.market === 'KR' ? '한국 시장 · KR' : '미국 시장 · US'}</span>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{data.type === 'STOCK' ? '주식 · STOCK' : 'ETF'}</span>
            </div>
            <div className="mt-4 flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-slate-950 font-mono text-sm font-bold text-white dark:bg-slate-100 dark:text-slate-950">{data.ticker.slice(0, 4)}</span>
              <div className="min-w-0"><h1 className="truncate text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{data.companyName}</h1><p className="mt-1 font-mono text-sm font-bold tracking-wide text-brand-600">{data.ticker}</p></div>
            </div>
          </header>
          <div className="p-5">
            <h2 className="text-sm font-semibold text-slate-950 dark:text-white">종목 정보</h2>
            <dl className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              <InfoRow icon={BarChart3} label="티커" value={data.ticker} mono />
              <InfoRow icon={Globe2} label="시장" value={data.market === 'KR' ? '한국 (KR)' : '미국 (US)'} />
              <InfoRow icon={Tag} label="유형" value={data.type === 'STOCK' ? '주식 (STOCK)' : '상장지수펀드 (ETF)'} />
            </dl>
            <p className="mt-3 text-xs leading-5 text-slate-500">종목 정보는 InvestLens 백엔드의 최신 종목 마스터를 기준으로 제공됩니다.</p>
          </div>
        </section>

        <aside className="surface p-4 lg:sticky lg:top-20">
          <h2 className="text-sm font-semibold text-slate-950 dark:text-white">포트폴리오</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">등록하면 이 종목과 관련된 뉴스 영향 분석을 맞춤 피드에서 확인할 수 있습니다.</p>
          <Button className="mt-4 w-full" variant={isAdded ? 'secondary' : 'primary'} icon={isAdded ? Check : Plus} disabled={isAdded || portfolio.isLoading} loading={addMutation.isPending} onClick={() => addMutation.mutate({ instrumentId: data.id })}>{isAdded ? '포트폴리오에 등록됨' : '포트폴리오에 추가'}</Button>
          {addMutation.isError && <p role="alert" className="mt-2 text-xs text-red-600">종목을 추가하지 못했습니다. 잠시 후 다시 시도해 주세요.</p>}
          <Link href="/dashboard" className="mt-2 inline-flex h-9 w-full items-center justify-center rounded-lg text-xs font-semibold text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-700/10">맞춤 뉴스 확인</Link>
        </aside>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value, mono }: { icon: typeof BarChart3; label: string; value: string; mono?: boolean }) {
  return <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center px-3.5 py-3"><dt className="flex items-center gap-2 text-xs font-medium text-slate-500"><Icon className="size-3.5" />{label}</dt><dd className={`text-right text-sm font-semibold text-slate-800 dark:text-slate-200 ${mono ? 'font-mono' : ''}`}>{value}</dd></div>
}
