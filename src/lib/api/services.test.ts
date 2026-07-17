import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from './client'
import { instrumentApi, toQuery } from './services'

describe('instrumentApi', () => {
  afterEach(() => vi.restoreAllMocks())

  it('한글 검색어와 시장·유형·limit을 URLSearchParams로 인코딩한다', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue([])

    await instrumentApi.search({ query: '삼성전자', market: 'KR', type: 'STOCK', limit: 20 })

    expect(get).toHaveBeenCalledWith('/instruments?query=%EC%82%BC%EC%84%B1%EC%A0%84%EC%9E%90&market=KR&type=STOCK&limit=20')
  })

  it('빈 선택 필터는 쿼리 문자열에서 제외한다', () => {
    expect(toQuery({ query: '', market: undefined, type: undefined, limit: 50 })).toBe('?limit=50')
  })
})
