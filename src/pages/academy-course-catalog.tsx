import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import type { Course } from '@/types'
import { BookOpen, Search, Filter, Clock, Users } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useAcademyCourses } from '@/hooks/use-academy-courses'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function AcademyCourseCatalogPage() {
  const { academySlug } = useParams({ strict: false }) as {
    academySlug: string
  }
  const navigate = useNavigate()
  const { user, currentAcademy } = useAuthStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')

  const {
    data: courses = [],
    isLoading,
    error,
  } = useAcademyCourses(academySlug)

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`
    }
    return `${remainingMinutes}m`
  }

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return numPrice > 0 ? `$${numPrice.toFixed(2)}` : 'Gratis'
  }

  // Filter courses based on search and difficulty
  const filteredCourses = courses.filter((course: Course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDifficulty =
      difficultyFilter === 'all' || course.difficulty_level === difficultyFilter

    return matchesSearch && matchesDifficulty
  })

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a: Course, b: Course) => {
    switch (sortBy) {
      case 'newest':
        return (
          new Date(b.created_at || '').getTime() -
          new Date(a.created_at || '').getTime()
        )
      case 'title':
        return a.title.localeCompare(b.title)
      case 'duration':
        return (a.duration_minutes || 0) - (b.duration_minutes || 0)
      default:
        return 0
    }
  })

  const handleViewCourse = (courseSlug: string) => {
    navigate({
      to: '/courses/$courseSlug',
      params: { courseSlug },
    })
  }

  if (isLoading) {
    return (
      <DashboardLayout
        user={user}
        academy={currentAcademy}
        variant='full'
        dashboardType='student'
      >
        <div className='container mx-auto px-4 py-8'>
          <div className='space-y-6'>
            <Skeleton className='h-12 w-64' />
            <Skeleton className='h-10 w-full max-w-md' />
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className='h-80' />
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout
        user={user}
        academy={currentAcademy}
        variant='full'
        dashboardType='student'
      >
        <div className='container mx-auto px-4 py-8'>
          <div className='py-12 text-center'>
            <BookOpen className='mx-auto mb-4 h-16 w-16 text-gray-400' />
            <h3 className='mb-2 text-lg font-bold text-red-600'>
              Error al Cargar Cursos
            </h3>
            <p className='text-gray-600'>
              No se pudieron cargar los cursos. Por favor, inténtalo de nuevo.
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      user={user}
      academy={currentAcademy}
      variant='full'
      dashboardType='student'
    >
      <div className='container mx-auto px-4 pb-8'>
        {/* Header */}
        <div className='mb-8'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() =>
              navigate({
                to: '/academy/$academySlug/my-courses',
                params: { academySlug },
              })
            }
            className='mb-4'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='mr-2'
            >
              <path d='m15 18-6-6 6-6' />
            </svg>
            Volver a Mis Cursos
          </Button>
          <h1 className='mb-2 text-4xl font-bold tracking-tight'>
            Catálogo de Cursos
          </h1>
          <p className='text-muted-foreground text-lg'>
            Explora todos los cursos disponibles y comienza tu aprendizaje
          </p>
        </div>

        {/* Filters */}
        <div className='mb-8 flex flex-col gap-4 sm:flex-row'>
          <div className='flex-1'>
            <div className='relative'>
              <Search className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
              <Input
                placeholder='Buscar cursos...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>

          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className='w-[180px]'>
              <Filter className='mr-2 h-4 w-4' />
              <SelectValue placeholder='Dificultad' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Todas las Dificultades</SelectItem>
              <SelectItem value='beginner'>Principiante</SelectItem>
              <SelectItem value='intermediate'>Intermedio</SelectItem>
              <SelectItem value='advanced'>Avanzado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Ordenar por' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='newest'>Más Recientes</SelectItem>
              <SelectItem value='title'>Título</SelectItem>
              <SelectItem value='duration'>Duración</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className='mb-6'>
          <p className='text-sm text-gray-600'>
            {sortedCourses.length === 0
              ? 'No se encontraron cursos'
              : `Mostrando ${sortedCourses.length} ${sortedCourses.length === 1 ? 'curso' : 'cursos'}`}
          </p>
        </div>

        {/* Courses Grid */}
        {sortedCourses.length === 0 ? (
          <Card className='py-12 text-center'>
            <CardContent>
              <BookOpen className='mx-auto mb-4 h-16 w-16 text-gray-400' />
              <h3 className='mb-2 text-lg font-medium text-gray-900'>
                No se encontraron cursos
              </h3>
              <p className='mb-4 text-gray-500'>
                {searchQuery || difficultyFilter !== 'all'
                  ? 'Intenta ajustar tus filtros de búsqueda'
                  : 'No hay cursos disponibles en este momento'}
              </p>
              {(searchQuery || difficultyFilter !== 'all') && (
                <Button
                  onClick={() => {
                    setSearchQuery('')
                    setDifficultyFilter('all')
                  }}
                  variant='outline'
                >
                  Limpiar Filtros
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {sortedCourses.map((course: Course) => (
              <Card
                key={course.id}
                className='cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl'
                onClick={() => handleViewCourse(course.slug)}
              >
                {/* Promotional Image */}
                <div className='relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100'>
                  {course.promotional_image_url ? (
                    <img
                      src={course.promotional_image_url}
                      alt={course.title}
                      className='h-full w-full object-cover transition-transform duration-300 hover:scale-105'
                    />
                  ) : (
                    <div className='flex h-full items-center justify-center'>
                      <BookOpen className='h-16 w-16 text-gray-400' />
                    </div>
                  )}

                  {/* Difficulty Badge Overlay */}
                  <div className='absolute top-3 left-3'>
                    <Badge
                      variant='outline'
                      className={`${getDifficultyColor(course.difficulty_level)} backdrop-blur-sm`}
                    >
                      {course.difficulty_level === 'beginner' && 'Principiante'}
                      {course.difficulty_level === 'intermediate' &&
                        'Intermedio'}
                      {course.difficulty_level === 'advanced' && 'Avanzado'}
                    </Badge>
                  </div>

                  {/* Status Badge Overlay */}
                  {course.status === 'published' && (
                    <div className='absolute top-3 right-3'>
                      <Badge
                        variant='outline'
                        className='bg-blue-100 text-blue-800 backdrop-blur-sm'
                      >
                        Publicado
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className='pb-3'>
                  <CardTitle className='line-clamp-2 text-lg leading-tight'>
                    {course.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className='space-y-4'>
                  <CardDescription className='line-clamp-3 min-h-[60px]'>
                    {course.description || 'Sin descripción disponible'}
                  </CardDescription>

                  {/* Course Info */}
                  <div className='space-y-2 text-sm text-gray-600'>
                    <div className='flex items-center gap-2'>
                      <Clock className='h-4 w-4' />
                      <span>
                        {formatDuration(course.duration_minutes || 0)}
                      </span>
                    </div>

                    {course.enrollment_count !== undefined && (
                      <div className='flex items-center gap-2'>
                        <Users className='h-4 w-4' />
                        <span>{course.enrollment_count} estudiantes</span>
                      </div>
                    )}
                  </div>

                  {/* Price & Action */}
                  <div className='flex items-center justify-between border-t pt-2'>
                    <span className='text-primary text-lg font-bold'>
                      {formatPrice(course.price || 0)}
                    </span>
                    <Button
                      size='sm'
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewCourse(course.slug)
                      }}
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
