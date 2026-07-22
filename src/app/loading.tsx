import { getTranslations } from 'next-intl/server'

export default async function Loading() {
  const t = await getTranslations('status')
  return <div className="grid min-h-screen place-items-center bg-slate-50 dark:bg-slate-950"><div className="text-center"><div className="mx-auto size-7 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" /><p className="mt-3 text-sm text-slate-500">{t('appLoading')}</p></div></div>
}
