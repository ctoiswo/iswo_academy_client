import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type {
  CreateAssessmentData,
  AssessmentType,
} from '@/services/assessment-service'
import { Plus } from 'lucide-react'
import { useCreateAssessment } from '@/hooks/use-assessments'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

interface CreateAssessmentDialogProps {
  academySlug: string
  courseSlug: string
  sections: Array<{ id: number; title: string }>
  open?: boolean
  onOpenChange?: (open: boolean) => void
  hasExistingExam?: boolean
}

export function CreateAssessmentDialog({
  academySlug,
  courseSlug,
  sections,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  hasExistingExam = false,
}: CreateAssessmentDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = controlledOnOpenChange || setInternalOpen

  const [assessmentType, setAssessmentType] = useState<AssessmentType>('Quiz')

  const createAssessment = useCreateAssessment(academySlug, courseSlug)

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<CreateAssessmentData>({
      defaultValues: {
        type: 'Quiz',
        passing_score: 70,
        attempts_allowed: 3,
        weight_percentage: 10,
        retake_waiting_hours: 0,
        published: false,
        randomize_questions: false,
        randomize_answers: false,
        show_correct_answers: true,
        require_all_sections_complete: false,
      },
    })

  const handleTypeChange = (type: AssessmentType) => {
    setAssessmentType(type)
    setValue('type', type)

    // Set defaults based on type
    if (type === 'Exam') {
      setValue('passing_score', 75)
      setValue('attempts_allowed', 1)
      setValue('weight_percentage', 40)
      setValue('retake_waiting_hours', 24)
      setValue('show_correct_answers', false)
      setValue('require_all_sections_complete', true)
      setValue('section_id', undefined)
    } else {
      setValue('passing_score', 70)
      setValue('attempts_allowed', 3)
      setValue('weight_percentage', 10)
      setValue('retake_waiting_hours', 0)
      setValue('show_correct_answers', true)
      setValue('require_all_sections_complete', false)
    }
  }

  const onSubmit = async (data: CreateAssessmentData) => {
    createAssessment.mutate(data, {
      onSuccess: () => {
        setOpen(false)
        reset()
        setAssessmentType('Quiz')
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Crear Evaluación
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Crear Nueva Evaluación</DialogTitle>
          <DialogDescription>
            Elige entre Quiz (evaluación de sección) o Examen (evaluación final
            del curso)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Tipo de Evaluación */}
          <div>
            <Tabs
              value={assessmentType}
              onValueChange={(v) => handleTypeChange(v as AssessmentType)}
            >
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='Quiz'>Quiz de Sección</TabsTrigger>
                <TabsTrigger value='Exam' disabled={hasExistingExam}>
                  Examen Final
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {hasExistingExam && (
              <p className='mt-2 text-sm text-amber-600'>
                ⚠️ Ya existe un examen final para este curso. Solo puede haber
                un examen final por curso.
              </p>
            )}
          </div>

          {/* Información Básica */}
          <div className='space-y-4'>
            <div>
              <Label htmlFor='title'>Título *</Label>
              <Input
                id='title'
                {...register('title', { required: true })}
                placeholder='Ej: Quiz Módulo 1 - Introducción'
              />
            </div>

            <div>
              <Label htmlFor='description'>Descripción</Label>
              <Textarea
                id='description'
                {...register('description')}
                placeholder='Descripción de la evaluación'
                rows={3}
              />
            </div>

            {assessmentType === 'Quiz' && (
              <div>
                <Label htmlFor='section_id'>Sección *</Label>
                <Select
                  onValueChange={(value) =>
                    setValue('section_id', Number(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccionar sección' />
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
                <p className='text-muted-foreground mt-1 text-sm'>
                  Los quizzes pertenecen a una sección específica
                </p>
              </div>
            )}
          </div>

          {/* Configuración */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='passing_score'>Puntaje Mínimo (%)</Label>
              <Input
                id='passing_score'
                type='number'
                min='0'
                max='100'
                {...register('passing_score', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor='attempts_allowed'>Intentos Permitidos</Label>
              <Input
                id='attempts_allowed'
                type='number'
                min='1'
                {...register('attempts_allowed', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor='time_limit_minutes'>Límite de Tiempo (min)</Label>
              <Input
                id='time_limit_minutes'
                type='number'
                min='1'
                {...register('time_limit_minutes', { valueAsNumber: true })}
                placeholder={
                  assessmentType === 'Exam' ? 'Requerido' : 'Opcional'
                }
              />
            </div>

            <div>
              <Label htmlFor='weight_percentage'>Peso (%)</Label>
              <Input
                id='weight_percentage'
                type='number'
                min='0'
                max='100'
                {...register('weight_percentage', { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Opciones Avanzadas */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='published'>Publicar inmediatamente</Label>
              <Switch
                id='published'
                checked={watch('published')}
                onCheckedChange={(checked) => setValue('published', checked)}
              />
            </div>

            <div className='flex items-center justify-between'>
              <Label htmlFor='randomize_questions'>Aleatorizar preguntas</Label>
              <Switch
                id='randomize_questions'
                checked={watch('randomize_questions')}
                onCheckedChange={(checked) =>
                  setValue('randomize_questions', checked)
                }
              />
            </div>

            <div className='flex items-center justify-between'>
              <Label htmlFor='show_correct_answers'>
                Mostrar respuestas correctas
              </Label>
              <Switch
                id='show_correct_answers'
                checked={watch('show_correct_answers')}
                onCheckedChange={(checked) =>
                  setValue('show_correct_answers', checked)
                }
              />
            </div>

            {assessmentType === 'Exam' && (
              <div className='flex items-center justify-between'>
                <Label htmlFor='require_all_sections_complete'>
                  Requiere completar todas las secciones
                </Label>
                <Switch
                  id='require_all_sections_complete'
                  checked={watch('require_all_sections_complete')}
                  onCheckedChange={(checked) =>
                    setValue('require_all_sections_complete', checked)
                  }
                />
              </div>
            )}
          </div>

          {/* Botones */}
          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={createAssessment.isPending}>
              {createAssessment.isPending ? 'Creando...' : 'Crear Evaluación'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
