import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from './client'
import { tokenStorage } from '@/lib/auth/token-storage'

describe('apiClient', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => vi.useRealTimers())

  it('JWT를 Bearer 인증 헤더로 전송한다', async () => {
    tokenStorage.set('test-access-token')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ id: 'user-1' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }))

    await apiClient.get('/users/me')

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/backend/users/me',
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer test-access-token' }) }),
    )
  })

  it('401 응답에서 토큰을 삭제하고 인증 만료 이벤트를 보낸다', async () => {
    tokenStorage.set('expired-token')
    const unauthorized = vi.fn()
    window.addEventListener('investlens:unauthorized', unauthorized)
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    }))

    await expect(apiClient.get('/portfolio')).rejects.toMatchObject({ status: 401 })

    expect(tokenStorage.get()).toBeNull()
    expect(unauthorized).toHaveBeenCalledOnce()
    window.removeEventListener('investlens:unauthorized', unauthorized)
  })

  it('서버 오류인 GET 요청만 제한적으로 재시도한다', async () => {
    vi.useFakeTimers()
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('', { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } }))

    const request = apiClient.get('/instruments')
    await vi.advanceTimersByTimeAsync(900)
    await expect(request).resolves.toEqual([])
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('POST 요청은 중복 생성 위험 때문에 재시도하지 않는다', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 503 }))

    await expect(apiClient.post('/portfolio', { instrumentId: 'instrument-1' })).rejects.toMatchObject({ status: 503 })
    expect(fetchMock).toHaveBeenCalledOnce()
  })
})
