'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

const NEWS_SECTION_ID = 'instrument-news'
const HEADER_OFFSET_PX = 72

export function ScrollToNewsButton() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const target = document.getElementById(NEWS_SECTION_ID)
    if (!target) return

    const updateVisibility = () => {
      const targetTop = target.getBoundingClientRect().top
      setHidden(targetTop <= window.innerHeight * 0.8)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility)
    return () => {
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
    }
  }, [])

  const scrollToNews = () => {
    const target = document.getElementById(NEWS_SECTION_ID)
    if (!target) return
    const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }

  return (
    <div className={`pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-center transition-opacity duration-200 lg:pl-60 ${hidden ? 'opacity-0' : 'opacity-100'}`}>
      <button type="button" onClick={scrollToNews} disabled={hidden} tabIndex={hidden ? -1 : undefined} aria-hidden={hidden} aria-label="관련 뉴스로 이동" title="관련 뉴스로 이동" className={`grid size-10 place-items-center rounded-full border border-white/20 bg-slate-950 text-white shadow-lg shadow-slate-950/20 transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 motion-safe:animate-bounce dark:bg-white dark:text-slate-950 dark:hover:bg-brand-100 dark:focus-visible:ring-offset-slate-950 ${hidden ? 'pointer-events-none' : 'pointer-events-auto'}`}>
        <ChevronDown className="size-5" aria-hidden />
      </button>
    </div>
  )
}
