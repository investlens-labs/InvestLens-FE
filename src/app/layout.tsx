import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'
import './globals.css'
import { AppProviders } from '@/components/providers/app-providers'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  return {
    title: { default: 'InvestLens', template: '%s · InvestLens' },
    description: t('description'),
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
