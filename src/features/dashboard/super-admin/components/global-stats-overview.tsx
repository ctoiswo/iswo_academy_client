import { StatsWidget } from '@/components/dashboard'
import { DashboardCard } from '@/components/dashboard'
import { Building2, Users, BookOpen, DollarSign } from 'lucide-react'
import type { GlobalStats } from '../index'

interface GlobalStatsOverviewProps {
  stats: GlobalStats | null
  loading?: boolean
  error?: string | null
}

export function GlobalStatsOverview({ stats, loading = false, error }: GlobalStatsOverviewProps) {
  if (error) {
    return (
      <DashboardCard 
        title="Global Statistics" 
        className="col-span-full"
      >
        <div className="text-center py-8">
          <p className="text-destructive">Error loading statistics: {error}</p>
        </div>
      </DashboardCard>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsWidget
        title="Total Academies"
        value={stats?.totalAcademies ?? 0}
        change={stats?.monthlyGrowth.academies}
        changeType={stats?.monthlyGrowth.academies && stats.monthlyGrowth.academies > 0 ? 'increase' : 'neutral'}
        icon={Building2}
        loading={loading}
        format="number"
        description="Active learning institutions"
      />
      
      <StatsWidget
        title="Total Users"
        value={stats?.totalUsers ?? 0}
        change={stats?.monthlyGrowth.users}
        changeType={stats?.monthlyGrowth.users && stats.monthlyGrowth.users > 0 ? 'increase' : 'neutral'}
        icon={Users}
        loading={loading}
        format="number"
        description="Registered platform users"
      />
      
      <StatsWidget
        title="Total Courses"
        value={stats?.totalCourses ?? 0}
        icon={BookOpen}
        loading={loading}
        format="number"
        description="Published courses across all academies"
      />
      
      <StatsWidget
        title="Total Revenue"
        value={stats?.totalRevenue ?? 0}
        change={stats?.monthlyGrowth.revenue}
        changeType={stats?.monthlyGrowth.revenue && stats.monthlyGrowth.revenue > 0 ? 'increase' : 'neutral'}
        icon={DollarSign}
        loading={loading}
        format="currency"
        description="Platform-wide revenue"
      />
    </div>
  )
}