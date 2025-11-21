import { Link, useParams, useRouter, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  Users,
  BookOpen,
  Star,
  Clock,
  Play,
  ArrowLeft,
  Heart,
  Share2,
  Award,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { useAcademy } from '@/hooks/use-academy'
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
import { toast } from 'sonner'

export function PublicAcademyPage() {
  const { slug } = useParams({ strict: false })
  const router = useRouter()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { isInWishlist, toggleWishlist } = useWishlist()

  // Fetch real academy data from backend
  const {
    academy: backendAcademy,
    loading,
    error,
    refetch,
  } = useAcademy(slug || '')

  // Show loading state
  if (loading) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='text-primary mx-auto h-12 w-12 animate-spin' />
          <p className='text-muted-foreground mt-4'>Cargando academia...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !backendAcademy) {
    return (
      <div className='bg-background min-h-screen'>
        <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur'>
          <div className='container flex h-16 items-center justify-between'>
            <Button variant='ghost' size='sm' onClick={() => router.history.back()}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Volver
            </Button>
          </div>
        </header>
        <div className='container py-20'>
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              {error || 'No se encontró la academia'}
              <Button
                variant='outline'
                size='sm'
                onClick={() => refetch()}
                className='ml-4'
              >
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Adapt backend data to component format with defaults for missing fields
  const academy = {
    id: backendAcademy.id,
    name: backendAcademy.name,
    slug: backendAcademy.slug,
    description: backendAcademy.description,
    instructor: {
      name: backendAcademy.creator?.name || 'Instructor',
      bio: 'Instructor experto dedicado a compartir conocimientos de calidad.', // TODO: Add bio field to backend
      avatar:
        'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', // TODO: Add avatar field to backend
    },
    students: backendAcademy.enrolled_users_count || 0,
    rating: 4.5, // TODO: Implement rating system in backend
    totalRatings: 0, // TODO: Implement rating system in backend
    coursesCount: backendAcademy.courses_count || 0,
    image:
      backendAcademy.logo_url ||
      'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=400&dpr=2',
    category: 'Educación', // TODO: Add category field to backend response
    tags: [], // TODO: Add tags field to backend
    createdAt: '2024', // TODO: Add created_at to backend response
    totalHours: backendAcademy.courses
      ? Math.round(
          backendAcademy.courses.reduce(
            (sum, course) => sum + course.duration_minutes,
            0
          ) / 60
        )
      : 0,
  }

  // Helper functions
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

  // Use real courses from backend or show empty state
  const courses = backendAcademy.courses || []

  // Check if academy is in wishlist
  const isSaved = isInWishlist('academy', academy.id)

  // Handle save button click
  const handleSaveClick = () => {
    if (!isAuthenticated) {
      toast.info('Inicia sesión para guardar academias')
      navigate({ to: '/sign-in' })
      return
    }

    const added = toggleWishlist('academy', academy.id, academy.slug, academy.name)
    if (added) {
      toast.success(`${academy.name} guardada en tu lista`)
    } else {
      toast.info(`${academy.name} removida de tu lista`)
    }
  }

  // Handle share button click
  const handleShareClick = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: academy.name,
          text: academy.description,
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
      {/* Header */}
      <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur'>
        <div className='container flex h-16 items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Button variant='ghost' size='sm' onClick={() => router.history.back()}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Volver
            </Button>
          </div>

          <motion.div
            className='flex items-center space-x-2'
            whileHover={{ scale: 1.05 }}
          >
            <GraduationCap className='text-primary h-6 w-6' />
            <span className='font-bold'>ISWO Academy</span>
          </motion.div>

          <div className='flex items-center space-x-4'>
            <Button variant='ghost' asChild>
              <Link to='/sign-in'>Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link to='/sign-up'>Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero de la Academia */}
      <section className='relative overflow-hidden'>
        <div className='absolute inset-0'>
          <img
            src={academy.image}
            alt={academy.name}
            className='h-full w-full object-cover'
          />
          <div className='absolute inset-0 bg-black/60' />
        </div>

        <div className='relative z-10 container py-20 lg:py-32'>
          <div className='max-w-4xl'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant='secondary' className='mb-4'>
                {academy.category}
              </Badge>

              <h1 className='text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl'>
                {academy.name}
              </h1>

              <p className='mt-6 max-w-3xl text-lg leading-8 text-gray-200 sm:text-xl'>
                {academy.description}
              </p>

              <div className='mt-8 flex flex-wrap items-center gap-6 text-white'>
                {academy.instructor.name && (
                  <div className='flex items-center space-x-2'>
                    <img
                      src={academy.instructor.avatar}
                      alt={academy.instructor.name}
                      className='h-10 w-10 rounded-full'
                    />
                    <div>
                      <p className='font-medium'>
                        Por {academy.instructor.name}
                      </p>
                    </div>
                  </div>
                )}

                {academy.rating > 0 && (
                  <div className='flex items-center space-x-1'>
                    <Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
                    <span className='font-medium'>{academy.rating}</span>
                    {academy.totalRatings > 0 && (
                      <span className='text-gray-300'>
                        ({academy.totalRatings} reseñas)
                      </span>
                    )}
                  </div>
                )}

                <div className='flex items-center space-x-1'>
                  <Users className='h-5 w-5' />
                  <span>{academy.students.toLocaleString()} estudiantes</span>
                </div>

                <div className='flex items-center space-x-1'>
                  <BookOpen className='h-5 w-5' />
                  <span>{academy.coursesCount} cursos</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Información de la Academia */}
      <section className='border-b py-16'>
        <div className='container'>
          <div className='grid gap-12 lg:grid-cols-3'>
            {/* Información principal */}
            <div className='space-y-8 lg:col-span-2'>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className='mb-4 text-2xl font-bold'>Sobre esta academia</h2>
                <p className='text-muted-foreground leading-relaxed'>
                  {academy.description}
                </p>

                {academy.tags && academy.tags.length > 0 && (
                  <div className='mt-6 flex flex-wrap gap-2'>
                    {academy.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant='outline'>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </motion.div>

              {academy.instructor.name && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h2 className='mb-6 text-2xl font-bold'>
                    Conoce a tu instructor
                  </h2>
                  <div className='flex items-start space-x-4'>
                    <img
                      src={academy.instructor.avatar}
                      alt={academy.instructor.name}
                      className='h-16 w-16 rounded-full'
                    />
                    <div>
                      <h3 className='text-xl font-semibold'>
                        {academy.instructor.name}
                      </h3>
                      <p className='text-muted-foreground mt-2 leading-relaxed'>
                        {academy.instructor.bio}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar con estadísticas */}
            <div className='space-y-6'>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Esta academia incluye</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {academy.totalHours > 0 && (
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                          <Clock className='text-muted-foreground h-4 w-4' />
                          <span className='text-sm'>Contenido total</span>
                        </div>
                        <span className='font-medium'>
                          {academy.totalHours} horas
                        </span>
                      </div>
                    )}

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <BookOpen className='text-muted-foreground h-4 w-4' />
                        <span className='text-sm'>Cursos</span>
                      </div>
                      <span className='font-medium'>
                        {academy.coursesCount}
                      </span>
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <Users className='text-muted-foreground h-4 w-4' />
                        <span className='text-sm'>Estudiantes</span>
                      </div>
                      <span className='font-medium'>
                        {academy.students.toLocaleString()}
                      </span>
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <Award className='text-muted-foreground h-4 w-4' />
                        <span className='text-sm'>Certificado</span>
                      </div>
                      <span className='font-medium'>Incluido</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <div className='flex space-x-2'>
                <Button 
                  variant={isSaved ? 'default' : 'outline'} 
                  size='sm' 
                  className='flex-1'
                  onClick={handleSaveClick}
                >
                  <Heart className={`mr-2 h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Guardada' : 'Guardar'}
                </Button>
                <Button 
                  variant='outline' 
                  size='sm' 
                  className='flex-1'
                  onClick={handleShareClick}
                >
                  <Share2 className='mr-2 h-4 w-4' />
                  Compartir
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cursos de la Academia */}
      <section className='py-16'>
        <div className='container'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='mb-12 text-center'
          >
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
              Cursos disponibles ({courses.length})
            </h2>
            <p className='text-muted-foreground mt-4 text-lg'>
              Explora todo el contenido disponible en esta academia
            </p>
          </motion.div>

          {courses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='py-16 text-center'
            >
              <BookOpen className='text-muted-foreground mx-auto mb-4 h-16 w-16' />
              <h3 className='mb-2 text-xl font-semibold'>
                Aún no hay cursos disponibles
              </h3>
              <p className='text-muted-foreground mx-auto mb-6 max-w-md'>
                Esta academia está preparando contenido increíble. Regresa
                pronto para ver los nuevos cursos.
              </p>
              <Button variant='outline' asChild>
                <Link to='/academies'>Ver otras academias</Link>
              </Button>
            </motion.div>
          ) : (
            <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Link
                    to='/courses/$courseSlug'
                    params={{ courseSlug: course.slug }}
                  >
                    <Card className='group h-full cursor-pointer overflow-hidden'>
                      <div className='relative'>
                        <img
                          src={
                            course.thumbnail_url ||
                            'https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2'
                          }
                          alt={course.title}
                          className='h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105'
                        />
                        <div className='absolute top-4 left-4'>
                          <Badge variant='secondary'>
                            {formatDifficulty(course.difficulty_level)}
                          </Badge>
                        </div>
                        <div className='absolute top-4 right-4'>
                          <div className='rounded bg-black/70 px-2 py-1 text-sm font-medium text-white'>
                            {course.is_free
                              ? 'Gratis'
                              : formatPrice(course.price)}
                          </div>
                        </div>
                        <div className='absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20'>
                          <Play className='h-12 w-12 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className='line-clamp-2'>
                          {course.title}
                        </CardTitle>
                        <CardDescription className='line-clamp-2'>
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className='space-y-4'>
                          <div className='flex items-center justify-between text-sm'>
                            <div className='flex items-center space-x-4'>
                              <div className='flex items-center space-x-1'>
                                <Clock className='text-muted-foreground h-4 w-4' />
                                <span>
                                  {course.duration_minutes > 0
                                    ? `${Math.round(course.duration_minutes / 60)}h`
                                    : 'Pronto'}
                                </span>
                              </div>
                              <div className='flex items-center space-x-1'>
                                <BookOpen className='text-muted-foreground h-4 w-4' />
                                <span>
                                  {course.is_published
                                    ? 'Disponible'
                                    : 'Próximamente'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className='flex items-center justify-between text-sm'>
                            <div className='text-muted-foreground text-sm'>
                              Por {course.creator.name}
                            </div>
                            <div className='flex items-center space-x-1'>
                              <Users className='text-muted-foreground h-4 w-4' />
                              <span>{course.enrollment_count} estudiantes</span>
                            </div>
                          </div>
                          <Button className='w-full'>
                            Ver detalles del curso
                            <Play className='ml-2 h-4 w-4' />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer simple */}
      <footer className='bg-muted/50 border-t'>
        <div className='container py-8'>
          <div className='flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0'>
            <div className='flex items-center space-x-2'>
              <GraduationCap className='text-primary h-6 w-6' />
              <span className='font-bold'>ISWO Academy</span>
            </div>
            <p className='text-muted-foreground text-sm'>
              © 2025 ISWO Academy. Todos los derechos reservados.
            </p>
            <div className='flex items-center space-x-4'>
              <Button size='sm' variant='ghost' asChild>
                <Link to='/sign-in'>Iniciar Sesión</Link>
              </Button>
              <Button size='sm' asChild>
                <Link to='/sign-up'>Registrarse</Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
