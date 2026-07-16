'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, type ReactNode } from 'react'
import { authApi } from '@/lib/api/services'
import type { TokenResponse, User } from '@/lib/api/types'
import { tokenStorage } from '@/lib/auth/token-storage'
import { queryKeys } from '@/lib/query-keys'

interface AuthContextValue {
  user?: User
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (token: TokenResponse) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)
const PUBLIC_PATHS = ['/login', '/signup']

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const hasToken = Boolean(tokenStorage.get())
  const { data: user, isLoading } = useQuery({
    queryKey: queryKeys.me,
    queryFn: authApi.me,
    enabled: hasToken,
  })

  const signOut = useCallback(() => {
    tokenStorage.clear()
    queryClient.clear()
    router.replace('/login')
  }, [queryClient, router])

  const signIn = useCallback((token: TokenResponse) => {
    tokenStorage.set(token.accessToken)
    void queryClient.invalidateQueries({ queryKey: queryKeys.me })
    router.replace('/dashboard')
  }, [queryClient, router])

  useEffect(() => {
    window.addEventListener('investlens:unauthorized', signOut)
    return () => window.removeEventListener('investlens:unauthorized', signOut)
  }, [signOut])

  useEffect(() => {
    if (!hasToken && !PUBLIC_PATHS.includes(pathname) && pathname !== '/') router.replace('/login')
    if (hasToken && PUBLIC_PATHS.includes(pathname)) router.replace('/dashboard')
  }, [hasToken, pathname, router])

  return <AuthContext value={{ user, isAuthenticated: hasToken, isLoading, signIn, signOut }}>{children}</AuthContext>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
