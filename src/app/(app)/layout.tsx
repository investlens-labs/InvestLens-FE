import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AppShell } from '@/components/layout/app-shell'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
}

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>
}
