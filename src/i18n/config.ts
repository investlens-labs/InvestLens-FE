export const locales = ['ko', 'en', 'ja', 'zh'] as const

export type AppLocale = (typeof locales)[number]

export const defaultLocale: AppLocale = 'ko'
export const localeCookieName = 'NEXT_LOCALE'

export function isAppLocale(value: unknown): value is AppLocale {
  return typeof value === 'string' && locales.includes(value as AppLocale)
}

export const intlLocale: Record<AppLocale, string> = {
  ko: 'ko-KR',
  en: 'en-US',
  ja: 'ja-JP',
  zh: 'zh-CN',
}
