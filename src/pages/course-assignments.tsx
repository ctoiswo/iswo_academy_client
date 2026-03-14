import { useState } from 'react'
import { useParams, useNavigate, Link } from '@tanstack/react-router'
import type { Assignment } from '@/types'
import {
  CheckSquare,
  Plus,
  ArrowLeft,
  Clock,
  AlertTriangle,
  CalendarClock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAssignments } from '@/hooks/use-assignments'
import { useCourse } from '@/hooks/use-courses'
import { useSections } from '@/hooks/use-sections'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { AssignmentCard } from '@/components/assignments/assignment-card'

type StatusFilter = 'all' | 'active' | 'past_due' | 'upcoming'

const STATUS_TABS: {
  value: StatusFilter
  label: string
  Icon: React.ComponentType<{ className?: string }>
  accent: string
  bg: string
  border: string
}[] = [
  {
    value: 'all',
    label: 'Todas',
    Icon: CheckSquare,
    accent: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/40',
  },
  {
    value: 'active',
    label: 'Activas',
    Icon: Clock,
    accent: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/40',
  },
  {
    value: 'upcoming',
    label: 'Próximas',
    Icon: CalendarClock,
    accent: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/40',
  },
  {
    value: 'past_due',
    label: 'Vencidas',
    Icon: AlertTriangle,
    accent: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/40',
  },
]

export default function CourseAssignmentsPage() {
  const params = useParams({ strict: false }) as {
    academySlug: string
    courseSlug: string
  }
  const { academySlug, courseSlug } = params
  const navigate = useNavigate()

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sectionFilter, setSectionFilter] = useState<string>('all')

  const {
    data: course,
    isLoading: loadingCourse,
    error: courseError,
  } = useCourse(courseSlug)
  const { data: sections = [] } = useSections(academySlug, courseSlug)

  const { data: assignments = [], isLoading: loadingAssignments } =
    useAssignments(academySlug, courseSlug, {
      status: statusFilter === 'all' ? undefined : statusFilter,
      section_id: sectionFilter === 'all' ? undefined : Number(sectionFilter),
    })

  const handleEditAssignment = (assignment: Assignment) => {
    toast.info(`Edición de tareas no implementada aún (ID: ${assignment.id})`)
  }
  const handleViewStats = (assignment: Assignment) => {
    toast.info(`Estadísticas no implementadas aún (ID: ${assignment.id})`)
  }
  const handleViewSubmissions = (assignment: Assignment) => {
    toast.info(`Vista de entregas no implementada aún (ID: ${assignment.id})`)
  }

  if (loadingCourse) {
    return (
      <div className='flex flex-col gap-4 p-6'>
        <Skeleton className='h-32 w-full rounded-2xl' />
        <Skeleton className='h-16 w-full rounded-xl' />
        <Skeleton className='h-48 w-full rounded-xl' />
      </div>
    )
  }

  if (courseError || !course) {
    return (
      <div className='p-6 text-center'>
        <h3 className='mb-2 text-lg font-bold text-red-500'>
          Error al cargar el curso
        </h3>
        <p className='text-muted-foreground'>
          No encontrado o sin permiso de acceso
        </p>
      </div>
    )
  }

  const filteredAssignments = assignments.filter((a) => {
    const matchesSection =
      sectionFilter === 'all' || a.section_id === Number(sectionFilter)
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && a.available && a.accepting_submissions) ||
      (statusFilter === 'past_due' && a.past_due) ||
      (statusFilter === 'upcoming' && !a.available)
    return matchesSection && matchesStatus
  })

  const countFor = (v: StatusFilter) => {
    if (v === 'all') return assignments.length
    return assignments.filter((a) => {
      if (v === 'active') return a.available && a.accepting_submissions
      if (v === 'past_due') return a.past_due
      if (v === 'upcoming') return !a.available
      return false
    }).length
  }

  return (
    <div className='flex flex-col gap-6 p-6'>
      {/* Header */}
      <div className='border-border/60 from-card via-card to-primary/5 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6'>
        <div className='bg-primary/10 absolute top-0 right-0 h-48 w-48 translate-x-1/3 -translate-y-1/3 rounded-full blur-[80px]' />
        <div className='relative z-10 flex items-start justify-between gap-4'>
          <div className='flex flex-col gap-2'>
            <Link
              to='/academy/$academySlug/courses/$courseSlug'
              params={{ academySlug, courseSlug }}
              className='text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-sm transition-colors'
            >
              <ArrowLeft className='size-3.5' />
              Volver al curso
            </Link>
            <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
              {course.title}
            </h1>
            <p className='text-muted-foreground text-sm'>
              Crea y gestiona tareas, cuestionarios y proyectos
            </p>
          </div>
          <Button
            onClick={() =>
              navigate({
                to: '/academy/$academySlug/courses/$courseSlug/assignments/new',
                params: { academySlug, courseSlug },
              })
            }
            className='bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 font-semibold shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all hover:shadow-[0_0_28px_rgba(99,102,241,0.35)]'
          >
            <Plus className='mr-2 size-4' />
            Añadir tarea
          </Button>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
        {STATUS_TABS.map((tab) => {
          const Icon = tab.Icon
          const active = statusFilter === tab.value
          return (
            <button
              key={tab.value}
              type='button'
              onClick={() => setStatusFilter(tab.value)}
              className={cn(
                'border-border/60 bg-card group relative flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200',
                active
                  ? `${tab.border} shadow-[0_0_16px_rgba(99,102,241,0.08)]`
                  : 'hover:border-border hover:-translate-y-0.5 hover:shadow-[0_0_12px_rgba(99,102,241,0.05)]'
              )}
            >
              <div className={cn('rounded-lg p-2', tab.bg)}>
                <Icon className={cn('size-4', tab.accent)} />
              </div>
              <div className='min-w-0'>
                <p className='text-muted-foreground text-xs'>{tab.label}</p>
                <p className='text-foreground text-xl font-bold leading-none'>
                  {countFor(tab.value)}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Section filter */}
      {sections.length > 0 && (
        <div className='w-full sm:w-64'>
          <Select value={sectionFilter} onValueChange={setSectionFilter}>
            <SelectTrigger className='border-border/60 bg-card'>
              <SelectValue placeholder='Filtrar por sección' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Todas las secciones</SelectItem>
              {sections.map((section) => (
                <SelectItem key={section.id} value={section.id.toString()}>
                  {section.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Content */}
      {loadingAssignments ? (
        <div className='flex flex-col gap-4'>
          <Skeleton className='h-48 rounded-xl' />
          <Skeleton className='h-48 rounded-xl' />
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className='border-border/40 bg-card/50 flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center'>
          <div className='bg-primary/10 rounded-xl p-4'>
            <CheckSquare className='text-primary size-8' />
          </div>
          <div>
            <h3 className='font-semibold'>
              {assignments.length === 0
                ? 'Aún no hay tareas'
                : 'Sin tareas para este filtro'}
            </h3>
            <p className='text-muted-foreground mx-auto mt-1 max-w-sm text-sm'>
              {assignments.length === 0
                ? 'Añade tareas para evaluar el progreso de los estudiantes'
                : 'Prueba cambiando el filtro de estado o de sección'}
            </p>
          </div>
          {assignments.length === 0 && (
            <Button
              onClick={() =>
                navigate({
                  to: '/academy/$academySlug/courses/$courseSlug/assignments/new',
                  params: { academySlug, courseSlug },
                })
              }
              variant='outline'
              className='mt-2'
            >
              <Plus className='mr-2 size-4' />
              Añadir tarea
            </Button>
          )}
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              academySlug={academySlug}
              courseSlug={courseSlug}
              onEdit={handleEditAssignment}
              onViewStats={handleViewStats}
              onViewSubmissions={handleViewSubmissions}
            />
          ))}
        </div>
      )}
    </div>
  )
}

