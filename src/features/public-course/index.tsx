import { useParams, useNavigate } from '@tanstack/react-router'
import { Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { useCourseBySlug } from '@/hooks/use-featured-content'
import { useWishlist } from '@/hooks/use-wishlist'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Header } from '@/features/home/components/header'
import {
  CourseHeader,
  CourseHero,
  CourseContent,
  CourseSidebar,
  CourseInstructor,
} from './components'

export function PublicCoursePage() {
  const { courseSlug } = useParams({ strict: false })
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const {
    data: courseData,
    isLoading,
    isError,
    refetch,
  } = useCourseBySlug(courseSlug || '')

  // Loading state
  if (isLoading) {
    return (
      <div className='bg-background min-h-screen'>
        <Header />
        <div className='container py-16'>
          <div className='flex min-h-[400px] flex-col items-center justify-center'>
            <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
            <p className='text-muted-foreground mt-4'>Cargando curso...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (isError || !courseData) {
    return (
      <div className='bg-background min-h-screen'>
        <Header />
        <div className='container py-16'>
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              Error al cargar el curso.{' '}
              <Button variant='outline' size='sm' onClick={() => refetch()}>
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Enhanced course data with mock data for missing fields
  const enhancedCourse = {
    ...courseData,
    // Mock data for UI until backend provides these fields
    longDescription: courseData.description,
    instructor: {
      name: courseData.creator?.name || 'Instructor',
      bio: 'Instructor experto con amplia experiencia en la industria.',
      avatar:
        'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 4.8,
      courses: 5,
      students: courseData.enrollment_count || 100,
    },
    thumbnail_url:
      courseData.thumbnail_url ||
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=400&dpr=2',
    rating: 4.8,
    total_ratings: Math.max(
      Math.floor((courseData.enrollment_count || 0) * 0.3),
      10
    ),
    tags: ['Desarrollo', 'Programación'],
    requirements: [
      'Conocimientos básicos del tema',
      'Ganas de aprender',
      'Computadora con acceso a internet',
    ],
    whatYoullLearn: [
      'Fundamentos del tema',
      'Técnicas avanzadas',
      'Aplicaciones prácticas',
      'Mejores prácticas de la industria',
    ],
    sections:
      courseData.duration_minutes > 0
        ? [
            {
              id: 1,
              title: 'Introducción',
              lessons: 5,
              duration: Math.round(courseData.duration_minutes * 0.2),
            },
            {
              id: 2,
              title: 'Contenido Principal',
              lessons: 10,
              duration: Math.round(courseData.duration_minutes * 0.5),
            },
            {
              id: 3,
              title: 'Proyectos Prácticos',
              lessons: 8,
              duration: Math.round(courseData.duration_minutes * 0.3),
            },
          ]
        : [
            {
              id: 1,
              title: 'Próximamente',
              lessons: 0,
              duration: 0,
            },
          ],
  }

  // Utility functions
  const formatPrice = (priceString: string) => {
    const price = parseFloat(priceString)
    return `$${(price / 1000).toFixed(0)}k`
  }

  const formatDifficulty = (level: string) => {
    const levels = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
    }
    return levels[level as keyof typeof levels] || level
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Check if course is in wishlist
  const isSaved = isInWishlist('course', courseData.id)

  // Handle save button click
  const handleSaveClick = () => {
    if (!isAuthenticated) {
      toast.info('Inicia sesión para guardar cursos')
      navigate({ to: '/sign-in' })
      return
    }

    const added = toggleWishlist(
      'course',
      courseData.id,
      courseData.slug,
      courseData.title
    )
    if (added) {
      toast.success(`${courseData.title} guardado en tu lista`)
    } else {
      toast.info(`${courseData.title} removido de tu lista`)
    }
  }

  // Handle share button click
  const handleShareClick = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: courseData.title,
          text: courseData.description,
          url: url,
        })
      } catch (_err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        toast.success('Enlace copiado al portapapeles')
      } catch (_err) {
        toast.error('No se pudo copiar el enlace')
      }
    }
  }

  return (
    <div className='bg-background min-h-screen'>
      <Header />

      {courseData.academy && (
        <CourseHeader
          academy={courseData.academy}
          courseTitle={courseData.title}
        />
      )}

      <CourseHero
        course={enhancedCourse}
        getDifficultyColor={getDifficultyColor}
        formatDifficulty={formatDifficulty}
      />

      <div className='container pb-8'>
        <div className='grid gap-8 lg:grid-cols-3'>
          <div className='space-y-8 lg:col-span-2'>
            <CourseContent course={enhancedCourse} />
            <CourseInstructor instructor={enhancedCourse.instructor} />
          </div>

          <CourseSidebar
            course={enhancedCourse}
            isSaved={isSaved}
            onSaveClick={handleSaveClick}
            onShareClick={handleShareClick}
            formatPrice={formatPrice}
            formatDifficulty={formatDifficulty}
          />
        </div>
      </div>
    </div>
  )
}
