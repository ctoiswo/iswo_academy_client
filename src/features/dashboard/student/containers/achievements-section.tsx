import type { DashboardAchievement } from '@/types'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { AchievementItem } from '../components/achievement-item'

interface AchievementsSectionProps {
  mounted: boolean
  achievements: DashboardAchievement[]
  isLoading: boolean
}

export function AchievementsSection({
  mounted,
  achievements,
  isLoading,
}: AchievementsSectionProps) {
  const { t } = useTranslation()
  const a = 'dashboard.student.achievements'

  return (
    <section
      className={cn(
        'transition-all delay-500 duration-700',
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      )}
    >
      <h2 className='text-foreground mb-4 text-lg font-semibold'>
        {t(`${a}.title`)}
      </h2>

      <div className='flex flex-wrap gap-3'>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-[52px] w-56 rounded-xl' />
          ))
        ) : achievements.length === 0 ? (
          <p className='text-muted-foreground py-2 text-sm'>
            {t(`${a}.empty`)}
          </p>
        ) : (
          achievements.map((achievement, index) => (
            <AchievementItem
              key={achievement.id}
              achievement={achievement}
              index={index}
            />
          ))
        )}
      </div>
    </section>
  )
}
