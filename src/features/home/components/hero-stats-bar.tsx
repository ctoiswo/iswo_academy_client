import type { StatItem } from '@/types'

interface HeroStatsBarProps {
  items: StatItem[]
}

export function HeroStatsBar({ items }: HeroStatsBarProps) {
  if (items.length === 0) return null

  return (
    <div className='flex flex-wrap items-center justify-center gap-8 sm:gap-12 pt-8 border-t border-border/20 w-full max-w-xl'>
      {items.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className='flex flex-col items-center gap-1.5'>
            <div className='flex items-center gap-2'>
              <Icon className='size-4 text-primary/60' />
              <span
                className='text-xl sm:text-2xl font-bold text-foreground'
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {stat.value}
              </span>
            </div>
            <span className='text-[11px] text-muted-foreground'>{stat.label}</span>
          </div>
        )
      })}
    </div>
  )
}
