import { useParams } from '@tanstack/react-router'
import { Users, PlayCircle, Clock, BookOpen } from 'lucide-react'
import { useCourseBySlug } from '@/hooks/use-courses'
import { useAuthStore } from '@/stores/auth-store'
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
      <div className="px-3 py-3 border-b">
        <Skeleton className="h-4 w-32 mb-2" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
        </div>
      </div>
    )
  }

  if (!course) {
    return null
  }

  return (
    <div className="px-3 py-3 border-b bg-muted/30">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 truncate">
        {course.title}
      </h3>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-medium">{course.enrollment_count || 0}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <PlayCircle className="w-3.5 h-3.5 text-green-600" />
          <span className="font-medium">{course.lessons_count || 0}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-purple-600" />
          <span className="font-medium">{course.sections_count || 0}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-orange-600" />
          <span className="font-medium">{Math.floor(course.duration_minutes / 60)}h</span>
        </div>
      </div>
    </div>
  )
}
