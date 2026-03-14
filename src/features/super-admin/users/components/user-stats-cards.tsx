import { Users, ShieldCheck, UserCheck, UserX } from 'lucide-react'
import type { UsersMeta } from '@/lib/super-admin-api'
import { useTranslation } from '@/hooks/use-translation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface UserStatsCardsProps {
  meta: UsersMeta
}

export function UserStatsCards({ meta }: UserStatsCardsProps) {
  const { t } = useTranslation()

  const CARDS = [
    {
      label: t('superAdmin.users.stats.total'),
      key: 'total_count' as const,
      icon: Users,
      color: 'text-blue-500',
      subKey: 'new_this_month' as const,
    },
    {
      label: t('superAdmin.users.stats.confirmed'),
      key: 'confirmed_count' as const,
      icon: UserCheck,
      color: 'text-green-500',
    },
    {
      label: t('superAdmin.users.stats.unconfirmed'),
      key: 'unconfirmed_count' as const,
      icon: UserX,
      color: 'text-amber-500',
    },
    {
      label: t('superAdmin.users.stats.superAdmins'),
      key: 'super_admin_count' as const,
      icon: ShieldCheck,
      color: 'text-purple-500',
    },
  ]

  return (
    <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
      {CARDS.map((card) => (
        <Card key={card.label}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{card.label}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{meta[card.key]}</div>
            {'subKey' in card && (
              <p className='text-muted-foreground text-xs'>
                {t('superAdmin.users.stats.newThisMonth', {
                  count: meta[card.subKey!],
                })}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
