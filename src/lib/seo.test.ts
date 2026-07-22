import { afterEach, describe, expect, it } from 'vitest'
import { absoluteUrl, buildStructuredData, defaultSiteUrl, getSiteUrl, serializeJsonLd } from './seo'

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL

afterEach(() => {
  if (originalSiteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL
  else process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl
})

describe('SEO helpers', () => {
  it('운영 origin을 루트 URL로 정규화한다', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com/app?source=test#section'

    expect(getSiteUrl().toString()).toBe('https://example.com/')
    expect(absoluteUrl('/sitemap.xml')).toBe('https://example.com/sitemap.xml')
  })

  it('유효하지 않은 사이트 URL은 운영 기본값으로 대체한다', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'javascript:alert(1)'

    expect(getSiteUrl().origin).toBe(defaultSiteUrl)
  })

  it('실제 서비스 정보만 포함한 구조화 데이터를 만든다', () => {
    const data = buildStructuredData('투자 뉴스 영향 분석 서비스', 'ko-KR')

    expect(data['@graph'].map((item) => item['@type'])).toEqual(['Organization', 'WebSite', 'WebApplication'])
    expect(data['@graph'][1]).toMatchObject({ name: 'InvestLens', description: '투자 뉴스 영향 분석 서비스', inLanguage: 'ko-KR' })
  })

  it('JSON-LD의 HTML 시작 문자를 안전하게 이스케이프한다', () => {
    expect(serializeJsonLd({ value: '</script><script>' })).not.toContain('</script>')
    expect(serializeJsonLd({ value: '</script><script>' })).toContain('\\u003c/script>')
  })
})
