'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ExternalLink, Info, Newspaper } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ImpactBadge } from '@/components/impact-badge'
import { ErrorState, LoadingState, StatusState } from '@/components/ui/status-state'
import { newsApi } from '@/lib/api/services'
import { formatDate } from '@/lib/format'
import { queryKeys } from '@/lib/query-keys'

export default function NewsDetailPage() {
  const { newsId } = useParams<{ newsId: string }>()
  const detail = useQuery({ queryKey: queryKeys.newsDetail(newsId), queryFn: () => newsApi.detail(newsId), enabled: Boolean(newsId) })

  if (detail.isLoading) return <LoadingState label="뉴스 분석 상세를 불러오는 중입니다." />
  if (detail.isError) return <ErrorState onRetry={() => void detail.refetch()} />
  if (!detail.data) return <StatusState title="뉴스를 찾을 수 없습니다" description="삭제되었거나 잘못된 주소일 수 있습니다." />

  const news = detail.data
  const title = news.translatedTitle || news.originalTitle
  const content = news.translatedContent || news.originalContent

  return (
    <article className="mx-auto max-w-5xl">
      <Link href="/dashboard" className="mb-4 inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"><ArrowLeft className="size-4" />뉴스 피드로</Link>
      <div className="surface overflow-hidden">
        <header className="border-b border-slate-200 p-5 sm:p-6 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500"><span className="font-semibold text-brand-600">{news.source || '출처 미상'}</span><span>·</span><time dateTime={news.publishedAt}>{formatDate(news.publishedAt)}</time><span className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">AI {news.analysisStatus === 'COMPLETED' ? '분석 완료' : news.analysisStatus === 'PENDING' ? '분석 중' : '분석 실패'}</span></div>
          <h1 className="mt-3 text-xl font-semibold leading-8 tracking-tight text-slate-950 sm:text-2xl dark:text-white">{title}</h1>
          {news.originalTitle && news.originalTitle !== title && <p className="mt-2 text-sm leading-6 text-slate-500">{news.originalTitle}</p>}
          {news.originalUrl && <a href={news.originalUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">원문 기사 보기<ExternalLink className="size-3.5" /></a>}
        </header>

        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-6">
            <section aria-labelledby="summary-title" className="rounded-xl border border-brand-100 bg-brand-50/70 p-4 dark:border-brand-700/40 dark:bg-brand-700/10">
              <h2 id="summary-title" className="flex items-center gap-2 text-sm font-semibold text-brand-700 dark:text-brand-100"><Newspaper className="size-4" />핵심 요약</h2>
              <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">{news.summary || '요약 정보가 없습니다.'}</p>
            </section>
            {news.marketContext && <section><h2 className="text-base font-semibold text-slate-950 dark:text-white">시장 맥락</h2><p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-400">{news.marketContext}</p></section>}
            <section><h2 className="text-base font-semibold text-slate-950 dark:text-white">기사 내용</h2><div className="mt-3 whitespace-pre-line text-[15px] leading-8 text-slate-700 dark:text-slate-300">{content || '기사 본문을 제공하지 않습니다. 원문 링크에서 확인해 주세요.'}</div></section>
          </div>
          <aside className="space-y-4">
            <section className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-950 dark:text-white">종목별 영향 분석</h2>
              <div className="mt-3 space-y-3">
                {news.impacts?.length ? news.impacts.map((impact) => (
                  <Link key={`${impact.instrumentId}-${impact.direction}`} href={`/instruments/${impact.instrumentId}`} className="group block rounded-lg bg-slate-50 p-3 transition hover:bg-brand-50 hover:ring-1 hover:ring-brand-100 dark:bg-slate-800/70 dark:hover:bg-brand-700/15 dark:hover:ring-brand-700/30">
                    <div className="flex items-center justify-between gap-2"><span><strong className="font-mono text-sm text-slate-950 group-hover:underline dark:text-white">{impact.ticker}</strong><span className="ml-1.5 text-[11px] text-slate-500">{impact.instrumentType}</span></span>{impact.aiAnalyzed ? <ImpactBadge direction={impact.direction} score={impact.score} /> : <span className="rounded-md bg-white px-2 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-300">AI 분석 준비 중</span>}</div>
                    <p className="mt-1 truncate text-xs text-slate-500 group-hover:underline">{impact.companyName}</p>
                    {impact.aiAnalyzed && <><p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400">{impact.reason}</p>{impact.analysisModel && <p className="mt-1 text-[10px] text-slate-400">AI · {impact.analysisModel}</p>}</>}
                  </Link>
                )) : <p className="text-xs leading-5 text-slate-500">연관 종목 영향 분석이 아직 없습니다.</p>}
              </div>
            </section>
            <section className="flex gap-2 rounded-xl bg-slate-100 p-3.5 text-xs leading-5 text-slate-500 dark:bg-slate-800/70 dark:text-slate-400"><Info className="mt-0.5 size-4 shrink-0" /><p>{news.disclaimer || '본 분석은 투자 참고 정보이며 투자 조언이나 주가 예측을 제공하지 않습니다.'}</p></section>
          </aside>
        </div>
      </div>
    </article>
  )
}
