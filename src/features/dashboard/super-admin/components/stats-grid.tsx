import { Building2, Users, BookOpen, DollarSign, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import type { GlobalStats } from '../types'

interface StatsGridProps {
  stats: GlobalStats | null
  loading?: boolean
}

function TrendBadge({ value, label }: { value: number | string; label: string }) {
  const num = typeof value === 'string' ? parseFloat(value) : value
  const isPositive = num > 0
  const isZero = num === 0
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium',
        isZero ? 'text-muted-foreground' : isPositive ? 'text-emerald-400' : 'text-red-400'
      )}
    >
      {isZero ? (
        <Minus className='h-3 w-3' />
      ) : isPositive ? (
        <TrendingUp className='h-3 w-3' />
      ) : (
        <TrendingDown className='h-3 w-3' />
      )}
      {label}
    </span>
  )
}

function StatTile({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  loading,
  trend,
  sub,
}: {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  iconColor: string
  loading: boolean
  trend?: { value: number | string; label: string }
  sub?: string
}) {
  if (loading) {
    return (
      <div className='flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4'>
        <Skeleton className='size-10 shrink-0 rounded-lg' />
        <div className='flex flex-col gap-1'>
          <Skeleton className='h-6 w-16' />
          <Skeleton className='h-3 w-24' />
          <Skeleton className='h-3 w-20' />
        </div>
      </div>
    )
  }

  return (
    <div className='flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.06)]'>
      <div className={cn('flex shrink-0 items-center justify-center size-10 rounded-lg', iconBg)}>
        <Icon className={cn('size-5', iconColor)} />
      </div>
      <div className='flex min-w-0 flex-col'>
        <span className='text-2xl font-bold tracking-tight'>{value}</span>
        <span className='text-muted-foreground text-xs'>{label}</span>
        {trend && <TrendBadge value={trend.value} label={trend.label} />}
        {sub && !trend && <span className='text-muted-foreground text-xs'>{sub}</span>}
      </div>
    </div>
  )
}

export function StatsGrid({ stats, loading = false }: StatsGridProps) {
  const { t } = useTranslation()
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  const totalRevenue = parseFloat(String(stats?.total_revenue ?? 0))
  const revenueGrowth = stats?.revenue_growth_pct ?? 0
  const revenueGrowthLabel =
    revenueGrowth === 0
      ? t('super_admin.stats.vsLastMonth')
      : revenueGrowth > 0
        ? t('super_admin.stats.growthPositive', { pct: revenueGrowth })
        : t('super_admin.stats.growthNegative', { pct: revenueGrowth })

  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
      <StatTile
        label={t('super_admin.stats.totalAcademies')}
        value={(stats?.total_academies ?? 0).toLocaleString()}
        icon={Building2}
        iconBg='bg-primary/10'
        iconColor='text-primary'
        loading={loading}
        trend={{
          value: stats?.new_academies_this_month ?? 0,
          label: t('super_admin.stats.newThisMonth', { count: stats?.new_academies_this_month ?? 0 }),
        }}
        sub={`${stats?.active_academies ?? 0} ${t('super_admin.stats.activeAcademies')} · ${stats?.inactive_academies ?? 0} ${t('super_admin.stats.inactiveAcademies')}`}
      />

      <StatTile
        label={t('super_admin.stats.totalUsers')}
        value={(stats?.total_users ?? 0).toLocaleString()}
        icon={Users}
        iconBg='bg-emerald-500/10'
        iconColor='text-emerald-400'
        loading={loading}
        trend={{
          value: stats?.new_users_this_month ?? 0,
          label: t('super_admin.stats.newThisMonth', { count: stats?.new_users_this_month ?? 0 }),
        }}
      />

      <StatTile
        label={t('super_admin.stats.totalCourses')}
        value={(stats?.total_courses ?? 0).toLocaleString()}
        icon={BookOpen}
        iconBg='bg-violet-500/10'
        iconColor='text-violet-400'
        loading={loading}
        sub={`${stats?.published_courses ?? 0} ${t('super_admin.stats.publishedCourses')} · ${stats?.draft_courses ?? 0} ${t('super_admin.stats.draftCourses')}`}
      />

      <StatTile
        label={t('super_admin.stats.totalRevenue')}
        value={fmt(totalRevenue)}
        icon={DollarSign}
        iconBg='bg-amber-500/10'
        iconColor='text-amber-400'
        loading={loading}
        trend={{ value: revenueGrowth, label: revenueGrowthLabel }}
      />
    </div>
  )
}
