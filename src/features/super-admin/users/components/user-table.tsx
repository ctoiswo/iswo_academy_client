import { CalendarDays, Clock, Building2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { SuperAdminUser } from '@/lib/super-admin-api'
import type { ConfirmTarget } from '../types'
import { UserRow } from './user-row'
import { useTranslation } from '@/hooks/use-translation'

interface UserTableProps {
  users: SuperAdminUser[]
  loading: boolean
  searchQuery: string
  currentUserId: number | undefined
  onConfirm: (target: ConfirmTarget) => void
}

export function UserTable({
  users,
  loading,
  searchQuery,
  currentUserId,
  onConfirm,
}: UserTableProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <Card>
        <div className='py-16 text-center'>
          <p className='text-muted-foreground'>{t('superAdmin.users.table.loading')}</p>
        </div>
      </Card>
    )
  }

  if (users.length === 0) {
    return (
      <Card>
        <div className='py-16 text-center'>
          <p className='text-muted-foreground'>
            {searchQuery
              ? t('superAdmin.users.table.emptySearch')
              : t('superAdmin.users.table.empty')}
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className='overflow-hidden'>
      <Table className='table-fixed'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[20%]'>{t('superAdmin.users.table.colUser')}</TableHead>
            <TableHead className='w-[10%]'>{t('superAdmin.users.table.colStatus')}</TableHead>
            <TableHead className='w-[30%]'>
              <span className='flex items-center gap-1'>
                <Building2 className='h-3.5 w-3.5' />
                {t('superAdmin.users.table.colAcademies')}
              </span>
            </TableHead>
            <TableHead className='w-[10%]'>
              <span className='flex items-center gap-1'>
                <CalendarDays className='h-3.5 w-3.5' />
                {t('superAdmin.users.table.colRegistered')}
              </span>
            </TableHead>
            <TableHead className='w-[10%]'>
              <span className='flex items-center gap-1'>
                <Clock className='h-3.5 w-3.5' />
                {t('superAdmin.users.table.colLastLogin')}
              </span>
            </TableHead>
            <TableHead className='w-[5%] text-right'>{t('superAdmin.users.table.colActions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              currentUserId={currentUserId}
              onConfirm={onConfirm}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
