import type { StatItem } from '@/types'

interface HeroStatsBarProps {
  items: StatItem[]
}

export function HeroStatsBar({ items }: HeroStatsBarProps) {
  if (items.length === 0) return null

  return (
    <div className='border-border/20 flex w-full max-w-xl flex-wrap items-center justify-center gap-8 border-t pt-8 sm:gap-12'>
      {items.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className='flex flex-col items-center gap-1.5'>
            <div className='flex items-center gap-2'>
              <Icon className='text-primary/60 size-4' />
              <span
                className='text-foreground text-xl font-bold sm:text-2xl'
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {stat.value}
              </span>
            </div>
            <span className='text-muted-foreground text-[11px]'>
              {stat.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
