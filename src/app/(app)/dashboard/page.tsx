'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowRight, BriefcaseBusiness, Newspaper, Search, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { NewsFeed } from '@/components/news-feed'
import { PageHeading } from '@/components/page-heading'
import { portfolioApi } from '@/lib/api/services'
import { queryKeys } from '@/lib/query-keys'

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const common = useTranslations('common')
  const portfolio = useQuery({ queryKey: queryKeys.portfolio, queryFn: portfolioApi.list })

  return (
    <>
      <PageHeading eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />
      <section className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label={t('summaryMetrics')}>
        <SummaryCard icon={BriefcaseBusiness} label={t('watchlist')} value={portfolio.isLoading ? '—' : common('items', { count: portfolio.data?.length ?? 0 })} sub={t('portfolioBasis')} />
        <SummaryCard icon={Newspaper} label={t('newsAnalysis')} value={t('realtime')} sub={t('directionScore')} />
        <SummaryCard icon={ShieldCheck} label={t('analysisRange')} value={t('rangeValue')} sub={t('impactPotential')} />
        <Link href="/search" className="surface group flex min-h-24 items-center gap-3 p-4 transition hover:border-brand-500/40">
          <span className="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100"><Search className="size-5" /></span>
          <span><span className="block text-sm font-semibold text-slate-900 dark:text-white">{t('addInstrument')}</span><span className="mt-1 flex items-center gap-1 text-xs text-slate-500">{t('goToSearch')} <ArrowRight className="size-3 transition group-hover:translate-x-0.5" /></span></span>
        </Link>
      </section>
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <NewsFeed />
        <aside className="surface overflow-hidden xl:sticky xl:top-20">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{t('myPortfolio')}</h2><Link href="/portfolio" className="text-xs font-semibold text-brand-600 hover:underline">{t('manage')}</Link>
          </div>
          <div className="p-2">
            {portfolio.isLoading ? <p className="p-3 text-xs text-slate-500">{t('loadingInstruments')}</p>
              : portfolio.data?.length ? portfolio.data.slice(0, 7).map((item) => (
                <Link key={item.id} href={`/instruments/${item.instrumentId}`} className="group flex items-center gap-3 rounded-lg px-2.5 py-2 transition hover:bg-brand-50/80 dark:hover:bg-brand-700/15">
                  <span className="grid size-8 shrink-0 place-items-center rounded-md bg-slate-100 font-mono text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-100">{item.ticker.slice(0, 4)}</span>
                  <span className="min-w-0"><strong className="block text-xs text-slate-900 group-hover:underline dark:text-white">{item.ticker}</strong><span className="block truncate text-[11px] text-slate-500 group-hover:underline">{item.companyName}</span></span>
                  <span className="ml-auto rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 dark:bg-slate-800">{item.type}</span>
                </Link>
              )) : <div className="p-4 text-center"><p className="text-sm font-medium text-slate-800 dark:text-slate-200">{t('emptyTitle')}</p><p className="mt-1 text-xs leading-5 text-slate-500">{t('emptyDescription')}</p><Link href="/search" className="mt-3 inline-flex text-xs font-semibold text-brand-600 hover:underline">{t('addFirst')}</Link></div>}
          </div>
        </aside>
      </div>
    </>
  )
}

function SummaryCard({ icon: Icon, label, value, sub }: { icon: typeof Newspaper; label: string; value: string; sub: string }) {
  return <div className="surface flex min-h-24 items-center gap-3 p-4"><span className="grid size-10 place-items-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"><Icon className="size-5" /></span><span><span className="block text-xs text-slate-500">{label}</span><strong className="mt-0.5 block text-base text-slate-950 dark:text-white">{value}</strong><span className="mt-0.5 block text-[11px] text-slate-400">{sub}</span></span></div>
}
