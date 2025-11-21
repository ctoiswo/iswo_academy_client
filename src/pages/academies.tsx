import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, Loader2 } from 'lucide-react'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { useAcademies } from '@/hooks/use-academies'
import { useCategories } from '@/hooks/use-categories'
import { useGeneralStatistics } from '@/hooks/use-statistics'
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
import { PublicAcademyCard } from '@/components/public-academy-card'

export function AcademiesPage() {
  console.log('📋 AcademiesPage (LIST) rendered')

  // Read category from URL search params
  const searchParams = useSearch({ strict: false }) as { category?: string }
  const navigate = useNavigate()

  const [searchInput, setSearchInput] = useState('') // Input del usuario
  const [searchQuery, setSearchQuery] = useState('') // Query con debounce para la API
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || 'all')
  const [sortBy, setSortBy] = useState<
    'popular' | 'rating' | 'students' | 'newest'
  >('popular')

  // Update selected category when URL changes
  useEffect(() => {
    if (searchParams.category) {
      setSelectedCategory(searchParams.category)
    }
  }, [searchParams.category])

  // Debounce del search input - espera 500ms después del último cambio
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
    }, 400)

    return () => clearTimeout(timer)
  }, [searchInput])

  // Obtenemos estadísticas generales del backend
  const {
    data: generalStats,
    isLoading: statsLoading,
    error: statsError,
  } = useGeneralStatistics()

  // Obtenemos las categorías para los filtros
  const { categories: allCategories, loading: allCategoriesLoading } =
    useCategories()

  // Obtenemos las academias filtradas directamente del backend
  const hasFilters = searchQuery || selectedCategory !== 'all'
  const {
    data: academies = [],
    isLoading: isFiltering,
    error: academiesError,
  } = useAcademies({
    search: searchQuery || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    sort_by: sortBy,
  })

  // Agrupamos las academias por categoría SOLO cuando no hay filtros activos
  // Cuando hay filtros, mostramos lista en cuadrícula
  const academiesByCategory = useMemo(() => {
    if (!academies.length) return []

    // Si hay filtros activos, devolver las academias para mostrar en cuadrícula
    if (hasFilters) {
      const categoryName = selectedCategory !== 'all' 
        ? allCategories.find(c => c.slug === selectedCategory)?.name || 'Resultados'
        : 'Resultados'
      
      return {
        filtered: true,
        categoryName,
        academies: academies.map((academy) => ({
          id: academy.id,
          name: academy.name,
          slug: academy.slug,
          description: academy.description,
          banner_url: academy.banner_url,
          monthly_price: academy.monthly_price,
          enrolled_users_count: academy.enrolled_users_count,
          courses_count: academy.courses_count,
        })),
      }
    }

    // Sin filtros: agrupamos por categoría para mostrar carruseles
    const grouped = academies.reduce(
      (acc, academy) => {
        const categoryName = academy.academy_category?.name || 'Sin categoría'
        const categorySlug = academy.academy_category?.slug || 'sin-categoria'

        if (!acc[categorySlug]) {
          acc[categorySlug] = {
            id: academy.academy_category?.id || 0,
            name: categoryName,
            slug: categorySlug,
            academies: [],
          }
        }

        acc[categorySlug].academies.push({
          id: academy.id,
          name: academy.name,
          slug: academy.slug,
          description: academy.description,
          banner_url: academy.banner_url,
          monthly_price: academy.monthly_price,
          enrolled_users_count: academy.enrolled_users_count,
          courses_count: academy.courses_count,
        })

        return acc
      },
      {} as Record<string, any>
    )

    return { filtered: false, categories: Object.values(grouped) }
  }, [academies, hasFilters, selectedCategory, allCategories])

  // Estadísticas: siempre del backend
  const stats = {
    totalAcademies: hasFilters
      ? academies.length
      : (generalStats?.total_academies ?? 0),
    totalStudents: generalStats?.total_students ?? 0,
    totalCategories: generalStats?.total_categories ?? 0,
  }

  // Convertimos las categorías para los filtros
  const categories = allCategories.map((category) => ({
    id: category.slug,
    name: category.name,
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

  // Las estadísticas ahora vienen directamente del backend (sin cálculos)
  const totalAcademies = stats.totalAcademies
  const totalStudents = stats.totalStudents
  const totalCategories = stats.totalCategories

  // Estados de carga y error - solo mostrar loader completo en la carga inicial
  const isInitialLoading =
    (allCategoriesLoading || statsLoading || isFiltering) && !hasFilters
  const error = academiesError || statsError

  if (isInitialLoading) {
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
              <p className='text-muted-foreground'>
                {error instanceof Error ? error.message : String(error)}
              </p>
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
              {totalStudents}
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
                placeholder='Buscar academias por nombre o descripción...'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
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

              <Select
                value={sortBy}
                onValueChange={(value) =>
                  setSortBy(
                    value as 'popular' | 'rating' | 'students' | 'newest'
                  )
                }
              >
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
                <BookOpen className='mr-2 h-4 w-4' />
                <span>{category.name}</span>
                <Badge variant='secondary' className='ml-2 text-xs'>
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Active Filters Indicator */}
          {(searchQuery || selectedCategory !== 'all' || sortBy !== 'popular') && (
            <div className='bg-muted/50 mt-4 flex flex-wrap items-center gap-2 rounded-lg p-3'>
              <span className='text-muted-foreground text-sm font-medium'>
                Filtros activos:
              </span>
              {searchQuery && (
                <Badge variant='secondary' className='gap-1'>
                  Búsqueda: "{searchQuery}"
                  <button
                    onClick={() => {
                      setSearchInput('')
                      setSearchQuery('')
                    }}
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
              {sortBy !== 'popular' && (
                <Badge variant='secondary' className='gap-1'>
                  Orden: {sortBy === 'rating' ? 'Mejor calificación' : sortBy === 'students' ? 'Más estudiantes' : sortBy === 'newest' ? 'Más reciente' : 'Más popular'}
                  <button
                    onClick={() => setSortBy('popular')}
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
                  setSearchInput('')
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setSortBy('popular')
                  navigate({ to: '/academies' })
                }}
                className='ml-auto h-6 text-xs'
              >
                Limpiar todos
              </Button>
            </div>
          )}
        </motion.div>

        {/* Category Carousels or Filtered Grid */}
        <div className='relative'>
          {/* Indicador de loading sutil cuando se está filtrando */}
          {hasFilters && isFiltering && (
            <div className='bg-background/80 absolute top-4 right-4 z-10 rounded-full border p-2 shadow-sm backdrop-blur-sm'>
              <Loader2 className='text-muted-foreground h-4 w-4 animate-spin' />
            </div>
          )}

          {'filtered' in academiesByCategory && academiesByCategory.filtered && academiesByCategory.academies ? (
            /* Vista filtrada - Cuadrícula completa */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {academiesByCategory.academies.length > 0 ? (
                <>
                  <div className='mb-8 flex items-center justify-between'>
                    <div>
                      <h2 className='text-foreground mb-2 text-2xl font-bold'>
                        {academiesByCategory.categoryName}
                      </h2>
                      <p className='text-muted-foreground text-sm'>
                        {academiesByCategory.academies.length}{' '}
                        {academiesByCategory.academies.length === 1
                          ? 'academia encontrada'
                          : 'academias encontradas'}
                      </p>
                    </div>
                    <Button
                      variant='outline'
                      onClick={() => {
                        setSelectedCategory('all')
                        setSearchInput('')
                        setSearchQuery('')
                        navigate({ to: '/academies' })
                      }}
                    >
                      Ver todas las categorías
                    </Button>
                  </div>
                  
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {academiesByCategory.academies.map((academy: any, index: number) => (
                      <div key={academy.id}>
                        <PublicAcademyCard academy={academy} index={index} />
                      </div>
                    ))}
                  </div>
                </>
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
                      onClick={() => {
                        setSearchInput('')
                        setSearchQuery('')
                      }}
                      variant='outline'
                      size='sm'
                      disabled={!searchQuery}
                    >
                      Limpiar búsqueda
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedCategory('all')
                        navigate({ to: '/academies' })
                      }}
                      variant='outline'
                      size='sm'
                      disabled={selectedCategory === 'all'}
                    >
                      Ver todas las categorías
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* Vista normal - Carruseles por categoría */
            'categories' in academiesByCategory && academiesByCategory.categories && academiesByCategory.categories.length > 0 ? (
              academiesByCategory.categories.map((category: any) => (
                <CategoryCarousel
                  key={category.slug}
                  title={category.name}
                  academies={category.academies}
                  categorySlug={category.slug}
                />
              ))
            ) : (
              <motion.div
                className='py-16 text-center'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <BookOpen className='text-muted-foreground mx-auto mb-4 h-16 w-16' />
                <h3 className='mb-2 text-xl font-semibold'>
                  No hay academias disponibles
                </h3>
              </motion.div>
            )
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
