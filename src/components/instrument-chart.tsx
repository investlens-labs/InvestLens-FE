'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  AreaSeries,
  ColorType,
  CrosshairMode,
  createChart,
  HistogramSeries,
  type HistogramData,
  type LineData,
  type Time,
} from 'lightweight-charts'
import { AlertTriangle, Clock3, RefreshCw } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from '@/components/providers/theme-provider'
import { instrumentApi } from '@/lib/api/services'
import type { ChartRange, InstrumentChart as InstrumentChartData } from '@/lib/api/types'
import { toLineData, toVolumeData } from '@/lib/chart-data'
import { queryKeys } from '@/lib/query-keys'

const ranges = [
  { value: '1D', labelKey: 'range1D' },
  { value: '1W', labelKey: 'range1W' },
  { value: '1M', labelKey: 'range1M' },
  { value: '3M', labelKey: 'range3M' },
  { value: '1Y', labelKey: 'range1Y' },
  { value: '5Y', labelKey: 'range5Y' },
] as const satisfies ReadonlyArray<{ value: ChartRange; labelKey: `range${ChartRange}` }>

export function InstrumentChart({ instrumentId }: { instrumentId: string }) {
  const t = useTranslations('chart')
  const [range, setRange] = useState<ChartRange>('1M')
  const chart = useQuery({
    queryKey: queryKeys.instrumentChart(instrumentId, range),
    queryFn: () => instrumentApi.chart(instrumentId, range),
    placeholderData: keepPreviousData,
  })

  return (
    <section aria-labelledby="price-chart-title" className="border-b border-slate-200 dark:border-slate-800">
      <div className="flex flex-col gap-3 px-5 pb-2 pt-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="price-chart-title" className="text-sm font-semibold text-slate-950 dark:text-white">{t('title')}</h2>
          {chart.data && <PriceSummary data={chart.data} />}
        </div>
        <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800" role="group" aria-label={t('rangeGroup')}>
          {ranges.map((item) => (
            <button key={item.value} type="button" aria-pressed={range === item.value} onClick={() => setRange(item.value)} className={`h-8 min-w-10 rounded-md px-2 text-xs font-semibold transition sm:min-w-12 ${range === item.value ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-500 hover:bg-white/60 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700/60 dark:hover:text-slate-100'}`}>{t(item.labelKey)}</button>
          ))}
        </div>
      </div>

      <div className="relative px-2 pb-3 sm:px-3">
        {chart.isLoading ? <ChartSkeleton />
          : chart.isError ? <ChartError onRetry={() => void chart.refetch()} />
          : !chart.data?.points.length ? <ChartEmpty />
          : <PriceVolumeChart data={chart.data} dimmed={chart.isFetching} />}
      </div>
    </section>
  )
}

function PriceSummary({ data }: { data: InstrumentChartData }) {
  const t = useTranslations('chart')
  const locale = useLocale()
  const positive = data.change >= 0
  const price = formatPrice(data.currentPrice, data.currency, locale)
  return (
    <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <strong className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{price}</strong>
      <span className={`text-sm font-semibold ${positive ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}>{positive ? '▲' : '▼'} {formatPrice(Math.abs(data.change), data.currency, locale)} ({new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(data.changeRate))}%)</span>
      <span className="text-[11px] text-slate-400">{data.interval} · {data.currency}</span>
      {data.exchangeDataDelayedBy > 0 && <span className="inline-flex items-center gap-1 text-[11px] text-amber-600"><Clock3 className="size-3" />{t('delayed', { seconds: data.exchangeDataDelayedBy })}</span>}
    </div>
  )
}

function PriceVolumeChart({ data, dimmed }: { data: InstrumentChartData; dimmed: boolean }) {
  const t = useTranslations('chart')
  const locale = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const [hover, setHover] = useState<{ timestamp: number; close: number; changeRate: number; volume: number } | null>(null)
  const lines = useMemo(() => toLineData(data.points), [data.points])
  const volumes = useMemo(() => toVolumeData(data.points), [data.points])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const dark = theme === 'dark'
    const instance = createChart(container, {
      autoSize: true,
      height: container.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: dark ? '#94a3b8' : '#64748b',
        fontFamily: 'var(--font-sans)',
        fontSize: 11,
        panes: { separatorColor: dark ? '#1e293b' : '#e2e8f0', separatorHoverColor: '#13896633', enableResize: false },
      },
      grid: {
        vertLines: { color: dark ? '#1e293b66' : '#e2e8f080' },
        horzLines: { color: dark ? '#1e293b66' : '#e2e8f080' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: dark ? '#64748b' : '#94a3b8', width: 1, labelBackgroundColor: '#0b6b4f' },
        horzLine: { color: dark ? '#64748b' : '#94a3b8', width: 1, labelBackgroundColor: '#0b6b4f' },
      },
      rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.08, bottom: 0.08 } },
      timeScale: { borderVisible: false, timeVisible: data.range === '1D' || data.range === '1W', secondsVisible: false, rightOffset: 2, barSpacing: data.range === '1D' ? 7 : 6 },
      handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: false },
      handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
      localization: { locale, priceFormatter: (price: number) => formatPrice(price, data.currency, locale) },
    })
    const rising = data.change >= 0
    const lineColor = rising ? '#ef4444' : '#2563eb'
    const areaSeries = instance.addSeries(AreaSeries, {
      lineColor,
      topColor: rising ? 'rgba(239, 68, 68, 0.22)' : 'rgba(37, 99, 235, 0.22)',
      bottomColor: rising ? 'rgba(239, 68, 68, 0.01)' : 'rgba(37, 99, 235, 0.01)',
      lineWidth: 2,
      priceLineVisible: true, lastValueVisible: true,
    })
    areaSeries.setData(lines)
    const volumeSeries = instance.addSeries(HistogramSeries, { priceFormat: { type: 'volume' }, priceLineVisible: false, lastValueVisible: false }, 1)
    volumeSeries.setData(volumes)
    instance.panes()[0]?.setStretchFactor(4)
    instance.panes()[1]?.setStretchFactor(1)
    instance.timeScale().fitContent()

    const handleCrosshair = (param: { seriesData: Map<unknown, unknown> }) => {
      const value = param.seriesData.get(areaSeries) as LineData<Time> | undefined
      const volume = param.seriesData.get(volumeSeries) as HistogramData<Time> | undefined
      if (!value || typeof value.time !== 'number') {
        setHover(null)
        return
      }
      setHover({
        timestamp: value.time,
        close: value.value,
        changeRate: data.previousClose ? ((value.value - data.previousClose) / data.previousClose) * 100 : 0,
        volume: volume?.value ?? 0,
      })
    }
    instance.subscribeCrosshairMove(handleCrosshair)
    return () => {
      instance.unsubscribeCrosshairMove(handleCrosshair)
      instance.remove()
    }
  }, [data.change, data.currency, data.previousClose, data.range, lines, locale, theme, volumes])

  return (
    <div className={`relative transition-opacity duration-200 ${dimmed ? 'opacity-55' : 'opacity-100'}`}>
      <div className="pointer-events-none absolute left-3 top-2 z-10 min-h-9 text-xs">
        {hover && <><strong className="text-slate-800 dark:text-slate-100">{formatChartDate(hover.timestamp, data.timezone, locale)}</strong><span className="ml-2 text-slate-600 dark:text-slate-300">{formatPrice(hover.close, data.currency, locale)}</span><span className={`ml-2 font-semibold ${hover.changeRate >= 0 ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}>{hover.changeRate >= 0 ? '+' : ''}{new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(hover.changeRate)}%</span><span className="ml-2 text-slate-500">{t('volume', { value: formatVolume(hover.volume, locale) })}</span></>}
      </div>
      <div ref={containerRef} role="img" className="h-[360px] w-full sm:h-[430px]" aria-label={t('aria', { ticker: data.ticker, range: data.range, price: formatPrice(data.currentPrice, data.currency, locale), rate: new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(data.changeRate) })} />
      {dimmed && <span className="absolute right-3 top-2 rounded bg-white/90 px-2 py-1 text-[11px] font-medium text-slate-500 shadow-sm dark:bg-slate-800/90 dark:text-slate-300">{t('refreshing')}</span>}
      <a href="https://www.tradingview.com/" target="_blank" rel="noreferrer" className="absolute bottom-1 left-3 text-[9px] text-slate-400 hover:underline">Charts by TradingView</a>
    </div>
  )
}

function ChartSkeleton() {
  const t = useTranslations('chart')
  return <div className="h-[360px] animate-pulse space-y-4 px-3 py-8 sm:h-[430px]" role="status" aria-label={t('loadingAria')}><div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" /><div className="h-[70%] rounded-lg bg-slate-100 dark:bg-slate-800/70" /><div className="h-[12%] rounded-lg bg-slate-100 dark:bg-slate-800/70" /><p className="text-center text-xs text-slate-500">{t('loadingDescription')}</p></div>
}

function ChartError({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations('chart')
  const common = useTranslations('common')
  return <div className="flex h-[360px] flex-col items-center justify-center text-center sm:h-[430px]"><AlertTriangle className="size-6 text-amber-500" /><p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">{t('errorTitle')}</p><p className="mt-1 text-xs text-slate-500">{t('errorDescription')}</p><button onClick={onRetry} className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-xs font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"><RefreshCw className="size-3.5" />{common('retry')}</button></div>
}

function ChartEmpty() {
  const t = useTranslations('chart')
  return <div className="flex h-[360px] flex-col items-center justify-center text-center sm:h-[430px]"><p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t('emptyTitle')}</p><p className="mt-1 text-xs text-slate-500">{t('emptyDescription')}</p></div>
}

function formatPrice(value: number, currency: string, locale: string) {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: currency === 'KRW' ? 0 : 2 }).format(value)
  } catch {
    return `${value.toLocaleString(locale)} ${currency}`
  }
}

function formatChartDate(timestamp: number, timezone: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, { timeZone: timezone, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(timestamp * 1000))
  } catch {
    return new Date(timestamp * 1000).toLocaleString(locale)
  }
}

function formatVolume(value: number, locale: string) {
  return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}
