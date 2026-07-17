import { describe, expect, it } from 'vitest'
import { createProxyResponse } from './proxy-response'

describe('createProxyResponse', () => {
  it('204 응답에 body를 생성하지 않고 상태 코드를 유지한다', async () => {
    const response = await createProxyResponse(new Response(null, { status: 204 }), new Headers())

    expect(response.status).toBe(204)
    expect(await response.text()).toBe('')
  })

  it('일반 응답 body와 content-type을 전달한다', async () => {
    const headers = new Headers({ 'Content-Type': 'application/json' })
    const response = await createProxyResponse(new Response('{"ok":true}', { status: 200 }), headers)

    expect(response.headers.get('content-type')).toBe('application/json')
    expect(await response.json()).toEqual({ ok: true })
  })
})
