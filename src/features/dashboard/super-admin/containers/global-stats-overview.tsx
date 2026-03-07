import { useTranslation } from 'react-i18next'
import { DashboardCard } from '@/components/dashboard'
import type { GlobalStats } from '../index'
import { StatsGrid } from '../components/stats-grid'
import { RevenueChart } from '../components/revenue-chart'
import { NewUsersChart } from '../components/new-users-chart'

interface GlobalStatsOverviewProps {
  stats: GlobalStats | null
  loading?: boolean
  error?: string | null
}

export function GlobalStatsOverview({
  stats,
  loading = false,
  error,
}: GlobalStatsOverviewProps) {
  const { t } = useTranslation()
  if (error) {
    return (
      <DashboardCard title={t('super_admin.stats.totalAcademies')} className='col-span-full'>
        <div className='py-8 text-center'>
          <p className='text-destructive'>{t('super_admin.errors.statsError', { message: error })}</p>
        </div>
      </DashboardCard>
    )
  }

  return (
    <div className='space-y-4'>
      <StatsGrid stats={stats} loading={loading} />

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <RevenueChart data={stats?.monthly_revenue ?? []} loading={loading} />
        <NewUsersChart data={stats?.monthly_new_users ?? []} loading={loading} />
      </div>
    </div>
  )
}
