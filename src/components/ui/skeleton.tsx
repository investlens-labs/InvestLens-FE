export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-800 ${className}`} />
}

export function NewsSkeleton() {
  return (
    <div className="surface space-y-3 p-4">
      <div className="flex gap-2"><Skeleton className="h-5 w-14" /><Skeleton className="h-5 w-20" /></div>
      <Skeleton className="h-5 w-4/5" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" />
    </div>
  )
}
