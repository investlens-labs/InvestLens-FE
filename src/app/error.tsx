'use client'

import { AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('status')
  const common = useTranslations('common')
  useEffect(() => { console.error(error) }, [error])
  return <main id="main-content" className="grid min-h-screen place-items-center bg-slate-50 p-5 dark:bg-slate-950"><div className="surface max-w-md p-7 text-center"><AlertTriangle className="mx-auto size-8 text-red-500" /><h1 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">{t('unexpectedTitle')}</h1><p className="mt-2 text-sm leading-6 text-slate-500">{t('unexpectedDescription')}</p><Button className="mt-5" onClick={reset}>{common('retry')}</Button></div></main>
}
