import { useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Settings,
  Clock,
  DollarSign,
  BarChart3,
  Calendar,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useCourseBySlug } from '@/hooks/use-courses'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { AccessCodeList } from '@/components/access-codes/access-code-list'
import { CourseForm } from '@/components/courses/course-form'

export default function CourseInfoPage() {
  const params = useParams({ strict: false }) as {
    academySlug: string
    courseSlug: string
  }
  const { academySlug, courseSlug } = params
  const { currentAcademy } = useAuthStore()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const academyId = currentAcademy?.id
  const {
    data: course,
    isLoading,
    error,
  } = useCourseBySlug(academyId ? Number(academyId) : 0, courseSlug)

  if (isLoading) {
    return (
      <div className='container mx-auto py-8'>
        <div className='space-y-6'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-32' />
          <Skeleton className='h-64' />
        </div>
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
          <Link
            to='/academy/$academySlug/courses'
            params={{ academySlug }}
            className='mt-4 inline-block'
          >
            <Button variant='outline'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Volver a Cursos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-6'>
        <div className='mb-4 flex items-start justify-between'>
          <div>
            <h1 className='mb-2 text-3xl font-bold'>{course.title}</h1>
            <p className='text-gray-600'>{course.description}</p>
          </div>
          <Button onClick={() => setIsEditDialogOpen(true)}>
            <Settings className='mr-2 h-4 w-4' />
            Editar Curso
          </Button>
        </div>
      </div>

      <div className='grid gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
            <CardDescription>
              Detalles y configuración del curso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-6 md:grid-cols-4'>
              {/* Estado */}
              <div className='flex flex-col'>
                <div className='mb-2 flex items-center gap-2 text-gray-600'>
                  <BarChart3 className='h-4 w-4' />
                  <span className='text-sm font-medium'>Estado</span>
                </div>
                <Badge
                  variant={
                    course.status === 'published' ? 'default' : 'secondary'
                  }
                  className='w-fit'
                >
                  {course.status === 'published'
                    ? 'Publicado'
                    : course.status === 'draft'
                      ? 'Borrador'
                      : 'Archivado'}
                </Badge>
              </div>

              {/* Nivel de Dificultad */}
              <div className='flex flex-col'>
                <div className='mb-2 flex items-center gap-2 text-gray-600'>
                  <BarChart3 className='h-4 w-4' />
                  <span className='text-sm font-medium'>Nivel</span>
                </div>
                <Badge variant='outline' className='w-fit'>
                  {course.difficulty_level === 'beginner'
                    ? 'Principiante'
                    : course.difficulty_level === 'intermediate'
                      ? 'Intermedio'
                      : 'Avanzado'}
                </Badge>
              </div>

              {/* Precio */}
              <div className='flex flex-col'>
                <div className='mb-2 flex items-center gap-2 text-gray-600'>
                  <DollarSign className='h-4 w-4' />
                  <span className='text-sm font-medium'>Precio</span>
                </div>
                <p className='text-lg font-semibold text-green-600'>
                  {course.is_free
                    ? 'Gratis'
                    : `$${Number(course.price).toLocaleString()}`}
                </p>
              </div>

              {/* Duración */}
              <div className='flex flex-col'>
                <div className='mb-2 flex items-center gap-2 text-gray-600'>
                  <Clock className='h-4 w-4' />
                  <span className='text-sm font-medium'>Duración</span>
                </div>
                <p className='text-lg font-semibold'>
                  {Math.floor(course.duration_minutes / 60)}h{' '}
                  {course.duration_minutes % 60}m
                </p>
              </div>
            </div>

            {/* Fechas */}
            <div className='mt-6 grid grid-cols-2 gap-6 border-t pt-6'>
              <div className='flex flex-col'>
                <div className='mb-1 flex items-center gap-2 text-gray-600'>
                  <Calendar className='h-4 w-4' />
                  <span className='text-sm font-medium'>Fecha de creación</span>
                </div>
                <p className='text-sm text-gray-700'>
                  {new Date(course.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className='flex flex-col'>
                <div className='mb-1 flex items-center gap-2 text-gray-600'>
                  <Calendar className='h-4 w-4' />
                  <span className='text-sm font-medium'>
                    Última actualización
                  </span>
                </div>
                <p className='text-sm text-gray-700'>
                  {new Date(course.updated_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {course.thumbnail_url && (
              <div className='mt-6 border-t pt-6'>
                <h4 className='mb-3 text-sm font-medium text-gray-600'>
                  Miniatura del curso
                </h4>
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className='w-full max-w-2xl rounded-lg border shadow-sm'
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Códigos de Acceso</CardTitle>
            <CardDescription>
              Gestiona los códigos de acceso para este curso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccessCodeList courseSlug={course.slug} />
          </CardContent>
        </Card>
      </div>

      {/* Dialog para editar curso */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Editar Curso</DialogTitle>
          </DialogHeader>
          <CourseForm
            academySlug={academySlug}
            course={course}
            onSuccess={() => setIsEditDialogOpen(false)}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
