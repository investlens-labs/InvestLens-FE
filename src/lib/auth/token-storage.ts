const ACCESS_TOKEN_KEY = 'investlens.accessToken'

export const tokenStorage = {
  get: () => (typeof window === 'undefined' ? null : window.localStorage.getItem(ACCESS_TOKEN_KEY)),
  set: (token: string) => window.localStorage.setItem(ACCESS_TOKEN_KEY, token),
  clear: () => {
    if (typeof window !== 'undefined') window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  },
}
