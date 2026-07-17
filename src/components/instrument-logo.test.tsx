import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { InstrumentLogo, LogoAttribution } from './instrument-logo'

describe('InstrumentLogo', () => {
  it('API 응답의 로고 URL을 그대로 표시한다', () => {
    const logoUrl = 'https://img.logo.dev/ticker/AAPL?token=publishable'
    render(<InstrumentLogo companyName="Apple Inc." logoUrl={logoUrl} />)

    expect(screen.getByRole('img', { name: 'Apple Inc. 로고' })).toHaveAttribute('src', logoUrl)
  })

  it('이미지 로딩에 실패하면 종목명 첫 글자를 표시한다', () => {
    render(<InstrumentLogo companyName="Apple Inc." logoUrl="https://example.com/missing.png" />)

    fireEvent.error(screen.getByRole('img', { name: 'Apple Inc. 로고' }))

    expect(screen.getByRole('img', { name: 'Apple Inc. 로고 없음' })).toHaveTextContent('A')
  })

  it('로고 URL이 없으면 티커를 fallback으로 사용한다', () => {
    render(<InstrumentLogo companyName="" ticker="qqq" logoUrl={null} size={48} />)

    expect(screen.getByRole('img', { name: 'qqq 로고 없음' })).toHaveTextContent('Q')
  })
})

describe('LogoAttribution', () => {
  it('API 응답의 출처 URL을 새 탭 링크로 표시한다', () => {
    render(<LogoAttribution url="https://logo.dev" />)

    expect(screen.getByRole('link', { name: 'Logos provided by Logo.dev' })).toHaveAttribute('href', 'https://logo.dev')
    expect(screen.getByRole('link', { name: 'Logos provided by Logo.dev' })).toHaveAttribute('target', '_blank')
  })
})
