import { describe, expect, it } from 'vitest'
import { impactScoreOptions } from './news-feed'

describe('맞춤 뉴스 점수 필터', () => {
  it('10점부터 1점까지 모든 최소 점수를 제공한다', () => {
    expect(impactScoreOptions).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
  })
})
