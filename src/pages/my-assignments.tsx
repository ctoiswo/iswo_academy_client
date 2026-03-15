import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from '@tanstack/react-router'
import { studentAssignmentService } from '@/services/student-assignment-service'
import type { CourseAssignments, StudentAssignment } from '@/types'
import { motion } from 'framer-motion'
import {
  ClipboardList,
  Clock,
  AlertCircle,
  Calendar,
  BookOpen,
  ChevronRight,
  FileText,
  CalendarClock,
  Award,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

type FilterStatus = 'all' | 'pending' | 'past_due' | 'upcoming'

export default function MyAssignmentsPage() {
  const { academySlug } = useParams({
    from: '/_authenticated/academy/$academySlug/my-assignments',
  })
  const { user, currentAcademy } = useAuthStore()
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

  const { data, isLoading } = useQuery({
    queryKey: ['student-assignments', academySlug, user?.id, filterStatus],
    queryFn: () =>
      studentAssignmentService.getMyAssignments(
        academySlug,
        user!.id,
        filterStatus !== 'all' ? { status: filterStatus } : undefined
      ),
    enabled: !!user?.id,
  })

  const assignmentsData = data?.data

  const getStatusBadge = (assignment: StudentAssignment) => {
    if (assignment.is_past_due) {
      return (
        <Badge variant='destructive' className='gap-1 text-xs'>
          <AlertCircle className='h-3 w-3' />
          Vencida
        </Badge>
      )
    }
    if (assignment.days_until_due !== null) {
      if (assignment.days_until_due === 0) {
        return (
          <Badge className='gap-1 bg-orange-500 text-xs text-white hover:bg-orange-500'>
            <Clock className='h-3 w-3' />
            Vence hoy
          </Badge>
        )
      }
      if (assignment.days_until_due <= 3) {
        return (
          <Badge className='gap-1 bg-amber-500 text-xs text-white hover:bg-amber-500'>
            <Clock className='h-3 w-3' />
            {assignment.days_until_due}d
          </Badge>
        )
      }
      if (assignment.days_until_due <= 7) {
        return (
          <Badge variant='secondary' className='gap-1 text-xs'>
            <Calendar className='h-3 w-3' />
            {assignment.days_until_due}d
          </Badge>
        )
      }
    }
    return (
      <Badge variant='outline' className='gap-1 text-xs'>
        <FileText className='h-3 w-3' />
        Pendiente
      </Badge>
    )
  }

  const formatDueDate = (dueAt: string | null) => {
    if (!dueAt) return 'Sin fecha límite'
    const date = new Date(dueAt)
    const now = new Date()
    const diffDays = Math.ceil(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (diffDays < 0) return `Venció hace ${Math.abs(diffDays)} días`
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <DashboardLayout
      user={user}
      academy={currentAcademy}
      variant='full'
      dashboardType='student'
    >
      <div className='flex-1 space-y-6 px-4'>
        {/* Header */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='flex items-center gap-2 text-2xl font-bold tracking-tight'>
              <ClipboardList className='text-primary size-6' />
              Mis Tareas
            </h1>
            <p className='text-muted-foreground mt-1 text-sm'>
              Gestiona todas tus asignaciones pendientes
            </p>
          </div>

          <Select
            value={filterStatus}
            onValueChange={(value) => setFilterStatus(value as FilterStatus)}
          >
            <SelectTrigger className='w-[190px]'>
              <SelectValue placeholder='Filtrar por estado' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Todas las tareas</SelectItem>
              <SelectItem value='pending'>Pendientes</SelectItem>
              <SelectItem value='upcoming'>Próximas (7 días)</SelectItem>
              <SelectItem value='past_due'>Vencidas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        {isLoading ? (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className='h-24 rounded-xl' />
            ))}
          </div>
        ) : assignmentsData ? (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-muted-foreground text-sm font-medium'>
                  Total
                </CardTitle>
                <ClipboardList className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {assignmentsData.summary.total_assignments}
                </div>
                <p className='text-muted-foreground mt-1 text-xs'>
                  {assignmentsData.summary.courses_with_assignments} cursos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-muted-foreground text-sm font-medium'>
                  Próximas
                </CardTitle>
                <CalendarClock className='text-primary h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-primary text-2xl font-bold'>
                  {assignmentsData.summary.upcoming}
                </div>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Próximos 7 días
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-muted-foreground text-sm font-medium'>
                  Vencidas
                </CardTitle>
                <AlertCircle className='h-4 w-4 text-destructive' />
              </CardHeader>
              <CardContent>
                <div className='text-destructive text-2xl font-bold'>
                  {assignmentsData.summary.past_due}
                </div>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Requieren atención
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-muted-foreground text-sm font-medium'>
                  Cursos
                </CardTitle>
                <BookOpen className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {assignmentsData.summary.courses_with_assignments}
                </div>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Con asignaciones
                </p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Assignments by Course */}
        {isLoading ? (
          <div className='space-y-4'>
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className='h-64 rounded-xl' />
            ))}
          </div>
        ) : assignmentsData &&
          assignmentsData.assignments_by_course.length > 0 ? (
          <motion.div
            className='space-y-4'
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {assignmentsData.assignments_by_course.map((courseData) => (
              <CourseAssignmentsCard
                key={courseData.course.id}
                courseData={courseData}
                academySlug={academySlug}
                getStatusBadge={getStatusBadge}
                formatDueDate={formatDueDate}
              />
            ))}
          </motion.div>
        ) : (
          <div className='border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center'>
            <Award className='text-muted-foreground/40 size-14' />
            <p className='text-muted-foreground mt-4 text-base font-medium'>
              No hay tareas
            </p>
            <p className='text-muted-foreground mt-1 text-sm'>
              {filterStatus === 'all'
                ? 'No tienes asignaciones en este momento.'
                : `No hay tareas ${
                    filterStatus === 'pending'
                      ? 'pendientes'
                      : filterStatus === 'upcoming'
                        ? 'próximas'
                        : 'vencidas'
                  }.`}
            </p>
            <Button asChild className='mt-6' variant='outline'>
              <Link
                to='/academy/$academySlug/courses'
                params={{ academySlug }}
              >
                Explorar Cursos
              </Link>
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

interface CourseAssignmentsCardProps {
  courseData: CourseAssignments
  academySlug: string
  getStatusBadge: (assignment: StudentAssignment) => React.ReactElement
  formatDueDate: (dueAt: string | null) => string
}

function CourseAssignmentsCard({
  courseData,
  academySlug,
  getStatusBadge,
  formatDueDate,
}: CourseAssignmentsCardProps) {
  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            {courseData.course.image_url ? (
              <img
                src={courseData.course.image_url}
                alt={courseData.course.title}
                className='h-10 w-10 rounded-lg object-cover'
              />
            ) : (
              <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg'>
                <BookOpen className='text-primary h-5 w-5' />
              </div>
            )}
            <div>
              <CardTitle className='text-base'>
                {courseData.course.title}
              </CardTitle>
              <p className='text-muted-foreground text-xs'>
                {courseData.assignments.length}{' '}
                {courseData.assignments.length === 1
                  ? 'asignación'
                  : 'asignaciones'}
              </p>
            </div>
          </div>
          <Button asChild variant='ghost' size='sm' className='text-xs'>
            <Link
              to='/academy/$academySlug/courses/$courseSlug/content'
              params={{ academySlug, courseSlug: courseData.course.slug }}
            >
              Ver curso
              <ChevronRight className='ml-1 h-3.5 w-3.5' />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className='pt-0'>
        <div className='space-y-2'>
          {courseData.assignments.map((assignment, idx) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Link
                to='/academy/$academySlug/courses/$courseSlug/content'
                params={{ academySlug, courseSlug: courseData.course.slug }}
                search={
                  assignment.lesson
                    ? { lessonId: assignment.lesson.id }
                    : undefined
                }
                className='hover:bg-muted/60 border-border group flex items-start justify-between rounded-lg border p-3 transition-colors'
              >
                <div className='flex min-w-0 flex-1 items-start gap-3'>
                  <div className='bg-primary/10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md'>
                    <FileText className='text-primary h-3.5 w-3.5' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-foreground group-hover:text-primary truncate text-sm font-medium transition-colors'>
                      {assignment.title}
                    </p>
                    <div className='text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs'>
                      {assignment.section && (
                        <span className='flex items-center gap-1'>
                          <BookOpen className='h-3 w-3' />
                          {assignment.section.title}
                        </span>
                      )}
                      <span className='flex items-center gap-1'>
                        <Clock className='h-3 w-3' />
                        {formatDueDate(assignment.due_at)}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Award className='h-3 w-3' />
                        {assignment.max_points} pts
                      </span>
                    </div>
                  </div>
                </div>
                <div className='ml-3 flex shrink-0 items-center gap-2'>
                  {getStatusBadge(assignment)}
                  <ChevronRight className='text-muted-foreground h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100' />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
