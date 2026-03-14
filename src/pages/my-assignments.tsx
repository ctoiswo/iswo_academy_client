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
  const { user } = useAuthStore()
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

  // Fetch assignments
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
        <Badge variant='destructive' className='gap-1'>
          <AlertCircle className='h-3 w-3' />
          Vencida
        </Badge>
      )
    }

    if (assignment.days_until_due !== null) {
      if (assignment.days_until_due === 0) {
        return (
          <Badge variant='default' className='gap-1 bg-orange-500'>
            <Clock className='h-3 w-3' />
            Vence hoy
          </Badge>
        )
      }
      if (assignment.days_until_due <= 3) {
        return (
          <Badge variant='default' className='gap-1 bg-yellow-500'>
            <Clock className='h-3 w-3' />
            Vence en {assignment.days_until_due} días
          </Badge>
        )
      }
      if (assignment.days_until_due <= 7) {
        return (
          <Badge variant='secondary' className='gap-1'>
            <Calendar className='h-3 w-3' />
            Vence en {assignment.days_until_due} días
          </Badge>
        )
      }
    }

    return (
      <Badge variant='outline' className='gap-1'>
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

    if (diffDays < 0) {
      return `Venció hace ${Math.abs(diffDays)} días`
    }

    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const { currentAcademy } = useAuthStore()

  return (
    <DashboardLayout user={user} academy={currentAcademy} variant='sidebar' dashboardType='student'>
      <div className='space-y-6'>
        {/* Header with stats */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-foreground'>Mis Tareas</h1>
            <p className='mt-1 text-muted-foreground'>
              Gestiona todas tus asignaciones pendientes
            </p>
          </div>

          <Select
            value={filterStatus}
            onValueChange={(value) => setFilterStatus(value as FilterStatus)}
          >
            <SelectTrigger className='w-[200px]'>
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

        {/* Stats Cards */}
        {isLoading ? (
          <div className='grid gap-4 md:grid-cols-4'>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className='h-24' />
            ))}
          </div>
        ) : assignmentsData ? (
          <div className='grid gap-4 md:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>
                  Total
                </CardTitle>
                <ClipboardList className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {assignmentsData.summary.total_assignments}
                </div>
                <p className='mt-1 text-xs text-muted-foreground'>
                  {assignmentsData.summary.courses_with_assignments} cursos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>
                  Próximas
                </CardTitle>
                <CalendarClock className='h-4 w-4 text-blue-400' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-blue-600'>
                  {assignmentsData.summary.upcoming}
                </div>
                <p className='mt-1 text-xs text-muted-foreground'>Próximos 7 días</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>
                  Vencidas
                </CardTitle>
                <AlertCircle className='h-4 w-4 text-red-400' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-red-600'>
                  {assignmentsData.summary.past_due}
                </div>
                <p className='mt-1 text-xs text-muted-foreground'>Requieren atención</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>
                  Cursos
                </CardTitle>
                <BookOpen className='h-4 w-4 text-purple-400' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-purple-600'>
                  {assignmentsData.summary.courses_with_assignments}
                </div>
                <p className='mt-1 text-xs text-muted-foreground'>Con asignaciones</p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Assignments by Course */}
        {isLoading ? (
          <div className='space-y-6'>
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className='h-64' />
            ))}
          </div>
        ) : assignmentsData &&
          assignmentsData.assignments_by_course.length > 0 ? (
          <motion.div
            className='space-y-6'
            initial={{ opacity: 0, y: 20 }}
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
          <Card>
            <CardContent className='py-12'>
              <div className='text-center'>
                <ClipboardList className='mx-auto h-12 w-12 text-muted-foreground' />
                <h3 className='mt-4 text-lg font-semibold text-foreground'>
                  No hay tareas
                </h3>
                <p className='mt-2 text-muted-foreground'>
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
                <Button asChild className='mt-6'>
                  <Link to='/academies'>Explorar Cursos</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
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
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-4'>
            {courseData.course.image_url && (
              <img
                src={courseData.course.image_url}
                alt={courseData.course.title}
                className='h-16 w-16 rounded-lg object-cover'
              />
            )}
            <div>
              <CardTitle className='text-xl'>
                {courseData.course.title}
              </CardTitle>
              <p className='mt-1 text-sm text-muted-foreground'>
                {courseData.assignments.length}{' '}
                {courseData.assignments.length === 1
                  ? 'asignación'
                  : 'asignaciones'}
              </p>
            </div>
          </div>
          <Button asChild variant='outline' size='sm'>
            <Link
              to='/academy/$academySlug/courses/$courseSlug/content'
              params={{
                academySlug,
                courseSlug: courseData.course.slug,
              }}
            >
              Ver Curso
              <ChevronRight className='ml-1 h-4 w-4' />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {courseData.assignments.map((assignment) => (
            <motion.div
              key={assignment.id}
              className='flex items-start justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50'
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className='flex-1'>
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex-1'>
                    <h4 className='font-semibold text-foreground'>
                      {assignment.title}
                    </h4>
                    {assignment.description && (
                      <p className='mt-1 line-clamp-2 text-sm text-muted-foreground'>
                        {assignment.description}
                      </p>
                    )}
                    <div className='mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground'>
                      {assignment.section && (
                        <span className='flex items-center gap-1'>
                          <BookOpen className='h-4 w-4' />
                          {assignment.section.title}
                        </span>
                      )}
                      {assignment.lesson && (
                        <span className='flex items-center gap-1'>
                          <FileText className='h-4 w-4' />
                          {assignment.lesson.title}
                        </span>
                      )}
                      <span className='flex items-center gap-1'>
                        <Clock className='h-4 w-4' />
                        {formatDueDate(assignment.due_at)}
                      </span>
                    </div>
                  </div>
                  <div className='flex flex-col items-end gap-2'>
                    {getStatusBadge(assignment)}
                    <span className='text-sm font-medium text-muted-foreground'>
                      {assignment.max_points} pts
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
