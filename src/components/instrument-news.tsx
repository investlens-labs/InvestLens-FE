'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { AlertTriangle, ChevronLeft, ChevronRight, Clock3, ExternalLink, Languages, Newspaper, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { ImpactBadge } from '@/components/impact-badge'
import { InstrumentSentiment, InstrumentSentimentSkeleton } from '@/components/instrument-sentiment'
import { StatusState } from '@/components/ui/status-state'
import { instrumentApi } from '@/lib/api/services'
import type { FeedItem, Impact, NewsLanguage } from '@/lib/api/types'
import { formatDate } from '@/lib/format'
import { queryKeys } from '@/lib/query-keys'

const PAGE_SIZE = 20
const languages: Array<{ value: NewsLanguage; label: string }> = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中文' },
]

export function InstrumentNews({ instrumentId, ticker }: { instrumentId: string; ticker: string }) {
  const [page, setPage] = useState(0)
  const [language, setLanguage] = useState<NewsLanguage>('ko')
  const news = useQuery({
    queryKey: queryKeys.instrumentNews(instrumentId, language, page, PAGE_SIZE),
    queryFn: () => instrumentApi.news(instrumentId, { language, page, size: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  })
  const sentiment = useQuery({
    queryKey: queryKeys.instrumentNewsSentiment(instrumentId),
    queryFn: () => instrumentApi.sentiment(instrumentId),
    enabled: news.isSuccess,
  })

  return (
    <section id="instrument-news" aria-labelledby="instrument-news-title" className="mt-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="instrument-news-title" className="flex scroll-mt-14 items-center gap-2 text-base font-semibold text-slate-950 dark:text-white"><Newspaper className="size-4 text-brand-600" />{ticker} 관련 뉴스</h2>
          <p className="mt-1 text-xs text-slate-500">최근 90일 기사와 종목 영향 분석 {news.data ? `· ${news.data.totalElements.toLocaleString()}건` : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          {news.isFetching && !news.isLoading && <span role="status" className="text-xs text-slate-500">뉴스 갱신 중...</span>}
          <Languages className="size-4 text-slate-400" aria-hidden />
          <label htmlFor="news-language" className="sr-only">뉴스 표시 언어</label>
          <select id="news-language" className="field h-9 w-auto min-w-28 py-0 text-[13px]" value={language} onChange={(event) => { setLanguage(event.target.value as NewsLanguage); setPage(0) }}>
            {languages.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </div>
      </div>

      {news.isSuccess && (sentiment.isLoading
        ? <InstrumentSentimentSkeleton />
        : sentiment.data ? <InstrumentSentiment sentiment={sentiment.data} />
          : sentiment.isError ? (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              <span>AI 종합 분석을 불러오지 못했습니다. 기사 목록은 계속 확인할 수 있습니다.</span>
              <button type="button" className="h-8 rounded-lg px-2.5 font-semibold hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:hover:bg-amber-900/40" onClick={() => void sentiment.refetch()}>다시 시도</button>
            </div>
          ) : null)}

      {news.isLoading ? <InstrumentNewsSkeleton />
        : news.isError ? <StatusState compact icon={AlertTriangle} title="관련 뉴스를 수집하지 못했습니다" description="외부 뉴스 제공처의 응답이 지연되었을 수 있습니다. 잠시 후 다시 시도해 주세요." actionLabel="다시 시도" onAction={() => void news.refetch()} />
        : !news.data?.content.length ? <StatusState compact title="아직 관련 뉴스가 없습니다" description="최근 90일 동안 수집된 기사가 없습니다. 새로운 기사가 확인되면 이곳에 표시됩니다." />
        : (
          <>
            <div className={`grid gap-3 transition-opacity ${news.isFetching ? 'opacity-60' : ''}`}>
              {news.data.content.map((item) => <RelatedNewsItem key={item.id} news={item} />)}
            </div>
            {news.data.totalPages > 1 && (
              <nav className="mt-4 flex items-center justify-center gap-3" aria-label={`${ticker} 관련 뉴스 페이지`}>
                <button type="button" className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800" disabled={news.data.first || news.isFetching} onClick={() => setPage((current) => Math.max(0, current - 1))}><ChevronLeft className="size-4" />이전</button>
                <span className="min-w-20 text-center text-xs text-slate-500"><strong className="text-slate-800 dark:text-slate-200">{news.data.number + 1}</strong> / {news.data.totalPages}</span>
                <button type="button" className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800" disabled={news.data.last || news.isFetching} onClick={() => setPage((current) => current + 1)}>다음<ChevronRight className="size-4" /></button>
              </nav>
            )}
          </>
        )}
    </section>
  )
}

export function RelatedNewsItem({ news }: { news: FeedItem }) {
  const displayTitle = news.localized ? (news.translatedTitle || news.title) : news.title

  return (
    <article className="surface group p-4 transition hover:border-brand-500/40 hover:bg-brand-50/30 dark:hover:bg-brand-700/5">
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
        <span className="font-semibold text-brand-700 dark:text-brand-100">{news.source || '출처 미상'}</span>
        <span aria-hidden>·</span>
        <span className="inline-flex items-center gap-1"><Clock3 className="size-3" />{formatDate(news.publishedAt)}</span>
        {news.analysisStatus === 'PENDING' && <span className="rounded bg-amber-50 px-1.5 py-0.5 font-medium text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">영향 분석 중</span>}
        {news.analysisStatus === 'FAILED' && <span className="rounded bg-red-50 px-1.5 py-0.5 font-medium text-red-700 dark:bg-red-950/50 dark:text-red-300">분석 실패</span>}
        {news.localized && news.localizationModel && <span className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">번역 · {news.localizationModel}</span>}
      </div>
      <a href={news.originalUrl} target="_blank" rel="noopener noreferrer" className="mt-1.5 flex items-start justify-between gap-4 rounded-md focus-visible:outline-offset-4">
        <span className="min-w-0">
          <span className="line-clamp-2 text-[15px] font-semibold leading-6 text-slate-950 group-hover:text-brand-700 group-hover:underline dark:text-slate-100 dark:group-hover:text-brand-100">{displayTitle}</span>
          {news.localized
            ? <span className="mt-1 block line-clamp-3 text-[15px] leading-6 text-slate-600 dark:text-slate-400">{news.summary || '기사 요약을 준비하고 있습니다.'}</span>
            : <span className="mt-1 block text-[13px] font-medium text-amber-700 dark:text-amber-300">원문 기사 · 번역을 사용할 수 없습니다.</span>}
        </span>
        <ExternalLink aria-hidden className="mt-1 size-4 shrink-0 text-slate-400 group-hover:text-brand-600" />
      </a>
      <div className="mt-3 grid gap-2">
        {news.impacts.length ? news.impacts.slice(0, 3).map((impact) => <ImpactResult key={`${impact.ticker}-${impact.direction}`} impact={impact} />) : <span className="text-sm text-slate-500">영향 분석 대기</span>}
      </div>
    </article>
  )
}

function ImpactResult({ impact }: { impact: Impact }) {
  if (!impact.aiAnalyzed) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
        <span className="font-mono text-xs font-bold">{impact.ticker}</span>
        <span className="inline-flex items-center gap-1.5 font-medium"><Sparkles className="size-3.5 text-slate-400" />AI 분석 준비 중</span>
      </div>
    )
  }

  const probabilities = [
    { label: '상승', value: impact.upProbability, className: 'text-red-600 dark:text-red-400' },
    { label: '하락', value: impact.downProbability, className: 'text-blue-600 dark:text-blue-400' },
    { label: '중립', value: impact.neutralProbability, className: 'text-slate-600 dark:text-slate-300' },
  ]

  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/70">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200">{impact.ticker}</span>
        <ImpactBadge direction={impact.direction} score={impact.score} />
        {impact.analysisModel && <span className="text-[11px] text-slate-400">AI · {impact.analysisModel}</span>}
      </div>
      <p className="mt-1.5 text-[15px] leading-6 text-slate-600 dark:text-slate-400">{impact.reason}</p>
      <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-200 pt-2 text-xs dark:border-slate-700">
        {probabilities.map((item) => <div key={item.label} className="flex items-center gap-1"><dt className="text-slate-500">{item.label}</dt><dd className={`font-mono font-bold ${item.className}`}>{item.value}%</dd></div>)}
      </dl>
    </div>
  )
}

function InstrumentNewsSkeleton() {
  return (
    <div className="surface p-4" role="status" aria-label="관련 뉴스 수집 중">
      <p className="mb-4 text-xs text-slate-500">첫 조회에서는 최근 기사를 수집하므로 1~2분 정도 걸릴 수 있습니다.</p>
      <div className="space-y-5">{[1, 2, 3].map((item) => <div key={item} className="animate-pulse space-y-2"><div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-800" /><div className="h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-800" /><div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800/70" /></div>)}</div>
    </div>
  )
}
