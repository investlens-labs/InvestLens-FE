export const siteName = 'InvestLens'
export const defaultSiteUrl = 'https://investlens.mandoo4137-a53.workers.dev'

const supportedProtocols = new Set(['http:', 'https:'])

export function getSiteUrl(rawUrl = process.env.NEXT_PUBLIC_SITE_URL): URL {
  try {
    const url = new URL(rawUrl || defaultSiteUrl)
    if (!supportedProtocols.has(url.protocol)) return new URL(defaultSiteUrl)
    url.pathname = '/'
    url.search = ''
    url.hash = ''
    return url
  } catch {
    return new URL(defaultSiteUrl)
  }
}

export function absoluteUrl(path = '/'): string {
  return new URL(path, getSiteUrl()).toString()
}

export function buildStructuredData(description: string, language: string) {
  const url = getSiteUrl().toString()
  const logo = absoluteUrl('/icon.png')

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${url}#organization`,
        name: siteName,
        url,
        logo,
      },
      {
        '@type': 'WebSite',
        '@id': `${url}#website`,
        name: siteName,
        url,
        description,
        publisher: { '@id': `${url}#organization` },
        inLanguage: language,
      },
      {
        '@type': 'WebApplication',
        '@id': `${url}#application`,
        name: siteName,
        url,
        description,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        inLanguage: language,
        publisher: { '@id': `${url}#organization` },
      },
    ],
  }
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
