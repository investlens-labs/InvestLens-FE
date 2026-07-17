const DEFAULT_UPSTREAM_TIMEOUT_MS = 50_000
const INSTRUMENT_NEWS_TIMEOUT_MS = 150_000

export function getUpstreamTimeout(path: string[]) {
  return path.length === 3 && path[0] === 'instruments' && path[2] === 'news'
    ? INSTRUMENT_NEWS_TIMEOUT_MS
    : DEFAULT_UPSTREAM_TIMEOUT_MS
}
