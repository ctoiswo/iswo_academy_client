import { Link, useParams, useRouter, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Clock,
  Users,
  Star,
  Play,
  BookOpen,
  Share2,
  Heart,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { useCourseBySlug } from '@/hooks/use-featured-content'
import { useWishlist } from '@/hooks/use-wishlist'
import { useAuthStore } from '@/stores/auth-store'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PublicHeader } from '@/components/layout/public-header'
import { toast } from 'sonner'

export function PublicCoursePage() {
  const { courseSlug } = useParams({ strict: false })
  const router = useRouter()
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
        <PublicHeader />
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
        <PublicHeader />
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

  // Combinar datos reales del backend con datos mock para campos no disponibles aún
  const course = {
    ...courseData,
    // Datos mock temporales hasta que estén disponibles en el backend
    longDescription: courseData.description,
    instructor: {
      name: courseData.creator.name,
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
    total_ratings: Math.max(Math.floor(courseData.enrollment_count * 0.3), 10),
    category: 'Cursos',
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

    const added = toggleWishlist('course', courseData.id, courseData.slug, courseData.title)
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
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        toast.success('Enlace copiado al portapapeles')
      } catch (err) {
        toast.error('No se pudo copiar el enlace')
      }
    }
  }

  return (
    <div className='bg-background min-h-screen'>
      <PublicHeader />

      {/* Breadcrumb */}
      <div className='bg-muted/30 border-b'>
        <div className='container py-4'>
          <div className='flex items-center gap-2 text-sm'>
            <Link
              to='/courses'
              className='text-muted-foreground hover:text-foreground'
            >
              Cursos
            </Link>
            <span className='text-muted-foreground'>•</span>
            <Link
              to='/academies/$slug'
              params={{ slug: courseData.academy.slug }}
              className='text-muted-foreground hover:text-foreground'
            >
              {courseData.academy.name}
            </Link>
            <span className='text-muted-foreground'>•</span>
            <span className='text-muted-foreground'>{courseData.title}</span>
          </div>
        </div>
      </div>

      <div className='container py-8'>
        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='space-y-8 lg:col-span-2'>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <button
                onClick={() => router.history.back()}
                className='text-muted-foreground hover:text-foreground group mb-6 inline-flex items-center'
              >
                <ArrowLeft className='mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1' />
                Volver
              </button>

              <div className='mb-4 flex flex-wrap items-center gap-3'>
                <Badge className={getDifficultyColor(course.difficulty_level)}>
                  {formatDifficulty(course.difficulty_level)}
                </Badge>
                <Badge variant='outline'>{courseData.academy.name}</Badge>
                {course.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant='secondary'>
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className='text-foreground mb-4 text-3xl font-bold lg:text-4xl'>
                {course.title}
              </h1>

              <p className='text-muted-foreground mb-6 text-lg leading-relaxed'>
                {course.description}
              </p>

              <div className='flex flex-wrap items-center gap-6 text-sm'>
                <div className='flex items-center gap-2'>
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className='h-8 w-8 rounded-full'
                  />
                  <span>
                    Por{' '}
                    <span className='font-medium'>
                      {course.instructor.name}
                    </span>
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <Star className='h-4 w-4 fill-current text-yellow-500' />
                  <span className='font-medium'>{course.rating}</span>
                  <span className='text-muted-foreground'>
                    ({course.total_ratings})
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <Users className='text-muted-foreground h-4 w-4' />
                  <span>
                    {course.enrollment_count.toLocaleString()} estudiantes
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <Clock className='text-muted-foreground h-4 w-4' />
                  <span>{Math.round(course.duration_minutes / 60)} horas</span>
                </div>
              </div>
            </motion.div>

            {/* Course Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='relative overflow-hidden rounded-xl'
            >
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className='h-64 w-full object-cover lg:h-80'
              />
              <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
                <Button
                  size='lg'
                  className='bg-white/90 text-black hover:bg-white'
                >
                  <Play className='mr-2 h-5 w-5' />
                  Vista previa del curso
                </Button>
              </div>
            </motion.div>

            {/* What you'll learn */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BookOpen className='h-5 w-5' />
                    Lo que aprenderás
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-3 md:grid-cols-2'>
                    {course.whatYoullLearn.map((item, index) => (
                      <div key={index} className='flex items-start gap-2'>
                        <div className='mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-500' />
                        <span className='text-sm'>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Course Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Contenido del curso</CardTitle>
                  <CardDescription>
                    {course.sections.length} secciones •{' '}
                    {course.sections.reduce((sum, s) => sum + s.lessons, 0)}{' '}
                    lecciones • {Math.round(course.duration_minutes / 60)} horas
                    de contenido
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {course.sections.map((section, index) => (
                    <div key={section.id} className='rounded-lg border p-4'>
                      <div className='flex items-center justify-between'>
                        <h4 className='font-medium'>
                          {index + 1}. {section.title}
                        </h4>
                        <div className='text-muted-foreground text-sm'>
                          {section.lessons} lecciones •{' '}
                          {Math.round(section.duration / 60)}h
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Requisitos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    {course.requirements.map((req, index) => (
                      <div key={index} className='flex items-start gap-2'>
                        <div className='mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500' />
                        <span className='text-sm'>{req}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Instructor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex items-start gap-4'>
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className='h-16 w-16 rounded-full'
                    />
                    <div className='flex-1'>
                      <h4 className='mb-1 text-lg font-medium'>
                        {course.instructor.name}
                      </h4>
                      <div className='text-muted-foreground mb-3 flex items-center gap-4 text-sm'>
                        <div className='flex items-center gap-1'>
                          <Star className='h-4 w-4 fill-current text-yellow-500' />
                          <span>{course.instructor.rating}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Users className='h-4 w-4' />
                          <span>
                            {course.instructor.students.toLocaleString()}{' '}
                            estudiantes
                          </span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <BookOpen className='h-4 w-4' />
                          <span>{course.instructor.courses} cursos</span>
                        </div>
                      </div>
                      <p className='text-muted-foreground text-sm leading-relaxed'>
                        {course.instructor.bio}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='sticky top-8'
            >
              <Card className='shadow-lg'>
                <CardContent className='p-6'>
                  <div className='mb-6 text-center'>
                    <div className='mb-2 text-3xl font-bold'>
                      {course.is_free ? (
                        <span className='text-green-600'>Gratis</span>
                      ) : (
                        <span>{formatPrice(course.price)}</span>
                      )}
                    </div>
                    <p className='text-muted-foreground text-sm'>
                      Acceso completo de por vida
                    </p>
                  </div>

                  <div className='mb-6 space-y-4'>
                    <Button className='w-full' size='lg'>
                      <Play className='mr-2 h-4 w-4' />
                      Inscribirse al curso
                    </Button>

                    <div className='flex gap-2'>
                      <Button 
                        variant={isSaved ? 'default' : 'outline'} 
                        size='sm' 
                        className='flex-1'
                        onClick={handleSaveClick}
                      >
                        <Heart className={`mr-1 h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                        {isSaved ? 'Guardado' : 'Guardar'}
                      </Button>
                      <Button 
                        variant='outline' 
                        size='sm' 
                        className='flex-1'
                        onClick={handleShareClick}
                      >
                        <Share2 className='mr-1 h-4 w-4' />
                        Compartir
                      </Button>
                    </div>
                  </div>

                  <div className='space-y-3 text-sm'>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Nivel:</span>
                      <span>{formatDifficulty(course.difficulty_level)}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Duración:</span>
                      <span>
                        {Math.round(course.duration_minutes / 60)} horas
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Lecciones:</span>
                      <span>
                        {course.sections.reduce((sum, s) => sum + s.lessons, 0)}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Idioma:</span>
                      <span>Español</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Acceso:</span>
                      <span>De por vida</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
