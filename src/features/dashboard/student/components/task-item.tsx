import type { DashboardAssignment } from '@/types'
import { Calendar, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface TaskItemProps {
  task: DashboardAssignment
  index: number
}

export function TaskItem({ task, index }: TaskItemProps) {
  const { t } = useTranslation()
  const tk = 'dashboard.student.tasks'

  function formatDueDate(
    dueAt: string | null,
    daysUntil: number | null,
    isPastDue: boolean
  ): string {
    if (!dueAt) return t(`${tk}.noDate`)
    if (isPastDue) return t(`${tk}.overdue`)
    if (daysUntil === 0) return t(`${tk}.today`)
    if (daysUntil === 1) return t(`${tk}.tomorrow`)
    if (daysUntil !== null) return t(`${tk}.inDays`, { count: daysUntil })
    return t(`${tk}.noDate`)
  }

  const isUrgent =
    task.is_past_due ||
    task.status === 'past_due' ||
    (task.days_until_due !== null && task.days_until_due <= 1)
  const dueLabel = formatDueDate(
    task.due_at,
    task.days_until_due,
    task.is_past_due
  )

  return (
    <div
      className={cn(
        'group border-border/60 bg-card flex items-center gap-4 rounded-xl border p-4',
        'hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_16px_rgba(99,102,241,0.06)]',
        isUrgent && 'border-amber-500/30 bg-amber-500/5'
      )}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className='bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg'>
        <FileText className='text-primary size-5' />
      </div>

      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-2'>
          <h4 className='text-foreground truncate text-sm font-medium'>
            {task.title}
          </h4>
          {isUrgent && (
            <Badge className='border-amber-500/30 bg-amber-500/20 px-1.5 text-[10px] text-amber-400'>
              {task.is_past_due ? t(`${tk}.overdue`) : t(`${tk}.urgent`)}
            </Badge>
          )}
        </div>
        <p className='text-muted-foreground truncate text-xs'>
          {task.course_title}
        </p>
      </div>

      <div className='text-muted-foreground flex shrink-0 items-center gap-1 text-xs'>
        <Calendar className='size-3.5' />
        {dueLabel}
      </div>
    </div>
  )
}
