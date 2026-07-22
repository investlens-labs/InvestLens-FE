import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithIntl } from '@/test/render'
import { ImpactBadge } from './impact-badge'

describe('ImpactBadge', () => {
  it.each([
    [1, '영향 거의 없음'],
    [5, '중간 수준 영향'],
    [10, '매우 크고 즉각적인 영향 가능성'],
  ])('%i점 기준을 색상뿐 아니라 텍스트와 설명으로 표시한다', (score, description) => {
    renderWithIntl(<ImpactBadge direction="NEGATIVE" score={score} />, { locale: 'ko' })
    expect(screen.getByText(`부정 · ${score}점`)).toHaveAttribute('title', `${score}점: ${description}`)
  })
})
