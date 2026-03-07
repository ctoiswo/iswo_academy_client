import { MoreVertical, RefreshCw, CalendarDays, Tag } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import { useTranslation } from '@/hooks/use-translation'
import type { SuperAdminPayment, PaymentStatus } from '@/lib/super-admin-api'
import type { RefundTarget } from '../types'

const STATUS_VARIANTS: Record<PaymentStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  completed: 'default',
  pending: 'secondary',
  failed: 'destructive',
  refunded: 'outline',
}

interface PaymentRowProps {
  payment: SuperAdminPayment
  onRefund: (target: RefundTarget) => void
}

export function PaymentRow({ payment: p, onRefund }: PaymentRowProps) {
  const { t, i18n } = useTranslation()

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  function formatCurrency(amount: number, currency: string | null) {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: currency ?? 'MXN',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const STATUS_LABELS: Record<PaymentStatus, string> = {
    completed: t('superAdmin.payments.table.statusCompleted'),
    pending: t('superAdmin.payments.table.statusPending'),
    failed: t('superAdmin.payments.table.statusFailed'),
    refunded: t('superAdmin.payments.table.statusRefunded'),
  }

  const userInitials = p.user
    ? (p.user.full_name ?? p.user.email)
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?'

  return (
    <TableRow>
      {/* User */}
      <TableCell>
        <div className='flex items-center gap-3'>
          <Avatar className='h-8 w-8'>
            <AvatarFallback className='text-xs'>{userInitials}</AvatarFallback>
          </Avatar>
          <div className='min-w-0'>
            <p className='truncate text-sm font-medium'>
              {p.user?.full_name ?? '—'}
            </p>
            <p className='text-muted-foreground truncate text-xs'>
              {p.user?.email ?? '—'}
            </p>
          </div>
        </div>
      </TableCell>

      {/* Amount */}
      <TableCell>
        <span className='font-semibold'>
          {formatCurrency(p.amount, p.currency)}
        </span>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge variant={STATUS_VARIANTS[p.status]}>
          {STATUS_LABELS[p.status]}
        </Badge>
      </TableCell>

      {/* Payable */}
      <TableCell>
        <div className='flex items-center gap-1.5'>
          <Tag className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
          <div className='min-w-0'>
            <p className='truncate text-sm'>{p.payable?.name ?? '—'}</p>
            <p className='text-muted-foreground text-xs'>{p.payable_type}</p>
          </div>
        </div>
      </TableCell>

      {/* Provider */}
      <TableCell>
        <span className='text-sm capitalize'>{p.provider ?? '—'}</span>
      </TableCell>

      {/* Date */}
      <TableCell>
        <div className='flex items-center gap-1.5 text-sm'>
          <CalendarDays className='text-muted-foreground h-3.5 w-3.5' />
          {formatDate(p.created_at)}
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell>
        {p.status === 'completed' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                onClick={() => onRefund({ payment: p })}
                className='text-destructive focus:text-destructive'
              >
                <RefreshCw className='mr-2 h-4 w-4' />
                {t('superAdmin.payments.table.refundAction')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  )
}
