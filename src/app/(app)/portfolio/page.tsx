'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { PageHeading } from '@/components/page-heading'
import { Button } from '@/components/ui/button'
import { ErrorState, LoadingState, StatusState } from '@/components/ui/status-state'
import { portfolioApi } from '@/lib/api/services'
import { formatDate } from '@/lib/format'
import { queryKeys } from '@/lib/query-keys'

export default function PortfolioPage() {
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
      <PageHeading eyebrow="Watchlist" title="내 포트폴리오" description="맞춤 뉴스의 기준이 되는 관심 종목을 관리하세요." action={<Link href="/search"><Button icon={Plus}>종목 추가</Button></Link>} />
      {portfolio.isLoading ? <LoadingState label="포트폴리오를 불러오는 중입니다." />
        : portfolio.isError ? <ErrorState onRetry={() => void portfolio.refetch()} />
        : !portfolio.data?.length ? <StatusState title="포트폴리오가 비어 있습니다" description="첫 관심 종목을 추가하면 관련 뉴스와 영향 분석을 받아볼 수 있어요." actionLabel="종목 추가하기" onAction={() => { window.location.href = '/search' }} />
        : (
          <div className="surface overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60"><span className="text-sm font-semibold text-slate-800 dark:text-slate-200">등록 종목</span><span className="text-xs text-slate-500">{portfolio.data.length}개</span></div>
            <div className="grid grid-cols-[90px_minmax(0,1fr)_80px_130px_64px] border-b border-slate-100 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-slate-400 max-md:hidden dark:border-slate-800"><span>티커</span><span>종목명</span><span>유형</span><span>등록일</span><span className="text-right">삭제</span></div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {portfolio.data.map((item) => (
                <li key={item.id} className="grid items-center gap-2 px-4 py-3 md:grid-cols-[90px_minmax(0,1fr)_80px_130px_64px]">
                  <strong className="font-mono text-sm text-slate-950 dark:text-white">{item.ticker}</strong>
                  <span className="truncate text-sm text-slate-700 dark:text-slate-300">{item.companyName}</span>
                  <span className="w-fit rounded bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{item.type}</span>
                  <span className="text-xs text-slate-500">{formatDate(item.createdAt)}</span>
                  <Button aria-label={`${item.ticker} 삭제`} variant="danger" className="h-9 w-9 justify-self-start px-0 md:justify-self-end" loading={removeMutation.isPending && removeMutation.variables === item.id} disabled={removeMutation.isPending} onClick={() => removeMutation.mutate(item.id)}><Trash2 className="size-4" /></Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      {removeMutation.isError && <p role="alert" className="mt-3 text-sm text-red-600">종목을 삭제하지 못했습니다. 다시 시도해 주세요.</p>}
    </>
  )
}
