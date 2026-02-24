import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  desc: string
  mounted: boolean
  delay: number
}

export function FeatureCard({ icon: Icon, title, desc, mounted, delay }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2 p-4 rounded-xl border border-border/30 bg-card/40 transition-all duration-500',
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Icon className='size-5 text-primary/70' />
      <span className='text-sm font-semibold text-foreground'>{title}</span>
      <span className='text-xs text-muted-foreground'>{desc}</span>
    </div>
  )
}
