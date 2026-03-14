import { useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import type { AssessmentType, Assessment, AssessmentFull } from '@/types'
import { ArrowLeft, FileQuestion, BookOpen, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAssessments } from '@/hooks/use-assessments'
import { useCourse } from '@/hooks/use-courses'
import { useSections } from '@/hooks/use-sections'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AssessmentAttemptsDialog } from '@/components/assessments/assessment-attempts-dialog'
import { AssessmentCard } from '@/components/assessments/assessment-card'
import { AssessmentStatisticsDialog } from '@/components/assessments/assessment-statistics-dialog'
import { CreateAssessmentDialog } from '@/components/assessments/create-assessment-dialog'
import { EditAssessmentDialog } from '@/components/assessments/edit-assessment-dialog'

type FilterType = AssessmentType | 'all'

const FILTER_TABS: {
  value: FilterType
  label: string
  Icon: React.ComponentType<{ className?: string }>
  accent: string
  bg: string
  border: string
}[] = [
  {
    value: 'all',
    label: 'Todas',
    Icon: FileQuestion,
    accent: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/40',
  },
  {
    value: 'Quiz',
    label: 'Quizzes',
    Icon: BookOpen,
    accent: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/40',
  },
  {
    value: 'Exam',
    label: 'Exámenes',
    Icon: GraduationCap,
    accent: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/40',
  },
]

export default function CourseExamsPage() {
  const params = useParams({ strict: false }) as {
    academySlug: string
    courseSlug: string
  }
  const { academySlug, courseSlug } = params

  const [filterType, setFilterType] = useState<FilterType>('all')
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null)
  const [statsAssessment, setStatsAssessment] = useState<Assessment | null>(null)
  const [attemptsAssessment, setAttemptsAssessment] = useState<Assessment | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const { data: course, isLoading, error } = useCourse(courseSlug)
  const { data: sections } = useSections(academySlug, courseSlug)
  const { data: assessments, isLoading: assessmentsLoading } = useAssessments(
    academySlug,
    courseSlug,
    { type: filterType === 'all' ? undefined : filterType }
  )

  if (isLoading) {
    return (
      <div className='space-y-4 p-6'>
        <Skeleton className='h-32 w-full rounded-2xl' />
        <Skeleton className='h-16 w-full rounded-xl' />
        <div className='grid gap-4 lg:grid-cols-2'>
          <Skeleton className='h-48 rounded-xl' />
          <Skeleton className='h-48 rounded-xl' />
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className='p-6 text-center'>
        <h3 className='mb-2 text-lg font-bold text-red-500'>Error al cargar el curso</h3>
        <p className='text-muted-foreground mb-4'>No encontrado o sin permiso de acceso</p>
        <Link to='/academy/$academySlug/admin/courses' params={{ academySlug }}>
          <Button variant='outline'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Volver a Cursos
          </Button>
        </Link>
      </div>
    )
  }

  const filteredAssessments = assessments || []
  const quizzesCount = assessments?.filter((a) => a.type === 'Quiz').length ?? 0
  const examsCount = assessments?.filter((a) => a.type === 'Exam').length ?? 0
  const hasExam = assessments?.some((a) => a.type === 'Exam') ?? false

  const countFor = (v: FilterType) =>
    v === 'all' ? (assessments?.length ?? 0) : v === 'Quiz' ? quizzesCount : examsCount

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
              Crea y gestiona exámenes y quizzes para evaluar conocimientos
            </p>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className='bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 font-semibold shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all hover:shadow-[0_0_28px_rgba(99,102,241,0.35)]'
          >
            Crear evaluación
          </Button>
        </div>
      </div>

      {/* Filter tabs as stat-style cards */}
      <div className='grid grid-cols-3 gap-3'>
        {FILTER_TABS.map((tab) => {
          const Icon = tab.Icon
          const active = filterType === tab.value
          return (
            <button
              key={tab.value}
              type='button'
              onClick={() => setFilterType(tab.value)}
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
              {active && (
                <div className={cn('absolute right-3 top-3 size-2 rounded-full', tab.bg)}>
                  <div className={cn('size-2 rounded-full', tab.accent.replace('text-', 'bg-'))} />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Warning banner for existing exam */}
      {hasExam && (
        <div className='border-amber-500/30 bg-amber-500/10 flex items-start gap-3 rounded-xl border p-4'>
          <GraduationCap className='mt-0.5 size-4 shrink-0 text-amber-400' />
          <div>
            <p className='text-sm font-semibold text-amber-400'>Examen final existente</p>
            <p className='text-muted-foreground mt-0.5 text-xs'>
              Este curso ya tiene un examen final. Solo puede existir uno por curso. Puedes
              editarlo o crear quizzes adicionales para las secciones.
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      {assessmentsLoading && (
        <div className='grid gap-4 lg:grid-cols-2'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-56 rounded-xl' />
          ))}
        </div>
      )}

      {!assessmentsLoading && filteredAssessments.length === 0 && (
        <div className='border-border/40 bg-card/50 flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center'>
          <div className='bg-primary/10 rounded-xl p-4'>
            <FileQuestion className='text-primary size-8' />
          </div>
          <div>
            <h3 className='font-semibold'>
              {filterType === 'all' && 'Aún no hay evaluaciones'}
              {filterType === 'Quiz' && 'Aún no hay quizzes'}
              {filterType === 'Exam' && (hasExam ? 'Ya existe un examen final' : 'Aún no hay exámenes finales')}
            </h3>
            <p className='text-muted-foreground mx-auto mt-1 max-w-sm text-sm'>
              {filterType === 'all' && 'Crea quizzes para secciones individuales o un examen final para todo el curso'}
              {filterType === 'Quiz' && 'Los quizzes evalúan secciones específicas y permiten múltiples intentos'}
              {filterType === 'Exam' && !hasExam && 'Los exámenes finales evalúan todo el curso y requieren completar todas las secciones'}
              {filterType === 'Exam' && hasExam && 'Solo puede existir un examen final por curso'}
            </p>
          </div>
        </div>
      )}

      {!assessmentsLoading && filteredAssessments.length > 0 && (
        <div className='grid gap-4 lg:grid-cols-2'>
          {filteredAssessments.map((assessment) => (
            <AssessmentCard
              key={assessment.id}
              assessment={assessment as AssessmentFull}
              academySlug={academySlug}
              courseSlug={courseSlug}
              onEdit={setEditingAssessment}
              onViewStats={setStatsAssessment}
              onViewAttempts={setAttemptsAssessment}
            />
          ))}
        </div>
      )}

      <CreateAssessmentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        academySlug={academySlug}
        courseSlug={courseSlug}
        sections={sections || []}
        hasExistingExam={hasExam}
      />
      <EditAssessmentDialog
        assessment={editingAssessment}
        onOpenChange={(open) => !open && setEditingAssessment(null)}
        academySlug={academySlug}
        courseSlug={courseSlug}
        sections={sections || []}
      />
      <AssessmentStatisticsDialog
        assessment={statsAssessment}
        onOpenChange={(open) => !open && setStatsAssessment(null)}
        academySlug={academySlug}
        courseSlug={courseSlug}
      />
      <AssessmentAttemptsDialog
        assessment={attemptsAssessment}
        onOpenChange={(open) => !open && setAttemptsAssessment(null)}
        academySlug={academySlug}
        courseSlug={courseSlug}
      />
    </div>
  )
}
