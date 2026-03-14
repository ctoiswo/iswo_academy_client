import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { PlayCircle, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useUserEnrollments } from '@/hooks/use-enrollments'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ContinueLearningProps {
  mounted: boolean
  academySlug: string
}

export function ContinueLearning({
  mounted,
  academySlug,
}: ContinueLearningProps) {
  const { t } = useTranslation()
  const c = 'dashboard.student.continueLearning'
  const navigate = useNavigate()
  const { data: activeEnrollments } = useUserEnrollments({ status: 'active', academy_slug: academySlug })

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
        'transition-all delay-200 duration-700',
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      )}
    >
      <h2 className='text-foreground mb-4 text-lg font-semibold'>
        {t(`${c}.title`)}
      </h2>

      <div className='group border-border/60 from-primary/5 via-card to-card hover:border-primary/40 relative overflow-hidden rounded-2xl border bg-gradient-to-br transition-all duration-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.1)]'>
        <div className='flex flex-col md:flex-row'>
          <div className='relative h-40 w-full shrink-0 bg-gradient-to-br from-indigo-500/30 to-indigo-600/10 md:h-auto md:w-72'>
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='bg-primary/20 border-primary/20 flex size-20 items-center justify-center rounded-2xl border backdrop-blur-sm'>
                <PlayCircle className='text-primary size-10' />
              </div>
            </div>
            <div className='from-card absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t to-transparent md:hidden' />
            <div className='from-card absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l to-transparent md:block' />
          </div>

          <div className='flex flex-1 flex-col justify-center gap-4 p-6'>
            <div className='flex flex-col gap-2'>
              <Badge
                variant='outline'
                className='bg-primary/10 border-primary/25 text-primary w-fit gap-1 text-[10px]'
              >
                <PlayCircle className='size-3' />
                {t(`${c}.inProgress`)}
              </Badge>
              <h3 className='text-foreground text-xl font-bold md:text-2xl'>
                {lastCourse.title}
              </h3>
              <p className='text-muted-foreground text-sm'>
                {t(`${c}.completedPercent`, { progress: lastCourse.progress })}
              </p>
            </div>

            <div className='flex flex-col gap-2'>
              <div className='flex items-center justify-between text-xs'>
                <span className='text-muted-foreground'>
                  {t(`${c}.courseProgress`)}
                </span>
                <span className='text-primary font-semibold'>
                  {lastCourse.progress}%
                </span>
              </div>
              <div className='bg-secondary relative h-3 overflow-hidden rounded-full'>
                <div
                  className='from-primary to-primary/80 absolute inset-y-0 left-0 rounded-full bg-gradient-to-r transition-all duration-1000 ease-out'
                  style={{ width: mounted ? `${lastCourse.progress}%` : '0%' }}
                />
                <div className='absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent' />
              </div>
            </div>

            <Button
              size='lg'
              className='bg-primary text-primary-foreground hover:bg-primary/90 group/btn w-full gap-2 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] md:w-auto'
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
              <ArrowRight className='size-4 transition-transform group-hover/btn:translate-x-1' />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
