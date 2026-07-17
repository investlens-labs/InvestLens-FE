import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ImpactBadge } from './impact-badge'

describe('ImpactBadge', () => {
  it('색상에 의존하지 않고 영향 방향과 점수를 텍스트로 표시한다', () => {
    render(<ImpactBadge direction="NEGATIVE" score={4} />)
    expect(screen.getByText('부정 · 4점')).toBeInTheDocument()
    expect(screen.getByText('부정 · 4점')).toHaveAttribute('title', '4점: 실적이나 핵심 사업에 직접적인 큰 영향')
  })
})
