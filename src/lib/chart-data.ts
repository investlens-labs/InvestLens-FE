import type { CandlestickData, HistogramData, UTCTimestamp } from 'lightweight-charts'
import type { ChartPoint } from '@/lib/api/types'

export function toCandlestickData(points: ChartPoint[]): CandlestickData<UTCTimestamp>[] {
  return points.map((point) => ({
    time: point.timestamp as UTCTimestamp,
    open: point.open,
    high: point.high,
    low: point.low,
    close: point.close,
  }))
}

export function toVolumeData(points: ChartPoint[]): HistogramData<UTCTimestamp>[] {
  return points.map((point) => ({
    time: point.timestamp as UTCTimestamp,
    value: point.volume,
    color: point.close >= point.open ? 'rgba(239, 68, 68, 0.45)' : 'rgba(37, 99, 235, 0.45)',
  }))
}
