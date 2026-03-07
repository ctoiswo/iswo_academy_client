import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useTranslation } from '@/hooks/use-translation'
import type { SuperAdminPayment } from '@/lib/super-admin-api'
import type { RefundTarget } from '../types'
import { PaymentRow } from './payment-row'

interface PaymentTableProps {
  payments: SuperAdminPayment[]
  loading: boolean
  onRefund: (target: RefundTarget) => void
}

export function PaymentTable({ payments, loading, onRefund }: PaymentTableProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <Card>
        <div className='py-16 text-center'>
          <p className='text-muted-foreground'>{t('superAdmin.payments.table.loading')}</p>
        </div>
      </Card>
    )
  }

  if (payments.length === 0) {
    return (
      <Card>
        <div className='py-16 text-center'>
          <p className='text-muted-foreground'>{t('superAdmin.payments.table.empty')}</p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('superAdmin.payments.table.user')}</TableHead>
            <TableHead>{t('superAdmin.payments.table.amount')}</TableHead>
            <TableHead>{t('superAdmin.payments.table.status')}</TableHead>
            <TableHead>{t('superAdmin.payments.table.resource')}</TableHead>
            <TableHead>{t('superAdmin.payments.table.provider')}</TableHead>
            <TableHead>{t('superAdmin.payments.table.date')}</TableHead>
            <TableHead className='w-12'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <PaymentRow key={payment.id} payment={payment} onRefund={onRefund} />
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
