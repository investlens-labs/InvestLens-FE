import { Compass, Home } from 'lucide-react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function NotFound() {
  const t = await getTranslations('status')
  return <main id="main-content" className="grid min-h-screen place-items-center bg-slate-50 p-5 dark:bg-slate-950"><div className="surface w-full max-w-md p-8 text-center"><span className="mx-auto grid size-12 place-items-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100"><Compass className="size-6" /></span><p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-brand-600">{t('notFoundEyebrow')}</p><h1 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{t('notFoundTitle')}</h1><p className="mt-2 text-sm leading-6 text-slate-500">{t('notFoundDescription')}</p><Link href="/dashboard" className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700"><Home className="size-4" />{t('goDashboard')}</Link></div></main>
}
