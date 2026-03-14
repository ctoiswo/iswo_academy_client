import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  desc: string
  mounted: boolean
  delay: number
}

export function FeatureCard({
  icon: Icon,
  title,
  desc,
  mounted,
  delay,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        'border-border/30 bg-card/40 flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-500',
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Icon className='text-primary/70 size-5' />
      <span className='text-foreground text-sm font-semibold'>{title}</span>
      <span className='text-muted-foreground text-xs'>{desc}</span>
    </div>
  )
}
