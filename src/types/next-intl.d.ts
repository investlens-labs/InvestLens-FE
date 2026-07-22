import ko from '../../messages/ko.json'
import type { AppLocale } from '@/i18n/config'

declare module 'next-intl' {
  interface AppConfig {
    Locale: AppLocale
    Messages: typeof ko
  }
}
