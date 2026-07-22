import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MarketIntelligencePreview } from './market-intelligence-preview'

const props = {
  eyebrow: 'News impact preview',
  signalLabel: 'Overall signal',
  positiveLabel: 'Positive',
  negativeLabel: 'Negative',
  neutralLabel: 'Neutral',
  articleLabel: 'Related news',
  articleCountLabel: '20 articles',
  statusLabel: 'Product preview',
  scoreLabel: 'Impact',
  news: ['Earnings improve', 'Regulatory costs rise', 'Supply chain changes'] as [string, string, string],
}

describe('MarketIntelligencePreview', () => {
  it('expresses direction with text and not color alone', () => {
    render(<MarketIntelligencePreview {...props} />)

    expect(screen.getByRole('figure', { name: props.eyebrow })).toBeInTheDocument()
    expect(screen.getAllByText('Positive').length).toBeGreaterThan(0)
    expect(screen.getByText('Negative')).toBeInTheDocument()
    expect(screen.getByText('Neutral')).toBeInTheDocument()
    expect(screen.getByText('Earnings improve')).toBeInTheDocument()
  })
})
