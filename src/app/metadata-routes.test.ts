import { describe, expect, it } from 'vitest'
import manifest from './manifest'
import robots from './robots'
import sitemap from './sitemap'

describe('metadata routes', () => {
  it('공개 홈을 허용하고 API 크롤링을 제한한다', () => {
    const result = robots()
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules

    expect(rules).toMatchObject({ userAgent: '*', allow: '/', disallow: '/api/' })
    expect(result.sitemap).toMatch(/^https:\/\/.*\/sitemap\.xml$/)
  })

  it('공개 랜딩 페이지만 sitemap에 포함한다', () => {
    const result = sitemap()

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ url: expect.stringMatching(/^https:\/\/.*\/$/), priority: 1 })
  })

  it('설치 가능한 웹 앱 manifest를 제공한다', () => {
    expect(manifest()).toMatchObject({
      name: 'InvestLens',
      start_url: '/',
      display: 'standalone',
      icons: [expect.objectContaining({ src: '/icon.png', type: 'image/png' })],
    })
  })
})
