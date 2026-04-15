import {
  Building2,
  Users,
  BookOpen,
  DollarSign,
  MoreHorizontal,
  Eye,
  Edit,
  Settings,
  Route,
  Ban,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { superAdminApi } from '@/lib/api-client'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import type { AcademyOverview } from '../types'

interface AcademyRowProps {
  academy: AcademyOverview
  onRefresh: () => void
}

const STATUS_VARIANT: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  active: 'default',
  inactive: 'secondary',
  suspended: 'destructive',
}

export function AcademyRow({ academy, onRefresh }: AcademyRowProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleSuspend = async () => {
    try {
      await superAdminApi.updateAcademyStatus(academy.id, 'inactive')
      toast.success(`Academia "${academy.name}" suspendida`)
      onRefresh()
    } catch {
      toast.error('No se pudo suspender la academia')
    }
  }

  return (
    <TableRow>
      {/* Name + description */}
      <TableCell className='max-w-[620px]'>
        <div className='flex items-center space-x-3'>
          <div className='flex-shrink-0'>
            {academy.logo_url ? (
              <img
                src={academy.logo_url}
                alt={academy.name}
                className='h-8 w-8 rounded-full object-cover'
              />
            ) : (
              <div className='bg-muted flex h-8 w-8 items-center justify-center rounded-full'>
                <Building2 className='text-muted-foreground h-4 w-4' />
              </div>
            )}
          </div>
          <div className='min-w-0'>
            <p className='truncate font-medium'>{academy.name}</p>
            <p className='text-muted-foreground truncate text-sm'>
              {academy.description}
            </p>
          </div>
        </div>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge variant={STATUS_VARIANT[academy.status] ?? 'outline'}>
          {t(
            `super_admin.academies.status${academy.status.charAt(0).toUpperCase() + academy.status.slice(1)}`
          )}
        </Badge>
      </TableCell>

      {/* Users */}
      <TableCell className='hidden text-right sm:table-cell'>
        <div className='flex items-center justify-end space-x-1'>
          <Users className='text-muted-foreground h-4 w-4' />
          <span>{academy.total_users.toLocaleString()}</span>
        </div>
      </TableCell>

      {/* Courses */}
      <TableCell className='hidden text-right md:table-cell'>
        <div className='flex items-center justify-end space-x-1'>
          <BookOpen className='text-muted-foreground h-4 w-4' />
          <span>{academy.total_courses}</span>
        </div>
      </TableCell>

      {/* Revenue */}
      <TableCell className='text-right'>
        <div className='flex items-center justify-end space-x-1'>
          <DollarSign className='text-muted-foreground h-4 w-4' />
          <span>{formatCurrency(academy.total_revenue)}</span>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              onClick={() => navigate({ to: '/academy/$academySlug/dashboard', params: { academySlug: academy.slug } })}
            >
              <Eye className='mr-2 h-4 w-4' />
              {t('super_admin.academies.actionView')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate({ to: '/academy/$academySlug/settings', params: { academySlug: academy.slug } })}
            >
              <Edit className='mr-2 h-4 w-4' />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate({ to: '/academy/$academySlug/admin/courses', params: { academySlug: academy.slug } })}
            >
              <BookOpen className='mr-2 h-4 w-4' />
              Cursos
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate({ to: '/academy/$academySlug/learning-paths', params: { academySlug: academy.slug } })}
            >
              <Route className='mr-2 h-4 w-4' />
              Rutas de Aprendizaje
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate({ to: '/academy/$academySlug/settings', params: { academySlug: academy.slug } })}
            >
              <Settings className='mr-2 h-4 w-4' />
              {t('super_admin.academies.actionSettings')}
            </DropdownMenuItem>
            <DropdownMenuItem className='text-destructive' onClick={handleSuspend}>
              <Ban className='mr-2 h-4 w-4' />
              {t('super_admin.academies.actionSuspend')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
