import { describe, expect, it } from 'vitest'
import { getUpstreamTimeout } from './proxy-timeout'

describe('getUpstreamTimeout', () => {
  it('초기 수집이 필요한 종목 뉴스 요청에는 긴 제한 시간을 적용한다', () => {
    expect(getUpstreamTimeout(['instruments', 'instrument-uuid', 'news'])).toBe(150_000)
  })

  it('그 외 API는 기본 제한 시간을 유지한다', () => {
    expect(getUpstreamTimeout(['instruments', 'instrument-uuid', 'chart'])).toBe(50_000)
  })
})
