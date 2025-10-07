import { useState } from 'react'
import React from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Code,
  Palette,
  TrendingUp,
  Briefcase,
  BookOpen,
  Globe,
  Microscope,
  Heart,
  Music,
  GraduationCap,
  Loader2,
  Clock,
  Users,
  Play,
  Filter
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PublicHeader } from '@/components/layout/public-header'
import { useAcademyCategories, useFeaturedCourses } from '@/hooks/use-featured-content'
import { Link } from '@tanstack/react-router'

// Mapeo de iconos para las categorías
const iconMap = {
  Code,
  Briefcase,
  Globe,
  Palette,
  Microscope,
  Heart,
  Music,
  GraduationCap,
  TrendingUp
}

export function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedPrice, setSelectedPrice] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  // Obtenemos las categorías y cursos
  const categoriesQuery = useAcademyCategories()
  const coursesQuery = useFeaturedCourses(selectedCategory || undefined)

  // Helper functions
  const formatPrice = (priceString: string) => {
    const price = parseFloat(priceString)
    return `$${(price / 1000).toFixed(0)}k`
  }

  const formatDifficulty = (level: string) => {
    const levels = {
      beginner: 'Principiante',
      intermediate: 'Intermedio', 
      advanced: 'Avanzado'
    }
    return levels[level as keyof typeof levels] || level
  }

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

  // Filter courses based on search and filters
  const filteredCourses = (coursesQuery.data || []).filter(course => {
    // Search filter
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !course.creator.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all' && course.difficulty_level !== selectedDifficulty) {
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
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
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
        staggerChildren: 0.2
      }
    }
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  }

  const searchVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  }

  // Estadísticas
  const totalCourses = sortedCourses.length
  const freeCourses = sortedCourses.filter(c => c.is_free).length
  const totalHours = Math.round(sortedCourses.reduce((sum, c) => sum + c.duration_minutes, 0) / 60)

  // Estados de carga y error
  if (categoriesQuery.isLoading && coursesQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Cargando cursos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-8"
      >
        {/* Header Section */}
        <motion.div
          variants={headerVariants}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Explora Nuestros{' '}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Cursos
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {totalCourses > 0 ? (
              <>
                Descubre <span className="font-semibold">{totalCourses}</span> cursos increíbles creados por expertos de la industria.
                Aprende nuevas habilidades a tu propio ritmo.
              </>
            ) : (
              'No se encontraron cursos que coincidan con tu búsqueda'
            )}
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={statsVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-card rounded-2xl p-6 shadow-sm border text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{totalCourses}+</div>
            <div className="text-muted-foreground font-medium">Cursos Disponibles</div>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-sm border text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{freeCourses}+</div>
            <div className="text-muted-foreground font-medium">Cursos Gratuitos</div>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-sm border text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{totalHours}h+</div>
            <div className="text-muted-foreground font-medium">Contenido Total</div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          variants={searchVariants}
          className="bg-card rounded-2xl p-6 shadow-sm border mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Buscar cursos por nombre o instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
              <Select value={selectedCategory?.toString() || 'all'} onValueChange={(value) => setSelectedCategory(value === 'all' ? null : parseInt(value))}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {(categoriesQuery.data || []).map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-40 h-12">
                  <SelectValue placeholder="Dificultad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="beginner">Principiante</SelectItem>
                  <SelectItem value="intermediate">Intermedio</SelectItem>
                  <SelectItem value="advanced">Avanzado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                <SelectTrigger className="w-32 h-12">
                  <SelectValue placeholder="Precio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="free">Gratis</SelectItem>
                  <SelectItem value="paid">Pagos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 h-12">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Más popular</SelectItem>
                  <SelectItem value="newest">Más reciente</SelectItem>
                  <SelectItem value="duration">Duración</SelectItem>
                  <SelectItem value="enrollments">Más inscritos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory || selectedDifficulty !== 'all' || selectedPrice !== 'all') && (
            <div className="flex flex-wrap items-center gap-2 mt-4 p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Filtros activos:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Búsqueda: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="secondary" className="gap-1">
                  {(categoriesQuery.data || []).find(c => c.id === selectedCategory)?.name}
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedDifficulty !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {formatDifficulty(selectedDifficulty)}
                  <button
                    onClick={() => setSelectedDifficulty('all')}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedPrice !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {selectedPrice === 'free' ? 'Gratis' : 'De pago'}
                  <button
                    onClick={() => setSelectedPrice('all')}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory(null)
                  setSelectedDifficulty('all')
                  setSelectedPrice('all')
                }}
                className="ml-auto text-xs h-6"
              >
                Limpiar todos
              </Button>
            </div>
          )}
        </motion.div>

        {/* Courses Grid */}
        <div className="relative">
          {coursesQuery.isLoading && (
            <div className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm rounded-full p-2 shadow-sm border">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
          
          {sortedCourses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <Link to='/public/courses/$courseSlug' params={{ courseSlug: generateCourseSlug(course) }}>
                    <Card className="group h-full cursor-pointer overflow-handed hover:shadow-xl transition-all duration-300">
                      <div className="relative">
                        <img
                          src={course.thumbnail_url || 'https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2'}
                          alt={course.title}
                          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary">{formatDifficulty(course.difficulty_level)}</Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <div className="rounded bg-black/70 px-2 py-1 text-xs font-medium text-white">
                            {course.is_free ? 'Gratis' : formatPrice(course.price)}
                          </div>
                        </div>
                        <div className="absolute bottom-3 right-3 bg-background/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 shadow-sm border">
                          <Play className="w-3 h-3 text-green-600 fill-current" />
                          <span className="text-xs font-semibold text-foreground">{Math.round(course.duration_minutes / 60)}h</span>
                        </div>
                      </div>
                      
                      <CardHeader className="pb-4">
                        <CardTitle className="line-clamp-2 text-lg group-hover:text-green-600 transition-colors">
                          {course.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          Por {course.creator.name}
                        </p>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Users className="text-muted-foreground h-3 w-3" />
                              <span className="text-xs">{course.enrollment_count}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="text-muted-foreground h-3 w-3" />
                              <span className="text-xs">{Math.round(course.duration_minutes / 60)}h</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {course.is_published ? 'Disponible' : 'Próximamente'}
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
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No se encontraron cursos</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                No hay cursos que coincidan con los filtros seleccionados.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory(null)
                  setSelectedDifficulty('all')
                  setSelectedPrice('all')
                }}
                variant="outline"
              >
                Limpiar filtros
              </Button>
            </motion.div>
          )}
        </div>

        {/* CTA Section */}
        <motion.div
          variants={headerVariants}
          className="text-center mt-20 py-16 bg-slate-100 dark:bg-slate-800 rounded-3xl border"
        >
          <h2 className="text-3xl font-bold mb-4 text-foreground">¿No encuentras el curso ideal?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explora nuestras academias especializadas o crea tu propio curso y compártelo con el mundo.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="default" asChild>
              <Link to="/academies">
                Ver Academias
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/landing">
                Crear Curso
              </Link>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}