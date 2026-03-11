import { PlayCircle, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface WelcomeHeroProps {
  firstName: string
  pendingTasksCount: number
  mounted: boolean
}

export function WelcomeHero({ firstName, pendingTasksCount, mounted }: WelcomeHeroProps) {
  const { t } = useTranslation()
  const w = 'dashboard.student.welcome'

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-primary/5 p-6 md:p-8',
        'transition-all duration-700',
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      )}
    >
      <div className='absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4' />
      <div className='absolute bottom-0 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-[60px]' />

      <div className='relative z-10 flex flex-col gap-3'>
        <h1 className='text-2xl md:text-3xl font-bold tracking-tight text-foreground'>
          {t(`${w}.title`, { firstName })}
        </h1>
        <p className='text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl'>
          {t(`${w}.taskCountBefore`)}{' '}
          <span className='text-amber-400 font-semibold'>
            {t(`${w}.taskCountHighlight`, { count: pendingTasksCount })}
          </span>{' '}
          {t(`${w}.taskCountAfter`)}
        </p>
        <div className='flex flex-wrap gap-2 mt-2'>
          <a href='#continue'>
            <Badge
              variant='outline'
              className='gap-1.5 px-3 py-1.5 bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 cursor-pointer transition-colors'
            >
              <PlayCircle className='size-3.5' />
              {t(`${w}.continueLearning`)}
            </Badge>
          </a>
          <a href='#tasks'>
            <Badge
              variant='outline'
              className='gap-1.5 px-3 py-1.5 bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 cursor-pointer transition-colors'
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
