import { useTranslation } from 'react-i18next'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import type { MonthlyUsers } from '@/lib/super-admin-api'
import { Skeleton } from '@/components/ui/skeleton'
import { DashboardCard } from '@/components/dashboard'
import { CustomTooltip } from './custom-tooltip'

interface NewUsersChartProps {
  data: MonthlyUsers[]
  loading?: boolean
}

export function NewUsersChart({ data, loading = false }: NewUsersChartProps) {
  const { t } = useTranslation()
  return (
    <DashboardCard title={t('super_admin.charts.usersTitle')}>
      {loading ? (
        <Skeleton className='h-48 w-full rounded-lg' />
      ) : (
        <ResponsiveContainer width='100%' height={200}>
          <AreaChart
            data={data}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id='usersGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='hsl(var(--chart-2, 160 84% 39%))'
                  stopOpacity={0.3}
                />
                <stop
                  offset='95%'
                  stopColor='hsl(var(--chart-2, 160 84% 39%))'
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
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
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={36}
              className='fill-muted-foreground'
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
            />
            <Area
              type='monotone'
              dataKey='users'
              stroke='#10b981'
              strokeWidth={2}
              fill='url(#usersGradient)'
              dot={{ fill: '#10b981', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </DashboardCard>
  )
}
