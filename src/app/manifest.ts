import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'InvestLens',
    short_name: 'InvestLens',
    description: '포트폴리오 기반 투자 뉴스와 AI 영향 분석 서비스',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#0d3329',
    lang: 'ko',
    icons: [
      {
        src: '/icon.png',
        sizes: '800x800',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
