import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { BookOpen, Loader2, type LucideIcon } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { teacherQueries } from '@/lib/api/teacher'
import { Badge } from '@/components/ui/badge'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import type { TeacherCourse } from '@/features/dashboard/teacher/types'

interface Props {
  /** Path suffix to append after $courseSlug, e.g. 'lessons', 'students' */
  section: string
  title: string
  description: string
  icon: LucideIcon
}

export function CourseSectionRedirect({
  section,
  title,
  description,
  icon: Icon,
}: Props) {
  const { academySlug } = useParams({ strict: false })
  const { user, currentAcademy } = useAuthStore()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    ...teacherQueries.courses(user?.id ?? 0, academySlug ?? ''),
    enabled: !!user?.id && !!academySlug,
  })

  const courses: TeacherCourse[] = data?.data ?? []

  // Auto-redirect when only one course
  useEffect(() => {
    if (courses.length === 1 && academySlug) {
      const slug = courses[0].slug ?? String(courses[0].id)
      navigate({
        to: `/academy/${academySlug}/courses/${slug}/${section}` as any,
      })
    }
  }, [courses, academySlug, section, navigate])

  const handleSelect = (course: TeacherCourse) => {
    if (!academySlug) return
    const slug = course.slug ?? String(course.id)
    navigate({
      to: `/academy/${academySlug}/courses/${slug}/${section}` as any,
    })
  }

  return (
    <DashboardLayout
      user={user}
      academy={currentAcademy}
      variant='full'
      dashboardType='teacher'
      title={title}
      subtitle={description}
    >
      {isLoading || courses.length === 1 ? (
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
        <div className='space-y-4'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary/10 rounded-lg p-2'>
              <Icon className='text-primary size-5' />
            </div>
            <div>
              <h2 className='text-lg font-semibold'>Selecciona un curso</h2>
              <p className='text-muted-foreground text-sm'>
                ¿En qué curso deseas gestionar {title.toLowerCase()}?
              </p>
            </div>
          </div>

          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => handleSelect(course)}
                className='bg-card hover:border-primary/50 hover:bg-card/80 group flex flex-col gap-3 rounded-xl border p-5 text-left shadow-sm transition-all hover:shadow-md'
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
                  <p className='text-muted-foreground line-clamp-2 text-sm'>
                    {course.description}
                  </p>
                )}
                <div className='text-muted-foreground flex gap-4 text-xs'>
                  <span>{course.enrollments ?? 0} estudiantes</span>
                  <span>{course.totalLessons ?? 0} lecciones</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
