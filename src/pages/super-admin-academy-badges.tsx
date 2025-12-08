import { useState, useEffect } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import superAdminGamificationService from '@/services/super-admin-gamification-service'
import type { BadgeDetail } from '@/types'
import {
  Award,
  Filter,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  Trophy,
  Star,
  TrendingUp,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EditBadgeDialog } from '@/components/super-admin/edit-badge-dialog'

const CATEGORY_LABELS: Record<string, string> = {
  milestone: 'Hitos',
  social: 'Social',
  mastery: 'Maestría',
  special: 'Especial',
  streak: 'Racha',
  collection: 'Colección',
}

const TIER_LABELS: Record<string, string> = {
  bronze: 'Bronce',
  silver: 'Plata',
  gold: 'Oro',
  platinum: 'Platino',
  diamond: 'Diamante',
}

const RARITY_LABELS: Record<string, string> = {
  common: 'Común',
  uncommon: 'Poco común',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Legendario',
}

export default function SuperAdminAcademyBadges() {
  const navigate = useNavigate()
  const { slug } = useParams({
    from: '/_authenticated/super-admin/gamification/academies/$slug/badges',
  })

  const [badges, setBadges] = useState<BadgeDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterTier, setFilterTier] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [badgeToDelete, setBadgeToDelete] = useState<BadgeDetail | null>(null)
  const [badgeToEdit, setBadgeToEdit] = useState<BadgeDetail | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    secret: 0,
    totalPoints: 0,
  })

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchInput)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [searchInput])

  // Initial load
  useEffect(() => {
    fetchBadges(true)
  }, [slug])

  // Filter changes
  useEffect(() => {
    if (!loading) {
      fetchBadges(false)
    }
  }, [debouncedSearch, filterCategory, filterTier, filterStatus])

  const fetchBadges = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true)
      } else {
        setIsFiltering(true)
      }

      // Preparar filtros para el backend
      const filters: any = {}

      if (debouncedSearch) filters.search = debouncedSearch
      if (filterCategory !== 'all') filters.category = filterCategory
      if (filterTier !== 'all') filters.tier = filterTier
      if (filterStatus !== 'all') filters.status = filterStatus

      const data = await superAdminGamificationService.getAcademyBadges(
        slug,
        filters
      )
      setBadges(data)

      // Calculate stats
      const stats = {
        total: data.length,
        active: data.filter((b) => b.is_active).length,
        secret: data.filter((b) => b.is_secret).length,
        totalPoints: data.reduce((sum, b) => sum + b.points_reward, 0),
      }
      setStats(stats)
    } catch (_error) {
      // console.error('Error fetching badges:', error)
      toast.error('No se pudieron cargar los badges')
    } finally {
      if (isInitialLoad) {
        setLoading(false)
      } else {
        setIsFiltering(false)
      }
    }
  }

  const handleToggleActive = async (badge: BadgeDetail) => {
    const newStatus = !badge.is_active

    // Actualización optimista
    setBadges((prev) =>
      prev.map((b) => (b.id === badge.id ? { ...b, is_active: newStatus } : b))
    )

    try {
      await superAdminGamificationService.updateBadge(slug, badge.id, {
        is_active: newStatus,
      })

      toast.success(
        newStatus
          ? 'Badge activado correctamente'
          : 'Badge desactivado correctamente'
      )

      // Actualizar estadísticas
      setStats((prev) => ({
        ...prev,
        active: newStatus ? prev.active + 1 : prev.active - 1,
      }))
    } catch (error: any) {
      // console.error('Error toggling badge status:', error)

      // Revertir cambio optimista
      setBadges((prev) =>
        prev.map((b) =>
          b.id === badge.id ? { ...b, is_active: badge.is_active } : b
        )
      )

      toast.error(
        error.response?.data?.message ||
          'No se pudo cambiar el estado del badge'
      )
    }
  }

  const handleDeleteBadge = async () => {
    if (!badgeToDelete) return

    try {
      await superAdminGamificationService.deleteBadge(slug, badgeToDelete.id)

      setBadges((prev) => prev.filter((b) => b.id !== badgeToDelete.id))

      toast.success('Badge eliminado correctamente')

      // Actualizar estadísticas
      setStats((prev) => ({
        total: prev.total - 1,
        active: badgeToDelete.is_active ? prev.active - 1 : prev.active,
        secret: badgeToDelete.is_secret ? prev.secret - 1 : prev.secret,
        totalPoints: prev.totalPoints - badgeToDelete.points_reward,
      }))

      setBadgeToDelete(null)
    } catch (error: any) {
      // console.error('Error deleting badge:', error)
      toast.error(
        error.response?.data?.message || 'No se pudo eliminar el badge'
      )
    }
  }

  // Los badges ya vienen filtrados del backend
  const filteredBadges = badges

  if (loading) {
    return (
      <div className='container mx-auto space-y-6 p-6'>
        <Skeleton className='h-12 w-full' />
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className='h-32' />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => navigate({ to: '/super-admin/gamification' })}
          >
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <div>
            <h1 className='text-3xl font-bold'>Gestión de Badges</h1>
            <p className='text-muted-foreground'>Academia: {slug}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total de Badges
            </CardTitle>
            <Award className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.total}</div>
            <p className='text-muted-foreground text-xs'>En esta academia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Badges Activos
            </CardTitle>
            <Trophy className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.active}</div>
            <p className='text-muted-foreground text-xs'>
              {stats.total > 0
                ? `${Math.round((stats.active / stats.total) * 100)}%`
                : '0%'}{' '}
              del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Badges Secretos
            </CardTitle>
            <Eye className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.secret}</div>
            <p className='text-muted-foreground text-xs'>
              Ocultos hasta ganarlos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Puntos Totales
            </CardTitle>
            <TrendingUp className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {stats.totalPoints.toLocaleString()}
            </div>
            <p className='text-muted-foreground text-xs'>Puntos disponibles</p>
          </CardContent>
        </Card>
      </div>

      {/* Badges Management */}
      <Card>
        <CardHeader>
          <CardTitle>Badges de la Academia</CardTitle>
          <CardDescription>
            Gestiona los badges disponibles para los estudiantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className='mb-4 flex flex-col gap-4 sm:flex-row'>
            <div className='relative flex-1'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
              <Input
                placeholder='Buscar badges...'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className='pl-9'
                disabled={isFiltering}
              />
            </div>
            <Select
              value={filterCategory}
              onValueChange={setFilterCategory}
              disabled={isFiltering}
            >
              <SelectTrigger className='w-full sm:w-[180px]'>
                <Filter className='mr-2 h-4 w-4' />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todas las Categorías</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterTier}
              onValueChange={setFilterTier}
              disabled={isFiltering}
            >
              <SelectTrigger className='w-full sm:w-[180px]'>
                <Star className='mr-2 h-4 w-4' />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todos los Niveles</SelectItem>
                {Object.entries(TIER_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterStatus}
              onValueChange={setFilterStatus}
              disabled={isFiltering}
            >
              <SelectTrigger className='w-full sm:w-[180px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todos los Estados</SelectItem>
                <SelectItem value='active'>Activos</SelectItem>
                <SelectItem value='inactive'>Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Badges Table */}
          <div className='relative rounded-md border'>
            {isFiltering && (
              <div className='bg-background/50 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm'>
                <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                  <div className='border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent' />
                  Filtrando badges...
                </div>
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Badge</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Rareza</TableHead>
                  <TableHead>Puntos</TableHead>
                  <TableHead>Ganado</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className='text-right'>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBadges.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className='text-center'>
                      No se encontraron badges
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBadges.map((badge) => (
                    <TableRow key={badge.id}>
                      <TableCell>
                        <div className='flex items-center gap-3'>
                          {badge.icon_url ? (
                            <img
                              src={badge.icon_url}
                              alt={badge.name}
                              className='h-10 w-10 rounded-full'
                            />
                          ) : (
                            <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
                              <Award className='text-primary h-5 w-5' />
                            </div>
                          )}
                          <div>
                            <div className='flex items-center gap-2 font-medium'>
                              {badge.name}
                              {badge.is_secret && (
                                <EyeOff className='text-muted-foreground h-3 w-3' />
                              )}
                            </div>
                            <div className='text-muted-foreground line-clamp-1 text-sm'>
                              {badge.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>
                          {CATEGORY_LABELS[badge.category] || badge.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={
                            badge.tier === 'bronze'
                              ? 'border-orange-500 text-orange-500'
                              : badge.tier === 'silver'
                                ? 'border-gray-400 text-gray-400'
                                : badge.tier === 'gold'
                                  ? 'border-yellow-500 text-yellow-500'
                                  : badge.tier === 'platinum'
                                    ? 'border-cyan-500 text-cyan-500'
                                    : 'border-purple-500 text-purple-500'
                          }
                        >
                          {TIER_LABELS[badge.tier] || badge.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className='text-sm'>
                          {RARITY_LABELS[badge.rarity] || badge.rarity}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className='font-medium'>
                          {badge.points_reward}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className='text-sm'>
                          <div className='font-medium'>
                            {badge.earned_count} veces
                          </div>
                          <div className='text-muted-foreground'>
                            {badge.earn_rate?.toFixed(1)}% de usuarios
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Switch
                            checked={badge.is_active}
                            onCheckedChange={() => handleToggleActive(badge)}
                          />
                          <Badge
                            variant={badge.is_active ? 'default' : 'secondary'}
                          >
                            {badge.is_active ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setBadgeToEdit(badge)}
                            title='Editar badge'
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => setBadgeToDelete(badge)}
                            title='Eliminar badge'
                          >
                            <Trash2 className='text-destructive h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Results count */}
          {filteredBadges.length > 0 && (
            <div className='text-muted-foreground mt-4 text-sm'>
              Mostrando {filteredBadges.length}{' '}
              {filteredBadges.length === 1 ? 'badge' : 'badges'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Badge Dialog */}
      <EditBadgeDialog
        open={!!badgeToEdit}
        onOpenChange={(open) => !open && setBadgeToEdit(null)}
        badge={badgeToEdit}
        academySlug={slug}
        onSuccess={fetchBadges}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!badgeToDelete}
        onOpenChange={(open) => !open && setBadgeToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Estás seguro de eliminar este badge?
            </AlertDialogTitle>
            <AlertDialogDescription className='space-y-3'>
              <p>
                Estás a punto de eliminar el badge{' '}
                <strong>"{badgeToDelete?.name}"</strong>.
              </p>
              <div className='bg-muted space-y-1 rounded-lg p-3'>
                <p className='text-sm font-medium'>Información del badge:</p>
                <ul className='space-y-1 text-sm'>
                  <li>• Ganado {badgeToDelete?.earned_count} veces</li>
                  <li>• {badgeToDelete?.points_reward} puntos de recompensa</li>
                  <li>
                    • Estado: {badgeToDelete?.is_active ? 'Activo' : 'Inactivo'}
                  </li>
                </ul>
              </div>
              <p className='text-destructive font-medium'>
                ⚠️ Esta acción no se puede deshacer.
              </p>
              <p className='text-sm'>
                Los usuarios que ya ganaron este badge lo conservarán en sus
                perfiles, pero no se podrá ganar más en el futuro.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBadge}
              className='bg-destructive hover:bg-destructive/90'
            >
              Sí, eliminar badge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
