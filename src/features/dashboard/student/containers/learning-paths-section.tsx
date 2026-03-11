import { useNavigate } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { LearningPathCard } from '../components/learning-path-card'
import type { DashboardLPEnrollment } from '@/types'

interface LearningPathsSectionProps {
  mounted: boolean
  academySlug: string
  enrollments: DashboardLPEnrollment[]
  isLoading: boolean
}

export function LearningPathsSection({ mounted, academySlug, enrollments, isLoading }: LearningPathsSectionProps) {
  const { t } = useTranslation()
  const lp = 'dashboard.student.learningPaths'
  const navigate = useNavigate()

  return (
    <section
      className={cn(
        'transition-all duration-700 delay-[400ms]',
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      )}
    >
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <h2 className='text-lg font-semibold text-foreground'>{t(`${lp}.title`)}</h2>
          {!isLoading && (
            <Badge variant='secondary' className='text-xs'>
              {enrollments.length}
            </Badge>
          )}
        </div>
        <Button
          variant='ghost'
          size='sm'
          className='text-xs text-muted-foreground hover:text-foreground gap-1'
          onClick={() =>
            navigate({
              to: '/academy/$academySlug/learning-paths',
              params: { academySlug },
            })
          }
        >
          {t(`${lp}.viewAll`)}
          <ChevronRight className='size-3.5' />
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-[200px] rounded-xl' />
          ))
        ) : enrollments.length === 0 ? (
          <p className='text-sm text-muted-foreground py-2 col-span-3'>{t(`${lp}.empty`)}</p>
        ) : (
          enrollments.map((path, index) => (
            <LearningPathCard
              key={path.id}
              path={path}
              index={index}
              onContinue={(slug) =>
                navigate({
                  to: '/academy/$academySlug/learning-paths/$learningPathSlug',
                  params: { academySlug, learningPathSlug: slug },
                })
              }
            />
          ))
        )}
      </div>
    </section>
  )
}
