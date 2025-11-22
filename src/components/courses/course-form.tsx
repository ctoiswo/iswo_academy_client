import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { toast } from 'sonner'

import { courseService, type Course, type CreateCourseData, type UpdateCourseData } from '@/services/course-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { DialogFooter } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'

const courseSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(100, 'El título debe tener menos de 100 caracteres'),
  description: z.string().min(1, 'La descripción es requerida').max(1000, 'La descripción debe tener menos de 1000 caracteres'),
  duration_minutes: z.number().min(1, 'La duración debe ser al menos 1 minuto').max(10000, 'La duración debe ser menor a 10000 minutos'),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  status: z.enum(['draft', 'published']).optional(),
  is_free: z.boolean().optional(),
  price: z.string().optional(),
})

type CourseFormData = z.infer<typeof courseSchema>

interface CourseFormProps {
  academyId: number
  course?: Course
  onSuccess: () => void
  onCancel: () => void
}

export function CourseForm({ academyId, course, onSuccess, onCancel }: CourseFormProps) {
  const isEditing = !!course
  
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course?.title || '',
      description: course?.description || '',
      duration_minutes: course?.duration_minutes || 60,
      difficulty_level: course?.difficulty_level as 'beginner' | 'intermediate' | 'advanced' || 'beginner',
      status: course?.status === 'published' ? 'published' : 'draft',
      is_free: course?.is_free ?? true,
      price: course?.price || '0',
    },
  })

  const isFree = form.watch('is_free')

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateCourseData) => courseService.createCourse(academyId, data),
    onSuccess: () => {
      toast.success('Course created successfully')
      onSuccess()
    },
    onError: (error) => {
      toast.error(`Failed to create course: ${error.message}`)
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateCourseData) => {
      if (!course?.id) throw new Error('Course ID is required for update')
      return courseService.updateCourse(academyId, course.id, data)
    },
    onSuccess: () => {
      toast.success('Course updated successfully')
      onSuccess()
    },
    onError: (error) => {
      toast.error(`Failed to update course: ${error.message}`)
    },
  })

  const onSubmit = (data: CourseFormData) => {
    const courseData = {
      ...data,
      // If course is free, set price to "0"
      price: data.is_free ? '0' : data.price,
    }

    if (isEditing) {
      updateMutation.mutate(courseData)
    } else {
      createMutation.mutate(courseData)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ingresa el título del curso" {...field} />
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe lo que los estudiantes aprenderán en este curso"
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Explica el contenido del curso, los objetivos y lo que los estudiantes lograrán
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Duration Field */}
        <FormField
          control={form.control}
          name="duration_minutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duración (minutos)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  max="10000"
                  placeholder="60"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Difficulty Level Field */}
          <FormField
            control={form.control}
            name="difficulty_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nivel de Dificultad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona nivel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Principiante</SelectItem>
                    <SelectItem value="intermediate">Intermedio</SelectItem>
                    <SelectItem value="advanced">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status Field */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Is Free Checkbox */}
          <FormField
            control={form.control}
            name="is_free"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
                <div className="flex flex-row items-center space-x-3 space-y-0 h-9">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Curso Gratuito
                  </FormLabel>
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
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="29.99"
                    {...field}
                  />
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
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Curso' : 'Crear Curso'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}