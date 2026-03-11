import { BookOpen, Flame, Compass, Star, Users, Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { DashboardAchievement } from '@/types'

const CATEGORY_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>, color: string }> = {
  learning: { icon: BookOpen, color: 'text-blue-400' },
  consistency: { icon: Flame, color: 'text-orange-400' },
  exploration: { icon: Compass, color: 'text-emerald-400' },
  excellence: { icon: Star, color: 'text-amber-400' },
  social: { icon: Users, color: 'text-purple-400' },
}

interface AchievementItemProps {
  achievement: DashboardAchievement
  index: number
}

export function AchievementItem({ achievement, index }: AchievementItemProps) {
  const { t } = useTranslation()
  const a = 'dashboard.student.achievements'
  const config = CATEGORY_CONFIG[achievement.category] ?? { icon: Trophy, color: 'text-primary' }
  const Icon = config.icon

  function formatCompletedAt(completedAt: string | null): string {
    if (!completedAt) return ''
    const now = new Date()
    const date = new Date(completedAt)
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(diffDays / 7)
    const months = Math.floor(diffDays / 30)
    if (diffDays === 0) return t(`${a}.today`)
    if (diffDays === 1) return t(`${a}.yesterday`)
    if (diffDays < 7) return t(`${a}.daysAgo`, { count: diffDays })
    if (weeks === 1) return t(`${a}.weekAgo`)
    if (diffDays < 30) return t(`${a}.weeksAgo`, { count: weeks })
    if (months === 1) return t(`${a}.monthAgo`)
    return t(`${a}.monthsAgo`, { count: months })
  }

  return (
    <div
      className={cn(
        'group flex items-center gap-3 px-4 py-3 rounded-xl border border-border/60 bg-card',
        'transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_16px_rgba(99,102,241,0.06)]',
      )}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className='flex items-center justify-center size-9 rounded-lg bg-primary/10'>
        <Icon className={cn('size-4', config.color)} />
      </div>
      <div className='flex flex-col'>
        <span className='text-sm font-medium text-foreground'>{achievement.name}</span>
        <span className='text-[10px] text-muted-foreground'>{formatCompletedAt(achievement.completed_at)}</span>
      </div>
    </div>
  )
}
