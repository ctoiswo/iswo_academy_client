import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export interface StatCardProps {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  /** Tailwind background utility for the icon wrapper, e.g. "bg-primary/10" */
  iconBg?: string
  /** Tailwind text color utility for the icon, e.g. "text-primary" */
  iconColor?: string
  loading?: boolean
  className?: string
  /** When provided the card renders as a button */
  onClick?: () => void
  /** Optional small sub-label below the value */
  description?: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconBg = 'bg-primary/10',
  iconColor = 'text-primary',
  loading = false,
  className,
  onClick,
  description,
}: StatCardProps) {
  const baseClass = cn(
    'flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4',
    'transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.06)]',
    onClick && 'cursor-pointer hover:-translate-y-0.5 text-left w-full',
    className
  )

  if (loading) {
    return (
      <div className={baseClass}>
        <Skeleton className='size-10 rounded-lg' />
        <div className='flex flex-col gap-1'>
          <Skeleton className='h-6 w-12' />
          <Skeleton className='h-3 w-20' />
        </div>
      </div>
    )
  }

  const content = (
    <>
      <div
        className={cn(
          'flex shrink-0 items-center justify-center size-10 rounded-lg',
          iconBg
        )}
      >
        <Icon className={cn('size-5', iconColor)} />
      </div>
      <div className='flex flex-col min-w-0'>
        <span className='text-xl font-bold text-foreground leading-tight'>
          {value}
        </span>
        <span className='text-[11px] text-muted-foreground leading-tight'>
          {label}
        </span>
        {description && (
          <span className='text-[10px] text-muted-foreground/70 mt-0.5 leading-tight truncate'>
            {description}
          </span>
        )}
      </div>
    </>
  )

  if (onClick) {
    return (
      <button type='button' className={baseClass} onClick={onClick}>
        {content}
      </button>
    )
  }

  return <div className={baseClass}>{content}</div>
}
