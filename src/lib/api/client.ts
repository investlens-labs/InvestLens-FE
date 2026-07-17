import { tokenStorage } from '@/lib/auth/token-storage'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/backend'
const RETRY_DELAYS = [900, 1800]

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  auth?: boolean
  timeoutMs?: number
}

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

const extractMessage = (data: unknown, fallback: string) => {
  if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
    return data.message
  }
  return fallback
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, timeoutMs = 45_000, body, ...init } = options
  const method = (init.method ?? 'GET').toUpperCase()
  const maxAttempts = method === 'GET' ? RETRY_DELAYS.length + 1 : 1

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), timeoutMs)
    const token = auth ? tokenStorage.get() : null

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...init.headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      })

      const contentType = response.headers.get('content-type') ?? ''
      const data = contentType.includes('json') ? await response.json() : await response.text()

      if (response.status === 401 && auth) {
        tokenStorage.clear()
        window.dispatchEvent(new Event('investlens:unauthorized'))
      }

      if (!response.ok) {
        const error = new ApiError(extractMessage(data, '요청을 처리하지 못했습니다.'), response.status, data)
        if (attempt < maxAttempts - 1 && response.status >= 500) {
          await wait(RETRY_DELAYS[attempt])
          continue
        }
        throw error
      }

      return data as T
    } catch (error) {
      if (error instanceof ApiError) throw error
      if (attempt < maxAttempts - 1) {
        await wait(RETRY_DELAYS[attempt])
        continue
      }
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.', 408)
      }
      throw new ApiError('네트워크 연결을 확인해 주세요.', 0, error)
    } finally {
      window.clearTimeout(timer)
    }
  }

  throw new ApiError('요청을 완료하지 못했습니다.', 0)
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  delete: <T = void>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}
