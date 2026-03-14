import { useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import type { Question } from '@/types'
import { ArrowLeft, Plus, GripVertical, Edit, Trash2 } from 'lucide-react'
import { useAssessments } from '@/hooks/use-assessments'
import { useCourse } from '@/hooks/use-courses'
import { useQuestions, useDeleteQuestion } from '@/hooks/use-questions'
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

export default function AssessmentQuestionsPage() {
  const params = useParams({ strict: false }) as {
    academySlug: string
    courseSlug: string
    assessmentId: string
  }
  const { academySlug, courseSlug, assessmentId } = params

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(
    null
  )
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

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

  const totalPoints = questions?.reduce((sum, q) => sum + q.points, 0) || 0

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

  if (loadingCourse) {
    return (
      <div className='container mx-auto py-8'>
        <Skeleton className='h-64' />
      </div>
    )
  }

  if (!course || !assessment) {
    return (
      <div className='container mx-auto py-8'>
        <div className='py-12 text-center'>
          <h3 className='mb-2 text-lg font-bold text-red-600'>
            Error al Cargar
          </h3>
          <p className='text-muted-foreground'>No se pudo cargar la evaluación</p>
        </div>
      </div>
    )
  }

  const isQuiz = assessment.type === 'Quiz'

  return (
    <div className='container mx-auto py-8'>
      {/* Header */}
      <div className='mb-6'>
        <Link
          to='/academy/$academySlug/courses/$courseSlug/exams'
          params={{ academySlug, courseSlug }}
        >
          <Button variant='ghost' size='sm' className='mb-2'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Volver a Evaluaciones
          </Button>
        </Link>
        <div className='flex items-start justify-between'>
          <div>
            <div className='mb-2 flex items-center gap-2'>
              <h1 className='text-3xl font-bold'>{assessment.title}</h1>
              <Badge variant={isQuiz ? 'default' : 'destructive'}>
                {isQuiz ? '📝 Quiz' : '🎓 Examen'}
              </Badge>
            </div>
            <p className='text-muted-foreground'>
              Gestiona las preguntas de esta evaluación
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} size='lg'>
            <Plus className='mr-2 h-4 w-4' />
            Añadir Pregunta
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className='mb-6 grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>{questions?.length || 0}</CardTitle>
            <CardDescription>Total de Preguntas</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>{totalPoints}</CardTitle>
            <CardDescription>Puntos Totales</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>
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
          ) : questions && questions.length > 0 ? (
            <div className='space-y-4'>
              {questions.map((question, index) => (
                <Card key={question.id}>
                  <CardContent className='pt-6'>
                    <div className='flex items-start gap-3'>
                      <div className='flex items-center gap-2'>
                        <GripVertical className='h-5 w-5 cursor-move text-muted-foreground' />
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600'>
                          {index + 1}
                        </div>
                      </div>

                      <div className='flex-1'>
                        <div className='mb-3 flex items-start justify-between'>
                          <div className='flex-1'>
                            <p className='mb-2 text-lg font-medium'>
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
                                <span className='text-sm text-muted-foreground'>
                                  {question.answers.length} opciones
                                </span>
                              )}
                            </div>
                          </div>
                          <div className='flex gap-1'>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => setEditingQuestion(question)}
                            >
                              <Edit className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() =>
                                setDeletingQuestionId(question.id!)
                              }
                              className='text-red-600 hover:text-red-700'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>

                        {/* Opciones de respuesta */}
                        {question.answers && question.answers.length > 0 && (
                          <div className='space-y-2'>
                            {question.answers.map((answer) => (
                              <div
                                key={answer.id}
                                className={`rounded-lg px-3 py-2 text-sm ${
                                  answer.is_correct
                                    ? 'border border-green-200 bg-green-50 font-medium text-green-800'
                                    : 'bg-gray-50 text-gray-700'
                                }`}
                              >
                                {answer.is_correct && '✓ '}
                                {answer.answer_text}
                              </div>
                            ))}
                          </div>
                        )}

                        {question.explanation && (
                          <p className='mt-3 rounded bg-blue-50 p-2 text-sm text-muted-foreground italic'>
                            💡 Explicación: {question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className='py-12 text-center text-muted-foreground'>
              <p className='mb-4 text-lg font-medium'>Aún no hay preguntas</p>
              <p className='mb-4'>
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
              className='bg-red-600 hover:bg-red-700'
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
