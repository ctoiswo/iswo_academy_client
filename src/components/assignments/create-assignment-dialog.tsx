import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { CreateAssignmentRequest } from '@/types'
import { Plus, X } from 'lucide-react'
import { useCreateAssignment } from '@/hooks/use-assignments'
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
import { Textarea } from '@/components/ui/textarea'

interface CreateAssignmentDialogProps {
  academySlug: string
  courseSlug: string
  sections: Array<{ id: number; title: string }>
  lessons: Array<{ id: number; title: string }>
}

interface RubricCriterion {
  id: string
  name: string
  description: string
  max_points: number
}

export function CreateAssignmentDialog({
  academySlug,
  courseSlug,
  sections,
  lessons,
}: CreateAssignmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [rubricCriteria, setRubricCriteria] = useState<RubricCriterion[]>([])
  const [showRubric, setShowRubric] = useState(false)

  const createAssignment = useCreateAssignment(academySlug, courseSlug)

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<CreateAssignmentRequest>({
      defaultValues: {
        max_points: 100,
        passing_score: 70,
        max_attempts: 1,
        require_file_upload: false,
        require_text_submission: true,
        max_file_uploads: 5,
        max_file_size_mb: 10,
        late_penalty_percent: 10,
        allow_resubmission: false,
        auto_accept_on_time: false,
        peer_review_enabled: false,
        peer_review_count: 2,
      },
    })

  const requireFileUpload = watch('require_file_upload')
  const peerReviewEnabled = watch('peer_review_enabled')

  // For now, show all lessons. In a future version, we could fetch lessons per section
  const filteredLessons = lessons

  const addRubricCriterion = () => {
    const newCriterion: RubricCriterion = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      max_points: 10,
    }
    setRubricCriteria([...rubricCriteria, newCriterion])
  }

  const removeRubricCriterion = (id: string) => {
    setRubricCriteria(rubricCriteria.filter((c) => c.id !== id))
  }

  const updateRubricCriterion = (
    id: string,
    field: keyof RubricCriterion,
    value: string | number
  ) => {
    setRubricCriteria(
      rubricCriteria.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    )
  }

  const onSubmit = async (data: CreateAssignmentRequest) => {
    const payload = {
      ...data,
      section_id: selectedSection ? Number(selectedSection) : undefined,
      rubric:
        showRubric && rubricCriteria.length > 0 ? rubricCriteria : undefined,
    }

    createAssignment.mutate(payload, {
      onSuccess: () => {
        setOpen(false)
        reset()
        setSelectedSection('')
        setRubricCriteria([])
        setShowRubric(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Añadir Tarea
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[90vh] max-w-3xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Crear Nueva Tarea</DialogTitle>
          <DialogDescription>
            Configura una nueva tarea para evaluar a los estudiantes
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Información Básica */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold'>Información Básica</h3>

            <div>
              <Label htmlFor='title'>Título *</Label>
              <Input
                id='title'
                {...register('title', { required: true })}
                placeholder='Ej: Trabajo Final - Análisis de Datos'
              />
            </div>

            <div>
              <Label htmlFor='description'>Descripción</Label>
              <Textarea
                id='description'
                {...register('description')}
                placeholder='Descripción breve de la tarea'
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor='instructions'>Instrucciones</Label>
              <Textarea
                id='instructions'
                {...register('instructions')}
                placeholder='Instrucciones detalladas para completar la tarea'
                rows={4}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='section'>Sección (Opcional)</Label>
                <Select
                  value={selectedSection}
                  onValueChange={setSelectedSection}
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
              </div>

              <div>
                <Label htmlFor='lesson_id'>Lección *</Label>
                <Select
                  onValueChange={(value) =>
                    setValue('lesson_id', Number(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccionar lección' />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredLessons.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id.toString()}>
                        {lesson.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Puntuación */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold'>Puntuación</h3>

            <div className='grid grid-cols-3 gap-4'>
              <div>
                <Label htmlFor='max_points'>Puntos Máximos</Label>
                <Input
                  id='max_points'
                  type='number'
                  {...register('max_points', { valueAsNumber: true })}
                />
              </div>

              <div>
                <Label htmlFor='passing_score'>Puntaje Mínimo</Label>
                <Input
                  id='passing_score'
                  type='number'
                  {...register('passing_score', { valueAsNumber: true })}
                />
              </div>

              <div>
                <Label htmlFor='max_attempts'>Intentos Máximos</Label>
                <Input
                  id='max_attempts'
                  type='number'
                  min='1'
                  {...register('max_attempts', { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold'>Fechas y Plazos</h3>

            <div className='grid grid-cols-3 gap-4'>
              <div>
                <Label htmlFor='available_from'>Disponible Desde</Label>
                <Input
                  id='available_from'
                  type='datetime-local'
                  {...register('available_from')}
                />
              </div>

              <div>
                <Label htmlFor='due_at'>Fecha Límite</Label>
                <Input
                  id='due_at'
                  type='datetime-local'
                  {...register('due_at')}
                />
              </div>

              <div>
                <Label htmlFor='late_submission_until'>
                  Acepta Entregas Hasta
                </Label>
                <Input
                  id='late_submission_until'
                  type='datetime-local'
                  {...register('late_submission_until')}
                />
              </div>
            </div>

            <div>
              <Label htmlFor='late_penalty_percent'>
                Penalización por Entrega Tardía (%)
              </Label>
              <Input
                id='late_penalty_percent'
                type='number'
                min='0'
                max='100'
                {...register('late_penalty_percent', { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Configuración de Entregas */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold'>Configuración de Entregas</h3>

            <div className='flex items-center justify-between'>
              <Label htmlFor='require_text_submission'>
                Requiere Respuesta de Texto
              </Label>
              <Switch
                id='require_text_submission'
                checked={watch('require_text_submission')}
                onCheckedChange={(checked) =>
                  setValue('require_text_submission', checked)
                }
              />
            </div>

            <div className='flex items-center justify-between'>
              <Label htmlFor='require_file_upload'>
                Requiere Subida de Archivos
              </Label>
              <Switch
                id='require_file_upload'
                checked={requireFileUpload}
                onCheckedChange={(checked) =>
                  setValue('require_file_upload', checked)
                }
              />
            </div>

            {requireFileUpload && (
              <div className='ml-6 grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='max_file_uploads'>Archivos Máximos</Label>
                  <Input
                    id='max_file_uploads'
                    type='number'
                    min='1'
                    {...register('max_file_uploads', { valueAsNumber: true })}
                  />
                </div>

                <div>
                  <Label htmlFor='max_file_size_mb'>Tamaño Máximo (MB)</Label>
                  <Input
                    id='max_file_size_mb'
                    type='number'
                    min='1'
                    {...register('max_file_size_mb', { valueAsNumber: true })}
                  />
                </div>
              </div>
            )}

            <div className='flex items-center justify-between'>
              <Label htmlFor='allow_resubmission'>Permitir Re-envío</Label>
              <Switch
                id='allow_resubmission'
                checked={watch('allow_resubmission')}
                onCheckedChange={(checked) =>
                  setValue('allow_resubmission', checked)
                }
              />
            </div>

            <div className='flex items-center justify-between'>
              <Label htmlFor='auto_accept_on_time'>
                Auto-aceptar Entregas a Tiempo
              </Label>
              <Switch
                id='auto_accept_on_time'
                checked={watch('auto_accept_on_time')}
                onCheckedChange={(checked) =>
                  setValue('auto_accept_on_time', checked)
                }
              />
            </div>
          </div>

          {/* Revisión por Pares */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold'>Revisión por Pares</h3>

            <div className='flex items-center justify-between'>
              <Label htmlFor='peer_review_enabled'>
                Habilitar Revisión por Pares
              </Label>
              <Switch
                id='peer_review_enabled'
                checked={peerReviewEnabled}
                onCheckedChange={(checked) =>
                  setValue('peer_review_enabled', checked)
                }
              />
            </div>

            {peerReviewEnabled && (
              <div className='ml-6'>
                <Label htmlFor='peer_review_count'>
                  Número de Revisiones por Estudiante
                </Label>
                <Input
                  id='peer_review_count'
                  type='number'
                  min='1'
                  {...register('peer_review_count', { valueAsNumber: true })}
                />
              </div>
            )}
          </div>

          {/* Rúbrica */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-semibold'>Rúbrica de Evaluación</h3>
              <Switch checked={showRubric} onCheckedChange={setShowRubric} />
            </div>

            {showRubric && (
              <div className='space-y-4'>
                {rubricCriteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className='space-y-2 rounded-lg border p-4'
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex-1 space-y-2'>
                        <Input
                          placeholder='Nombre del criterio'
                          value={criterion.name}
                          onChange={(e) =>
                            updateRubricCriterion(
                              criterion.id,
                              'name',
                              e.target.value
                            )
                          }
                        />
                        <Textarea
                          placeholder='Descripción'
                          value={criterion.description}
                          onChange={(e) =>
                            updateRubricCriterion(
                              criterion.id,
                              'description',
                              e.target.value
                            )
                          }
                          rows={2}
                        />
                        <Input
                          type='number'
                          placeholder='Puntos máximos'
                          value={criterion.max_points}
                          onChange={(e) =>
                            updateRubricCriterion(
                              criterion.id,
                              'max_points',
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() => removeRubricCriterion(criterion.id)}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  type='button'
                  variant='outline'
                  onClick={addRubricCriterion}
                  className='w-full'
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Añadir Criterio
                </Button>
              </div>
            )}
          </div>

          {/* Botones de Acción */}
          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={createAssignment.isPending}>
              {createAssignment.isPending ? 'Creando...' : 'Crear Tarea'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
