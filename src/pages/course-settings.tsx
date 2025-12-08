import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Save, Trash2, Archive } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import {
  useCourseBySlug,
  useUpdateCourse,
  useDeleteCourse,
} from '@/hooks/use-courses'
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
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'

const settingsSchema = z.object({
  is_published: z.boolean(),
  is_free: z.boolean(),
  certificate_enabled: z.boolean(),
  allow_comments: z.boolean(),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

export default function CourseSettingsPage() {
  const params = useParams({ strict: false }) as {
    academySlug: string
    courseSlug: string
  }
  const { academySlug, courseSlug } = params
  const { currentAcademy } = useAuthStore()
  const navigate = useNavigate()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)

  const academyId = currentAcademy?.id
  const {
    data: course,
    isLoading,
    error,
  } = useCourseBySlug(academyId ? Number(academyId) : 0, courseSlug)
  const updateCourse = useUpdateCourse(academySlug)
  const deleteCourse = useDeleteCourse(academySlug)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      is_published: false,
      is_free: false,
      certificate_enabled: false,
      allow_comments: true,
    },
  })

  // Reset form when course data loads
  useEffect(() => {
    if (course) {
      form.reset({
        is_published: course.status === 'published',
        is_free: course.is_free || false,
        certificate_enabled: course.certificate_enabled || false,
        allow_comments: course.allow_comments !== false,
      })
    }
  }, [course, form])

  const onSubmit = async (values: SettingsFormValues) => {
    if (!course) return

    const updateData = {
      status: (values.is_published ? 'published' : 'draft') as
        | 'published'
        | 'draft',
      is_free: values.is_free,
      certificate_enabled: values.certificate_enabled,
      allow_comments: values.allow_comments,
    }

    await updateCourse.mutateAsync({
      courseSlug: courseSlug,
      data: updateData,
    })
  }

  const handleDelete = async () => {
    if (!course) return

    await deleteCourse.mutateAsync(courseSlug)
    setDeleteDialogOpen(false)
    navigate({ to: `/academy/${academySlug}/courses` })
  }

  const handleArchive = async () => {
    if (!course) return

    await updateCourse.mutateAsync({
      courseSlug: courseSlug,
      data: { status: 'archived' },
    })
    setArchiveDialogOpen(false)
  }

  if (isLoading) {
    return (
      <div className='container mx-auto py-8'>
        <Skeleton className='h-64' />
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className='container mx-auto py-8'>
        <div className='py-12 text-center'>
          <h3 className='mb-2 text-lg font-bold text-red-600'>
            Error al Cargar el Curso
          </h3>
          <p className='text-gray-600'>
            Curso no encontrado o no tienes permiso para acceder
          </p>
          <a
            href={`/academy/${academySlug}/courses`}
            className='mt-4 inline-block'
          >
            <Button variant='outline'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Volver a Cursos
            </Button>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-6'>
        <a href={`/academy/${academySlug}/courses/${courseSlug}`}>
          <Button variant='ghost' size='sm' className='mb-4'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Volver al Curso
          </Button>
        </a>
        <h1 className='mb-2 text-3xl font-bold'>{course.title}</h1>
        <p className='text-gray-600'>
          Ajustes avanzados y configuración del curso
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Curso</CardTitle>
              <CardDescription>
                Gestiona la visibilidad y opciones del curso
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <h4 className='mb-4 text-sm font-medium'>
                  Visibilidad y Acceso
                </h4>
                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='is_published'
                    render={({ field }) => (
                      <FormItem className='flex items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>
                            Publicar Curso
                          </FormLabel>
                          <FormDescription>
                            Hacer el curso visible para estudiantes
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='is_free'
                    render={({ field }) => (
                      <FormItem className='flex items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>
                            Curso Gratuito
                          </FormLabel>
                          <FormDescription>
                            Los estudiantes pueden acceder sin pagar
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h4 className='mb-4 text-sm font-medium'>Opciones del Curso</h4>
                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='certificate_enabled'
                    render={({ field }) => (
                      <FormItem className='flex items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>
                            Certificado de Finalización
                          </FormLabel>
                          <FormDescription>
                            Otorgar certificado al completar el curso
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='allow_comments'
                    render={({ field }) => (
                      <FormItem className='flex items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>
                            Permitir Comentarios
                          </FormLabel>
                          <FormDescription>
                            Los estudiantes pueden comentar en las lecciones
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className='border-t pt-4'>
                <Button
                  type='submit'
                  className='w-full'
                  disabled={updateCourse.isPending}
                >
                  <Save className='mr-2 h-4 w-4' />
                  {updateCourse.isPending ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      <Card className='mt-6 border-red-200'>
        <CardHeader>
          <CardTitle className='text-red-600'>Zona de Peligro</CardTitle>
          <CardDescription>Acciones irreversibles del curso</CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='flex items-center justify-between rounded-lg border border-red-200 p-3'>
            <div>
              <p className='font-medium'>Archivar Curso</p>
              <p className='text-sm text-gray-600'>
                El curso no será visible pero se conservarán los datos
              </p>
            </div>
            <Button
              variant='outline'
              className='border-red-200 text-red-600 hover:bg-red-50'
              onClick={() => setArchiveDialogOpen(true)}
            >
              <Archive className='mr-2 h-4 w-4' />
              Archivar
            </Button>
          </div>
          <div className='flex items-center justify-between rounded-lg border border-red-200 p-3'>
            <div>
              <p className='font-medium'>Eliminar Curso</p>
              <p className='text-sm text-gray-600'>
                Eliminar permanentemente el curso y todo su contenido
              </p>
            </div>
            <Button
              variant='destructive'
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Eliminar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Archive Dialog */}
      <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Archivar curso?</AlertDialogTitle>
            <AlertDialogDescription>
              El curso "{course?.title}" será archivado y no será visible para
              los estudiantes. Podrás restaurarlo más tarde. Los estudiantes
              actuales conservarán su acceso.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchive}
              className='bg-orange-600 hover:bg-orange-700'
            >
              Archivar Curso
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Eliminar curso permanentemente?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El curso "{course?.title}",
              todas sus lecciones, evaluaciones y datos de estudiantes serán
              eliminados permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-red-600 hover:bg-red-700'
            >
              Eliminar Permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
