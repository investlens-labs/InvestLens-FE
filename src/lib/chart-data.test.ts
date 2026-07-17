import { describe, expect, it } from 'vitest'
import { toLineData, toVolumeData } from './chart-data'

const points = [
  { timestamp: 1_784_208_600, open: 328, high: 329, low: 326, close: 327, volume: 100 },
  { timestamp: 1_784_208_900, open: 327, high: 331, low: 327, close: 330, volume: 200 },
]

describe('chart data adapters', () => {
  it('초 단위 timestamp와 종가를 라인 데이터로 변환한다', () => {
    expect(toLineData(points)[0]).toEqual({ time: 1_784_208_600, value: 327 })
  })

  it('상승 거래량은 빨강, 하락 거래량은 파랑으로 구분한다', () => {
    const volume = toVolumeData(points)
    expect(volume[0].color).toContain('37, 99, 235')
    expect(volume[1].color).toContain('239, 68, 68')
  })
})
