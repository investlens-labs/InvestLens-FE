import { cookies } from 'next/headers'
import { isAppLocale, localeCookieName } from '@/i18n/config'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { locale?: unknown } | null

  if (!isAppLocale(body?.locale)) {
    return Response.json({ message: 'Unsupported locale' }, { status: 400 })
  }

  const cookieStore = await cookies()
  cookieStore.set(localeCookieName, body.locale, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  return Response.json({ locale: body.locale })
}
