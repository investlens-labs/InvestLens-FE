import { describe, expect, it } from 'vitest'
import en from '../../../messages/en.json'
import ja from '../../../messages/ja.json'
import ko from '../../../messages/ko.json'
import zh from '../../../messages/zh.json'
import { locales, type AppLocale } from '@/i18n/config'

type MessageLeaf = string | number | boolean
type MessageTree = { [key: string]: MessageTree | MessageLeaf }

const messages: Record<AppLocale, MessageTree> = { ko, en, ja, zh }

function flattenMessages(tree: MessageTree, prefix = '', result: Record<string, MessageLeaf> = {}) {
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object') flattenMessages(value, path, result)
    else result[path] = value
  }
  return result
}

function getIcuPlaceholders(message: MessageLeaf) {
  if (typeof message !== 'string') return []
  return [...new Set([...message.matchAll(/\{([A-Za-z][\w]*)\b/g)].map((match) => match[1]))].sort()
}

describe('i18n message catalogs', () => {
  const reference = flattenMessages(messages.ko)

  it.each(locales)('%s 카탈로그가 한국어와 동일한 leaf key를 가진다', (locale) => {
    expect(Object.keys(flattenMessages(messages[locale])).sort()).toEqual(Object.keys(reference).sort())
  })

  it.each(locales)('%s 카탈로그가 각 key의 ICU placeholder를 유지한다', (locale) => {
    const catalog = flattenMessages(messages[locale])
    const mismatches = Object.keys(reference).filter((key) => (
      JSON.stringify(getIcuPlaceholders(catalog[key])) !== JSON.stringify(getIcuPlaceholders(reference[key]))
    ))

    expect(mismatches).toEqual([])
  })
})
