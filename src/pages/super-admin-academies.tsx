import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { PaginationMeta } from '@/types'
import {
  LayoutGrid,
  List,
  Plus,
  Search,
  Users,
  BookOpen,
  Calendar,
  MoreVertical,
  Edit,
  Eye,
  Settings,
  Route,
  ChevronLeft,
  ChevronRight,
  Ban,
  Trash2,
  RotateCcw,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { superAdminApi, type AcademyOverview } from '@/lib/super-admin-api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

type ViewMode = 'grid' | 'list'

export default function SuperAdminAcademies() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [academies, setAcademies] = useState<AcademyOverview[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    per_page: 15,
  })

  const loadAcademies = useCallback(
    async (page: number = 1, search: string = '') => {
      try {
        setLoading(true)
        const result = await superAdminApi.getAcademies({
          page,
          per_page: 15,
          search: search || undefined,
        })
        setAcademies(result.data)
        setPagination(result.meta)
        setCurrentPage(page)
      } catch (_error) {
        // console.error('Error loading academies:', error)
      } finally {
        setLoading(false)
      }
    },
    []
  )

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

  const handleSuspend = async (academy: AcademyOverview) => {
    try {
      await superAdminApi.updateAcademyStatus(academy.slug, 'inactive')
      toast.success(`Academia "${academy.name}" suspendida`)
      loadAcademies(currentPage, searchQuery)
    } catch {
      toast.error('No se pudo suspender la academia')
    }
  }

  const handleReactivate = async (academy: AcademyOverview) => {
    try {
      await superAdminApi.updateAcademyStatus(academy.slug, 'active')
      toast.success(`Academia "${academy.name}" reactivada`)
      loadAcademies(currentPage, searchQuery)
    } catch {
      toast.error('No se pudo reactivar la academia')
    }
  }

  const handleDelete = async (academy: AcademyOverview) => {
    if (!window.confirm(`¿Eliminar permanentemente la academia "${academy.name}"? Esta acción no se puede deshacer.`)) return
    try {
      await superAdminApi.deleteAcademy(academy.slug)
      toast.success(`Academia "${academy.name}" eliminada`)
      loadAcademies(currentPage, searchQuery)
    } catch {
      toast.error('No se pudo eliminar la academia')
    }
  }

  const statusLabel = (status: AcademyOverview['status']) => {
    if (status === 'active') return 'Activa'
    if (status === 'suspended') return 'Suspendida'
    return 'Inactiva'
  }

  const statusVariant = (status: AcademyOverview['status']): 'default' | 'secondary' | 'destructive' => {
    if (status === 'active') return 'default'
    if (status === 'suspended') return 'destructive'
    return 'secondary'
  }

  return (
    <DashboardLayout
      user={user}
      academy={null}
      variant='full'
      dashboardType='super-admin'
      title='Academias'
      subtitle='Gestiona todas las academias de la plataforma'
    >
      <div className='space-y-6'>
        {/* Filters and View Toggle */}
        <div className='flex flex-col items-stretch gap-4 sm:flex-row sm:items-center'>
          <div className='relative flex-1'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
            <Input
              placeholder='Buscar academias...'
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className='pl-10'
            />
          </div>
          <div className='flex items-center self-start rounded-lg border'>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size='sm'
              onClick={() => setViewMode('grid')}
              className='rounded-r-none'
            >
              <LayoutGrid className='h-4 w-4' />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size='sm'
              onClick={() => setViewMode('list')}
              className='rounded-l-none'
            >
              <List className='h-4 w-4' />
            </Button>
          </div>
          <Button
            className='self-start'
            onClick={() => navigate({ to: '/create-academy' })}
          >
            <Plus className='mr-2 h-4 w-4' />
            Nueva Academia
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className='py-12 text-center'>
            <p className='text-muted-foreground'>Cargando academias...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && academies.length === 0 && (
          <div className='py-12 text-center'>
            <p className='text-muted-foreground'>
              {searchQuery
                ? 'No se encontraron academias'
                : 'No hay academias disponibles'}
            </p>
          </div>
        )}

        {/* Grid View */}
        {!loading && viewMode === 'grid' && academies.length > 0 && (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {academies.map((academy) => (
              <Card
                key={academy.id}
                className='transition-shadow hover:shadow-lg'
              >
                <CardHeader className='space-y-0 pb-4'>
                  <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-12 w-12'>
                        <AvatarImage src={academy.logo_url || undefined} />
                        <AvatarFallback>
                          {academy.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className='text-lg'>
                          {academy.name}
                        </CardTitle>
                        <CardDescription className='mt-1 text-xs'>
                          {academy.slug}
                        </CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate({
                              to: '/academy/$academySlug/dashboard',
                              params: { academySlug: academy.slug },
                            })
                          }
                        >
                          <Eye className='mr-2 h-4 w-4' />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate({
                              to: '/academy/$academySlug/settings',
                              params: { academySlug: academy.slug },
                            })
                          }
                        >
                          <Edit className='mr-2 h-4 w-4' />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate({
                              to: '/academy/$academySlug/admin/courses',
                              params: { academySlug: academy.slug },
                            })
                          }
                        >
                          <BookOpen className='mr-2 h-4 w-4' />
                          Cursos
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate({
                              to: '/academy/$academySlug/learning-paths',
                              params: { academySlug: academy.slug },
                            })
                          }
                        >
                          <Route className='mr-2 h-4 w-4' />
                          Rutas de Aprendizaje
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate({
                              to: '/academy/$academySlug/settings',
                              params: { academySlug: academy.slug },
                            })
                          }
                        >
                          <Settings className='mr-2 h-4 w-4' />
                          Configuración
                        </DropdownMenuItem>
                        {academy.status === 'active' && (
                          <DropdownMenuItem
                            className='text-destructive'
                            onClick={() => handleSuspend(academy)}
                          >
                            <Ban className='mr-2 h-4 w-4' />
                            Suspender academia
                          </DropdownMenuItem>
                        )}
                        {academy.status === 'inactive' && (
                          <DropdownMenuItem
                            onClick={() => handleReactivate(academy)}
                          >
                            <RotateCcw className='mr-2 h-4 w-4' />
                            Reactivar academia
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className='text-destructive'
                            onClick={() => handleDelete(academy)}
                          >
                            <Trash2 className='mr-2 h-4 w-4' />
                            Eliminar academia
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <p className='text-muted-foreground line-clamp-2 text-sm'>
                    {academy.description || 'Sin descripción'}
                  </p>
                  <div className='flex items-center gap-4 text-sm'>
                    <div className='flex items-center gap-1.5'>
                      <Users className='text-muted-foreground h-4 w-4' />
                      <span>{academy.total_users || 0} estudiantes</span>
                    </div>
                    <div className='flex items-center gap-1.5'>
                      <BookOpen className='text-muted-foreground h-4 w-4' />
                      <span>{academy.total_courses || 0} cursos</span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Badge variant={statusVariant(academy.status)}>
                      {statusLabel(academy.status)}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className='text-muted-foreground text-xs'>
                  <Calendar className='mr-1.5 h-3 w-3' />
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
                  <TableHead>Ingresos</TableHead>
                  <TableHead>Creador</TableHead>
                  <TableHead className='text-right'>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {academies.map((academy) => (
                  <TableRow key={academy.id}>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-10 w-10'>
                          <AvatarImage src={academy.logo_url || undefined} />
                          <AvatarFallback>
                            {academy.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className='font-medium'>{academy.name}</div>
                          <div className='text-muted-foreground text-sm'>
                            {academy.slug}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1.5'>
                        <Users className='text-muted-foreground h-4 w-4' />
                        {academy.total_users || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1.5'>
                        <BookOpen className='text-muted-foreground h-4 w-4' />
                        {academy.total_courses || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(academy.status)}>
                        {statusLabel(academy.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className='text-sm'>
                        ${academy.total_revenue?.toFixed(2) || '0.00'}
                      </span>
                    </TableCell>
                    <TableCell className='text-muted-foreground text-sm'>
                      {academy.creator?.name || 'Sin creador'}
                    </TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8'
                          >
                            <MoreVertical className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate({
                                to: '/academy/$academySlug/dashboard',
                                params: { academySlug: academy.slug },
                              })
                            }
                          >
                            <Eye className='mr-2 h-4 w-4' />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate({
                                to: '/academy/$academySlug/settings',
                                params: { academySlug: academy.slug },
                              })
                            }
                          >
                            <Edit className='mr-2 h-4 w-4' />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate({
                                to: '/academy/$academySlug/admin/courses',
                                params: { academySlug: academy.slug },
                              })
                            }
                          >
                            <BookOpen className='mr-2 h-4 w-4' />
                            Cursos
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate({
                                to: '/academy/$academySlug/learning-paths',
                                params: { academySlug: academy.slug },
                              })
                            }
                          >
                            <Route className='mr-2 h-4 w-4' />
                            Rutas de Aprendizaje
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate({
                                to: '/academy/$academySlug/settings',
                                params: { academySlug: academy.slug },
                              })
                            }
                          >
                            <Settings className='mr-2 h-4 w-4' />
                            Configuración
                          </DropdownMenuItem>
                          {academy.status === 'active' && (
                            <DropdownMenuItem
                              className='text-destructive'
                              onClick={() => handleSuspend(academy)}
                            >
                              <Ban className='mr-2 h-4 w-4' />
                              Suspender academia
                            </DropdownMenuItem>
                          )}
                          {academy.status === 'inactive' && (
                            <DropdownMenuItem
                              onClick={() => handleReactivate(academy)}
                            >
                              <RotateCcw className='mr-2 h-4 w-4' />
                              Reactivar academia
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className='text-destructive'
                              onClick={() => handleDelete(academy)}
                            >
                              <Trash2 className='mr-2 h-4 w-4' />
                              Eliminar academia
                            </DropdownMenuItem>
                          )}
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
          <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
            <div className='text-muted-foreground text-sm'>
              Mostrando{' '}
              {(pagination.current_page - 1) * pagination.per_page + 1} a{' '}
              {Math.min(
                pagination.current_page * pagination.per_page,
                pagination.total_count
              )}{' '}
              de {pagination.total_count} academias
            </div>
            <div className='flex flex-wrap items-center justify-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className='h-4 w-4' />
                Anterior
              </Button>
              <div className='flex items-center gap-1'>
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
                    const showEllipsisBefore =
                      index > 0 && page - array[index - 1] > 1
                    return (
                      <div key={page} className='flex items-center gap-1'>
                        {showEllipsisBefore && (
                          <span className='text-muted-foreground px-2'>
                            ...
                          </span>
                        )}
                        <Button
                          variant={currentPage === page ? 'default' : 'outline'}
                          size='sm'
                          onClick={() => handlePageChange(page)}
                          className='w-10'
                        >
                          {page}
                        </Button>
                      </div>
                    )
                  })}
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.total_pages}
              >
                Siguiente
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
