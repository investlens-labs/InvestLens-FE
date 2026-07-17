import { NextRequest } from 'next/server'
import { createProxyResponse } from '@/lib/api/proxy-response'
import { getUpstreamTimeout } from '@/lib/api/proxy-timeout'

const BACKEND_API_URL = process.env.INVESTLENS_API_BASE_URL ?? 'https://investlens-be.onrender.com/api/v1'
const ALLOWED_METHODS = new Set(['GET', 'POST', 'DELETE'])

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  if (!ALLOWED_METHODS.has(request.method)) {
    return Response.json({ message: '지원하지 않는 요청입니다.' }, { status: 405 })
  }

  const { path } = await context.params
  const upstreamUrl = new URL(`${BACKEND_API_URL}/${path.map(encodeURIComponent).join('/')}`)
  const upstreamTimeout = getUpstreamTimeout(path)
  request.nextUrl.searchParams.forEach((value, key) => upstreamUrl.searchParams.append(key, value))

  const headers = new Headers({ Accept: 'application/json' })
  const authorization = request.headers.get('authorization')
  const contentType = request.headers.get('content-type')
  if (authorization) headers.set('Authorization', authorization)
  if (contentType) headers.set('Content-Type', contentType)

  try {
    const response = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body: request.method === 'POST' ? await request.text() : undefined,
      cache: 'no-store',
      signal: AbortSignal.timeout(upstreamTimeout),
    })
    const responseHeaders = new Headers()
    const upstreamContentType = response.headers.get('content-type')
    if (upstreamContentType) responseHeaders.set('Content-Type', upstreamContentType)
    return createProxyResponse(response, responseHeaders)
  } catch (error) {
    const message = error instanceof DOMException && error.name === 'TimeoutError'
      ? '백엔드 서버 응답이 지연되고 있습니다.'
      : '백엔드 서버에 연결할 수 없습니다.'
    return Response.json({ message }, { status: 503 })
  }
}

export const dynamic = 'force-dynamic'
export const GET = proxy
export const POST = proxy
export const DELETE = proxy
