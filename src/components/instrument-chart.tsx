'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  createChart,
  HistogramSeries,
  type CandlestickData,
  type Time,
} from 'lightweight-charts'
import { AlertTriangle, Clock3, RefreshCw } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from '@/components/providers/theme-provider'
import { instrumentApi } from '@/lib/api/services'
import type { ChartRange, InstrumentChart as InstrumentChartData } from '@/lib/api/types'
import { toCandlestickData, toVolumeData } from '@/lib/chart-data'
import { queryKeys } from '@/lib/query-keys'

const ranges: Array<{ value: ChartRange; label: string }> = [
  { value: '1D', label: '1일' },
  { value: '1W', label: '1주' },
  { value: '1M', label: '1개월' },
  { value: '3M', label: '3개월' },
  { value: '1Y', label: '1년' },
  { value: '5Y', label: '5년' },
]

export function InstrumentChart({ instrumentId }: { instrumentId: string }) {
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
          <h2 id="price-chart-title" className="text-sm font-semibold text-slate-950 dark:text-white">가격 차트</h2>
          {chart.data && <PriceSummary data={chart.data} />}
        </div>
        <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800" role="group" aria-label="차트 기간">
          {ranges.map((item) => (
            <button key={item.value} type="button" aria-pressed={range === item.value} onClick={() => setRange(item.value)} className={`h-8 min-w-10 rounded-md px-2 text-xs font-semibold transition sm:min-w-12 ${range === item.value ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-500 hover:bg-white/60 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700/60 dark:hover:text-slate-100'}`}>{item.label}</button>
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
  const positive = data.change >= 0
  const price = formatPrice(data.currentPrice, data.currency)
  return (
    <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <strong className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{price}</strong>
      <span className={`text-sm font-semibold ${positive ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}>{positive ? '▲' : '▼'} {formatPrice(Math.abs(data.change), data.currency)} ({Math.abs(data.changeRate).toFixed(2)}%)</span>
      <span className="text-[11px] text-slate-400">{data.interval} · {data.currency}</span>
      {data.exchangeDataDelayedBy > 0 && <span className="inline-flex items-center gap-1 text-[11px] text-amber-600"><Clock3 className="size-3" />{data.exchangeDataDelayedBy}초 지연</span>}
    </div>
  )
}

function PriceVolumeChart({ data, dimmed }: { data: InstrumentChartData; dimmed: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const [hover, setHover] = useState<{ timestamp: number; close: number; changeRate: number } | null>(null)
  const candles = useMemo(() => toCandlestickData(data.points), [data.points])
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
      localization: { priceFormatter: (price: number) => formatPrice(price, data.currency) },
    })
    const candleSeries = instance.addSeries(CandlestickSeries, {
      upColor: '#ef4444', downColor: '#2563eb', borderVisible: false, wickUpColor: '#ef4444', wickDownColor: '#2563eb',
      priceLineVisible: true, lastValueVisible: true,
    })
    candleSeries.setData(candles)
    const volumeSeries = instance.addSeries(HistogramSeries, { priceFormat: { type: 'volume' }, priceLineVisible: false, lastValueVisible: false }, 1)
    volumeSeries.setData(volumes)
    instance.panes()[0]?.setStretchFactor(4)
    instance.panes()[1]?.setStretchFactor(1)
    instance.timeScale().fitContent()

    const handleCrosshair = (param: { seriesData: Map<unknown, unknown> }) => {
      const value = param.seriesData.get(candleSeries) as CandlestickData<Time> | undefined
      if (!value || typeof value.time !== 'number') {
        setHover(null)
        return
      }
      setHover({
        timestamp: value.time,
        close: value.close,
        changeRate: data.previousClose ? ((value.close - data.previousClose) / data.previousClose) * 100 : 0,
      })
    }
    instance.subscribeCrosshairMove(handleCrosshair)
    return () => {
      instance.unsubscribeCrosshairMove(handleCrosshair)
      instance.remove()
    }
  }, [candles, data.currency, data.previousClose, data.range, theme, volumes])

  return (
    <div className={`relative transition-opacity duration-200 ${dimmed ? 'opacity-55' : 'opacity-100'}`}>
      <div className="pointer-events-none absolute left-3 top-2 z-10 min-h-9 text-xs">
        {hover && <><strong className="text-slate-800 dark:text-slate-100">{formatChartDate(hover.timestamp, data.timezone)}</strong><span className="ml-2 text-slate-600 dark:text-slate-300">{formatPrice(hover.close, data.currency)}</span><span className={`ml-2 font-semibold ${hover.changeRate >= 0 ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}>{hover.changeRate >= 0 ? '+' : ''}{hover.changeRate.toFixed(2)}%</span></>}
      </div>
      <div ref={containerRef} role="img" className="h-[360px] w-full sm:h-[430px]" aria-label={`${data.ticker} ${data.range} 캔들 및 거래량 차트. 현재가 ${formatPrice(data.currentPrice, data.currency)}, 등락률 ${data.changeRate.toFixed(2)}퍼센트`} />
      {dimmed && <span className="absolute right-3 top-2 rounded bg-white/90 px-2 py-1 text-[11px] font-medium text-slate-500 shadow-sm dark:bg-slate-800/90 dark:text-slate-300">기간 데이터 갱신 중</span>}
      <a href="https://www.tradingview.com/" target="_blank" rel="noreferrer" className="absolute bottom-1 left-3 text-[9px] text-slate-400 hover:underline">Charts by TradingView</a>
    </div>
  )
}

function ChartSkeleton() {
  return <div className="h-[360px] animate-pulse space-y-4 px-3 py-8 sm:h-[430px]" role="status" aria-label="차트 로딩 중"><div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" /><div className="h-[70%] rounded-lg bg-slate-100 dark:bg-slate-800/70" /><div className="h-[12%] rounded-lg bg-slate-100 dark:bg-slate-800/70" /><p className="text-center text-xs text-slate-500">시세 서버에서 데이터를 준비하고 있습니다.</p></div>
}

function ChartError({ onRetry }: { onRetry: () => void }) {
  return <div className="flex h-[360px] flex-col items-center justify-center text-center sm:h-[430px]"><AlertTriangle className="size-6 text-amber-500" /><p className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">차트 데이터를 불러오지 못했습니다</p><p className="mt-1 text-xs text-slate-500">시세 서버 응답이 지연될 수 있습니다.</p><button onClick={onRetry} className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-xs font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"><RefreshCw className="size-3.5" />다시 시도</button></div>
}

function ChartEmpty() {
  return <div className="flex h-[360px] flex-col items-center justify-center text-center sm:h-[430px]"><p className="text-sm font-semibold text-slate-800 dark:text-slate-200">표시할 시세 데이터가 없습니다</p><p className="mt-1 text-xs text-slate-500">다른 기간을 선택해 확인해 주세요.</p></div>
}

function formatPrice(value: number, currency: string) {
  try {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency, maximumFractionDigits: currency === 'KRW' ? 0 : 2 }).format(value)
  } catch {
    return `${value.toLocaleString('ko-KR')} ${currency}`
  }
}

function formatChartDate(timestamp: number, timezone: string) {
  try {
    return new Intl.DateTimeFormat('ko-KR', { timeZone: timezone, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(timestamp * 1000))
  } catch {
    return new Date(timestamp * 1000).toLocaleString('ko-KR')
  }
}
