import { ArrowRight, BarChart3, BriefcaseBusiness, CheckCircle2, Newspaper, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import logo from '@/app/icon.png'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { intlLocale } from '@/i18n/config'
import { buildStructuredData, serializeJsonLd, siteName } from '@/lib/seo'

const openGraphLocale = {
  ko: 'ko_KR',
  en: 'en_US',
  ja: 'ja_JP',
  zh: 'zh_CN',
} as const

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  const locale = await getLocale()
  const title = t('homeTitle')
  const description = t('description')

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      url: '/',
      siteName,
      title,
      description,
      locale: openGraphLocale[locale],
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: `${siteName} 투자 뉴스 인텔리전스` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image'] },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
  }
}

export default async function HomePage() {
  const auth = await getTranslations('auth')
  const landing = await getTranslations('landing')
  const metadata = await getTranslations('metadata')
  const locale = await getLocale()
  const structuredData = buildStructuredData(metadata('description'), intlLocale[locale])
  const features = [
    { icon: Newspaper, title: auth('point1'), description: landing('newsDescription') },
    { icon: BarChart3, title: auth('point2'), description: landing('analysisDescription') },
    { icon: Search, title: auth('point3'), description: landing('searchDescription') },
  ]

  return (
    <div className="min-h-screen bg-white text-slate-950 dark:bg-[#0d1211] dark:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
      <header className="border-b border-slate-200/80 bg-white/95 dark:border-slate-800 dark:bg-[#0d1211]/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-5">
          <Link href="/" aria-label={landing('homeLabel')} className="flex shrink-0 items-center gap-2.5 font-bold tracking-tight">
            <Image src={logo} alt="" priority className="size-8 rounded-lg object-contain" />
            <span className="hidden text-lg sm:inline">InvestLens</span>
          </Link>
          <nav aria-label={landing('accountMenu')} className="ml-auto flex items-center gap-2">
            <LocaleSwitcher compact />
            <Link href="/login" className="hidden h-9 items-center rounded-lg px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 sm:inline-flex dark:text-slate-300 dark:hover:bg-slate-800">{auth('login')}</Link>
            <Link href="/signup" className="inline-flex h-9 items-center rounded-lg bg-brand-600 px-3.5 text-sm font-semibold text-white transition hover:bg-brand-700">{auth('signup')}</Link>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-[minmax(0,1fr)_420px] lg:py-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">{auth('tagline')}</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                {auth('heroLine1')} <span className="text-brand-600">{auth('heroLine2')}</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">{auth('heroDescription')}</p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                <Link href="/signup" className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700">{auth('createAccount')}<ArrowRight className="size-4" /></Link>
                <Link href="/login" className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">{auth('login')}</Link>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-semibold text-slate-500">{landing('previewEyebrow')}</p>
              <div className="mt-4 space-y-3">
                {[landing('previewNews1'), landing('previewNews2'), landing('previewNews3')].map((news, index) => (
                  <div key={news} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3.5 dark:border-slate-800">
                    <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg text-xs font-bold ${index === 0 ? 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300' : index === 1 ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{index === 0 ? '↑' : index === 1 ? '↓' : '→'}</span>
                    <span><strong className="block text-sm leading-5">{news}</strong><span className="mt-1 block text-xs text-slate-500">{landing('previewScore', { score: index === 0 ? 8 : index === 1 ? 6 : 3 })}</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="features-title" className="mx-auto max-w-6xl px-5 py-16">
          <div className="max-w-2xl">
            <h2 id="features-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">{landing('featuresTitle')}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{landing('featuresDescription')}</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
                <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100"><Icon className="size-5" /></span>
                <h3 className="mt-4 text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="markets-title" className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">KR · US · STOCK · ETF</p>
              <h2 id="markets-title" className="mt-3 text-2xl font-semibold tracking-tight">{landing('marketsTitle')}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{landing('marketsDescription')}</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2" aria-label={landing('supportedFeatures')}>
              {[landing('marketPoint1'), landing('marketPoint2'), landing('marketPoint3'), landing('marketPoint4')].map((point) => (
                <li key={point} className="flex items-start gap-2.5 rounded-xl bg-white p-4 text-sm font-medium dark:bg-slate-900"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-600" />{point}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="flex flex-col items-start justify-between gap-5 rounded-2xl bg-[#0d3329] p-6 text-white sm:flex-row sm:items-center sm:p-8">
            <div><h2 className="text-xl font-semibold">{landing('ctaTitle')}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50/70">{landing('ctaDescription')}</p></div>
            <Link href="/signup" className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-white px-4 text-sm font-semibold text-[#0d3329] transition hover:bg-emerald-50">{auth('signup')}<ArrowRight className="size-4" /></Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-5 py-6 text-center text-xs leading-5 text-slate-500 dark:border-slate-800">
        <p className="inline-flex items-center gap-1.5"><BriefcaseBusiness className="size-3.5" />{auth('disclaimer')}</p>
        <p className="mt-1">© {new Date().getFullYear()} InvestLens</p>
      </footer>
    </div>
  )
}
