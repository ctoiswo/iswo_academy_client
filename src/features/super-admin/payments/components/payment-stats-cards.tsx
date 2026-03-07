import { DollarSign, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from '@/hooks/use-translation'
import type { PaymentsMeta } from '@/lib/super-admin-api'

interface PaymentStatsCardsProps {
  meta: PaymentsMeta
}

export function PaymentStatsCards({ meta }: PaymentStatsCardsProps) {
  const { t, i18n } = useTranslation()

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const CARDS = [
    {
      label: t('superAdmin.payments.stats.totalRevenue'),
      key: 'total_revenue' as const,
      icon: DollarSign,
      color: 'text-emerald-500',
      format: 'currency' as const,
      subKey: 'this_month_revenue' as const,
    },
    {
      label: t('superAdmin.payments.stats.completed'),
      key: 'completed_count' as const,
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      label: t('superAdmin.payments.stats.pending'),
      key: 'pending_count' as const,
      icon: Clock,
      color: 'text-amber-500',
    },
    {
      label: t('superAdmin.payments.stats.failed'),
      key: 'failed_count' as const,
      icon: XCircle,
      color: 'text-red-500',
    },
    {
      label: t('superAdmin.payments.stats.refunded'),
      key: 'refunded_count' as const,
      icon: RefreshCw,
      color: 'text-blue-500',
    },
  ]

  return (
    <div className='grid grid-cols-2 gap-4 lg:grid-cols-5'>
      {CARDS.map((card) => (
        <Card key={card.key}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{card.label}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {'format' in card && card.format === 'currency'
                ? formatCurrency(meta[card.key] as number)
                : meta[card.key]}
            </div>
            {'subKey' in card && card.subKey && (
              <p className='text-muted-foreground text-xs'>
                {formatCurrency(meta[card.subKey!])} {t('superAdmin.payments.stats.thisMonth')}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
