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
} from 'lucide-react'
import { adaptCategoryForCarousel } from '@/lib/academy-adapters'
import { useCategories } from '@/hooks/use-categories'
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
import { CategoryCarousel } from '@/components/category-carousel'
import { PublicHeader } from '@/components/layout/public-header'

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
  TrendingUp,
}

export function AcademiesPage() {
  console.log('📋 AcademiesPage (LIST) rendered')

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  // Obtenemos las categorías base sin filtros para los botones de categoría
  const { categories: allCategories, loading: allCategoriesLoading } =
    useCategories()

  // Obtenemos las categorías filtradas del backend solo cuando hay filtros
  const hasFilters = searchQuery || selectedCategory !== 'all'
  const {
    categories: filteredCategories,
    loading: isFiltering,
    error,
    stats: filteredStats,
  } = useCategories({
    search: searchQuery || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    sortBy: sortBy,
  })

  // Determinamos qué categorías y estadísticas usar
  const categoriesToShow = hasFilters ? filteredCategories : allCategories
  const stats = hasFilters
    ? filteredStats
    : {
        totalAcademies: allCategories.reduce(
          (sum, cat) => sum + cat.academies_count,
          0
        ),
        totalStudents: allCategories.reduce(
          (sum, cat) =>
            sum +
            cat.academies.reduce(
              (academySum, academy) =>
                academySum + academy.enrolled_users_count,
              0
            ),
          0
        ),
        totalCategories: allCategories.length,
      }

  // Convertimos las categorías para los filtros (usamos allCategories para tener todos los botones)
  const categories = allCategories.map((category) => ({
    id: category.slug,
    name: category.name,
    icon: React.createElement(
      iconMap[category.icon as keyof typeof iconMap] || BookOpen,
      {
        className: 'w-5 h-5',
      }
    ),
    count: category.academies_count,
  }))

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

  // Las estadísticas ahora vienen directamente del backend filtrado
  const totalAcademies = stats.totalAcademies
  const totalStudents = stats.totalStudents
  const totalCategories = stats.totalCategories

  // Estados de carga y error - solo mostrar loader completo en la carga inicial
  if (allCategoriesLoading && !hasFilters) {
    return (
      <div className='bg-background min-h-screen'>
        <PublicHeader />
        <div className='container mx-auto px-4 py-8'>
          <div className='flex min-h-[400px] flex-col items-center justify-center'>
            <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
            <p className='text-muted-foreground mt-4'>Cargando academias...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='bg-background min-h-screen'>
        <PublicHeader />
        <div className='container mx-auto px-4 py-8'>
          <Card className='mx-auto max-w-md'>
            <CardHeader>
              <CardTitle className='text-red-600'>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className='mt-4 w-full'
              >
                Intentar de nuevo
              </Button>
            </CardContent>
          </Card>
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
            Explora Nuestras{' '}
            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Academias
            </span>
          </h1>
          <p className='text-muted-foreground mx-auto max-w-3xl text-xl leading-relaxed'>
            {searchQuery || selectedCategory !== 'all' ? (
              <>
                {totalAcademies > 0 ? (
                  <>
                    Encontramos{' '}
                    <span className='font-semibold'>{totalAcademies}</span>{' '}
                    academias que coinciden con tu búsqueda
                  </>
                ) : (
                  'No se encontraron academias que coincidan con tu búsqueda'
                )}
              </>
            ) : (
              <>
                Descubre las mejores academias online, creadas por expertos de
                la industria. Aprende nuevas habilidades y avanza en tu carrera
                profesional.
              </>
            )}
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={statsVariants}
          className='mb-12 grid grid-cols-1 gap-6 md:grid-cols-3'
        >
          <div className='bg-card rounded-2xl border p-6 text-center shadow-sm'>
            <div className='mb-2 text-3xl font-bold text-blue-600'>
              {totalAcademies}+
            </div>
            <div className='text-muted-foreground font-medium'>
              Academias Disponibles
            </div>
          </div>
          <div className='bg-card rounded-2xl border p-6 text-center shadow-sm'>
            <div className='mb-2 text-3xl font-bold text-green-600'>
              {(totalStudents / 1000).toFixed(1)}k+
            </div>
            <div className='text-muted-foreground font-medium'>
              Estudiantes Activos
            </div>
          </div>
          <div className='bg-card rounded-2xl border p-6 text-center shadow-sm'>
            <div className='mb-2 text-3xl font-bold text-purple-600'>
              {totalCategories}+
            </div>
            <div className='text-muted-foreground font-medium'>
              {searchQuery || selectedCategory !== 'all'
                ? 'Categorías Encontradas'
                : 'Categorías Principales'}
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
                placeholder='Buscar academias por nombre, instructor o tecnología...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                className='h-12 pl-10'
              />
            </div>

            {/* Filters */}
            <div className='flex gap-3'>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className='h-12 w-48'>
                  <SelectValue placeholder='Categoría' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className='h-12 w-40'>
                  <SelectValue placeholder='Ordenar por' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='popular'>Más popular</SelectItem>
                  <SelectItem value='rating'>Mejor calificación</SelectItem>
                  <SelectItem value='students'>Más estudiantes</SelectItem>
                  <SelectItem value='newest'>Más reciente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Tags */}
          <div className='mt-6 flex flex-wrap gap-3'>
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setSelectedCategory('all')}
              className='rounded-full'
            >
              <BookOpen className='mr-2 h-4 w-4' />
              Todas
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? 'default' : 'outline'
                }
                size='sm'
                onClick={() => setSelectedCategory(category.id)}
                className='rounded-full'
              >
                {category.icon}
                <span className='ml-2'>{category.name}</span>
                <Badge variant='secondary' className='ml-2 text-xs'>
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Active Filters Indicator */}
          {(searchQuery || selectedCategory !== 'all') && (
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
              {selectedCategory !== 'all' && (
                <Badge variant='secondary' className='gap-1'>
                  {categories.find((c) => c.id === selectedCategory)?.name}
                  <button
                    onClick={() => setSelectedCategory('all')}
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
                  setSelectedCategory('all')
                }}
                className='ml-auto h-6 text-xs'
              >
                Limpiar todos
              </Button>
            </div>
          )}
        </motion.div>

        {/* Category Carousels */}
        <div className='relative'>
          {/* Indicador de loading sutil cuando se está filtrando */}
          {hasFilters && isFiltering && (
            <div className='bg-background/80 absolute top-4 right-4 z-10 rounded-full border p-2 shadow-sm backdrop-blur-sm'>
              <Loader2 className='text-muted-foreground h-4 w-4 animate-spin' />
            </div>
          )}

          {categoriesToShow.length > 0 ? (
            categoriesToShow.map((category) => {
              const adaptedData = adaptCategoryForCarousel(category)

              return (
                <CategoryCarousel
                  key={category.id}
                  title={adaptedData.title}
                  academies={adaptedData.academies}
                />
              )
            })
          ) : (
            <motion.div
              className='py-16 text-center'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <BookOpen className='text-muted-foreground mx-auto mb-4 h-16 w-16' />
              <h3 className='mb-2 text-xl font-semibold'>
                No se encontraron academias
              </h3>
              <p className='text-muted-foreground mx-auto mb-6 max-w-md'>
                {searchQuery
                  ? `No hay academias que coincidan con "${searchQuery}"${selectedCategory !== 'all' ? ' en esta categoría' : ''}`
                  : 'No hay academias disponibles en esta categoría'}
              </p>
              <div className='flex justify-center gap-2'>
                <Button
                  onClick={() => setSearchQuery('')}
                  variant='outline'
                  size='sm'
                  disabled={!searchQuery}
                >
                  Limpiar búsqueda
                </Button>
                <Button
                  onClick={() => setSelectedCategory('all')}
                  variant='outline'
                  size='sm'
                  disabled={selectedCategory === 'all'}
                >
                  Ver todas las categorías
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* CTA Section */}
        <motion.div
          variants={headerVariants}
          className='mt-20 rounded-3xl border bg-slate-100 py-16 text-center dark:bg-slate-800'
        >
          <h2 className='text-foreground mb-4 text-3xl font-bold'>
            ¿No encuentras lo que buscas?
          </h2>
          <p className='text-muted-foreground mx-auto mb-8 max-w-2xl text-xl'>
            Crea tu propia academia y comparte tu conocimiento con miles de
            estudiantes.
          </p>
          <Button size='lg' variant='default' className='px-8'>
            Crear Mi Academia
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
