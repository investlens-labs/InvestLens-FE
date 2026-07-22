import { CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import type { ReactNode } from 'react'
import logo from '@/app/icon.png'

const points = ['포트폴리오 기반 맞춤 뉴스', 'AI 분석 영향 방향과 1–10점 점수', '빠른 종목 탐색과 관심 종목 관리']

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" className="grid min-h-screen bg-white lg:grid-cols-[minmax(340px,0.9fr)_1.1fr] dark:bg-slate-950">
      <section className="hidden bg-[#0d3329] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-2.5 text-lg font-bold"><span className="grid size-8 overflow-hidden rounded-lg bg-white/10" aria-hidden><Image src={logo} alt="" priority className="size-full object-contain" /></span>InvestLens</div>
        <div className="max-w-lg">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">News intelligence for investors</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight">시장 뉴스의 영향을<br />더 빠르고 명확하게.</h1>
          <p className="mt-4 whitespace-nowrap text-sm leading-6 text-emerald-50/70">내가 보유한 종목을 중심으로 중요한 뉴스와 영향 가능성을 한 화면에서 확인하세요.</p>
          <ul className="mt-8 space-y-3">
            {points.map((point) => <li key={point} className="flex items-center gap-2.5 text-sm text-emerald-50/90"><CheckCircle2 className="size-4 text-emerald-300" />{point}</li>)}
          </ul>
        </div>
        <p className="text-xs text-emerald-50/50">분석 결과는 투자 조언이나 주가 예측이 아닙니다.</p>
      </section>
      <section className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10 dark:bg-slate-950">{children}</section>
    </main>
  )
}
