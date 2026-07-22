import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { AuthForm } from '@/components/auth/auth-form'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  return { title: t('signup'), alternates: { canonical: '/signup' }, robots: { index: false, follow: true } }
}
export default function SignupPage() { return <AuthForm mode="signup" /> }
