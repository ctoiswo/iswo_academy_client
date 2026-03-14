import { PlayCircle, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface WelcomeHeroProps {
  firstName: string
  pendingTasksCount: number
  mounted: boolean
}

export function WelcomeHero({
  firstName,
  pendingTasksCount,
  mounted,
}: WelcomeHeroProps) {
  const { t } = useTranslation()
  const w = 'dashboard.student.welcome'

  return (
    <section
      className={cn(
        'border-border/60 from-card via-card to-primary/5 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 md:p-8',
        'transition-all duration-700',
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      )}
    >
      <div className='bg-primary/10 absolute top-0 right-0 h-64 w-64 translate-x-1/4 -translate-y-1/2 rounded-full blur-[100px]' />
      <div className='bg-primary/5 absolute bottom-0 left-1/4 h-32 w-32 rounded-full blur-[60px]' />

      <div className='relative z-10 flex flex-col gap-3'>
        <h1 className='text-foreground text-2xl font-bold tracking-tight md:text-3xl'>
          {t(`${w}.title`, { firstName })}
        </h1>
        <p className='text-muted-foreground max-w-2xl text-sm leading-relaxed md:text-base'>
          {t(`${w}.taskCountBefore`)}{' '}
          <span className='font-semibold text-amber-400'>
            {t(`${w}.taskCountHighlight`, { count: pendingTasksCount })}
          </span>{' '}
          {t(`${w}.taskCountAfter`)}
        </p>
        <div className='mt-2 flex flex-wrap gap-2'>
          <a href='#continue'>
            <Badge
              variant='outline'
              className='bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 cursor-pointer gap-1.5 px-3 py-1.5 transition-colors'
            >
              <PlayCircle className='size-3.5' />
              {t(`${w}.continueLearning`)}
            </Badge>
          </a>
          <a href='#tasks'>
            <Badge
              variant='outline'
              className='cursor-pointer gap-1.5 border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-amber-400 transition-colors hover:bg-amber-500/20'
            >
              <AlertCircle className='size-3.5' />
              {t(`${w}.viewTasks`)}
            </Badge>
          </a>
        </div>
      </div>
    </section>
  )
}
