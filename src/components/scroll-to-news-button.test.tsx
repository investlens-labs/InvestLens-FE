import { fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithIntl } from '@/test/render'
import { ScrollToNewsButton } from './scroll-to-news-button'

describe('ScrollToNewsButton', () => {
  afterEach(() => {
    document.getElementById('instrument-news-title')?.remove()
    vi.restoreAllMocks()
  })

  it('클릭하면 관련 뉴스 영역으로 부드럽게 이동한다', () => {
    const target = document.createElement('section')
    target.id = 'instrument-news-title'
    target.scrollIntoView = vi.fn()
    target.getBoundingClientRect = vi.fn(() => ({ bottom: 1100, height: 100, left: 0, right: 100, top: 1000, width: 100, x: 0, y: 1000, toJSON: () => ({}) }))
    document.body.appendChild(target)
    renderWithIntl(<ScrollToNewsButton />, { locale: 'ko' })

    fireEvent.click(screen.getByRole('button', { name: '관련 뉴스로 이동' }))

    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
  })
})
