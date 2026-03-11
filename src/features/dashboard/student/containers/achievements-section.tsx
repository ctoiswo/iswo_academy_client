import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslation } from 'react-i18next'
import { AchievementItem } from '../components/achievement-item'
import type { DashboardAchievement } from '@/types'

interface AchievementsSectionProps {
  mounted: boolean
  achievements: DashboardAchievement[]
  isLoading: boolean
}

export function AchievementsSection({ mounted, achievements, isLoading }: AchievementsSectionProps) {
  const { t } = useTranslation()
  const a = 'dashboard.student.achievements'

  return (
    <section
      className={cn(
        'transition-all duration-700 delay-500',
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      )}
    >
      <h2 className='text-lg font-semibold text-foreground mb-4'>{t(`${a}.title`)}</h2>

      <div className='flex flex-wrap gap-3'>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-[52px] w-56 rounded-xl' />
          ))
        ) : achievements.length === 0 ? (
          <p className='text-sm text-muted-foreground py-2'>{t(`${a}.empty`)}</p>
        ) : (
          achievements.map((achievement, index) => (
            <AchievementItem key={achievement.id} achievement={achievement} index={index} />
          ))
        )}
      </div>
    </section>
  )
}
