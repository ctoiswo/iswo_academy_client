import { useState } from 'react'
import type { Assessment, Question } from '@/types'
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CreateQuestionDialog } from './create-question-dialog'
import { EditQuestionDialog } from './edit-question-dialog'

interface ManageQuestionsDialogProps {
  assessment: Assessment | null
  onOpenChange: (open: boolean) => void
  academySlug: string
  courseSlug: string
}

export function ManageQuestionsDialog({
  assessment,
  onOpenChange,
  academySlug,
  courseSlug,
}: ManageQuestionsDialogProps) {
  const { data: questions, isLoading } = useQuestions(
    academySlug,
    courseSlug,
    assessment?.id || 0
  )
  const deleteQuestion = useDeleteQuestion(
    academySlug,
    courseSlug,
    assessment?.id || 0
  )

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(
    null
  )
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  if (!assessment) return null

  const isQuiz = assessment.type === 'Quiz'
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

  return (
    <>
      <Dialog open={!!assessment} onOpenChange={onOpenChange}>
        <DialogContent className='max-h-[90vh] max-w-4xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <span className='text-2xl'>{isQuiz ? '📝' : '🎓'}</span>
              Preguntas: {assessment.title}
            </DialogTitle>
            <DialogDescription>
              Gestiona las preguntas de esta evaluación. Agrega, edita o elimina
              preguntas.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            {/* Header con estadísticas */}
            <div className='flex items-center justify-between rounded-lg bg-gray-50 p-4'>
              <div className='flex gap-6 text-sm'>
                <div>
                  <p className='text-muted-foreground'>Total Preguntas</p>
                  <p className='text-2xl font-bold'>{questions?.length || 0}</p>
                </div>
                <div>
                  <p className='text-muted-foreground'>Puntos Totales</p>
                  <p className='text-2xl font-bold'>{totalPoints}</p>
                </div>
              </div>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className='mr-2 h-4 w-4' />
                Añadir Pregunta
              </Button>
            </div>

            {/* Lista de preguntas */}
            <ScrollArea className='h-[400px] rounded-lg border'>
              {isLoading ? (
                <div className='text-muted-foreground p-8 text-center'>
                  Cargando preguntas...
                </div>
              ) : questions && questions.length > 0 ? (
                <div className='divide-y'>
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className='flex items-start gap-3 p-4 hover:bg-gray-50'
                    >
                      <div className='flex items-center gap-2'>
                        <GripVertical className='text-muted-foreground h-5 w-5' />
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600'>
                          {index + 1}
                        </div>
                      </div>

                      <div className='flex-1'>
                        <div className='mb-2 flex items-start justify-between'>
                          <div className='flex-1'>
                            <p className='font-medium'>
                              {question.question_text}
                            </p>
                            <div className='mt-1 flex items-center gap-2'>
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

                        {/* Mostrar opciones de respuesta */}
                        {question.answers && question.answers.length > 0 && (
                          <div className='mt-2 space-y-1'>
                            {question.answers.map((answer) => (
                              <div
                                key={answer.id}
                                className={`rounded px-2 py-1 text-sm ${
                                  answer.is_correct
                                    ? 'bg-green-50 font-medium text-green-800'
                                    : 'bg-gray-50 text-gray-600'
                                }`}
                              >
                                {answer.is_correct && '✓ '}
                                {answer.answer_text}
                              </div>
                            ))}
                          </div>
                        )}

                        {question.explanation && (
                          <p className='text-muted-foreground mt-2 text-sm italic'>
                            Explicación: {question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-muted-foreground p-12 text-center'>
                  <p className='mb-4 text-lg font-medium'>
                    Aún no hay preguntas
                  </p>
                  <p className='mb-4'>
                    Comienza añadiendo preguntas a esta evaluación
                  </p>
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Añadir Primera Pregunta
                  </Button>
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de crear pregunta */}
      <CreateQuestionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        academySlug={academySlug}
        courseSlug={courseSlug}
        assessmentId={assessment.id}
      />

      {/* Diálogo de editar pregunta */}
      {editingQuestion && (
        <EditQuestionDialog
          question={editingQuestion}
          onOpenChange={(open: boolean) => !open && setEditingQuestion(null)}
          academySlug={academySlug}
          courseSlug={courseSlug}
          assessmentId={assessment.id}
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
    </>
  )
}
