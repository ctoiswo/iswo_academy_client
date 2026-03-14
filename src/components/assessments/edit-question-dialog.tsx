import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import type { Question, UpdateQuestionRequest } from '@/types'
import { Plus, X } from 'lucide-react'
import { useUpdateQuestion } from '@/hooks/use-questions'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface EditQuestionDialogProps {
  question: Question | null
  onOpenChange: (open: boolean) => void
  academySlug: string
  courseSlug: string
  assessmentId: number
}

export function EditQuestionDialog({
  question,
  onOpenChange,
  academySlug,
  courseSlug,
  assessmentId,
}: EditQuestionDialogProps) {
  const updateQuestion = useUpdateQuestion(
    academySlug,
    courseSlug,
    assessmentId,
    question?.id || 0
  )

  const { register, handleSubmit, reset, control, watch } =
    useForm<UpdateQuestionRequest>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'answers',
  })

  useEffect(() => {
    if (question) {
      reset({
        question_text: question.question_text,
        question_type: question.question_type,
        points: question.points,
        explanation: question.explanation || '',
        answers: question.answers || [],
      })
    }
  }, [question, reset])

  const onSubmit = (data: UpdateQuestionRequest) => {
    // Filtrar respuestas vacías
    const validAnswers =
      data.answers?.filter((a: { answer_text: string }) => a.answer_text.trim() !== '') || []

    updateQuestion.mutate(
      { ...data, answers: validAnswers },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  if (!question) return null

  const questionType = watch('question_type')
  const needsAnswers = [
    'multiple_choice',
    'true_false',
    'multiple_select',
  ].includes(questionType || '')

  return (
    <Dialog open={!!question} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-3xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Editar Pregunta</DialogTitle>
          <DialogDescription>
            Modifica la pregunta y sus opciones de respuesta
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Texto de la Pregunta */}
          <div>
            <Label htmlFor='question_text'>Pregunta *</Label>
            <Textarea
              id='question_text'
              {...register('question_text', { required: true })}
              placeholder='Escribe la pregunta aquí'
              rows={3}
            />
          </div>

          {/* Puntos */}
          <div>
            <Label htmlFor='points'>Puntos *</Label>
            <Input
              id='points'
              type='number'
              min='1'
              {...register('points', { required: true, valueAsNumber: true })}
            />
          </div>

          {/* Opciones de Respuesta */}
          {needsAnswers && (
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <Label>Opciones de Respuesta *</Label>
                {questionType !== 'true_false' && (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      append({ answer_text: '', is_correct: false })
                    }
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    Añadir Opción
                  </Button>
                )}
              </div>

              <div className='space-y-2'>
                {fields.map((field, index) => (
                  <div key={field.id} className='flex items-center gap-2'>
                    <Checkbox
                      checked={watch(`answers.${index}.is_correct`)}
                      onCheckedChange={(checked) => {
                        const answers = watch('answers') || []
                        // Si es multiple_choice, solo una puede ser correcta
                        if (questionType === 'multiple_choice' && checked) {
                          answers.forEach((_: unknown, i: number) => {
                            if (i !== index) {
                              answers[i].is_correct = false
                            }
                          })
                        }
                        answers[index].is_correct = checked as boolean
                        reset({ ...watch(), answers })
                      }}
                    />
                    <Input
                      {...register(`answers.${index}.answer_text`)}
                      placeholder={`Opción ${index + 1}`}
                      disabled={questionType === 'true_false'}
                    />
                    {questionType !== 'true_false' && fields.length > 2 && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() => remove(index)}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <p className='text-xs text-muted-foreground'>
                {questionType === 'multiple_choice' &&
                  'Marca la casilla de la respuesta correcta'}
                {questionType === 'multiple_select' &&
                  'Marca las casillas de todas las respuestas correctas'}
                {questionType === 'true_false' &&
                  'Marca si la respuesta es Verdadero o Falso'}
              </p>
            </div>
          )}

          {/* Explicación */}
          <div>
            <Label htmlFor='explanation'>Explicación (Opcional)</Label>
            <Textarea
              id='explanation'
              {...register('explanation')}
              placeholder='Explicación que se mostrará después de responder'
              rows={2}
            />
          </div>

          {/* Botones */}
          <div className='flex justify-end gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={updateQuestion.isPending}>
              {updateQuestion.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
