import { useParams } from '@tanstack/react-router'
import { Users, PlayCircle, Clock, BookOpen } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useCourseBySlug } from '@/hooks/use-courses'
import { Skeleton } from '@/components/ui/skeleton'

export function CourseStatsHeader() {
  const params = useParams({ strict: false }) as { courseSlug?: string }
  const { currentAcademy } = useAuthStore()
  const academyId = currentAcademy?.id

  const { data: course, isLoading } = useCourseBySlug(
    academyId ? Number(academyId) : 0,
    params.courseSlug || ''
  )

  if (isLoading) {
    return (
      <div className='border-b px-3 py-3'>
        <Skeleton className='mb-2 h-4 w-32' />
        <div className='grid grid-cols-2 gap-2'>
          <Skeleton className='h-8' />
          <Skeleton className='h-8' />
        </div>
      </div>
    )
  }

  if (!course) {
    return null
  }

  return (
    <div className='bg-muted/30 border-b px-3 py-3'>
      <h3 className='text-muted-foreground mb-2 truncate text-xs font-semibold uppercase'>
        {course.title}
      </h3>
      <div className='grid grid-cols-2 gap-2 text-xs'>
        <div className='flex items-center gap-1.5'>
          <Users className='h-3.5 w-3.5 text-blue-600' />
          <span className='font-medium'>{course.enrollment_count || 0}</span>
        </div>
        <div className='flex items-center gap-1.5'>
          <PlayCircle className='h-3.5 w-3.5 text-green-600' />
          <span className='font-medium'>{course.lessons_count || 0}</span>
        </div>
        <div className='flex items-center gap-1.5'>
          <BookOpen className='h-3.5 w-3.5 text-purple-600' />
          <span className='font-medium'>{course.sections_count || 0}</span>
        </div>
        <div className='flex items-center gap-1.5'>
          <Clock className='h-3.5 w-3.5 text-orange-600' />
          <span className='font-medium'>
            {Math.floor(course.duration_minutes / 60)}h
          </span>
        </div>
      </div>
    </div>
  )
}
