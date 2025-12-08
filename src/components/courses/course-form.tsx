import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Course } from '@/services/course-service'
import { useCreateCourse, useUpdateCourse } from '@/hooks/use-courses'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DialogFooter } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const courseSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es requerido')
    .max(100, 'El título debe tener menos de 100 caracteres'),
  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .max(1000, 'La descripción debe tener menos de 1000 caracteres'),
  duration_minutes: z
    .number()
    .min(1, 'La duración debe ser al menos 1 minuto')
    .max(10000, 'La duración debe ser menor a 10000 minutos'),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  status: z.enum(['draft', 'published']).optional(),
  is_free: z.boolean().optional(),
  price: z.string().optional(),
})

type CourseFormData = z.infer<typeof courseSchema>

interface CourseFormProps {
  academySlug: string | number
  course?: Course
  onSuccess: () => void
  onCancel: () => void
}

export function CourseForm({
  academySlug,
  course,
  onSuccess,
  onCancel,
}: CourseFormProps) {
  const isEditing = !!course

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course?.title || '',
      description: course?.description || '',
      duration_minutes: course?.duration_minutes || 60,
      difficulty_level:
        (course?.difficulty_level as
          | 'beginner'
          | 'intermediate'
          | 'advanced') || 'beginner',
      status: course?.status === 'published' ? 'published' : 'draft',
      is_free: course?.is_free ?? true,
      price: String(course?.price || '0'),
    },
  })

  const isFree = form.watch('is_free')

  // Use the hooks that handle query invalidation
  const createMutation = useCreateCourse(String(academySlug))
  const updateMutation = useUpdateCourse(String(academySlug))

  const onSubmit = (data: CourseFormData) => {
    const courseData = {
      title: data.title,
      description: data.description,
      duration_minutes: data.duration_minutes,
      difficulty_level: data.difficulty_level,
      status: data.status,
      // Convert price to number (backend calculates is_free automatically)
      price: data.is_free ? 0 : Number(data.price || 0),
    }

    if (isEditing) {
      if (!course?.slug && !course?.id) {
        return
      }
      const courseId = Number(course.slug || course.id)
      updateMutation.mutate(
        { courseId, data: courseData },
        {
          onSuccess: () => onSuccess(),
        }
      )
    } else {
      createMutation.mutate(courseData, {
        onSuccess: () => onSuccess(),
      })
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* Title Field */}
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder='Ingresa el título del curso' {...field} />
              </FormControl>
              <FormDescription>
                Un título claro y descriptivo para tu curso
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Describe lo que los estudiantes aprenderán en este curso'
                  className='min-h-[100px]'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Explica el contenido del curso, los objetivos y lo que los
                estudiantes lograrán
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Duration Field */}
        <FormField
          control={form.control}
          name='duration_minutes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duración (minutos)</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  min='1'
                  max='10000'
                  placeholder='60'
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Tiempo estimado para completar el curso en minutos
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Difficulty Level, Status, and Free Course in one row */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {/* Difficulty Level Field */}
          <FormField
            control={form.control}
            name='difficulty_level'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nivel de Dificultad</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecciona nivel' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='beginner'>Principiante</SelectItem>
                    <SelectItem value='intermediate'>Intermedio</SelectItem>
                    <SelectItem value='advanced'>Avanzado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status Field */}
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecciona estado' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='draft'>Borrador</SelectItem>
                    <SelectItem value='published'>Publicado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Is Free Checkbox */}
          <FormField
            control={form.control}
            name='is_free'
            render={({ field }) => (
              <FormItem className='flex flex-col justify-end'>
                <div className='flex h-9 flex-row items-center space-y-0 space-x-3'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className='font-normal'>Curso Gratuito</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Price Field (only show if not free) */}
        {!isFree && (
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input placeholder='29.99' {...field} />
                </FormControl>
                <FormDescription>
                  Precio del curso (ej: 29.99, 100, 199.50)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading
              ? 'Guardando...'
              : isEditing
                ? 'Actualizar Curso'
                : 'Crear Curso'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
