'use client'

import { CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'
import logo from '@/app/icon.png'
import { LocaleSwitcher } from '@/components/locale-switcher'

export default function AuthLayout({ children }: { children: ReactNode }) {
  const t = useTranslations('auth')
  const points = [t('point1'), t('point2'), t('point3')]

  return (
    <main id="main-content" className="grid min-h-screen bg-white lg:grid-cols-[minmax(340px,0.9fr)_1.1fr] dark:bg-slate-950">
      <section className="hidden bg-[#0d3329] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-2.5 text-lg font-bold"><span className="grid size-8 overflow-hidden rounded-lg bg-white/10" aria-hidden><Image src={logo} alt="" priority className="size-full object-contain" /></span>InvestLens</div>
        <div className="max-w-lg">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">{t('tagline')}</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight">{t('heroLine1')}<br />{t('heroLine2')}</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-50/70">{t('heroDescription')}</p>
          <ul className="mt-8 space-y-3">
            {points.map((point) => <li key={point} className="flex items-center gap-2.5 text-sm text-emerald-50/90"><CheckCircle2 className="size-4 text-emerald-300" />{point}</li>)}
          </ul>
        </div>
        <p className="text-xs text-emerald-50/50">{t('disclaimer')}</p>
      </section>
      <section className="relative flex min-h-screen items-center justify-center bg-slate-50 px-5 py-16 dark:bg-slate-950">
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6"><LocaleSwitcher /></div>
        {children}
      </section>
    </main>
  )
}
