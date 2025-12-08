import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type {
  Assessment,
  UpdateAssessmentRequest,
} from '@/types'
import { useUpdateAssessment } from '@/hooks/use-assessments'
import { Button } from '@/components/ui/button'
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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

interface EditAssessmentDialogProps {
  assessment: Assessment | null
  onOpenChange: (open: boolean) => void
  academySlug: string
  courseSlug: string
  sections: Array<{ id: number; title: string }>
}

export function EditAssessmentDialog({
  assessment,
  onOpenChange,
  academySlug,
  courseSlug,
  sections,
}: EditAssessmentDialogProps) {
  const updateAssessment = useUpdateAssessment(
    academySlug,
    courseSlug,
    assessment?.id || 0
  )
  const isQuiz = assessment?.type === 'Quiz'

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<UpdateAssessmentRequest>({
      defaultValues: {
        title: assessment?.title || '',
        description: assessment?.description || '',
        passing_score: assessment?.passing_score || 70,
        attempts_allowed: assessment?.attempts_allowed || 3,
        time_limit_minutes: assessment?.time_limit_minutes || undefined,
        weight_percentage: assessment?.weight_percentage || 10,
        retake_waiting_hours: assessment?.retake_waiting_hours || 0,
        published: assessment?.published || false,
        randomize_questions: assessment?.randomize_questions || false,
        show_correct_answers: assessment?.show_correct_answers || true,
        require_all_sections_complete:
          assessment?.require_all_sections_complete || false,
        section_id: assessment?.section_id || undefined,
      },
    })

  useEffect(() => {
    if (assessment) {
      reset({
        title: assessment.title,
        description: assessment.description || '',
        passing_score: assessment.passing_score,
        attempts_allowed: assessment.attempts_allowed || 3,
        time_limit_minutes: assessment.time_limit_minutes || undefined,
        weight_percentage: assessment.weight_percentage,
        retake_waiting_hours: assessment.retake_waiting_hours,
        published: assessment.published,
        randomize_questions: assessment.randomize_questions,
        show_correct_answers: assessment.show_correct_answers,
        require_all_sections_complete: assessment.require_all_sections_complete,
        section_id: assessment.section_id || undefined,
      })
    }
  }, [assessment, reset])

  const onSubmit = (data: UpdateAssessmentRequest) => {
    if (!assessment) return
    updateAssessment.mutate(data, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  const published = watch('published')
  const randomize = watch('randomize_questions')
  const showAnswers = watch('show_correct_answers')
  const requireAllSections = watch('require_all_sections_complete')

  if (!assessment) return null

  return (
    <Dialog open={!!assessment} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Editar {isQuiz ? 'Quiz' : 'Examen'}</DialogTitle>
          <DialogDescription>
            Modifica los detalles de esta evaluación. El tipo no puede ser
            cambiado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <div className='flex items-center gap-2 rounded-lg bg-gray-100 p-3'>
              <span className='text-2xl'>{isQuiz ? '📝' : '🎓'}</span>
              <div>
                <p className='text-sm font-medium'>
                  {isQuiz ? 'Quiz de Sección' : 'Examen Final'}
                </p>
                <p className='text-xs text-gray-600'>
                  {isQuiz
                    ? 'Evaluación de sección con múltiples intentos'
                    : 'Evaluación final del curso completo'}
                </p>
              </div>
            </div>

            {/* Basic Info */}
            <div>
              <Label htmlFor='title'>Título *</Label>
              <Input id='title' {...register('title', { required: true })} />
            </div>

            <div>
              <Label htmlFor='description'>Descripción</Label>
              <Textarea
                id='description'
                {...register('description')}
                rows={3}
              />
            </div>

            {/* Section Selection (Quiz only) */}
            {isQuiz && (
              <div>
                <Label htmlFor='section_id'>Sección *</Label>
                <Select
                  value={watch('section_id')?.toString() || ''}
                  onValueChange={(value) =>
                    setValue('section_id', value ? Number(value) : undefined)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecciona una sección' />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem
                        key={section.id}
                        value={section.id.toString()}
                      >
                        {section.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Configuration Grid */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='passing_score'>Puntaje Mínimo (%) *</Label>
                <Input
                  id='passing_score'
                  type='number'
                  min='0'
                  max='100'
                  {...register('passing_score', {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
              </div>

              <div>
                <Label htmlFor='attempts_allowed'>Intentos Permitidos *</Label>
                <Input
                  id='attempts_allowed'
                  type='number'
                  min='1'
                  {...register('attempts_allowed', {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
              </div>

              <div>
                <Label htmlFor='time_limit_minutes'>
                  Tiempo Límite (minutos)
                </Label>
                <Input
                  id='time_limit_minutes'
                  type='number'
                  min='0'
                  placeholder='Sin límite'
                  {...register('time_limit_minutes', { valueAsNumber: true })}
                />
              </div>

              <div>
                <Label htmlFor='weight_percentage'>Peso (%) *</Label>
                <Input
                  id='weight_percentage'
                  type='number'
                  min='0'
                  max='100'
                  step='0.1'
                  {...register('weight_percentage', {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
              </div>

              <div>
                <Label htmlFor='retake_waiting_hours'>
                  Espera para Reintento (horas)
                </Label>
                <Input
                  id='retake_waiting_hours'
                  type='number'
                  min='0'
                  {...register('retake_waiting_hours', { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Boolean Options */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between rounded-lg border p-3'>
                <div>
                  <Label htmlFor='published' className='cursor-pointer'>
                    Publicado
                  </Label>
                  <p className='text-xs text-gray-600'>
                    Los estudiantes pueden ver y realizar esta evaluación
                  </p>
                </div>
                <Switch
                  id='published'
                  checked={published}
                  onCheckedChange={(checked) => setValue('published', checked)}
                />
              </div>

              <div className='flex items-center justify-between rounded-lg border p-3'>
                <div>
                  <Label
                    htmlFor='randomize_questions'
                    className='cursor-pointer'
                  >
                    Preguntas Aleatorias
                  </Label>
                  <p className='text-xs text-gray-600'>
                    Mezclar el orden de las preguntas
                  </p>
                </div>
                <Switch
                  id='randomize_questions'
                  checked={randomize}
                  onCheckedChange={(checked) =>
                    setValue('randomize_questions', checked)
                  }
                />
              </div>

              <div className='flex items-center justify-between rounded-lg border p-3'>
                <div>
                  <Label
                    htmlFor='show_correct_answers'
                    className='cursor-pointer'
                  >
                    Mostrar Respuestas Correctas
                  </Label>
                  <p className='text-xs text-gray-600'>
                    Mostrar las respuestas correctas después de completar
                  </p>
                </div>
                <Switch
                  id='show_correct_answers'
                  checked={showAnswers}
                  onCheckedChange={(checked) =>
                    setValue('show_correct_answers', checked)
                  }
                />
              </div>

              {!isQuiz && (
                <div className='flex items-center justify-between rounded-lg border p-3'>
                  <div>
                    <Label
                      htmlFor='require_all_sections_complete'
                      className='cursor-pointer'
                    >
                      Requiere Todas las Secciones Completas
                    </Label>
                    <p className='text-xs text-gray-600'>
                      El estudiante debe completar todas las secciones primero
                    </p>
                  </div>
                  <Switch
                    id='require_all_sections_complete'
                    checked={requireAllSections}
                    onCheckedChange={(checked) =>
                      setValue('require_all_sections_complete', checked)
                    }
                  />
                </div>
              )}
            </div>
          </div>

          <div className='flex justify-end gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={updateAssessment.isPending}>
              {updateAssessment.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
