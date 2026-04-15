import { useState, useEffect } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import type { Question } from '@/types'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ArrowLeft, Plus, GripVertical, Edit, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useAssessments } from '@/hooks/use-assessments'
import { useCourse } from '@/hooks/use-courses'
import {
  useQuestions,
  useDeleteQuestion,
  useReorderQuestion,
} from '@/hooks/use-questions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CreateQuestionDialog } from '@/components/assessments/create-question-dialog'
import { EditQuestionDialog } from '@/components/assessments/edit-question-dialog'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function AssessmentQuestionsPage() {
  const params = useParams({ strict: false }) as {
    academySlug: string
    courseSlug: string
    assessmentId: string
  }
  const { academySlug, courseSlug, assessmentId } = params
  const { user, currentAcademy } = useAuthStore()
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(
    null
  )
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [localQuestions, setLocalQuestions] = useState<Question[]>([])

  const { data: course, isLoading: loadingCourse } = useCourse(courseSlug)
  const { data: assessments } = useAssessments(academySlug, courseSlug, {})
  const assessment = assessments?.find((a) => a.id === Number(assessmentId))

  const { data: questions, isLoading: loadingQuestions } = useQuestions(
    academySlug,
    courseSlug,
    Number(assessmentId)
  )

  const deleteQuestion = useDeleteQuestion(
    academySlug,
    courseSlug,
    Number(assessmentId)
  )
  const reorderQuestion = useReorderQuestion(
    academySlug,
    courseSlug,
    Number(assessmentId)
  )

  useEffect(() => {
    if (questions !== undefined) {
      setLocalQuestions(questions)
    }
  }, [questions])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = localQuestions.findIndex((q) => q.id === active.id)
      const newIndex = localQuestions.findIndex((q) => q.id === over.id)
      const reordered = arrayMove(localQuestions, oldIndex, newIndex)
      setLocalQuestions(reordered)
      reorderQuestion.mutate({
        questionId: active.id as number,
        position: newIndex + 1,
      })
    }
  }

  const totalPoints = localQuestions.reduce((sum, q) => sum + q.points, 0)

  const getQuestionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      multiple_choice: 'Opción Múltiple',
      true_false: 'Verdadero/Falso',
      multiple_select: 'Selección Múltiple',
      short_answer: 'Respuesta Corta',
      essay: 'Ensayo',
      fill_in_blank: 'Completar',
      matching: 'Emparejar',
      ordering: 'Ordenar',
    }
    return labels[type] || type
  }

  const handleDelete = () => {
    if (deletingQuestionId) {
      deleteQuestion.mutate(deletingQuestionId, {
        onSuccess: () => setDeletingQuestionId(null),
      })
    }
  }

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false)
  }

  const isQuiz = assessment?.type === 'Quiz'

  return (
    <DashboardLayout
      user={user}
      academy={currentAcademy}
      variant='full'
      title={assessment?.title ?? 'Preguntas'}
      subtitle='Gestiona las preguntas de esta evaluación'
    >
      <div className='space-y-6'>
        {/* Back link */}
        <Link
          to='/academy/$academySlug/courses/$courseSlug/exams'
          params={{ academySlug, courseSlug }}
        >
          <Button variant='ghost' size='sm' className='-ml-2'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Volver a Evaluaciones
          </Button>
        </Link>

        {loadingCourse ? (
          <div className='space-y-4'>
            <Skeleton className='h-8 w-1/3' />
            <Skeleton className='h-24' />
            <Skeleton className='h-64' />
          </div>
        ) : !course || !assessment ? (
          <Card>
            <CardContent className='py-12 text-center'>
              <h3 className='mb-2 text-lg font-semibold'>Error al cargar</h3>
              <p className='text-muted-foreground'>
                No se pudo cargar la evaluación
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Page header */}
            <div className='flex items-center justify-between'>
              <Badge variant={isQuiz ? 'default' : 'destructive'}>
                {isQuiz ? 'Quiz' : 'Examen'}
              </Badge>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className='mr-2 h-4 w-4' />
                Añadir Pregunta
              </Button>
            </div>

            {/* Estadísticas */}
            <div className='grid gap-4 md:grid-cols-3'>
              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-3xl font-bold'>
                    {questions?.length || 0}
                  </CardTitle>
                  <CardDescription>Total de Preguntas</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-3xl font-bold'>
                    {totalPoints}
                  </CardTitle>
                  <CardDescription>Puntos Totales</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-3xl font-bold'>
                    {assessment.passing_score}%
                  </CardTitle>
                  <CardDescription>Puntaje Mínimo</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Lista de Preguntas */}
            <Card>
              <CardHeader>
                <CardTitle>Preguntas</CardTitle>
                <CardDescription>
                  Lista de todas las preguntas de esta evaluación
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingQuestions ? (
                  <div className='space-y-4'>
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className='h-32' />
                    ))}
                  </div>
                ) : localQuestions.length > 0 ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={localQuestions.map((q) => q.id!)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className='space-y-4'>
                        {localQuestions.map((question, index) => (
                          <SortableQuestionCard
                            key={question.id}
                            question={question}
                            index={index}
                            onEdit={setEditingQuestion}
                            onDelete={(id) => setDeletingQuestionId(id)}
                            getQuestionTypeLabel={getQuestionTypeLabel}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div className='text-muted-foreground py-12 text-center'>
                    <p className='mb-2 text-base font-medium'>
                      Aún no hay preguntas
                    </p>
                    <p className='mb-4 text-sm'>
                      Comienza añadiendo preguntas a esta evaluación
                    </p>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                      <Plus className='mr-2 h-4 w-4' />
                      Añadir Primera Pregunta
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Diálogo de crear pregunta */}
      <CreateQuestionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        academySlug={academySlug}
        courseSlug={courseSlug}
        assessmentId={Number(assessmentId)}
        onSuccess={handleCreateSuccess}
      />

      {/* Diálogo de editar pregunta */}
      {editingQuestion && (
        <EditQuestionDialog
          question={editingQuestion}
          onOpenChange={(open: boolean) => !open && setEditingQuestion(null)}
          academySlug={academySlug}
          courseSlug={courseSlug}
          assessmentId={Number(assessmentId)}
        />
      )}

      {/* Diálogo de confirmar eliminación */}
      <AlertDialog
        open={deletingQuestionId !== null}
        onOpenChange={(open) => !open && setDeletingQuestionId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar pregunta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La pregunta y todas sus
              respuestas serán eliminadas permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}

// ─── Sortable Question Card ───────────────────────────────────────────────────

interface SortableQuestionCardProps {
  question: Question
  index: number
  onEdit: (question: Question) => void
  onDelete: (id: number) => void
  getQuestionTypeLabel: (type: string) => string
}

function SortableQuestionCard({
  question,
  index,
  onEdit,
  onDelete,
  getQuestionTypeLabel,
}: SortableQuestionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id! })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card ref={setNodeRef} style={style} className='border-border/60'>
      <CardContent className='pt-6'>
        <div className='flex items-start gap-3'>
          <div className='flex items-center gap-2'>
            <button
              {...attributes}
              {...listeners}
              className='text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing'
              aria-label='Arrastrar para reordenar'
            >
              <GripVertical className='h-5 w-5' />
            </button>
            <div className='bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold'>
              {index + 1}
            </div>
          </div>

          <div className='flex-1'>
            <div className='mb-3 flex items-start justify-between'>
              <div className='flex-1'>
                <p className='mb-2 text-base font-medium'>
                  {question.question_text}
                </p>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline'>
                    {getQuestionTypeLabel(question.question_type)}
                  </Badge>
                  <Badge variant='secondary'>
                    {question.points}{' '}
                    {question.points === 1 ? 'punto' : 'puntos'}
                  </Badge>
                  {question.answers && (
                    <span className='text-muted-foreground text-sm'>
                      {question.answers.length} opciones
                    </span>
                  )}
                </div>
              </div>
              <div className='flex gap-1'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => onEdit(question)}
                >
                  <Edit className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => onDelete(question.id!)}
                  className='text-destructive hover:text-destructive'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </div>

            {question.answers && question.answers.length > 0 && (
              <div className='space-y-2'>
                {question.answers.map((answer) => (
                  <div
                    key={answer.id}
                    className={`rounded-lg px-3 py-2 text-sm ${
                      answer.is_correct
                        ? 'border border-green-200 bg-green-50 font-medium text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {answer.is_correct && '✓ '}
                    {answer.answer_text}
                  </div>
                ))}
              </div>
            )}

            {question.explanation && (
              <p className='text-muted-foreground bg-muted mt-3 rounded-lg px-3 py-2 text-sm italic'>
                Explicación: {question.explanation}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
