'use client'

import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/lib/api/client'
import { authApi } from '@/lib/api/services'
import logo from '@/app/icon.png'

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const isSignup = mode === 'signup'

  const mutation = useMutation({
    mutationFn: async () => {
      if (isSignup) await authApi.signup({ email, password })
      return authApi.login({ email, password })
    },
    onSuccess: signIn,
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!mutation.isPending) mutation.mutate()
  }

  const error = mutation.error instanceof ApiError
    ? mutation.error.status === 409 ? '이미 가입된 이메일입니다.' : mutation.error.message
    : mutation.error ? '요청을 처리하지 못했습니다.' : null

  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-7 flex items-center justify-center gap-2 text-lg font-bold lg:hidden dark:text-white"><span className="grid size-8 overflow-hidden rounded-lg" aria-hidden><Image src={logo} alt="" priority className="size-full scale-[1.65] object-contain" /></span>InvestLens</div>
      <div className="surface p-5 sm:p-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600">{isSignup ? 'Create account' : 'Welcome back'}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{isSignup ? '회원가입' : '로그인'}</h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{isSignup ? '투자 뉴스를 내 포트폴리오에 맞춰 받아보세요.' : '계정에 로그인해 맞춤 뉴스 피드를 확인하세요.'}</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="label">이메일</label>
            <div className="relative"><Mail aria-hidden className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input id="email" className="field pl-9" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" maxLength={320} required /></div>
          </div>
          <div>
            <label htmlFor="password" className="label">비밀번호</label>
            <div className="relative">
              <LockKeyhole aria-hidden className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input id="password" className="field px-9" type={showPassword ? 'text' : 'password'} autoComplete={isSignup ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isSignup ? '8자 이상 입력' : '비밀번호 입력'} minLength={isSignup ? 8 : undefined} maxLength={72} required />
              <button type="button" className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setShowPassword((show) => !show)} aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
            </div>
            {isSignup && <p className="mt-1.5 text-xs text-slate-500">영문·숫자 조합을 권장하며 8–72자로 입력해 주세요.</p>}
          </div>
          {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">{error}</div>}
          <Button type="submit" className="w-full" loading={mutation.isPending}>{mutation.isPending ? (isSignup ? '계정을 만드는 중' : '로그인 중') : (isSignup ? '계정 만들기' : '로그인')}</Button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500">
          {isSignup ? '이미 계정이 있나요?' : '처음 방문하셨나요?'}{' '}
          <Link href={isSignup ? '/login' : '/signup'} className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">{isSignup ? '로그인' : '회원가입'}</Link>
        </p>
      </div>
    </div>
  )
}
