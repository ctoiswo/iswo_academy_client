import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  useNavigate,
  useParams,
} from '@tanstack/react-router'
import {
  BookOpen,
  Loader2,
  Settings,
  Users,
  LayoutList,
  Edit,
  Info,
  Clock,
  GraduationCap,
  ClipboardList,
  FileQuestion,
  Award,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { teacherQueries } from '@/lib/api/teacher'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import type { TeacherCourse } from '@/features/dashboard/teacher/types'

const MGMT_ACTIONS = [
  {
    label: 'Información',
    icon: Info,
    suffix: '/info',
  },
  {
    label: 'Lecciones',
    icon: LayoutList,
    suffix: '/lessons',
  },
  {
    label: 'Tareas',
    icon: ClipboardList,
    suffix: '/assignments',
  },
  {
    label: 'Exámenes',
    icon: FileQuestion,
    suffix: '/exams',
  },
  {
    label: 'Estudiantes',
    icon: Users,
    suffix: '/students',
  },
  {
    label: 'Certificados',
    icon: Award,
    suffix: '/certificates',
  },
  {
    label: 'Editar',
    icon: Edit,
    suffix: '/edit',
  },
  {
    label: 'Configuración',
    icon: Settings,
    suffix: '/settings',
  },
]

function CourseManagementSheet({
  course,
  academySlug,
  open,
  onClose,
}: {
  course: TeacherCourse | null
  academySlug: string
  open: boolean
  onClose: () => void
}) {
  const navigate = useNavigate()

  if (!course) return null

  const courseSlug = course.slug ?? String(course.id)
  const base = `/academy/${academySlug}/courses/${courseSlug}`

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side='right'
        className='flex w-80 flex-col gap-0 p-0 sm:w-96'
      >
        {/* Thumbnail / header */}
        <div className='from-primary/20 to-primary/5 relative h-40 w-full overflow-hidden bg-gradient-to-br'>
          {(course as any).promotional_image_url ||
          (course as any).thumbnail_url ? (
            <img
              src={
                (course as any).promotional_image_url ??
                (course as any).thumbnail_url
              }
              alt={course.title}
              className='h-full w-full object-cover'
            />
          ) : (
            <div className='flex h-full items-center justify-center'>
              <BookOpen className='text-muted-foreground h-16 w-16' />
            </div>
          )}
          {/* badges */}
          <div className='absolute top-3 left-3 flex flex-col gap-1.5'>
            <Badge
              variant={course.status === 'published' ? 'default' : 'secondary'}
              className='text-xs'
            >
              {course.status === 'published'
                ? 'Publicado'
                : course.status === 'draft'
                  ? 'Borrador'
                  : 'Archivado'}
            </Badge>
          </div>
        </div>

        <div className='flex flex-1 flex-col gap-4 overflow-y-auto p-5'>
          <SheetHeader className='p-0'>
            <SheetTitle className='text-left text-lg leading-tight'>
              {course.title}
            </SheetTitle>
            {course.description && (
              <p className='text-muted-foreground text-left text-sm'>
                {course.description}
              </p>
            )}
          </SheetHeader>

          {/* Stats */}
          <div className='grid grid-cols-2 gap-2'>
            <div className='bg-muted/50 flex items-center gap-2 rounded-lg p-3'>
              <Clock className='text-muted-foreground size-4 shrink-0' />
              <div>
                <p className='text-muted-foreground text-xs'>Duración</p>
                <p className='text-sm font-semibold'>{course.duration}</p>
              </div>
            </div>
            <div className='bg-muted/50 flex items-center gap-2 rounded-lg p-3'>
              <GraduationCap className='text-muted-foreground size-4 shrink-0' />
              <div>
                <p className='text-muted-foreground text-xs'>Inscritos</p>
                <p className='text-sm font-semibold'>{course.enrollments}</p>
              </div>
            </div>
            <div className='bg-muted/50 flex items-center gap-2 rounded-lg p-3'>
              <LayoutList className='text-muted-foreground size-4 shrink-0' />
              <div>
                <p className='text-muted-foreground text-xs'>Lecciones</p>
                <p className='text-sm font-semibold'>{course.totalLessons}</p>
              </div>
            </div>
            <div className='bg-muted/50 flex items-center gap-2 rounded-lg p-3'>
              <BookOpen className='text-muted-foreground size-4 shrink-0' />
              <div>
                <p className='text-muted-foreground text-xs'>Precio</p>
                <p className='text-sm font-semibold'>
                  {course.price === 0 ? 'Gratis' : `$${course.price}`}
                </p>
              </div>
            </div>
          </div>

          {/* Management actions */}
          <div className='space-y-2'>
            <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
              Gestionar
            </p>
            {MGMT_ACTIONS.map(({ label, icon: Icon, suffix }) => (
              <Button
                key={suffix}
                variant='outline'
                className='w-full justify-start gap-3'
                onClick={() => {
                  onClose()
                  navigate({ to: `${base}${suffix}` as any })
                }}
              >
                <Icon className='size-4' />
                {label}
              </Button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function TeachingCoursesPage() {
  const { academySlug } = useParams({ strict: false })
  const { user, currentAcademy } = useAuthStore()
  const [selectedCourse, setSelectedCourse] = useState<TeacherCourse | null>(
    null
  )

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
            <div
              key={course.id}
              className='bg-card group block rounded-lg border shadow-sm'
            >
              {/* Thumbnail */}
              <div className='from-primary/20 to-primary/5 relative h-40 w-full overflow-hidden rounded-t-lg bg-gradient-to-br'>
                {(course as any).promotional_image_url ||
                (course as any).thumbnail_url ? (
                  <img
                    src={
                      (course as any).promotional_image_url ??
                      (course as any).thumbnail_url
                    }
                    alt={course.title}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <div className='flex h-full items-center justify-center'>
                    <BookOpen className='text-muted-foreground h-12 w-12' />
                  </div>
                )}
                <div className='absolute top-3 left-3'>
                  <Badge
                    variant={
                      course.status === 'published' ? 'default' : 'secondary'
                    }
                    className='text-xs'
                  >
                    {course.status ?? 'draft'}
                  </Badge>
                </div>
              </div>

              <div className='p-4'>
                <h3 className='leading-snug font-semibold'>{course.title}</h3>
                {course.description && (
                  <p className='text-muted-foreground mt-1 line-clamp-2 text-sm'>
                    {course.description}
                  </p>
                )}
                <div className='text-muted-foreground mt-2 flex items-center gap-4 text-xs'>
                  <span>{course.enrollments ?? 0} estudiantes</span>
                  <span>{course.totalLessons ?? 0} lecciones</span>
                </div>

                <div className='mt-3 flex items-center justify-between gap-2'>
                  <Link
                    to='/academy/$academySlug/courses/$courseSlug/info'
                    params={{
                      academySlug: academySlug ?? '',
                      courseSlug: course.slug ?? String(course.id),
                    }}
                    className='text-muted-foreground hover:text-foreground text-xs transition-colors'
                  >
                    Ver info
                  </Link>
                  <Button size='sm' onClick={() => setSelectedCourse(course)}>
                    <Settings className='mr-1.5 h-3.5 w-3.5' />
                    Gestionar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CourseManagementSheet
        course={selectedCourse}
        academySlug={academySlug ?? ''}
        open={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </DashboardLayout>
  )
}

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/teaching/courses'
)({
  component: TeachingCoursesPage,
})
