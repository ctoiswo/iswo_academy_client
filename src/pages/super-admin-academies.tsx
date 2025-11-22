import { useState, useEffect, useCallback } from 'react'
import { LayoutGrid, List, Plus, Search, Users, BookOpen, Calendar, MoreVertical, Edit, Eye, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import academyService, { type FeaturedAcademy } from '@/services/academy-service'

type ViewMode = 'grid' | 'list'

interface PaginationMeta {
  current_page: number
  total_pages: number
  total_count: number
  per_page: number
}

export default function SuperAdminAcademies() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [academies, setAcademies] = useState<FeaturedAcademy[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    per_page: 15
  })

  const loadAcademies = useCallback(async (page: number = 1, search: string = '') => {
    try {
      setLoading(true)
      const result = await academyService.getAcademies({
        page,
        per_page: 15,
        search: search || undefined
      })
      setAcademies(result.data)
      setPagination(result.meta)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error loading academies:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAcademies(1, searchQuery)
  }, [searchQuery, loadAcademies])

  useEffect(() => {
    // Debounce search
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [searchInput])

  const handleSearch = (value: string) => {
    setSearchInput(value)
  }

  const handlePageChange = (page: number) => {
    loadAcademies(page, searchQuery)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Academias</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona todas las academias de la plataforma
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Academia
        </Button>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar academias..."
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center border rounded-lg self-start">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-r-none"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando academias...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && academies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery ? 'No se encontraron academias' : 'No hay academias disponibles'}
          </p>
        </div>
      )}

      {/* Grid View */}
      {!loading && viewMode === 'grid' && academies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {academies.map((academy) => (
            <Card key={academy.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="space-y-0 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={academy.logo_url || undefined} />
                      <AvatarFallback>{academy.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{academy.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {academy.slug}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Configuración
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {academy.description || 'Sin descripción'}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{academy.enrolled_users_count || 0} estudiantes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{academy.courses_count || 0} cursos</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {academy.subscription_required && (
                    <Badge variant="outline">${academy.monthly_price}/mes</Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1.5" />
                {academy.creator?.name || 'Sin creador'}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {!loading && viewMode === 'list' && academies.length > 0 && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Academia</TableHead>
                <TableHead>Estudiantes</TableHead>
                <TableHead>Cursos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Creador</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {academies.map((academy) => (
                <TableRow key={academy.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={academy.logo_url || undefined} />
                        <AvatarFallback>{academy.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{academy.name}</div>
                        <div className="text-sm text-muted-foreground">{academy.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {academy.enrolled_users_count || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      {academy.courses_count || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    {academy.subscription_required ? (
                      <Badge variant="default">Premium</Badge>
                    ) : (
                      <Badge variant="secondary">Gratuita</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {academy.subscription_required ? (
                      <span className="text-sm">${academy.monthly_price}/mes</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Gratis</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {academy.creator?.name || 'Sin creador'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          Configuración
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Pagination */}
      {!loading && academies.length > 0 && pagination.total_pages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {(pagination.current_page - 1) * pagination.per_page + 1} a{' '}
            {Math.min(pagination.current_page * pagination.per_page, pagination.total_count)} de{' '}
            {pagination.total_count} academias
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show first page, last page, current page, and pages around current
                  return (
                    page === 1 ||
                    page === pagination.total_pages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                })
                .map((page, index, array) => {
                  // Add ellipsis if there's a gap
                  const showEllipsisBefore = index > 0 && page - array[index - 1] > 1
                  return (
                    <div key={page} className="flex items-center gap-1">
                      {showEllipsisBefore && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    </div>
                  )
                })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.total_pages}
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
