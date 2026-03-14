import { useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useCourse } from '@/hooks/use-courses'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CourseForm } from '@/components/courses'

export default function CourseEditPage() {
  const navigate = useNavigate()
  const { academySlug, courseSlug } = useParams({ strict: false }) as {
    academySlug: string
    courseSlug: string
  }
  const { data: course, isLoading, error } = useCourse(courseSlug)

  const handleSuccess = () => {
    navigate({
      to: '/academy/$academySlug/courses/$courseSlug/info',
      params: { academySlug, courseSlug },
    })
  }

  const handleCancel = () => {
    navigate({
      to: '/academy/$academySlug/courses/$courseSlug/info',
      params: { academySlug, courseSlug },
    })
  }

  if (isLoading) {
    return (
      <div className='container pb-8'>
        <div className='space-y-6'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-96 w-full' />
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className='container py-8'>
        <div className='py-12 text-center'>
          <h3 className='mb-2 text-lg font-bold text-red-600'>
            Error al Cargar el Curso
          </h3>
          <p className='text-muted-foreground'>
            Curso no encontrado o no tienes permiso para editarlo
          </p>
          <Button variant='outline' onClick={handleCancel} className='mt-4'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Volver
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='container pb-8'>
      {/* Header */}
      <div className='mb-8'>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleCancel}
          className='mb-4'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Volver a Información del Curso
        </Button>
        <h1 className='text-3xl font-bold tracking-tight'>
          Editar Curso: {course.title}
        </h1>
        <p className='text-muted-foreground mt-2'>
          Actualiza la información del curso
        </p>
      </div>

      {/* Form */}
      <div className='max-w-4xl'>
        <CourseForm
          academySlug={academySlug}
          course={course}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
