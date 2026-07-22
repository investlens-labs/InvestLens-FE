import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'
import './globals.css'
import { AppProviders } from '@/components/providers/app-providers'
import { getSiteUrl, siteName } from '@/lib/seo'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1211' },
  ],
  colorScheme: 'light dark',
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  const naverVerification = process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION
  const title = t('homeTitle')
  const description = t('description')

  return {
    metadataBase: getSiteUrl(),
    title: { default: title, template: `%s · ${siteName}` },
    description,
    applicationName: siteName,
    icons: { icon: '/icon.png', apple: '/icon.png' },
    manifest: '/manifest.webmanifest',
    category: 'finance',
    formatDetection: { telephone: false, email: false, address: false },
    verification: {
      ...(googleVerification ? { google: googleVerification } : {}),
      ...(naverVerification ? { other: { 'naver-site-verification': naverVerification } } : {}),
    },
  }
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const locale = await getLocale()
  const messages = await getMessages()
  const t = await getTranslations('accessibility')

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <a href="#main-content" className="sr-only z-50 rounded bg-brand-600 px-3 py-2 text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
          {t('skipToContent')}
        </a>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
