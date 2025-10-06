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
  Loader2
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
import { PublicHeader } from '@/components/layout/public-header'
import { CategoryCarousel } from '@/components/category-carousel'
import { useCategories } from '@/hooks/use-categories'
import { adaptCategoryForCarousel } from '@/lib/academy-adapters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

export function AcademiesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  // Obtenemos las categorías base sin filtros para los botones de categoría
  const { categories: allCategories, loading: allCategoriesLoading } = useCategories()
  
  // Obtenemos las categorías filtradas del backend solo cuando hay filtros
  const hasFilters = searchQuery || selectedCategory !== 'all'
  const { 
    categories: filteredCategories, 
    loading: isFiltering, 
    error, 
    stats: filteredStats 
  } = useCategories({
    search: searchQuery || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    sortBy: sortBy
  })

  // Determinamos qué categorías y estadísticas usar
  const categoriesToShow = hasFilters ? filteredCategories : allCategories
  const stats = hasFilters ? filteredStats : {
    totalAcademies: allCategories.reduce((sum, cat) => sum + cat.academies_count, 0),
    totalStudents: allCategories.reduce((sum, cat) => 
      sum + cat.academies.reduce((academySum, academy) => academySum + academy.enrolled_users_count, 0), 0
    ),
    totalCategories: allCategories.length
  }
  
  // Convertimos las categorías para los filtros (usamos allCategories para tener todos los botones)
  const categories = allCategories.map(category => ({
    id: category.slug,
    name: category.name,
    icon: React.createElement(iconMap[category.icon as keyof typeof iconMap] || BookOpen, { 
      className: "w-5 h-5" 
    }),
    count: category.academies_count
  }))

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

  // Las estadísticas ahora vienen directamente del backend filtrado
  const totalAcademies = stats.totalAcademies
  const totalStudents = stats.totalStudents
  const totalCategories = stats.totalCategories

  // Estados de carga y error - solo mostrar loader completo en la carga inicial
  if (allCategoriesLoading && !hasFilters) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Cargando academias...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader />
        <div className="container mx-auto px-4 py-8">
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 w-full"
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
            Explora Nuestras{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Academias
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {(searchQuery || selectedCategory !== 'all') ? (
              <>
                {totalAcademies > 0 ? (
                  <>Encontramos <span className="font-semibold">{totalAcademies}</span> academias que coinciden con tu búsqueda</>
                ) : (
                  'No se encontraron academias que coincidan con tu búsqueda'
                )}
              </>
            ) : (
              <>
                Descubre las mejores academias online, creadas por expertos de la industria. 
                Aprende nuevas habilidades y avanza en tu carrera profesional.
              </>
            )}
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={statsVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-card rounded-2xl p-6 shadow-sm border text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{totalAcademies}+</div>
            <div className="text-muted-foreground font-medium">Academias Disponibles</div>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-sm border text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{(totalStudents / 1000).toFixed(1)}k+</div>
            <div className="text-muted-foreground font-medium">Estudiantes Activos</div>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-sm border text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{totalCategories}+</div>
            <div className="text-muted-foreground font-medium">
              {searchQuery || selectedCategory !== 'all' ? 'Categorías Encontradas' : 'Categorías Principales'}
            </div>
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
                placeholder="Buscar academias por nombre, instructor o tecnología..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                className="pl-10 h-12"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 h-12">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Más popular</SelectItem>
                  <SelectItem value="rating">Mejor calificación</SelectItem>
                  <SelectItem value="students">Más estudiantes</SelectItem>
                  <SelectItem value="newest">Más reciente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className="rounded-full"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Todas
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full"
              >
                {category.icon}
                <span className="ml-2">{category.name}</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Active Filters Indicator */}
          {(searchQuery || selectedCategory !== 'all') && (
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
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {categories.find(c => c.id === selectedCategory)?.name}
                  <button
                    onClick={() => setSelectedCategory('all')}
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
                  setSelectedCategory('all')
                }}
                className="ml-auto text-xs h-6"
              >
                Limpiar todos
              </Button>
            </div>
          )}
        </motion.div>

        {/* Category Carousels */}
        <div className="relative">
          {/* Indicador de loading sutil cuando se está filtrando */}
          {hasFilters && isFiltering && (
            <div className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm rounded-full p-2 shadow-sm border">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
          
          {categoriesToShow.length > 0 ? (
            categoriesToShow.map((category) => {
              const adaptedData = adaptCategoryForCarousel(category)
              const IconComponent = iconMap[category.icon as keyof typeof iconMap] || BookOpen
              
              return (
                <CategoryCarousel
                  key={category.id}
                  title={adaptedData.title}
                  academies={adaptedData.academies}
                  categoryIcon={<IconComponent className="w-6 h-6" />}
                />
              )
            })
          ) : (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No se encontraron academias</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery ? 
                  `No hay academias que coincidan con "${searchQuery}"${selectedCategory !== 'all' ? ' en esta categoría' : ''}` : 
                  'No hay academias disponibles en esta categoría'
                }
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => setSearchQuery('')}
                  variant="outline"
                  size="sm"
                  disabled={!searchQuery}
                >
                  Limpiar búsqueda
                </Button>
                <Button
                  onClick={() => setSelectedCategory('all')}
                  variant="outline"
                  size="sm"
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
          className="text-center mt-20 py-16 bg-slate-100 dark:bg-slate-800 rounded-3xl border"
        >
          <h2 className="text-3xl font-bold mb-4 text-foreground">¿No encuentras lo que buscas?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Crea tu propia academia y comparte tu conocimiento con miles de estudiantes.
          </p>
          <Button size="lg" variant="default" className="px-8">
            Crear Mi Academia
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}