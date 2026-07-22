import { beforeEach, describe, expect, it, vi } from 'vitest'
import { localeCookieName, locales } from '@/i18n/config'

const cookieSet = vi.hoisted(() => vi.fn())

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ set: cookieSet })),
}))

import { POST } from './route'

describe('POST /api/locale', () => {
  beforeEach(() => cookieSet.mockClear())

  it.each(locales)('지원 locale %s를 쿠키에 저장한다', async (locale) => {
    const response = await POST(new Request('http://localhost/api/locale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale }),
    }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ locale })
    expect(cookieSet).toHaveBeenCalledWith(localeCookieName, locale, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
      secure: false,
    })
  })

  it.each([
    ['지원하지 않는 locale', JSON.stringify({ locale: 'fr' })],
    ['누락된 locale', JSON.stringify({})],
    ['잘못된 JSON', '{'],
  ])('%s 요청을 거부하고 쿠키를 변경하지 않는다', async (_case, body) => {
    const response = await POST(new Request('http://localhost/api/locale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ message: 'Unsupported locale' })
    expect(cookieSet).not.toHaveBeenCalled()
  })
})
