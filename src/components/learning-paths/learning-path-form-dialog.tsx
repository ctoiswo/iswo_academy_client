import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { LearningPath } from '@/services/learning-path-service'
import { useAuthStore } from '@/stores/auth-store'
import {
  useCreateLearningPath,
  useUpdateLearningPath,
} from '@/hooks/use-learning-paths'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

interface LearningPathFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  learningPath?: LearningPath
  mode: 'create' | 'edit'
}

interface LearningPathFormData {
  title: string
  description: string
  estimated_duration_hours: number
  difficulty_level: string
  status: 'draft' | 'published' | 'archived'
}

export function LearningPathFormDialog({
  open,
  onOpenChange,
  learningPath,
  mode,
}: LearningPathFormDialogProps) {
  const { currentAcademy } = useAuthStore()
  const createMutation = useCreateLearningPath(currentAcademy?.slug || '')
  const updateMutation = useUpdateLearningPath(currentAcademy?.slug || '')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<LearningPathFormData>({
    defaultValues: {
      title: '',
      description: '',
      estimated_duration_hours: 1,
      difficulty_level: 'beginner',
      status: 'draft',
    },
  })

  // Reset form when learningPath prop changes or dialog opens
  useEffect(() => {
    if (open) {
      if (learningPath && mode === 'edit') {
        reset({
          title: learningPath.title,
          description: learningPath.description,
          estimated_duration_hours: learningPath.estimated_duration_hours,
          difficulty_level: learningPath.difficulty_level,
          status: learningPath.status,
        })
      } else {
        reset({
          title: '',
          description: '',
          estimated_duration_hours: 1,
          difficulty_level: 'beginner',
          status: 'draft',
        })
      }
    }
  }, [open, learningPath, mode, reset])

  const onSubmit = async (data: LearningPathFormData) => {
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(data)
      } else {
        await updateMutation.mutateAsync({
          learningPathSlug: learningPath!.slug,
          data,
        })
      }
      reset()
      onOpenChange(false)
    } catch (_error) {
      // console.error('Error saving learning path:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Crear' : 'Editar'} Ruta de Aprendizaje
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Crea una nueva ruta de aprendizaje para organizar cursos'
              : 'Edita la información de esta ruta de aprendizaje'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Título *</Label>
            <Input
              id='title'
              {...register('title', { required: 'El título es requerido' })}
              placeholder='Ej: Desarrollo Web Full Stack'
            />
            {errors.title && (
              <p className='text-destructive text-sm'>{errors.title.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Descripción *</Label>
            <Textarea
              id='description'
              {...register('description', {
                required: 'La descripción es requerida',
              })}
              placeholder='Describe el contenido y objetivos de esta ruta de aprendizaje...'
              rows={4}
            />
            {errors.description && (
              <p className='text-destructive text-sm'>
                {errors.description.message}
              </p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='estimated_duration_hours'>
                Duración Estimada (horas) *
              </Label>
              <Input
                id='estimated_duration_hours'
                type='number'
                min='1'
                {...register('estimated_duration_hours', {
                  required: 'La duración es requerida',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Debe ser al menos 1 hora' },
                })}
              />
              {errors.estimated_duration_hours && (
                <p className='text-destructive text-sm'>
                  {errors.estimated_duration_hours.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='difficulty_level'>Nivel de Dificultad</Label>
              <Select
                defaultValue={watch('difficulty_level')}
                onValueChange={(value) => setValue('difficulty_level', value)}
              >
                <SelectTrigger id='difficulty_level'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='beginner'>Principiante</SelectItem>
                  <SelectItem value='intermediate'>Intermedio</SelectItem>
                  <SelectItem value='advanced'>Avanzado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='status'>Estado</Label>
            <Select
              defaultValue={watch('status')}
              onValueChange={(value) =>
                setValue('status', value as 'draft' | 'published')
              }
            >
              <SelectTrigger id='status'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='draft'>Borrador</SelectItem>
                <SelectItem value='published'>Publicado</SelectItem>
                <SelectItem value='archived'>Archivado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {mode === 'create' ? 'Crear' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
