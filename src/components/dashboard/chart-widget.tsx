import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export interface ChartData {
  [key: string]: string | number
}

export interface ChartWidgetProps {
  title?: string
  description?: string
  data: ChartData[]
  type: 'line' | 'area' | 'bar' | 'pie'
  loading?: boolean
  className?: string
  height?: number
  xAxisKey?: string
  yAxisKey?: string
  dataKeys?: string[]
  colors?: string[]
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  emptyMessage?: string
}

const DEFAULT_COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#00ff00',
  '#ff00ff',
  '#00ffff',
  '#ff0000'
]

export function ChartWidget({
  title,
  description,
  data,
  type,
  loading = false,
  className,
  height = 300,
  xAxisKey = 'name',
  yAxisKey = 'value',
  dataKeys = [yAxisKey],
  colors = DEFAULT_COLORS,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  emptyMessage = 'No data available'
}: ChartWidgetProps) {
  if (loading) {
    return (
      <Card className={className}>
        {(title || description) && (
          <CardHeader>
            {title && <Skeleton className="h-5 w-32" />}
            {description && <Skeleton className="h-4 w-48 mt-2" />}
          </CardHeader>
        )}
        <CardContent>
          <Skeleton className={`w-full`} style={{ height }} />
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>
          <div 
            className="flex items-center justify-center text-muted-foreground"
            style={{ height }}
          >
            {emptyMessage}
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderChart = () => {
    const commonProps = {
      data,
      width: '100%',
      height
    }

    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              {showTooltip && <Tooltip />}
              {showLegend && <Legend />}
              {dataKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )

      case 'area':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              {showTooltip && <Tooltip />}
              {showLegend && <Legend />}
              {dataKeys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={data}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              {showTooltip && <Tooltip />}
              {showLegend && <Legend />}
              {dataKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[index % colors.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )

      case 'pie':
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={yAxisKey}
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              {showTooltip && <Tooltip />}
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  )
}

// Specialized chart components for common use cases
export interface TrendChartProps extends Omit<ChartWidgetProps, 'type' | 'data'> {
  data: Array<{ date: string; value: number; [key: string]: string | number }>
  trend?: 'up' | 'down' | 'stable'
}

export function TrendChart({ data, trend, ...props }: TrendChartProps) {
  const trendColor = trend === 'up' ? '#22c55e' : trend === 'down' ? '#ef4444' : '#6b7280'
  
  return (
    <ChartWidget
      {...props}
      type="line"
      data={data}
      xAxisKey="date"
      yAxisKey="value"
      colors={[trendColor]}
      showGrid={true}
      showLegend={false}
    />
  )
}

export interface ComparisonChartProps extends Omit<ChartWidgetProps, 'type' | 'data'> {
  data: Array<{ category: string; current: number; previous: number }>
}

export function ComparisonChart({ data, ...props }: ComparisonChartProps) {
  return (
    <ChartWidget
      {...props}
      type="bar"
      data={data}
      xAxisKey="category"
      dataKeys={['current', 'previous']}
      colors={['#3b82f6', '#e5e7eb']}
    />
  )
}

export interface DistributionChartProps extends Omit<ChartWidgetProps, 'type' | 'data'> {
  data: Array<{ name: string; value: number; color?: string }>
}

export function DistributionChart({ data, ...props }: DistributionChartProps) {
  const chartData = data.map(item => ({
    name: item.name,
    value: item.value
  }))
  
  const chartColors = data.map(item => item.color).filter(Boolean) as string[]
  
  return (
    <ChartWidget
      {...props}
      type="pie"
      data={chartData}
      colors={chartColors.length > 0 ? chartColors : DEFAULT_COLORS}
      showGrid={false}
    />
  )
}