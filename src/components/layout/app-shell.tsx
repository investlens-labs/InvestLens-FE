'use client'

import { BriefcaseBusiness, ChevronDown, LayoutDashboard, LogOut, Menu, Moon, Search, Sun, UserRound, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { useTheme } from '@/components/providers/theme-provider'
import logo from '@/app/icon.png'

const navItems = [
  { href: '/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/search', label: '종목 검색', icon: Search },
  { href: '/portfolio', label: '포트폴리오', icon: BriefcaseBusiness },
]

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { theme, toggle } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMobileOpen(false), [pathname])
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setUserOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1211]">
      <header className="fixed inset-x-0 top-0 z-40 h-14 border-b border-slate-200/90 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="flex h-full items-center px-4 lg:px-5">
          <button className="mr-2 grid size-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800" onClick={() => setMobileOpen(true)} aria-label="메뉴 열기">
            <Menu className="size-5" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2 font-bold tracking-tight text-slate-950 dark:text-white">
            <span className="grid size-7 overflow-hidden rounded-lg" aria-hidden><Image src={logo} alt="" priority className="size-full scale-[1.65] object-contain" /></span>
            <span className="text-base">InvestLens</span>
          </Link>
          <div className="ml-auto flex items-center gap-1.5">
            <button onClick={toggle} className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" aria-label={theme === 'light' ? '다크 모드 사용' : '라이트 모드 사용'}>
              {theme === 'light' ? <Moon className="size-4.5" /> : <Sun className="size-4.5" />}
            </button>
            <div className="relative" ref={menuRef}>
              <button onClick={() => setUserOpen((open) => !open)} className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" aria-expanded={userOpen} aria-haspopup="menu">
                <span className="grid size-6 place-items-center rounded-md bg-brand-50 text-brand-700 dark:bg-brand-700/25 dark:text-brand-100"><UserRound className="size-3.5" /></span>
                <span className="hidden max-w-40 truncate sm:block">{user?.email ?? '내 계정'}</span>
                <ChevronDown className="size-3.5" />
              </button>
              {userOpen && (
                <div role="menu" className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  <div className="border-b border-slate-100 px-2.5 py-2 dark:border-slate-800">
                    <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">{user?.email}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{user?.role === 'ADMIN' ? '관리자' : '일반 사용자'}</p>
                  </div>
                  <button role="menuitem" onClick={signOut} className="mt-1 flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50">
                    <LogOut className="size-4" />로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <aside className={`fixed bottom-0 left-0 top-14 z-30 w-60 border-r border-slate-200 bg-white p-3 transition-transform lg:translate-x-0 dark:border-slate-800 dark:bg-slate-950 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-2 flex items-center justify-between px-2 lg:hidden">
          <span className="text-xs font-semibold text-slate-500">메뉴</span>
          <button onClick={() => setMobileOpen(false)} className="grid size-8 place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="메뉴 닫기"><X className="size-4" /></button>
        </div>
        <nav aria-label="주 메뉴" className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href === '/dashboard' && pathname.startsWith('/news/'))
            return (
              <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${active ? 'bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
                <Icon className="size-4.5" />{label}
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-4 left-3 right-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          뉴스 분석은 투자 참고 정보이며 투자 조언이나 주가 예측이 아닙니다.
        </div>
      </aside>
      {mobileOpen && <button className="fixed inset-0 z-20 bg-slate-950/35 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="메뉴 닫기" />}

      <main id="main-content" className="min-h-screen pt-14 lg:pl-60">
        <div className="mx-auto w-full max-w-[1480px] p-4 sm:p-5 lg:p-6">{children}</div>
      </main>
    </div>
  )
}
