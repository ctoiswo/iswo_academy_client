import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Award, TrendingUp, Users, Trophy, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import superAdminGamificationService, { type GamificationOverview } from '@/services/super-admin-gamification-service'
import academyService from '@/services/academy-service'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function SuperAdminGamification() {
  const navigate = useNavigate()
  const [overview, setOverview] = useState<GamificationOverview | null>(null)
  const [academies, setAcademies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'enabled' | 'disabled'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    per_page: 15
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(searchInput)
      setCurrentPage(1)
      fetchData(1, searchInput)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [searchInput])

  useEffect(() => {
    setCurrentPage(1)
    fetchData(1, searchTerm)
  }, [filterStatus])

  const fetchData = async (page: number = currentPage, search: string = searchTerm) => {
    try {
      setLoading(true)
      const [overviewData, academiesData] = await Promise.all([
        superAdminGamificationService.getOverview(),
        academyService.getAcademies({
          page,
          per_page: 15,
          search: search || undefined,
          gamification: filterStatus !== 'all' ? filterStatus : undefined,
          view: 'light' // Always use light view to avoid loading courses
        }),
      ])
      setOverview(overviewData)
      setAcademies(academiesData.data)
      setPagination(academiesData.meta)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching gamification data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleGamification = async (academySlug: string, currentStatus: boolean) => {
    const newStatus = !currentStatus
    
    // Actualización optimista del estado local
    setAcademies(prevAcademies =>
      prevAcademies.map(academy =>
        academy.slug === academySlug
          ? {
              ...academy,
              academy_configuration: {
                ...academy.academy_configuration,
                enable_gamification: newStatus
              }
            }
          : academy
      )
    )

    try {
      await superAdminGamificationService.toggleGamification(academySlug, newStatus)
      
      // Actualizar overview para reflejar el cambio en las estadísticas
      const overviewData = await superAdminGamificationService.getOverview()
      setOverview(overviewData)
      
      toast.success(
        newStatus 
          ? '¡Gamificación activada correctamente!' 
          : 'Gamificación desactivada correctamente'
      )
    } catch (error: any) {
      console.error('Error toggling gamification:', error)
      
      // Revertir el cambio optimista en caso de error
      setAcademies(prevAcademies =>
        prevAcademies.map(academy =>
          academy.slug === academySlug
            ? {
                ...academy,
                academy_configuration: {
                  ...academy.academy_configuration,
                  enable_gamification: currentStatus
                }
              }
            : academy
        )
      )
      
      toast.error(
        error.response?.data?.message || 
        'No se pudo cambiar el estado de gamificación'
      )
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Gamificación</h1>
          <p className="text-muted-foreground">
            Gestiona la configuración de gamificación y badges en todas las academias
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      {overview && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Badges</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.total_badges}</div>
              <p className="text-xs text-muted-foreground">En todas las academias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Badges Ganados</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.total_user_badges}</div>
              <p className="text-xs text-muted-foreground">Por todos los usuarios</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Academias Activas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.academies_with_gamification}</div>
              <p className="text-xs text-muted-foreground">Con gamificación habilitada</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Puntos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overview.total_points_awarded.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Puntos otorgados</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Academies Management */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Gamificación por Academia</CardTitle>
          <CardDescription>
            Habilita o deshabilita la gamificación para cada academia
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar academias..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Estado de gamificación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Academias</SelectItem>
                <SelectItem value="enabled">Gamificación Habilitada</SelectItem>
                <SelectItem value="disabled">Gamificación Deshabilitada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Academies Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Academia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Badges</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {academies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No se encontraron academias
                    </TableCell>
                  </TableRow>
                ) : (
                  academies.map((academy) => {
                    const gamificationEnabled =
                      Boolean(academy.academy_configuration?.enable_gamification)
                    return (
                      <TableRow key={academy.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{academy.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {academy.slug}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={gamificationEnabled}
                              onCheckedChange={() =>
                                handleToggleGamification(academy.slug, gamificationEnabled)
                              }
                            />
                            <Badge variant={gamificationEnabled ? 'default' : 'secondary'}>
                              {gamificationEnabled ? 'Habilitada' : 'Deshabilitada'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{academy.badges_count || 0} badges</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate({
                                to: `/super-admin/gamification/academies/${academy.slug}/badges`,
                              })
                            }
                          >
                            <Award className="mr-2 h-4 w-4" />
                            Gestionar Badges
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {(pagination.current_page - 1) * pagination.per_page + 1} a{' '}
                {Math.min(pagination.current_page * pagination.per_page, pagination.total_count)} de{' '}
                {pagination.total_count} academias
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchData(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                    .filter((page) => {
                      return (
                        page === 1 ||
                        page === pagination.total_pages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      )
                    })
                    .map((page, index, array) => {
                      const showEllipsisBefore = index > 0 && page - array[index - 1] > 1
                      return (
                        <div key={page} className="flex items-center gap-1">
                          {showEllipsisBefore && (
                            <span className="px-2 text-muted-foreground">...</span>
                          )}
                          <Button
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => fetchData(page)}
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
                  onClick={() => fetchData(currentPage + 1)}
                  disabled={currentPage === pagination.total_pages}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Academies */}
      {overview && overview.top_academies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Academias por Badges</CardTitle>
            <CardDescription>Academias con más badges creados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overview.top_academies.map((academy, index) => (
                <div key={academy.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{academy.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {academy.badge_count} badges
                      </div>
                    </div>
                  </div>
                  <Trophy className="h-5 w-5 text-yellow-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
