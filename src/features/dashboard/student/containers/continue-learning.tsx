import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { PlayCircle, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useUserEnrollments } from '@/hooks/use-enrollments'

interface ContinueLearningProps {
  mounted: boolean
  academySlug: string
}

export function ContinueLearning({ mounted, academySlug }: ContinueLearningProps) {
  const { t } = useTranslation()
  const c = 'dashboard.student.continueLearning'
  const navigate = useNavigate()
  const { data: activeEnrollments } = useUserEnrollments({ status: 'active' })

  const lastCourse = useMemo(() => {
    const enrollments = activeEnrollments?.enrollments ?? []
    if (!enrollments.length) return null
    const latest = enrollments[0]
    return {
      id: String(latest.id),
      title: latest.course?.title ?? '',
      progress: latest.progress_percentage ?? 0,
      slug: latest.course?.slug ?? '',
    }
  }, [activeEnrollments])

  if (!lastCourse) return null

  return (
    <section
      id='continue'
      className={cn(
        'transition-all duration-700 delay-200',
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      )}
    >
      <h2 className='text-lg font-semibold text-foreground mb-4'>
        {t(`${c}.title`)}
      </h2>

      <div className='group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 via-card to-card hover:border-primary/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.1)]'>
        <div className='flex flex-col md:flex-row'>
          <div className='relative w-full md:w-72 h-40 md:h-auto bg-gradient-to-br from-indigo-500/30 to-indigo-600/10 shrink-0'>
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='size-20 rounded-2xl bg-primary/20 flex items-center justify-center backdrop-blur-sm border border-primary/20'>
                <PlayCircle className='size-10 text-primary' />
              </div>
            </div>
            <div className='absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent md:hidden' />
            <div className='hidden md:block absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-card to-transparent' />
          </div>

          <div className='flex-1 p-6 flex flex-col justify-center gap-4'>
            <div className='flex flex-col gap-2'>
              <Badge
                variant='outline'
                className='w-fit gap-1 text-[10px] bg-primary/10 border-primary/25 text-primary'
              >
                <PlayCircle className='size-3' />
                {t(`${c}.inProgress`)}
              </Badge>
              <h3 className='text-xl md:text-2xl font-bold text-foreground'>
                {lastCourse.title}
              </h3>
              <p className='text-sm text-muted-foreground'>
                {t(`${c}.completedPercent`, { progress: lastCourse.progress })}
              </p>
            </div>

            <div className='flex flex-col gap-2'>
              <div className='flex items-center justify-between text-xs'>
                <span className='text-muted-foreground'>{t(`${c}.courseProgress`)}</span>
                <span className='text-primary font-semibold'>{lastCourse.progress}%</span>
              </div>
              <div className='relative h-3 rounded-full bg-secondary overflow-hidden'>
                <div
                  className='absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1000 ease-out'
                  style={{ width: mounted ? `${lastCourse.progress}%` : '0%' }}
                />
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse' />
              </div>
            </div>

            <Button
              size='lg'
              className='w-full md:w-auto gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] group/btn'
              onClick={() =>
                navigate({
                  to: '/academy/$academySlug/my-courses',
                  params: { academySlug },
                  search: { status: 'active' },
                })
              }
            >
              <PlayCircle className='size-5' />
              {t(`${c}.continue`)}
              <ArrowRight className='size-4 group-hover/btn:translate-x-1 transition-transform' />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
