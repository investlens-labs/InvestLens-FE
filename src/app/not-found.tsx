import { Compass, Home } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return <main id="main-content" className="grid min-h-screen place-items-center bg-slate-50 p-5 dark:bg-slate-950"><div className="surface w-full max-w-md p-8 text-center"><span className="mx-auto grid size-12 place-items-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-100"><Compass className="size-6" /></span><p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-brand-600">404 error</p><h1 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">페이지를 찾을 수 없습니다</h1><p className="mt-2 text-sm leading-6 text-slate-500">주소가 변경되었거나 존재하지 않는 페이지입니다.</p><Link href="/dashboard" className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700"><Home className="size-4" />대시보드로 이동</Link></div></main>
}
