'use client'

import { AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return <main id="main-content" className="grid min-h-screen place-items-center bg-slate-50 p-5 dark:bg-slate-950"><div className="surface max-w-md p-7 text-center"><AlertTriangle className="mx-auto size-8 text-red-500" /><h1 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">예기치 않은 오류가 발생했습니다</h1><p className="mt-2 text-sm leading-6 text-slate-500">작업 내용은 안전하게 유지됩니다. 화면을 다시 불러와 복구해 보세요.</p><Button className="mt-5" onClick={reset}>다시 시도</Button></div></main>
}
