import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslation } from 'react-i18next'
import { TaskItem } from '../components/task-item'
import type { DashboardAssignment } from '@/types'

interface PendingTasksProps {
  mounted: boolean
  assignments: DashboardAssignment[]
  isLoading: boolean
}

export function PendingTasks({ mounted, assignments, isLoading }: PendingTasksProps) {
  const { t } = useTranslation()
  const tk = 'dashboard.student.tasks'

  return (
    <section
      id='tasks'
      className={cn(
        'transition-all duration-700 delay-300',
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      )}
    >
      <div className='flex items-center gap-2 mb-4'>
        <h2 className='text-lg font-semibold text-foreground'>{t(`${tk}.title`)}</h2>
        {!isLoading && (
          <Badge variant='secondary' className='text-xs'>
            {assignments.length}
          </Badge>
        )}
      </div>

      <div className='grid gap-3'>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-[68px] rounded-xl' />
          ))
        ) : assignments.length === 0 ? (
          <p className='text-sm text-muted-foreground py-2'>{t(`${tk}.empty`)}</p>
        ) : (
          assignments.map((task, index) => (
            <TaskItem key={task.id} task={task} index={index} />
          ))
        )}
      </div>
    </section>
  )
}
