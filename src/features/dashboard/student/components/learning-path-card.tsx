import { GraduationCap, Clock, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import type { DashboardLPEnrollment } from '@/types'

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'from-emerald-500/30 to-emerald-600/10',
  intermediate: 'from-indigo-500/30 to-indigo-600/10',
  advanced: 'from-sky-500/30 to-sky-600/10',
}

interface LearningPathCardProps {
  path: DashboardLPEnrollment
  index: number
  onContinue?: (slug: string) => void
}

export function LearningPathCard({ path, index, onContinue }: LearningPathCardProps) {
  const { t } = useTranslation()
  const lp = 'dashboard.student.learningPaths'
  const color = DIFFICULTY_COLORS[path.difficulty_level] ?? DIFFICULTY_COLORS.intermediate
  const hours = path.estimated_duration_hours
  const months = Math.ceil(hours / 40)
  const timeLabel = months === 1 ? t(`${lp}.durationMonth`) : t(`${lp}.durationMonths`, { count: months })

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border/60 bg-card',
        'transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_24px_rgba(99,102,241,0.08)]',
        'hover:-translate-y-0.5',
      )}
      style={{ transitionDelay: `${index * 75}ms` }}
    >
      <div className={cn('h-20 bg-gradient-to-br relative', color)}>
        <div className='absolute inset-0 flex items-center justify-center'>
          <GraduationCap className='size-8 text-foreground/10' />
        </div>
        <div className='absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent' />
      </div>

      <div className='p-4 -mt-6 relative z-10 flex flex-col gap-3'>
        <h3 className='text-sm font-semibold text-foreground'>{path.title}</h3>

        <div className='flex flex-col gap-1.5'>
          <div className='flex items-center justify-between text-[11px]'>
            <span className='text-muted-foreground'>
              {t(`${lp}.courses`, { completed: path.completed_courses, total: path.total_courses })}
            </span>
            <span className='text-primary font-semibold'>{path.progress_percentage}%</span>
          </div>
          <Progress value={path.progress_percentage} className='h-1.5' />
        </div>

        <div className='flex items-center justify-between pt-1'>
          <div className='flex items-center gap-1 text-[11px] text-muted-foreground'>
            <Clock className='size-3' />
            {timeLabel}
          </div>
          <Button
            size='sm'
            variant='ghost'
            className='h-7 px-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity gap-1'
            onClick={() => onContinue?.(path.slug)}
          >
            {t(`${lp}.continue`)}
            <ArrowRight className='size-3' />
          </Button>
        </div>
      </div>
    </div>
  )
}
