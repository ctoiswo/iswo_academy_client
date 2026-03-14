import { useTranslation } from 'react-i18next'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import type { MonthlyRevenue } from '@/lib/super-admin-api'
import { formatCurrency } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { DashboardCard } from '@/components/dashboard'

interface RevenueChartProps {
  data: MonthlyRevenue[]
  loading?: boolean
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className='border-border/60 bg-card rounded-lg border px-3 py-2 text-sm shadow-sm'>
      <p className='text-muted-foreground mb-1'>{label}</p>
      <p className='font-semibold'>{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export function RevenueChart({ data, loading = false }: RevenueChartProps) {
  const { t } = useTranslation()
  return (
    <DashboardCard title={t('super_admin.charts.revenueTitle')}>
      {loading ? (
        <Skeleton className='h-48 w-full rounded-lg' />
      ) : (
        <ResponsiveContainer width='100%' height={200}>
          <BarChart
            data={data}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray='3 3'
              className='stroke-border/40'
              vertical={false}
            />
            <XAxis
              dataKey='month'
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              className='fill-muted-foreground'
            />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={48}
              className='fill-muted-foreground'
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'hsl(var(--muted))', radius: 4 }}
            />
            <Bar
              dataKey='revenue'
              fill='hsl(var(--primary))'
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </DashboardCard>
  )
}
