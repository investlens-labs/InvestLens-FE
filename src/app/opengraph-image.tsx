import { ImageResponse } from 'next/og'

export const alt = 'InvestLens — 투자자를 위한 뉴스 인텔리전스'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#0d3329',
        color: '#ffffff',
        padding: '72px 80px',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 34, fontWeight: 700 }}>
        <div style={{ display: 'flex', width: 52, height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 14, background: '#5ee9bb', color: '#0d3329' }}>IL</div>
        InvestLens
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 66, fontWeight: 700, lineHeight: 1.18, letterSpacing: '-2px' }}>
          <span>시장 뉴스의 영향을</span>
          <span>더 빠르고 명확하게.</span>
        </div>
        <div style={{ marginTop: 26, fontSize: 27, color: '#b7d6cc' }}>포트폴리오 기반 투자 뉴스 · AI 영향 분석 · 한국·미국 주식과 ETF</div>
      </div>
      <div style={{ display: 'flex', gap: 16, fontSize: 20, color: '#7ee8c3' }}><span>NEWS INTELLIGENCE</span><span>•</span><span>FOR INVESTORS</span></div>
    </div>,
    size,
  )
}
