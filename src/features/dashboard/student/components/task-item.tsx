import { Calendar, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { DashboardAssignment } from '@/types'

interface TaskItemProps {
  task: DashboardAssignment
  index: number
}

export function TaskItem({ task, index }: TaskItemProps) {
  const { t } = useTranslation()
  const tk = 'dashboard.student.tasks'

  function formatDueDate(dueAt: string | null, daysUntil: number | null, isPastDue: boolean): string {
    if (!dueAt) return t(`${tk}.noDate`)
    if (isPastDue) return t(`${tk}.overdue`)
    if (daysUntil === 0) return t(`${tk}.today`)
    if (daysUntil === 1) return t(`${tk}.tomorrow`)
    if (daysUntil !== null) return t(`${tk}.inDays`, { count: daysUntil })
    return t(`${tk}.noDate`)
  }

  const isUrgent = task.is_past_due || task.status === 'past_due' || (task.days_until_due !== null && task.days_until_due <= 1)
  const dueLabel = formatDueDate(task.due_at, task.days_until_due, task.is_past_due)

  return (
    <div
      className={cn(
        'group flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card',
        'transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_16px_rgba(99,102,241,0.06)]',
        isUrgent && 'border-amber-500/30 bg-amber-500/5',
      )}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className='flex items-center justify-center size-10 rounded-lg shrink-0 bg-primary/10'>
        <FileText className='size-5 text-primary' />
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2'>
          <h4 className='text-sm font-medium text-foreground truncate'>{task.title}</h4>
          {isUrgent && (
            <Badge className='bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] px-1.5'>
              {task.is_past_due ? t(`${tk}.overdue`) : t(`${tk}.urgent`)}
            </Badge>
          )}
        </div>
        <p className='text-xs text-muted-foreground truncate'>{task.course_title}</p>
      </div>

      <div className='flex items-center gap-1 text-xs text-muted-foreground shrink-0'>
        <Calendar className='size-3.5' />
        {dueLabel}
      </div>
    </div>
  )
}
