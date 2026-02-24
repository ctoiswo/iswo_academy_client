import { Building2, Users, BookOpen, DollarSign } from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import { DashboardCard } from '@/components/dashboard'
import type { GlobalStats } from '../index'

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
  if (error) {
    return (
      <DashboardCard title='Global Statistics' className='col-span-full'>
        <div className='py-8 text-center'>
          <p className='text-destructive'>Error loading statistics: {error}</p>
        </div>
      </DashboardCard>
    )
  }

  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
      <StatCard
        label='Total Academias'
        value={(stats?.totalAcademies ?? 0).toLocaleString()}
        icon={Building2}
        iconBg='bg-primary/10'
        iconColor='text-primary'
        loading={loading}
        description='Instituciones activas'
      />

      <StatCard
        label='Total Usuarios'
        value={(stats?.totalUsers ?? 0).toLocaleString()}
        icon={Users}
        iconBg='bg-emerald-500/10'
        iconColor='text-emerald-400'
        loading={loading}
        description='Usuarios registrados'
      />

      <StatCard
        label='Total Cursos'
        value={(stats?.totalCourses ?? 0).toLocaleString()}
        icon={BookOpen}
        iconBg='bg-violet-500/10'
        iconColor='text-violet-400'
        loading={loading}
        description='Cursos en todas las academias'
      />

      <StatCard
        label='Ingresos Totales'
        value={
          new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          }).format(stats?.totalRevenue ?? 0)
        }
        icon={DollarSign}
        iconBg='bg-amber-500/10'
        iconColor='text-amber-400'
        loading={loading}
        description='Ingresos de toda la plataforma'
      />
    </div>
  )
}
