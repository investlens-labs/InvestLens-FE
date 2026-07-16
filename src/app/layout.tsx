import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { AppProviders } from '@/components/providers/app-providers'

export const metadata: Metadata = {
  title: { default: 'InvestLens', template: '%s · InvestLens' },
  description: '내 포트폴리오에 중요한 투자 뉴스를 빠르게 파악하세요.',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <a href="#main-content" className="sr-only z-50 rounded bg-brand-600 px-3 py-2 text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
          본문으로 건너뛰기
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
