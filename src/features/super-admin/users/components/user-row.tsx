import {
  ShieldCheck,
  UserCheck,
  UserX,
  MoreVertical,
  Shield,
  ShieldOff,
} from 'lucide-react'
import type { SuperAdminUser } from '@/lib/super-admin-api'
import { useTranslation } from '@/hooks/use-translation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import type { ConfirmTarget } from '../types'

type TFunction = ReturnType<typeof useTranslation>['t']

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatRelative(iso: string | null, t: TFunction) {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return t('superAdmin.users.relative.today')
  if (days === 1) return t('superAdmin.users.relative.yesterday')
  if (days < 30) return t('superAdmin.users.relative.days', { count: days })
  if (days < 365)
    return t('superAdmin.users.relative.months', {
      count: Math.floor(days / 30),
    })
  return t('superAdmin.users.relative.years', { count: Math.floor(days / 365) })
}

interface UserRowProps {
  user: SuperAdminUser
  currentUserId: number | undefined
  onConfirm: (target: ConfirmTarget) => void
}

export function UserRow({ user: u, currentUserId, onConfirm }: UserRowProps) {
  const { t } = useTranslation()
  return (
    <TableRow>
      {/* Identity */}
      <TableCell>
        <div className='flex items-center gap-3'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src={u.avatar_url || undefined} />
            <AvatarFallback>
              {(u.first_name?.[0] ?? '') + (u.last_name?.[0] ?? '')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className='flex items-center gap-2 font-medium'>
              {u.full_name || `${u.first_name} ${u.last_name}`}
              {u.is_super_admin && (
                <Badge
                  variant='default'
                  className='bg-purple-600 px-1.5 py-0 text-[10px]'
                >
                  <ShieldCheck className='mr-0.5 h-2.5 w-2.5' />
                  Super Admin
                </Badge>
              )}
            </div>
            <div className='text-muted-foreground text-sm'>{u.email}</div>
          </div>
        </div>
      </TableCell>

      {/* Status */}
      <TableCell>
        {u.confirmed ? (
          <Badge variant='secondary' className='text-green-700'>
            <UserCheck className='mr-1 h-3 w-3' />
            {t('superAdmin.users.table.statusConfirmed')}
          </Badge>
        ) : (
          <Badge variant='outline' className='text-amber-600'>
            <UserX className='mr-1 h-3 w-3' />
            {t('superAdmin.users.table.statusPending')}
          </Badge>
        )}
      </TableCell>

      {/* Academies */}
      <TableCell>
        <div className='flex flex-col gap-0.5'>
          <span className='font-medium'>{u.academies_count}</span>
          {u.academies.length > 0 && (
            <span className='text-muted-foreground truncate text-xs'>
              {u.academies.map((a) => a.name).join(', ')}
              {u.academies_count > 3 && (
                <>
                  {' '}
                  {t('superAdmin.users.table.moreAcademies', {
                    count: u.academies_count - 3,
                  })}
                </>
              )}
            </span>
          )}
        </div>
      </TableCell>

      {/* Registration date */}
      <TableCell className='text-muted-foreground text-sm'>
        {formatDate(u.created_at)}
      </TableCell>

      {/* Last login */}
      <TableCell className='text-muted-foreground text-sm'>
        {formatRelative(u.last_login_at, t)}
      </TableCell>

      {/* Actions */}
      <TableCell className='text-right'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='h-8 w-8'>
              <MoreVertical className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {!u.is_super_admin ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className='text-purple-600'
                  onClick={() => onConfirm({ user: u, action: 'promote' })}
                >
                  <Shield className='mr-2 h-4 w-4' />
                  {t('superAdmin.users.table.makeSuperAdmin')}
                </DropdownMenuItem>
              </>
            ) : (
              currentUserId !== u.id && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className='text-destructive'
                    onClick={() => onConfirm({ user: u, action: 'demote' })}
                  >
                    <ShieldOff className='mr-2 h-4 w-4' />
                    {t('superAdmin.users.table.removeSuperAdmin')}
                  </DropdownMenuItem>
                </>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}

export { CalendarDays, Clock, Building2 } from 'lucide-react'
