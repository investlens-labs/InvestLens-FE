const BODYLESS_STATUS_CODES = new Set([204, 205, 304])

export async function createProxyResponse(response: Response, headers: Headers) {
  const body = BODYLESS_STATUS_CODES.has(response.status) ? null : await response.arrayBuffer()
  return new Response(body, { status: response.status, headers })
}
