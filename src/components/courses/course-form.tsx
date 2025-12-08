import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Course } from '@/types'
import {
  Upload,
  Link as LinkIcon,
  X,
  Image as ImageIcon,
  Video,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCreateCourse, useUpdateCourse } from '@/hooks/use-courses'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

const courseSchema = z.object({
  // Información básica (requeridos)
  title: z
    .string()
    .min(1, 'El título es requerido')
    .max(100, 'El título debe tener menos de 100 caracteres'),
  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .max(5000, 'La descripción debe tener menos de 5000 caracteres'),

  // Configuración del curso
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  status: z.enum(['draft', 'published', 'archived']),
  category: z
    .string()
    .max(50, 'La categoría debe tener menos de 50 caracteres')
    .optional(),
  tags: z.string().optional(),

  // Precio y tipo
  pricing_type: z.enum(['free', 'one_time', 'subscription']),
  price: z.string().optional(),
  currency: z.string().optional(),
  subscription_price_monthly: z.string().optional(),
  subscription_price_annual: z.string().optional(),

  // Duración y contenido
  duration_minutes: z
    .number()
    .min(0, 'La duración no puede ser negativa')
    .optional(),

  // Información adicional
  prerequisites: z.string().max(1000).optional(),
  meta_title: z.string().max(200).optional(),
  meta_description: z.string().max(500).optional(),

  // Configuración de características
  allow_comments: z.boolean().optional(),
  certificate_enabled: z.boolean().optional(),
  progress_tracking: z.boolean().optional(),
  featured: z.boolean().optional(),
  trial_period_days: z.number().min(0).optional(),

  // Course Objectives
  course_objectives: z
    .array(
      z.object({
        id: z.number().optional(),
        title: z.string().min(1, 'El título del objetivo es requerido'),
        objective_type: z
          .enum(['learning', 'skill', 'knowledge', 'competency'])
          .optional(),
        is_measurable: z.boolean().optional(),
        position: z.number().optional(),
        _destroy: z.boolean().optional(),
      })
    )
    .optional(),

  // Attachments promocionales
  promotional_image_type: z.enum(['file', 'url']),
  promotional_image_file: z.any().optional(),
  promotional_image_url: z
    .string()
    .url('Debe ser una URL válida')
    .optional()
    .or(z.literal('')),

  promotional_video_type: z.enum(['file', 'url']),
  promotional_video_file: z.any().optional(),
  promotional_video_url: z
    .string()
    .url('Debe ser una URL válida')
    .optional()
    .or(z.literal('')),
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

  // Determinar el tipo de attachment existente para imagen
  const existingImageType = course?.promotional_image_url ? 'url' : 'file'
  const existingVideoType = course?.promotional_video_url ? 'url' : 'file'

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      // Información básica
      title: course?.title || '',
      description: course?.description || '',

      // Configuración del curso
      difficulty_level:
        (course?.difficulty_level as
          | 'beginner'
          | 'intermediate'
          | 'advanced') || 'beginner',
      status: (course?.status as 'draft' | 'published' | 'archived') || 'draft',
      category: course?.category || '',
      tags: Array.isArray(course?.tags)
        ? course.tags.join(', ')
        : course?.tags || '',

      // Precio y tipo
      pricing_type:
        (course?.pricing_type as 'free' | 'one_time' | 'subscription') ||
        'free',
      price: String(course?.price || '0'),
      currency: course?.currency || 'COP',
      subscription_price_monthly: String(
        course?.subscription_price_monthly || '0'
      ),
      subscription_price_annual: String(
        course?.subscription_price_annual || '0'
      ),

      // Duración
      duration_minutes: course?.duration_minutes || 0,

      // Información adicional
      prerequisites: course?.prerequisites || '',
      meta_title: course?.meta_title || '',
      meta_description: course?.meta_description || '',

      // Configuración de características
      allow_comments: course?.allow_comments ?? true,
      certificate_enabled: course?.certificate_enabled ?? true,
      progress_tracking: course?.progress_tracking ?? true,
      featured: course?.featured ?? false,
      trial_period_days: course?.trial_period_days || 0,

      // Course Objectives - cargar los existentes
      course_objectives:
        course?.course_objectives?.map((obj: any, index: number) => ({
          id: obj.id,
          title: obj.title,
          objective_type: obj.objective_type,
          is_measurable: obj.is_measurable,
          position: obj.position || index + 1,
          _destroy: false,
        })) || [],

      // Attachments promocionales - cargar los existentes
      promotional_image_type: existingImageType as 'file' | 'url',
      promotional_image_file: undefined,
      promotional_image_url: course?.promotional_image_url || '',

      promotional_video_type: existingVideoType as 'file' | 'url',
      promotional_video_file: undefined,
      promotional_video_url: course?.promotional_video_url || '',
    },
  })

  const pricingType = form.watch('pricing_type')
  const imageType = form.watch('promotional_image_type')
  const videoType = form.watch('promotional_video_type')

  // Watch course objectives for dynamic fields
  const courseObjectives = form.watch('course_objectives') || []

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUrlPreview, setImageUrlPreview] = useState<string | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [videoUrlPreview, setVideoUrlPreview] = useState<string | null>(null)

  // Track original attachment types to detect changes
  // Note: Rails should handle replacing attachments automatically when new data is provided

  // Use the hooks that handle query invalidation
  const createMutation = useCreateCourse(String(academySlug))
  const updateMutation = useUpdateCourse(String(academySlug))

  // Watch for URL changes to update previews
  const imageUrlValue = form.watch('promotional_image_url')
  const videoUrlValue = form.watch('promotional_video_url')

  useEffect(() => {
    if (imageType === 'url' && imageUrlValue) {
      setImageUrlPreview(imageUrlValue)
    } else {
      setImageUrlPreview(null)
    }
  }, [imageUrlValue, imageType])

  useEffect(() => {
    if (videoType === 'url' && videoUrlValue) {
      // Convert YouTube/Vimeo URLs to embeddable format
      setVideoUrlPreview(convertToEmbedUrl(videoUrlValue))
    } else {
      setVideoUrlPreview(null)
    }
  }, [videoUrlValue, videoType])

  const convertToEmbedUrl = (url: string): string => {
    // YouTube
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v')
      return `https://www.youtube.com/embed/${videoId}`
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    // Vimeo
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return `https://player.vimeo.com/video/${videoId}`
    }
    // Return original for direct video URLs
    return url
  }

  const onSubmit = (data: CourseFormData) => {
    // Validar imagen promocional
    if (data.promotional_image_type === 'file') {
      // Solo validar si no hay archivo subido Y no existe imagen en el curso
      if (!data.promotional_image_file && !course?.promotional_image_url) {
        form.setError('promotional_image_file', {
          message: 'Debes subir una imagen',
        })
        return
      }
    } else if (data.promotional_image_type === 'url') {
      // Solo validar si la URL está vacía o es inválida
      if (
        !data.promotional_image_url ||
        data.promotional_image_url.trim() === ''
      ) {
        form.setError('promotional_image_url', {
          message: 'Debes proporcionar una URL de imagen',
        })
        return
      }
    }

    // Validar video promocional
    if (data.promotional_video_type === 'file') {
      // Solo validar si no hay archivo subido Y no existe video en el curso
      if (!data.promotional_video_file && !course?.promotional_video_url) {
        form.setError('promotional_video_file', {
          message: 'Debes subir un video',
        })
        return
      }
    } else if (data.promotional_video_type === 'url') {
      // Solo validar si la URL está vacía o es inválida
      if (
        !data.promotional_video_url ||
        data.promotional_video_url.trim() === ''
      ) {
        form.setError('promotional_video_url', {
          message: 'Debes proporcionar una URL de video',
        })
        return
      }
    }

    // Crear FormData para soportar archivos
    const formData = new FormData()

    // Información básica
    formData.append('course[title]', data.title)
    formData.append('course[description]', data.description)

    // Configuración del curso
    formData.append('course[difficulty_level]', data.difficulty_level)
    formData.append('course[status]', data.status)
    if (data.category) formData.append('course[category]', data.category)
    if (data.tags) formData.append('course[tags]', data.tags)

    // Precio y tipo
    formData.append('course[pricing_type]', data.pricing_type)
    formData.append(
      'course[price]',
      String(data.pricing_type === 'free' ? 0 : Number(data.price || 0))
    )
    formData.append('course[currency]', data.currency || 'COP')

    if (data.pricing_type === 'subscription') {
      formData.append(
        'course[subscription_price_monthly]',
        String(Number(data.subscription_price_monthly || 0))
      )
      formData.append(
        'course[subscription_price_annual]',
        String(Number(data.subscription_price_annual || 0))
      )
    }

    // Duración
    formData.append(
      'course[duration_minutes]',
      String(data.duration_minutes || 0)
    )

    // Información adicional
    if (data.prerequisites)
      formData.append('course[prerequisites]', data.prerequisites)
    if (data.meta_title) formData.append('course[meta_title]', data.meta_title)
    if (data.meta_description)
      formData.append('course[meta_description]', data.meta_description)

    // Configuración de características
    formData.append(
      'course[allow_comments]',
      String(data.allow_comments ?? true)
    )
    formData.append(
      'course[certificate_enabled]',
      String(data.certificate_enabled ?? true)
    )
    formData.append(
      'course[progress_tracking]',
      String(data.progress_tracking ?? true)
    )
    formData.append('course[featured]', String(data.featured ?? false))
    formData.append(
      'course[trial_period_days]',
      String(data.trial_period_days || 0)
    )

    // Course Objectives
    if (data.course_objectives && data.course_objectives.length > 0) {
      data.course_objectives.forEach((objective, index) => {
        if (objective.id) {
          formData.append(
            `course[course_objectives_attributes][${index}][id]`,
            String(objective.id)
          )
          // Para registros existentes, enviar position para mantener el orden
          if (objective.position) {
            formData.append(
              `course[course_objectives_attributes][${index}][position]`,
              String(objective.position)
            )
          }
        }
        // Para nuevos registros (sin id), acts_as_list asigna position automáticamente

        formData.append(
          `course[course_objectives_attributes][${index}][title]`,
          objective.title
        )
        if (objective.objective_type) {
          formData.append(
            `course[course_objectives_attributes][${index}][objective_type]`,
            objective.objective_type
          )
        }
        formData.append(
          `course[course_objectives_attributes][${index}][is_measurable]`,
          String(objective.is_measurable ?? false)
        )
        if (objective._destroy) {
          formData.append(
            `course[course_objectives_attributes][${index}][_destroy]`,
            'true'
          )
        }
      })
    }

    // Imagen promocional
    if (data.promotional_image_type === 'file' && data.promotional_image_file) {
      formData.append(
        'course[promotional_image_attachment][type]',
        'FileAttachment'
      )
      formData.append(
        'course[promotional_image_attachment][attachment_type]',
        'promotional_image'
      )
      formData.append(
        'course[promotional_image_attachment][title]',
        'Imagen Promocional'
      )
      formData.append(
        'course[promotional_image_attachment][file]',
        data.promotional_image_file
      )
    } else if (
      data.promotional_image_type === 'url' &&
      data.promotional_image_url
    ) {
      formData.append(
        'course[promotional_image_attachment][type]',
        'UrlAttachment'
      )
      formData.append(
        'course[promotional_image_attachment][attachment_type]',
        'promotional_image'
      )
      formData.append(
        'course[promotional_image_attachment][title]',
        'Imagen Promocional'
      )
      formData.append(
        'course[promotional_image_attachment][url]',
        data.promotional_image_url
      )
    }

    // Video promocional
    if (data.promotional_video_type === 'file' && data.promotional_video_file) {
      formData.append(
        'course[promotional_video_attachment][type]',
        'FileAttachment'
      )
      formData.append(
        'course[promotional_video_attachment][attachment_type]',
        'promotional_video'
      )
      formData.append(
        'course[promotional_video_attachment][title]',
        'Video Promocional'
      )
      formData.append(
        'course[promotional_video_attachment][file]',
        data.promotional_video_file
      )
    } else if (
      data.promotional_video_type === 'url' &&
      data.promotional_video_url
    ) {
      formData.append(
        'course[promotional_video_attachment][type]',
        'UrlAttachment'
      )
      formData.append(
        'course[promotional_video_attachment][attachment_type]',
        'promotional_video'
      )
      formData.append(
        'course[promotional_video_attachment][title]',
        'Video Promocional'
      )
      formData.append(
        'course[promotional_video_attachment][url]',
        data.promotional_video_url
      )
    }

    if (isEditing) {
      if (!course?.slug && !course?.id) {
        return
      }
      updateMutation.mutate(
        { courseSlug: course.slug || String(course.id), data: formData },
        {
          onSuccess: () => onSuccess(),
        }
      )
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => onSuccess(),
      })
    }
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue('promotional_image_file', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue('promotional_video_file', file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setVideoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImagePreview = () => {
    setImagePreview(null)
    form.setValue('promotional_image_file', undefined)
  }

  const clearVideoPreview = () => {
    setVideoPreview(null)
    form.setValue('promotional_video_file', undefined)
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
            <CardDescription>
              Información general del curso visible para los estudiantes
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Title */}
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ej: Desarrollo Web Completo'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Un título claro y descriptivo para tu curso
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe lo que los estudiantes aprenderán en este curso...'
                      className='min-h-[120px]'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Explica el contenido, objetivos y lo que los estudiantes
                    lograrán
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category and Tags */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ej: Programación, Diseño...'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='tags'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etiquetas</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ej: React, JavaScript, Frontend'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Separadas por comas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Objetivos del Curso */}
        <Card>
          <CardHeader>
            <CardTitle>Objetivos del Curso</CardTitle>
            <CardDescription>
              Define qué aprenderán los estudiantes al completar este curso
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {courseObjectives.map((objective, index) => {
              // No mostrar objetivos marcados para destruir
              if (objective._destroy) {
                return null
              }

              return (
                <div key={index} className='space-y-3 rounded-lg border p-4'>
                  <div className='flex items-start justify-between gap-2'>
                    <div className='flex-1 space-y-3'>
                      <FormField
                        control={form.control}
                        name={`course_objectives.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Objetivo {index + 1}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Ej: Construir aplicaciones web con React'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                        <FormField
                          control={form.control}
                          name={`course_objectives.${index}.objective_type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Selecciona tipo' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value='learning'>
                                    Aprender
                                  </SelectItem>
                                  <SelectItem value='skill'>
                                    Habilidad
                                  </SelectItem>
                                  <SelectItem value='knowledge'>
                                    Conocimiento
                                  </SelectItem>
                                  <SelectItem value='competency'>
                                    Competencia
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`course_objectives.${index}.is_measurable`}
                          render={({ field }) => (
                            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                              <div className='space-y-0.5'>
                                <FormLabel className='text-sm'>
                                  Medible
                                </FormLabel>
                                <FormDescription className='text-xs'>
                                  ¿Es cuantificable?
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => {
                        const objectives =
                          form.getValues('course_objectives') || []
                        const objective = objectives[index]

                        // Si el objetivo tiene ID (existe en el backend), marcarlo para destruir
                        if (isEditing && objective?.id) {
                          const updatedObjectives = [...objectives]
                          updatedObjectives[index] = {
                            ...objective,
                            _destroy: true,
                          }
                          form.setValue('course_objectives', updatedObjectives)
                        } else {
                          // Si es nuevo (sin ID), simplemente quitarlo del array
                          form.setValue(
                            'course_objectives',
                            objectives.filter((_, i) => i !== index)
                          )
                        }
                      }}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              )
            })}

            <Button
              type='button'
              variant='outline'
              onClick={() => {
                const objectives = form.getValues('course_objectives') || []
                // No necesitamos calcular position para nuevos objetivos
                // acts_as_list lo asignará automáticamente
                form.setValue('course_objectives', [
                  ...objectives,
                  {
                    title: '',
                    objective_type: 'learning',
                    is_measurable: false,
                  },
                ])
              }}
              className='w-full'
            >
              + Agregar Objetivo
            </Button>
          </CardContent>
        </Card>

        {/* Configuración del Curso */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración del Curso</CardTitle>
            <CardDescription>
              Define el nivel, estado y duración del curso
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              {/* Difficulty Level */}
              <FormField
                control={form.control}
                name='difficulty_level'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel *</FormLabel>
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

              {/* Status */}
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado *</FormLabel>
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
                        <SelectItem value='archived'>Archivado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration */}
              <FormField
                control={form.control}
                name='duration_minutes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración (minutos)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min='0'
                        placeholder='0'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Se calcula automáticamente
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Prerequisites */}
            <FormField
              control={form.control}
              name='prerequisites'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prerequisitos</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe los conocimientos previos necesarios...'
                      className='min-h-[80px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Precio y Monetización */}
        <Card>
          <CardHeader>
            <CardTitle>Precio y Monetización</CardTitle>
            <CardDescription>
              Define el modelo de precio para tu curso
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Pricing Type */}
            <FormField
              control={form.control}
              name='pricing_type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Precio *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecciona tipo' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='free'>Gratuito</SelectItem>
                      <SelectItem value='one_time'>Pago Único</SelectItem>
                      <SelectItem value='subscription'>Suscripción</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* One-time Price */}
            {pricingType === 'one_time' && (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='price'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio *</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min='0'
                          step='0.01'
                          placeholder='99.99'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='currency'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moneda</FormLabel>
                      <FormControl>
                        <Input placeholder='COP' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Subscription Prices */}
            {pricingType === 'subscription' && (
              <>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='subscription_price_monthly'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio Mensual *</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            min='0'
                            step='0.01'
                            placeholder='29.99'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='subscription_price_annual'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio Anual *</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            min='0'
                            step='0.01'
                            placeholder='299.99'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='trial_period_days'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período de Prueba (días)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min='0'
                          placeholder='7'
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        0 = sin período de prueba
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='currency'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moneda</FormLabel>
                      <FormControl>
                        <Input placeholder='COP' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Características y Opciones */}
        <Card>
          <CardHeader>
            <CardTitle>Características y Opciones</CardTitle>
            <CardDescription>
              Configura las opciones adicionales del curso
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-3'>
              <FormField
                control={form.control}
                name='allow_comments'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        Permitir Comentarios
                      </FormLabel>
                      <FormDescription>
                        Los estudiantes pueden dejar comentarios en las
                        lecciones
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='certificate_enabled'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        Certificado Habilitado
                      </FormLabel>
                      <FormDescription>
                        Generar certificado al completar el curso
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='progress_tracking'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        Seguimiento de Progreso
                      </FormLabel>
                      <FormDescription>
                        Hacer seguimiento del progreso del estudiante
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='featured'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        Curso Destacado
                      </FormLabel>
                      <FormDescription>
                        Mostrar este curso en la página principal
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Material Promocional */}
        <Card>
          <CardHeader>
            <CardTitle>Material Promocional *</CardTitle>
            <CardDescription>
              Agrega una imagen y un video para la página de aterrizaje del
              curso
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Imagen Promocional */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <ImageIcon className='h-5 w-5' />
                <Label className='text-base font-semibold'>
                  Imagen Promocional
                </Label>
              </div>

              <FormField
                control={form.control}
                name='promotional_image_type'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='bg-muted flex h-10 w-full items-center justify-center rounded-lg p-1'>
                        <button
                          type='button'
                          onClick={() => field.onChange('url')}
                          className={cn(
                            'ring-offset-background focus-visible:ring-ring inline-flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
                            field.value === 'url'
                              ? 'bg-background text-foreground shadow-sm'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          <LinkIcon className='h-4 w-4' />
                          URL Externa
                        </button>
                        <button
                          type='button'
                          onClick={() => field.onChange('file')}
                          className={cn(
                            'ring-offset-background focus-visible:ring-ring inline-flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
                            field.value === 'file'
                              ? 'bg-background text-foreground shadow-sm'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          <Upload className='h-4 w-4' />
                          Subir Archivo
                        </button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {imageType === 'url' ? (
                <FormField
                  control={form.control}
                  name='promotional_image_url'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de la Imagen</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='https://ejemplo.com/imagen.jpg'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Puedes usar imágenes de Imgur, Cloudinary, o cualquier
                        CDN
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div className='space-y-2'>
                  <Label>Archivo de Imagen</Label>
                  <div className='flex items-center gap-4'>
                    <Input
                      type='file'
                      accept='image/jpeg,image/png,image/gif,image/webp'
                      onChange={handleImageFileChange}
                      className='cursor-pointer'
                    />
                  </div>
                  <FormDescription>
                    Formatos aceptados: JPG, PNG, GIF, WebP (máx. 100MB)
                  </FormDescription>
                </div>
              )}

              {/* Image Preview */}
              {imageType === 'url' && imageUrlPreview && (
                <div className='bg-muted relative mt-4 flex justify-center overflow-hidden rounded-lg border p-4'>
                  <img
                    src={imageUrlPreview}
                    alt='Vista previa'
                    className='h-auto max-h-96 w-auto max-w-full object-contain'
                    onError={() => setImageUrlPreview(null)}
                  />
                  <div className='absolute top-2 right-2'>
                    <Button
                      type='button'
                      variant='secondary'
                      size='icon'
                      onClick={() => {
                        form.setValue('promotional_image_url', '')
                        setImageUrlPreview(null)
                      }}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              )}

              {imageType === 'file' && imagePreview && (
                <div className='bg-muted relative mt-4 flex justify-center overflow-hidden rounded-lg border p-4'>
                  <img
                    src={imagePreview}
                    alt='Vista previa'
                    className='h-auto max-h-96 w-auto max-w-full object-contain'
                  />
                  <div className='absolute top-2 right-2'>
                    <Button
                      type='button'
                      variant='secondary'
                      size='icon'
                      onClick={clearImagePreview}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Video Promocional */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Video className='h-5 w-5' />
                <Label className='text-base font-semibold'>
                  Video Promocional
                </Label>
              </div>

              <FormField
                control={form.control}
                name='promotional_video_type'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='bg-muted flex h-10 w-full items-center justify-center rounded-lg p-1'>
                        <button
                          type='button'
                          onClick={() => field.onChange('url')}
                          className={cn(
                            'ring-offset-background focus-visible:ring-ring inline-flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
                            field.value === 'url'
                              ? 'bg-background text-foreground shadow-sm'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          <LinkIcon className='h-4 w-4' />
                          URL Externa
                        </button>
                        <button
                          type='button'
                          onClick={() => field.onChange('file')}
                          className={cn(
                            'ring-offset-background focus-visible:ring-ring inline-flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
                            field.value === 'file'
                              ? 'bg-background text-foreground shadow-sm'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          <Upload className='h-4 w-4' />
                          Subir Archivo
                        </button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {videoType === 'url' ? (
                <FormField
                  control={form.control}
                  name='promotional_video_url'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL del Video</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='https://www.youtube.com/watch?v=...'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Soporta YouTube, Vimeo, Google Drive y enlaces directos
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div className='space-y-2'>
                  <Label>Archivo de Video</Label>
                  <div className='flex items-center gap-4'>
                    <Input
                      type='file'
                      accept='video/mp4,video/webm,video/ogg'
                      onChange={handleVideoFileChange}
                      className='cursor-pointer'
                    />
                  </div>
                  <FormDescription>
                    Formatos aceptados: MP4, WebM, OGG (máx. 100MB)
                  </FormDescription>
                </div>
              )}

              {/* Video Preview */}
              {videoType === 'url' && videoUrlPreview && (
                <div className='bg-muted relative mt-4 flex justify-center overflow-hidden rounded-lg border p-4'>
                  <div className='aspect-video w-full max-w-2xl'>
                    {videoUrlPreview.includes('youtube.com/embed') ||
                    videoUrlPreview.includes('player.vimeo.com') ? (
                      <iframe
                        src={videoUrlPreview}
                        title='Vista previa del video'
                        className='h-full w-full rounded-md'
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={videoUrlPreview}
                        controls
                        className='h-full w-full rounded-md object-contain'
                      >
                        Tu navegador no soporta el elemento de video.
                      </video>
                    )}
                  </div>
                  <div className='absolute top-2 right-2'>
                    <Button
                      type='button'
                      variant='secondary'
                      size='icon'
                      onClick={() => {
                        form.setValue('promotional_video_url', '')
                        setVideoUrlPreview(null)
                      }}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              )}

              {videoType === 'file' && videoPreview && (
                <div className='bg-muted relative mt-4 flex justify-center overflow-hidden rounded-lg border p-4'>
                  <div className='aspect-video w-full max-w-2xl'>
                    <video
                      src={videoPreview}
                      controls
                      className='h-full w-full rounded-md object-contain'
                    >
                      Tu navegador no soporta el elemento de video.
                    </video>
                  </div>
                  <div className='absolute top-2 right-2'>
                    <Button
                      type='button'
                      variant='secondary'
                      size='icon'
                      onClick={clearVideoPreview}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SEO (Opcional) */}
        <Card>
          <CardHeader>
            <CardTitle>SEO (Opcional)</CardTitle>
            <CardDescription>
              Optimiza tu curso para motores de búsqueda
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <FormField
              control={form.control}
              name='meta_title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Título</FormLabel>
                  <FormControl>
                    <Input placeholder='Título para SEO' {...field} />
                  </FormControl>
                  <FormDescription>
                    Título optimizado para motores de búsqueda (máx. 60
                    caracteres)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='meta_description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Descripción para SEO'
                      className='min-h-[80px]'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Descripción optimizada para motores de búsqueda (máx. 160
                    caracteres)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Separator />

        {/* Form Actions */}
        <div className='flex justify-end gap-4'>
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
        </div>
      </form>
    </Form>
  )
}
