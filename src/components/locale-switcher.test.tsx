import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithIntl } from '@/test/render'
import { LocaleSwitcher } from './locale-switcher'

const refresh = vi.hoisted(() => vi.fn())

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh }),
}))

describe('LocaleSwitcher', () => {
  afterEach(() => {
    refresh.mockClear()
    vi.restoreAllMocks()
  })

  it('지원하는 네 언어를 모두 표시한다', () => {
    renderWithIntl(<LocaleSwitcher />, { locale: 'ko' })

    const select = screen.getByRole('combobox', { name: '화면 언어' })
    expect(select).toHaveValue('ko')
    expect(screen.getAllByRole('option')).toHaveLength(4)
    expect(screen.getByRole('option', { name: '한국어' })).toHaveValue('ko')
    expect(screen.getByRole('option', { name: 'English' })).toHaveValue('en')
    expect(screen.getByRole('option', { name: '日本語' })).toHaveValue('ja')
    expect(screen.getByRole('option', { name: '中文' })).toHaveValue('zh')
  })

  it('언어 변경을 POST한 뒤 서버 컴포넌트를 새로고침한다', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ locale: 'ja' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }))
    renderWithIntl(<LocaleSwitcher />, { locale: 'ko' })

    fireEvent.change(screen.getByRole('combobox', { name: '화면 언어' }), { target: { value: 'ja' } })

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/locale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: 'ja' }),
    }))
    await waitFor(() => expect(refresh).toHaveBeenCalledOnce())
  })
})
