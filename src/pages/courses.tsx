import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Search, BookOpen, Loader2, Clock, Users, Play } from 'lucide-react'
import {
  useAcademyCategories,
  useFeaturedCourses,
} from '@/hooks/use-featured-content'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PublicHeader } from '@/features/home/components/header'

export function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedPrice, setSelectedPrice] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  // Obtenemos las categorías y cursos
  const categoriesQuery = useAcademyCategories()
  const coursesQuery = useFeaturedCourses(selectedCategory || undefined)

  // Aplanar los cursos de todas las categorías a un solo array
  const allCourses = (coursesQuery.data || []).flatMap(
    (categoryData) => categoryData.courses
  )

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

  // Filter courses based on search and filters
  const filteredCourses = allCourses.filter((course) => {
    // Search filter
    if (
      searchQuery &&
      !course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !course.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Difficulty filter
    if (
      selectedDifficulty !== 'all' &&
      course.difficulty_level !== selectedDifficulty
    ) {
      return false
    }

    // Price filter
    if (selectedPrice === 'free' && !course.is_free) return false
    if (selectedPrice === 'paid' && course.is_free) return false

    return true
  })

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      case 'duration':
        return b.duration_minutes - a.duration_minutes
      case 'price':
        return parseFloat(b.price) - parseFloat(a.price)
      case 'enrollments':
        return b.enrollment_count - a.enrollment_count
      default: // popular
        return b.enrollment_count - a.enrollment_count
    }
  })

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  }

  const searchVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  }

  // Estadísticas
  const totalCourses = sortedCourses.length
  const freeCourses = sortedCourses.filter((c) => c.is_free).length
  const totalHours = Math.round(
    sortedCourses.reduce((sum, c) => sum + c.duration_minutes, 0) / 60
  )

  // Estados de carga y error
  if (categoriesQuery.isLoading && coursesQuery.isLoading) {
    return (
      <div className='bg-background min-h-screen'>
        <PublicHeader />
        <div className='container mx-auto px-4 py-8'>
          <div className='flex min-h-[400px] flex-col items-center justify-center'>
            <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
            <p className='text-muted-foreground mt-4'>Cargando cursos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-background min-h-screen'>
      <PublicHeader />

      <motion.div
        variants={pageVariants}
        initial='hidden'
        animate='visible'
        className='container mx-auto px-4 py-8'
      >
        {/* Header Section */}
        <motion.div variants={headerVariants} className='mb-12 text-center'>
          <h1 className='text-foreground mb-4 text-4xl font-bold lg:text-5xl'>
            Explora Nuestros{' '}
            <span className='bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent'>
              Cursos
            </span>
          </h1>
          <p className='text-muted-foreground mx-auto max-w-3xl text-xl leading-relaxed'>
            {totalCourses > 0 ? (
              <>
                Descubre <span className='font-semibold'>{totalCourses}</span>{' '}
                cursos increíbles creados por expertos de la industria. Aprende
                nuevas habilidades a tu propio ritmo.
              </>
            ) : (
              'No se encontraron cursos que coincidan con tu búsqueda'
            )}
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={statsVariants}
          className='mb-12 grid grid-cols-1 gap-6 md:grid-cols-3'
        >
          <div className='bg-card rounded-2xl border p-6 text-center shadow-sm'>
            <div className='mb-2 text-3xl font-bold text-green-600'>
              {totalCourses}+
            </div>
            <div className='text-muted-foreground font-medium'>
              Cursos Disponibles
            </div>
          </div>
          <div className='bg-card rounded-2xl border p-6 text-center shadow-sm'>
            <div className='mb-2 text-3xl font-bold text-blue-600'>
              {freeCourses}+
            </div>
            <div className='text-muted-foreground font-medium'>
              Cursos Gratuitos
            </div>
          </div>
          <div className='bg-card rounded-2xl border p-6 text-center shadow-sm'>
            <div className='mb-2 text-3xl font-bold text-purple-600'>
              {totalHours}h+
            </div>
            <div className='text-muted-foreground font-medium'>
              Contenido Total
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          variants={searchVariants}
          className='bg-card mb-12 rounded-2xl border p-6 shadow-sm'
        >
          <div className='flex flex-col gap-4 lg:flex-row'>
            {/* Search Input */}
            <div className='relative flex-1'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform' />
              <Input
                placeholder='Buscar cursos por nombre o instructor...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='h-12 pl-10'
              />
            </div>

            {/* Filters */}
            <div className='flex flex-wrap gap-3'>
              <Select
                value={selectedCategory?.toString() || 'all'}
                onValueChange={(value) =>
                  setSelectedCategory(value === 'all' ? null : parseInt(value))
                }
              >
                <SelectTrigger className='h-12 w-48'>
                  <SelectValue placeholder='Categoría' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Todas las categorías</SelectItem>
                  {(categoriesQuery.data || []).map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
              >
                <SelectTrigger className='h-12 w-40'>
                  <SelectValue placeholder='Dificultad' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Todas</SelectItem>
                  <SelectItem value='beginner'>Principiante</SelectItem>
                  <SelectItem value='intermediate'>Intermedio</SelectItem>
                  <SelectItem value='advanced'>Avanzado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                <SelectTrigger className='h-12 w-32'>
                  <SelectValue placeholder='Precio' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Todos</SelectItem>
                  <SelectItem value='free'>Gratis</SelectItem>
                  <SelectItem value='paid'>Pagos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className='h-12 w-40'>
                  <SelectValue placeholder='Ordenar por' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='popular'>Más popular</SelectItem>
                  <SelectItem value='newest'>Más reciente</SelectItem>
                  <SelectItem value='duration'>Duración</SelectItem>
                  <SelectItem value='enrollments'>Más inscritos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery ||
            selectedCategory ||
            selectedDifficulty !== 'all' ||
            selectedPrice !== 'all') && (
            <div className='bg-muted/50 mt-4 flex flex-wrap items-center gap-2 rounded-lg p-3'>
              <span className='text-muted-foreground text-sm font-medium'>
                Filtros activos:
              </span>
              {searchQuery && (
                <Badge variant='secondary' className='gap-1'>
                  Búsqueda: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className='hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5'
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant='secondary' className='gap-1'>
                  {
                    (categoriesQuery.data || []).find(
                      (c) => c.id === selectedCategory
                    )?.name
                  }
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className='hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5'
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedDifficulty !== 'all' && (
                <Badge variant='secondary' className='gap-1'>
                  {formatDifficulty(selectedDifficulty)}
                  <button
                    onClick={() => setSelectedDifficulty('all')}
                    className='hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5'
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedPrice !== 'all' && (
                <Badge variant='secondary' className='gap-1'>
                  {selectedPrice === 'free' ? 'Gratis' : 'De pago'}
                  <button
                    onClick={() => setSelectedPrice('all')}
                    className='hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5'
                  >
                    ×
                  </button>
                </Badge>
              )}
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory(null)
                  setSelectedDifficulty('all')
                  setSelectedPrice('all')
                }}
                className='ml-auto h-6 text-xs'
              >
                Limpiar todos
              </Button>
            </div>
          )}
        </motion.div>

        {/* Courses Grid */}
        <div className='relative'>
          {coursesQuery.isLoading && (
            <div className='bg-background/80 absolute top-4 right-4 z-10 rounded-full border p-2 shadow-sm backdrop-blur-sm'>
              <Loader2 className='text-muted-foreground h-4 w-4 animate-spin' />
            </div>
          )}

          {sortedCourses.length > 0 ? (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {sortedCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <Link
                    to='/courses/$courseSlug'
                    params={{ courseSlug: course.slug }}
                  >
                    <Card className='group overflow-handed h-full cursor-pointer transition-all duration-300 hover:shadow-xl'>
                      <div className='relative'>
                        <img
                          src={
                            course.thumbnail_url ||
                            'https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2'
                          }
                          alt={course.title}
                          className='h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105'
                        />
                        <div className='absolute top-3 left-3'>
                          <Badge variant='secondary'>
                            {formatDifficulty(course.difficulty_level)}
                          </Badge>
                        </div>
                        <div className='absolute top-3 right-3'>
                          <div className='rounded bg-black/70 px-2 py-1 text-xs font-medium text-white'>
                            {course.is_free
                              ? 'Gratis'
                              : formatPrice(course.price)}
                          </div>
                        </div>
                        <div className='bg-background/95 absolute right-3 bottom-3 flex items-center gap-1 rounded-full border px-3 py-1.5 shadow-sm backdrop-blur-sm'>
                          <Play className='h-3 w-3 fill-current text-green-600' />
                          <span className='text-foreground text-xs font-semibold'>
                            {Math.round(course.duration_minutes / 60)}h
                          </span>
                        </div>
                      </div>

                      <CardHeader className='pb-4'>
                        <CardTitle className='line-clamp-2 text-lg transition-colors group-hover:text-green-600'>
                          {course.title}
                        </CardTitle>
                        <p className='text-muted-foreground line-clamp-1 text-sm'>
                          Por {course.creator.name}
                        </p>
                      </CardHeader>

                      <CardContent className='pt-0'>
                        <div className='flex items-center justify-between text-sm'>
                          <div className='flex items-center space-x-3'>
                            <div className='flex items-center space-x-1'>
                              <Users className='text-muted-foreground h-3 w-3' />
                              <span className='text-xs'>
                                {course.enrollment_count}
                              </span>
                            </div>
                            <div className='flex items-center space-x-1'>
                              <Clock className='text-muted-foreground h-3 w-3' />
                              <span className='text-xs'>
                                {Math.round(course.duration_minutes / 60)}h
                              </span>
                            </div>
                          </div>
                          <Badge variant='outline' className='text-xs'>
                            {course.is_published
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
          ) : (
            <motion.div
              className='py-16 text-center'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <BookOpen className='text-muted-foreground mx-auto mb-4 h-16 w-16' />
              <h3 className='mb-2 text-xl font-semibold'>
                No se encontraron cursos
              </h3>
              <p className='text-muted-foreground mx-auto mb-6 max-w-md'>
                No hay cursos que coincidan con los filtros seleccionados.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory(null)
                  setSelectedDifficulty('all')
                  setSelectedPrice('all')
                }}
                variant='outline'
              >
                Limpiar filtros
              </Button>
            </motion.div>
          )}
        </div>

        {/* CTA Section */}
        <motion.div
          variants={headerVariants}
          className='mt-20 rounded-3xl border bg-slate-100 py-16 text-center dark:bg-slate-800'
        >
          <h2 className='text-foreground mb-4 text-3xl font-bold'>
            ¿No encuentras el curso ideal?
          </h2>
          <p className='text-muted-foreground mx-auto mb-8 max-w-2xl text-xl'>
            Explora nuestras academias especializadas o crea tu propio curso y
            compártelo con el mundo.
          </p>
          <div className='flex justify-center gap-4'>
            <Button size='lg' variant='default' asChild>
              <Link to='/academies'>Ver Academias</Link>
            </Button>
            <Button size='lg' variant='outline' asChild>
              <Link to='/landing'>Crear Curso</Link>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
