'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowRight, BriefcaseBusiness, Newspaper, Search, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { NewsFeed } from '@/components/news-feed'
import { PageHeading } from '@/components/page-heading'
import { portfolioApi } from '@/lib/api/services'
import { queryKeys } from '@/lib/query-keys'

export default function DashboardPage() {
  const portfolio = useQuery({ queryKey: queryKeys.portfolio, queryFn: portfolioApi.list })

  return (
    <>
      <PageHeading eyebrow="Market briefing" title="투자 뉴스 대시보드" description="내 관심 종목의 주요 뉴스와 시장 영향을 빠르게 파악하세요." />
      <section className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="요약 지표">
        <SummaryCard icon={BriefcaseBusiness} label="관심 종목" value={portfolio.isLoading ? '—' : `${portfolio.data?.length ?? 0}개`} sub="포트폴리오 기준" />
        <SummaryCard icon={Newspaper} label="뉴스 분석" value="실시간" sub="영향 방향·점수 제공" />
        <SummaryCard icon={ShieldCheck} label="분석 범위" value="1–10점" sub="투자 영향 가능성" />
        <Link href="/search" className="surface group flex min-h-24 items-center gap-3 p-4 transition hover:border-brand-500/40">
          <span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100"><Search className="size-5" /></span>
          <span><span className="block text-sm font-semibold text-slate-900 dark:text-white">종목 추가</span><span className="mt-1 flex items-center gap-1 text-xs text-slate-500">검색으로 이동 <ArrowRight className="size-3 transition group-hover:translate-x-0.5" /></span></span>
        </Link>
      </section>
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <NewsFeed />
        <aside className="surface overflow-hidden xl:sticky xl:top-20">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">내 포트폴리오</h2><Link href="/portfolio" className="text-xs font-semibold text-brand-600 hover:underline">관리</Link>
          </div>
          <div className="p-2">
            {portfolio.isLoading ? <p className="p-3 text-xs text-slate-500">종목을 불러오는 중...</p>
              : portfolio.data?.length ? portfolio.data.slice(0, 7).map((item) => (
                <Link key={item.id} href={`/instruments/${item.instrumentId}`} className="group flex items-center gap-3 rounded-lg px-2.5 py-2 transition hover:bg-brand-50/80 dark:hover:bg-brand-700/15">
                  <span className="grid size-8 shrink-0 place-items-center rounded-md bg-slate-100 font-mono text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-100">{item.ticker.slice(0, 4)}</span>
                  <span className="min-w-0"><strong className="block text-xs text-slate-900 group-hover:underline dark:text-white">{item.ticker}</strong><span className="block truncate text-[11px] text-slate-500 group-hover:underline">{item.companyName}</span></span>
                  <span className="ml-auto rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 dark:bg-slate-800">{item.type}</span>
                </Link>
              )) : <div className="p-4 text-center"><p className="text-sm font-medium text-slate-800 dark:text-slate-200">아직 종목이 없어요</p><p className="mt-1 text-xs leading-5 text-slate-500">관심 종목을 추가하면 맞춤 뉴스를 볼 수 있습니다.</p><Link href="/search" className="mt-3 inline-flex text-xs font-semibold text-brand-600 hover:underline">첫 종목 추가하기</Link></div>}
          </div>
        </aside>
      </div>
    </>
  )
}

function SummaryCard({ icon: Icon, label, value, sub }: { icon: typeof Newspaper; label: string; value: string; sub: string }) {
  return <div className="surface flex min-h-24 items-center gap-3 p-4"><span className="grid size-10 place-items-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"><Icon className="size-5" /></span><span><span className="block text-xs text-slate-500">{label}</span><strong className="mt-0.5 block text-base text-slate-950 dark:text-white">{value}</strong><span className="mt-0.5 block text-[11px] text-slate-400">{sub}</span></span></div>
}
