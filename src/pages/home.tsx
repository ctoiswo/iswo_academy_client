import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  Search,
  BookOpen,
  Users,
  Clock,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import {
  useFeaturedAcademies,
  useAcademyCategories,
  useFeaturedCourses,
} from '@/hooks/use-featured-content'
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
import { Input } from '@/components/ui/input'
import { PublicHeader } from '@/components/layout/public-header'

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  // Fetch categories and featured content from backend
  const categoriesQuery = useAcademyCategories()
  const {
    data: academiesByCategory,
    isLoading,
    isError,
    refetch,
  } = useFeaturedAcademies(selectedCategory || undefined)

  // Fetch courses organized by categories from backend
  const coursesByCategoriesQuery = useFeaturedCourses(
    selectedCategory || undefined
  )
  const coursesByCategories = coursesByCategoriesQuery.data || []

  // Helper function to format price from string
  const formatPrice = (priceString: string) => {
    const price = parseFloat(priceString)
    return `$${(price / 1000).toFixed(0)}k`
  }

  // Helper function to format difficulty level
  const formatDifficulty = (level: string) => {
    const levels = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
    }
    return levels[level as keyof typeof levels] || level
  }

  // Helper function to generate course slug
  const generateCourseSlug = (course: any) => {
    if (course.slug) return course.slug
    // Generate slug from title and id
    const titleSlug = course.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    return `${titleSlug}-${course.id}`
  }

  // Create categories array with "Todas" option plus real categories
  const allCategories = [
    { id: null, name: 'Todas las categorías', slug: 'all' },
    ...(categoriesQuery.data || []).map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    })),
  ]

  return (
    <div className='bg-background min-h-screen'>
      <PublicHeader />

      {/* Hero Section */}
      <section className='relative overflow-hidden py-20 lg:py-32'>
        <div className='absolute inset-0 z-0'>
          <img
            src='https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            alt='Estudiantes aprendiendo'
            className='h-full w-full object-cover opacity-10'
          />
          <div className='from-background/80 to-background/60 absolute inset-0 bg-gradient-to-br' />
        </div>

        <div className='relative z-10 container'>
          <div className='mx-auto max-w-4xl text-center'>
            <motion.h1
              className='text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Descubre tu próxima
              <span className='text-primary'> oportunidad de aprendizaje</span>
            </motion.h1>

            <motion.p
              className='text-muted-foreground mt-6 text-lg leading-8 sm:text-xl'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Explora miles de cursos creados por expertos en academias
              especializadas. Aprende nuevas habilidades y haz crecer tu carrera
              profesional.
            </motion.p>

            <motion.div
              className='mx-auto mt-10 max-w-2xl'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className='flex gap-4'>
                <div className='relative flex-1'>
                  <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                  <Input
                    type='text'
                    placeholder='¿Qué quieres aprender hoy?'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='h-12 pl-10 text-lg'
                  />
                </div>
                <Button size='lg' className='h-12 px-8'>
                  <Search className='mr-2 h-4 w-4' />
                  Buscar
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className='bg-muted/50 border-b py-12'>
        <div className='container'>
          {categoriesQuery.isLoading ? (
            <div className='flex items-center justify-center py-4'>
              <Loader2 className='h-6 w-6 animate-spin' />
              <span className='text-muted-foreground ml-2'>
                Cargando categorías...
              </span>
            </div>
          ) : (
            <div className='flex flex-wrap justify-center gap-4'>
              {allCategories.map((category, index) => (
                <motion.button
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-full px-6 py-3 text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-muted border'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Academies */}
      <section className='py-20'>
        <div className='container'>
          <motion.div
            className='mb-16 text-center'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
              Academias Destacadas
            </h2>
            <p className='text-muted-foreground mt-4 text-lg'>
              Descubre las mejores academias especializadas en diferentes áreas
            </p>
          </motion.div>

          {isLoading ? (
            <div className='col-span-full flex items-center justify-center py-12'>
              <Loader2 className='h-8 w-8 animate-spin' />
              <span className='text-muted-foreground ml-2'>
                Cargando academias...
              </span>
            </div>
          ) : isError ? (
            <div className='col-span-full'>
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>
                  Error al cargar las academias destacadas.{' '}
                  <Button variant='outline' size='sm' onClick={() => refetch()}>
                    Reintentar
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          ) : academiesByCategory && academiesByCategory.length > 0 ? (
            <div className='space-y-16'>
              {academiesByCategory.map((categoryData, categoryIndex) => {
                const { category, academies } = categoryData

                // Skip empty categories
                if (!academies || academies.length === 0) return null

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                  >
                    <div className='mb-8'>
                      <h3 className='mb-2 text-2xl font-bold'>
                        {category.name}
                      </h3>
                      <p className='text-muted-foreground'>
                        {category.description}
                      </p>
                    </div>

                    <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
                      {academies.map((academy, index) => (
                        <motion.div
                          key={academy.id}
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          whileHover={{ y: -10 }}
                        >
                          <Link
                            to='/academies/$slug'
                            params={{ slug: academy.slug }}
                          >
                            <Card className='group h-full cursor-pointer overflow-hidden'>
                              <div className='relative'>
                                <img
                                  src={
                                    academy.logo_url ||
                                    'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2'
                                  }
                                  alt={academy.name}
                                  className='h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105'
                                />
                                <div className='absolute top-4 right-4'>
                                  <div className='rounded bg-black/70 px-2 py-1 text-xs font-medium text-white'>
                                    Desde {formatPrice(academy.monthly_price)}
                                    /mes
                                  </div>
                                </div>
                              </div>
                              <CardHeader>
                                <CardTitle className='line-clamp-1'>
                                  {academy.name}
                                </CardTitle>
                                <CardDescription className='line-clamp-2'>
                                  {academy.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className='space-y-4'>
                                  <div className='flex items-center justify-between text-sm'>
                                    <span className='text-muted-foreground'>
                                      Por {academy?.creator?.name}
                                    </span>
                                  </div>
                                  <div className='flex items-center justify-between text-sm'>
                                    <div className='flex items-center space-x-4'>
                                      <div className='flex items-center space-x-1'>
                                        <Users className='text-muted-foreground h-4 w-4' />
                                        <span>
                                          {academy.student_count.toLocaleString()}
                                        </span>
                                      </div>
                                      <div className='flex items-center space-x-1'>
                                        <BookOpen className='text-muted-foreground h-4 w-4' />
                                        <span>
                                          {academy.course_count} cursos
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className='col-span-full py-12 text-center'>
              <p className='text-muted-foreground'>
                No se encontraron academias destacadas.
              </p>
            </div>
          )}

          {/* Ver todas las academias button */}
          <motion.div
            className='mt-12 text-center'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Button size='lg' variant='outline' asChild>
              <Link to='/academies'>
                Ver Todas las Academias
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Popular Courses by Category */}
      <section className='bg-muted/50 py-20'>
        <div className='container'>
          <motion.div
            className='mb-16 text-center'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
              Cursos Populares por Categoría
            </h2>
            <p className='text-muted-foreground mt-4 text-lg'>
              Explora los cursos más destacados organizados por áreas de
              conocimiento
            </p>
          </motion.div>

          {categoriesQuery.isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='h-8 w-8 animate-spin' />
              <span className='text-muted-foreground ml-2'>
                Cargando categorías...
              </span>
            </div>
          ) : (
            <div className='space-y-16'>
              {coursesByCategories.map((categoryData, categoryIndex) => {
                const { category, courses } = categoryData

                // Skip empty categories
                if (!courses || courses.length === 0) return null

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                  >
                    <div className='mb-8'>
                      <h3 className='mb-2 text-2xl font-bold'>
                        {category.name}
                      </h3>
                      <p className='text-muted-foreground'>
                        {category.description}
                      </p>
                    </div>

                    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                      {courses.map((course, courseIndex) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.4,
                            delay: courseIndex * 0.1,
                          }}
                          whileHover={{ y: -5 }}
                        >
                          <Link
                            to='/courses/$courseSlug'
                            params={{ courseSlug: generateCourseSlug(course) }}
                          >
                            <Card className='group h-full cursor-pointer overflow-hidden'>
                              <div className='relative'>
                                <img
                                  src={
                                    course?.thumbnail_url ||
                                    'https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2'
                                  }
                                  alt={course?.title}
                                  className='h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105'
                                />
                                <div className='absolute top-3 left-3'>
                                  <Badge variant='secondary'>
                                    {formatDifficulty(course?.difficulty_level)}
                                  </Badge>
                                </div>
                                <div className='absolute top-3 right-3'>
                                  <div className='rounded bg-black/70 px-2 py-1 text-xs font-medium text-white'>
                                    {course?.is_free
                                      ? 'Gratis'
                                      : formatPrice(course?.price)}
                                  </div>
                                </div>
                              </div>
                              <CardHeader className='pb-4'>
                                <CardTitle className='line-clamp-2 text-lg'>
                                  {course?.title}
                                </CardTitle>
                                <CardDescription className='line-clamp-1 text-sm'>
                                  Por {course?.creator?.name}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className='pt-0'>
                                <div className='flex items-center justify-between text-sm'>
                                  <div className='flex items-center space-x-3'>
                                    <div className='flex items-center space-x-1'>
                                      <Clock className='text-muted-foreground h-3 w-3' />
                                      <span className='text-xs'>
                                        {Math.round(
                                          course?.duration_minutes / 60
                                        )}
                                        h
                                      </span>
                                    </div>
                                    <div className='flex items-center space-x-1'>
                                      <Users className='text-muted-foreground h-3 w-3' />
                                      <span className='text-xs'>
                                        {course?.enrollment_count}
                                      </span>
                                    </div>
                                  </div>
                                  <Badge variant='outline' className='text-xs'>
                                    {course?.is_published
                                      ? 'Disponible'
                                      : 'Próximamente'}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* Ver todos los cursos button */}
          <motion.div
            className='mt-12 text-center'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Button size='lg' variant='outline' asChild>
              <Link to='/courses'>
                Explorar Todos los Cursos
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA for Creators */}
      <section className='bg-primary/5 border-t py-20'>
        <div className='container'>
          <motion.div
            className='mx-auto max-w-4xl text-center'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
              ¿Tienes conocimiento que compartir?
            </h2>
            <p className='text-muted-foreground mt-6 text-lg leading-8'>
              Únete a miles de instructores que ya están creando sus propias
              academias en línea. Comparte tu experiencia y genera ingresos
              enseñando lo que más te apasiona.
            </p>
            <div className='mt-10'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size='lg' asChild>
                  <Link to='/landing'>
                    Crear mi Academia
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Simple */}
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
