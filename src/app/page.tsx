import { ArrowRight, BarChart3, BriefcaseBusiness, CheckCircle2, Newspaper, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import logo from '@/app/icon.png'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { MarketIntelligencePreview } from '@/components/landing/market-intelligence-preview'
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
  const previewNews = [landing('previewNews1'), landing('previewNews2'), landing('previewNews3')] as [string, string, string]

  return (
    <div className="min-h-screen bg-white text-slate-950 dark:bg-[#0d1211] dark:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-[#0d1211]/90">
        <div className="mx-auto flex h-15 max-w-6xl items-center gap-3 px-4 sm:px-5">
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
        <section className="landing-grid relative overflow-hidden border-b border-slate-200 bg-[#f7faf9] dark:border-slate-800 dark:bg-[#0b100f]">
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-5 sm:py-18 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.88fr)] lg:gap-14 lg:py-22">
            <div className="landing-enter">
              <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-100">
                <span className="h-px w-6 bg-brand-500" aria-hidden="true" />{auth('tagline')}
              </p>
              <h1 className="mt-4 max-w-3xl text-[2.55rem] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-5xl lg:text-[3.7rem]">
                {auth('heroLine1')} <span className="text-brand-600">{auth('heroLine2')}</span>
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-7 text-slate-600 sm:text-base dark:text-slate-300">{auth('heroDescription')}</p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                <Link href="/signup" className="group inline-flex h-10 items-center gap-1.5 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-700">{auth('createAccount')}<ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" /></Link>
                <Link href="/login" className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors duration-150 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800">{auth('login')}</Link>
              </div>
              <dl className="mt-9 grid max-w-xl grid-cols-3 divide-x divide-slate-300 border-y border-slate-300/80 py-3 dark:divide-slate-700 dark:border-slate-700">
                <div className="pr-3"><dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Market</dt><dd className="mt-1 font-mono text-xs font-semibold">KR · US</dd></div>
                <div className="px-3"><dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Asset</dt><dd className="mt-1 font-mono text-xs font-semibold">STOCK · ETF</dd></div>
                <div className="pl-3"><dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Impact</dt><dd className="mt-1 font-mono text-xs font-semibold">1–10 SCORE</dd></div>
              </dl>
            </div>
            <MarketIntelligencePreview
              eyebrow={landing('previewEyebrow')}
              signalLabel={landing('signalLabel')}
              positiveLabel={landing('positiveLabel')}
              negativeLabel={landing('negativeLabel')}
              neutralLabel={landing('neutralLabel')}
              articleLabel={landing('articleLabel')}
              articleCountLabel={landing('articleCount', { count: 20 })}
              statusLabel={landing('previewStatusLabel')}
              scoreLabel={landing('scoreLabel')}
              news={previewNews}
            />
          </div>
        </section>

        <section aria-labelledby="features-title" className="mx-auto max-w-6xl px-4 py-16 sm:px-5 lg:py-20">
          <div className="max-w-2xl landing-enter">
            <h2 id="features-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">{landing('featuresTitle')}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{landing('featuresDescription')}</p>
          </div>
          <div className="mt-9 grid border-y border-slate-200 md:grid-cols-3 md:divide-x dark:border-slate-800 dark:divide-slate-800">
            {features.map(({ icon: Icon, title, description }, index) => (
              <article key={title} className="group relative border-b border-slate-200 px-1 py-5 last:border-b-0 md:border-b-0 md:px-5 md:first:pl-0 md:last:pr-0 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100"><Icon className="size-[18px]" /></span>
                  <span className="font-mono text-[11px] text-slate-400">0{index + 1}</span>
                </div>
                <h3 className="mt-4 text-base font-semibold">{title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="markets-title" className="border-y border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/40">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-5 lg:grid-cols-[0.8fr_1.2fr] lg:py-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">KR · US · STOCK · ETF</p>
              <h2 id="markets-title" className="mt-3 text-2xl font-semibold tracking-tight">{landing('marketsTitle')}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">{landing('marketsDescription')}</p>
            </div>
            <ul className="border-t border-slate-300 dark:border-slate-700" aria-label={landing('supportedFeatures')}>
              {[landing('marketPoint1'), landing('marketPoint2'), landing('marketPoint3'), landing('marketPoint4')].map((point, index) => (
                <li key={point} className="flex items-center gap-3 border-b border-slate-200 py-3.5 text-sm font-medium dark:border-slate-800">
                  <CheckCircle2 className="size-4 shrink-0 text-brand-600" />
                  <span className="flex-1">{point}</span>
                  <span className="font-mono text-[10px] text-slate-400">0{index + 1}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-5 lg:py-20">
          <div className="flex flex-col items-start justify-between gap-6 border-y border-slate-300 py-7 sm:flex-row sm:items-center dark:border-slate-700">
            <div><h2 className="text-xl font-semibold">{landing('ctaTitle')}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">{landing('ctaDescription')}</p></div>
            <Link href="/signup" className="group inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-[#0d3329] px-4 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-700 dark:bg-brand-500 dark:text-white dark:hover:bg-brand-600">{auth('signup')}<ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" /></Link>
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
