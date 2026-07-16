import { LoaderCircle, type LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

const variants: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 border-transparent',
  secondary: 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
  danger: 'border-red-200 bg-white text-red-600 hover:bg-red-50 dark:border-red-900/70 dark:bg-slate-900 dark:text-red-400',
  ghost: 'border-transparent bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  loading?: boolean
  icon?: LucideIcon
  children: ReactNode
}

export function Button({ variant = 'primary', loading, icon: Icon, className = '', disabled, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${className}`}
    >
      {loading ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : Icon ? <Icon aria-hidden className="size-4" /> : null}
      {children}
    </button>
  )
}
