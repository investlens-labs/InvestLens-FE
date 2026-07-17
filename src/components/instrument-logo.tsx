'use client'

import { useState } from 'react'

interface InstrumentLogoProps {
  companyName: string
  logoUrl: string | null
  size?: 32 | 48
  ticker?: string
}

interface LogoAttributionProps {
  className?: string
  url: string | null
}

export function InstrumentLogo({ companyName, logoUrl, size = 32, ticker }: InstrumentLogoProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const canShowImage = Boolean(logoUrl) && failedUrl !== logoUrl
  const label = companyName.trim() || ticker?.trim() || '종목'
  const monogram = label.slice(0, 1).toLocaleUpperCase()

  return (
    <span
      className="grid shrink-0 place-items-center overflow-hidden rounded-full border border-slate-200 bg-white font-semibold text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-100 dark:text-slate-700"
      style={{ width: size, height: size }}
    >
      {canShowImage ? (
        // API가 제공한 서명 URL을 그대로 사용해야 하므로 Next Image 변환을 거치지 않는다.
        <img
          src={logoUrl ?? undefined}
          alt={`${companyName} 로고`}
          width={size}
          height={size}
          className="size-full object-contain p-1"
          onError={() => setFailedUrl(logoUrl)}
        />
      ) : (
        <span role="img" aria-label={`${label} 로고 없음`} className={size === 48 ? 'text-base' : 'text-xs'}>
          {monogram}
        </span>
      )}
    </span>
  )
}

export function LogoAttribution({ className = '', url }: LogoAttributionProps) {
  if (!url) return null

  return (
    <a href={url} target="_blank" rel="noreferrer" className={`inline-flex rounded px-1 py-1 text-[11px] text-slate-500 underline decoration-slate-300 underline-offset-4 hover:bg-slate-100 hover:text-slate-800 dark:decoration-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 ${className}`}>
      Logos provided by Logo.dev
    </a>
  )
}
