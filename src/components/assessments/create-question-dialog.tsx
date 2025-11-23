import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import type {
  CreateQuestionData,
  QuestionType,
} from '@/services/question-service'
import { Plus, X } from 'lucide-react'
import { useCreateQuestion } from '@/hooks/use-questions'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface CreateQuestionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  academySlug: string
  courseSlug: string
  assessmentId: number
  onSuccess?: () => void
}

export function CreateQuestionDialog({
  open,
  onOpenChange,
  academySlug,
  courseSlug,
  assessmentId,
  onSuccess,
}: CreateQuestionDialogProps) {
  const [questionType, setQuestionType] =
    useState<QuestionType>('multiple_choice')
  const createQuestion = useCreateQuestion(
    academySlug,
    courseSlug,
    assessmentId
  )

  const { register, handleSubmit, reset, control, watch } =
    useForm<CreateQuestionData>({
      defaultValues: {
        question_text: '',
        question_type: 'multiple_choice',
        points: 1,
        explanation: '',
        answers: [
          { answer_text: '', is_correct: false },
          { answer_text: '', is_correct: false },
        ],
      },
    })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'answers',
  })

  const resetForm = () => {
    reset({
      question_text: '',
      question_type: 'multiple_choice',
      points: 1,
      explanation: '',
      answers: [
        { answer_text: '', is_correct: false },
        { answer_text: '', is_correct: false },
      ],
    })
    setQuestionType('multiple_choice')
  }

  // Limpiar el formulario cuando se cierra el diálogo
  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open])

  const onSubmit = (data: CreateQuestionData) => {
    // Filtrar respuestas vacías
    const validAnswers = data.answers.filter((a) => a.answer_text.trim() !== '')

    createQuestion.mutate(
      { ...data, answers: validAnswers },
      {
        onSuccess: () => {
          resetForm()
          if (onSuccess) {
            onSuccess()
          } else {
            onOpenChange(false)
          }
        },
      }
    )
  }

  const questionTypeOptions = [
    { value: 'multiple_choice', label: 'Opción Múltiple (una correcta)' },
    { value: 'true_false', label: 'Verdadero/Falso' },
    {
      value: 'multiple_select',
      label: 'Selección Múltiple (varias correctas)',
    },
  ]

  const needsAnswers = [
    'multiple_choice',
    'true_false',
    'multiple_select',
  ].includes(questionType)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-3xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Crear Nueva Pregunta</DialogTitle>
          <DialogDescription>
            Añade una pregunta a la evaluación con sus opciones de respuesta
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Tipo de Pregunta */}
          <div>
            <Label htmlFor='question_type'>Tipo de Pregunta *</Label>
            <Select
              value={questionType}
              onValueChange={(value) => {
                setQuestionType(value as QuestionType)
                // Si es Verdadero/Falso, establecer las respuestas por defecto
                if (value === 'true_false') {
                  reset({
                    ...watch(),
                    question_type: value as QuestionType,
                    answers: [
                      { answer_text: 'Verdadero', is_correct: false },
                      { answer_text: 'Falso', is_correct: false },
                    ],
                  })
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {questionTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
                        const answers = watch('answers')
                        // Si es multiple_choice, solo una puede ser correcta
                        if (questionType === 'multiple_choice' && checked) {
                          answers.forEach((_, i) => {
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

              <p className='text-xs text-gray-500'>
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
            <Button type='submit' disabled={createQuestion.isPending}>
              {createQuestion.isPending ? 'Creando...' : 'Crear Pregunta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
