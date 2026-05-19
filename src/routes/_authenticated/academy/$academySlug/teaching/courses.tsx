import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { BookOpen, Loader2, Settings } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { teacherQueries } from '@/lib/api/teacher'
import { Badge } from '@/components/ui/badge'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

function TeachingCoursesPage() {
  const { academySlug } = useParams({ strict: false })
  const { user, currentAcademy } = useAuthStore()

  const { data, isLoading } = useQuery({
    ...teacherQueries.courses(user?.id ?? 0, academySlug ?? ''),
    enabled: !!user?.id && !!academySlug,
  })

  const courses = data?.data ?? []

  return (
    <DashboardLayout
      user={user}
      academy={currentAcademy}
      variant='full'
      title='Mis Cursos'
      subtitle='Cursos que tienes asignados para gestionar'
      dashboardType='teacher'
    >
      {isLoading ? (
        <div className='flex items-center justify-center py-16'>
          <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
        </div>
      ) : courses.length === 0 ? (
        <div className='text-muted-foreground flex flex-col items-center gap-3 py-16'>
          <BookOpen className='h-12 w-12' />
          <p className='text-lg font-medium'>No tienes cursos asignados</p>
          <p className='text-sm'>
            El administrador de la academia debe asignarte cursos.
          </p>
        </div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {courses.map((course) => (
            <Link
              key={course.id}
              to='/academy/$academySlug/courses/$courseSlug/info'
              params={{
                academySlug: academySlug ?? '',
                courseSlug: course.slug ?? String(course.id),
              }}
              className='group bg-card block rounded-lg border p-5 shadow-sm transition-shadow hover:shadow-md'
            >
              <div className='flex items-start justify-between gap-2'>
                <h3 className='group-hover:text-primary leading-snug font-semibold'>
                  {course.title}
                </h3>
                <Badge
                  variant={
                    course.status === 'published' ? 'default' : 'secondary'
                  }
                  className='shrink-0 text-xs'
                >
                  {course.status ?? 'draft'}
                </Badge>
              </div>
              {course.description && (
                <p className='text-muted-foreground mt-1.5 line-clamp-2 text-sm'>
                  {course.description}
                </p>
              )}
              <div className='text-muted-foreground mt-3 flex items-center justify-between text-xs'>
                <div className='flex gap-4'>
                  <span>{course.enrollments ?? 0} estudiantes</span>
                  <span>{course.totalLessons ?? 0} lecciones</span>
                </div>
                <Settings className='h-3.5 w-3.5 opacity-40 transition-opacity group-hover:opacity-100' />
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/teaching/courses'
)({
  component: TeachingCoursesPage,
})
