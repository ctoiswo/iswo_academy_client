import { useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import type { AssessmentType, Assessment, AssessmentFull } from '@/types'
import { ArrowLeft, FileQuestion } from 'lucide-react'
import { useAssessments } from '@/hooks/use-assessments'
import { useCourse } from '@/hooks/use-courses'
import { useSections } from '@/hooks/use-sections'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AssessmentAttemptsDialog } from '@/components/assessments/assessment-attempts-dialog'
import { AssessmentCard } from '@/components/assessments/assessment-card'
import { AssessmentStatisticsDialog } from '@/components/assessments/assessment-statistics-dialog'
import { CreateAssessmentDialog } from '@/components/assessments/create-assessment-dialog'
import { EditAssessmentDialog } from '@/components/assessments/edit-assessment-dialog'

export default function CourseExamsPage() {
  const params = useParams({ strict: false }) as {
    academySlug: string
    courseSlug: string
  }
  const { academySlug, courseSlug } = params

  // Estados - DEBEN estar antes de cualquier return condicional
  const [filterType, setFilterType] = useState<AssessmentType | 'all'>('all')
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(
    null
  )
  const [statsAssessment, setStatsAssessment] = useState<Assessment | null>(
    null
  )
  const [attemptsAssessment, setAttemptsAssessment] =
    useState<Assessment | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Hooks de datos
  const { data: course, isLoading, error } = useCourse(courseSlug)
  const { data: sections } = useSections(academySlug, courseSlug)

  const { data: assessments, isLoading: assessmentsLoading } = useAssessments(
    academySlug,
    courseSlug,
    {
      type: filterType === 'all' ? undefined : filterType,
    }
  )

  if (isLoading) {
    return (
      <div className='container mx-auto py-8'>
        <Skeleton className='h-64' />
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className='container mx-auto py-8'>
        <div className='py-12 text-center'>
          <h3 className='mb-2 text-lg font-bold text-red-600'>
            Error al Cargar el Curso
          </h3>
          <p className='text-muted-foreground'>
            Curso no encontrado o no tienes permiso para acceder
          </p>
          <Link
            to='/academy/$academySlug/admin/courses'
            params={{ academySlug }}
            className='mt-4 inline-block'
          >
            <Button variant='outline'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Volver a Cursos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Variables calculadas
  const filteredAssessments = assessments || []
  const quizzesCount = assessments?.filter((a) => a.type === 'Quiz').length || 0
  const examsCount = assessments?.filter((a) => a.type === 'Exam').length || 0
  const hasExam = assessments?.some((a) => a.type === 'Exam') || false

  // Handlers
  const handleEdit = (assessment: Assessment) => {
    setEditingAssessment(assessment)
  }

  const handleViewStats = (assessment: Assessment) => {
    setStatsAssessment(assessment)
  }

  const handleViewAttempts = (assessment: Assessment) => {
    setAttemptsAssessment(assessment)
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-6 flex items-start justify-between'>
        <div>
          <Link
            to='/academy/$academySlug/courses/$courseSlug'
            params={{ academySlug, courseSlug }}
          >
            <Button variant='ghost' size='sm' className='mb-2'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Volver al Curso
            </Button>
          </Link>
          <h1 className='mb-2 text-3xl font-bold'>{course.title}</h1>
          <p className='text-muted-foreground'>
            Crea y gestiona exámenes y quizzes para evaluar conocimientos
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} size='lg'>
          Crear Evaluación
        </Button>
      </div>

      <div className='mb-6'>
        <Tabs
          value={filterType}
          onValueChange={(v) => setFilterType(v as AssessmentType | 'all')}
        >
          <TabsList>
            <TabsTrigger value='all'>
              Todas ({assessments?.length || 0})
            </TabsTrigger>
            <TabsTrigger value='Quiz'>📝 Quizzes ({quizzesCount})</TabsTrigger>
            <TabsTrigger value='Exam'>🎓 Exámenes ({examsCount})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {hasExam && (
        <div className='mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4'>
          <div className='flex items-start gap-3'>
            <span className='text-2xl'>ℹ️</span>
            <div>
              <h4 className='font-semibold text-amber-900'>
                Examen Final Existente
              </h4>
              <p className='text-sm text-amber-800'>
                Este curso ya tiene un examen final. Solo puede existir un
                examen final por curso. Puedes editar el examen existente o
                crear quizzes adicionales para las secciones.
              </p>
            </div>
          </div>
        </div>
      )}

      {assessmentsLoading && (
        <div className='grid gap-6 lg:grid-cols-2'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-64' />
          ))}
        </div>
      )}

      {!assessmentsLoading && filteredAssessments.length === 0 && (
        <div className='rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-16 text-center'>
          <FileQuestion className='text-muted-foreground mx-auto mb-4 h-16 w-16' />
          <h3 className='text-muted-foreground mb-2 text-xl font-semibold'>
            {filterType === 'all' && 'Aún no hay evaluaciones'}
            {filterType === 'Quiz' && 'Aún no hay quizzes'}
            {filterType === 'Exam' &&
              (hasExam
                ? 'Ya existe un examen final'
                : 'Aún no hay exámenes finales')}
          </h3>
          <p className='text-muted-foreground mx-auto mb-6 max-w-md'>
            {filterType === 'all' &&
              'Crea quizzes para evaluar secciones individuales o exámenes finales para evaluar todo el curso'}
            {filterType === 'Quiz' &&
              'Los quizzes son evaluaciones de secciones específicas con múltiples intentos permitidos'}
            {filterType === 'Exam' &&
              !hasExam &&
              'Los exámenes finales evalúan todo el curso y requieren completar todas las secciones primero'}
            {filterType === 'Exam' &&
              hasExam &&
              'Solo puede existir un examen final por curso. El examen puede estar en otra vista si aplicas filtros diferentes.'}
          </p>
        </div>
      )}

      {!assessmentsLoading && filteredAssessments.length > 0 && (
        <div className='grid gap-6 lg:grid-cols-2'>
          {filteredAssessments.map((assessment) => (
            <AssessmentCard
              key={assessment.id}
              assessment={assessment as AssessmentFull}
              academySlug={academySlug}
              courseSlug={courseSlug}
              onEdit={handleEdit}
              onViewStats={handleViewStats}
              onViewAttempts={handleViewAttempts}
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
