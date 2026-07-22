import { render, type RenderOptions } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import en from '../../messages/en.json'
import ja from '../../messages/ja.json'
import ko from '../../messages/ko.json'
import zh from '../../messages/zh.json'
import type { AppLocale } from '@/i18n/config'

type Messages = ComponentProps<typeof NextIntlClientProvider>['messages']

const messagesByLocale: Record<AppLocale, Messages> = { ko, en, ja, zh }

interface IntlRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  locale?: AppLocale
  messages?: Messages
}

export function renderWithIntl(
  ui: ReactElement,
  { locale = 'ko', messages = messagesByLocale[locale], ...options }: IntlRenderOptions = {},
) {
  function IntlWrapper({ children }: { children: ReactNode }) {
    return (
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Seoul">
        {children}
      </NextIntlClientProvider>
    )
  }

  return render(ui, { wrapper: IntlWrapper, ...options })
}
