import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { AuthForm } from '@/components/auth/auth-form'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  return { title: t('login') }
}
export default function LoginPage() { return <AuthForm mode="login" /> }
