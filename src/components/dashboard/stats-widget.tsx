import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export interface StatsWidgetProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon?: React.ComponentType<{ className?: string }>
  loading?: boolean
  className?: string
  description?: string
  format?: 'number' | 'currency' | 'percentage'
}

export function StatsWidget({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  loading = false,
  className,
  description,
  format = 'number'
}: StatsWidgetProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(val)
      case 'percentage':
        return `${val}%`
      case 'number':
      default:
        return new Intl.NumberFormat('en-US').format(val)
    }
  }

  const getTrendIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case 'neutral':
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600'
      case 'decrease':
        return 'text-red-600'
      case 'neutral':
      default:
        return 'text-gray-500'
    }
  }

  if (loading) {
    return (
      <Card className={cn('p-6', className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          {Icon && <Skeleton className="h-4 w-4" />}
        </CardHeader>
        <CardContent className="p-0">
          <Skeleton className="h-8 w-32 mb-2" />
          {change !== undefined && (
            <div className="flex items-center space-x-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
            </div>
          )}
          {description && <Skeleton className="h-4 w-full mt-2" />}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('p-6', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        {change !== undefined && (
          <div className="flex items-center space-x-1 text-xs">
            {getTrendIcon()}
            <span className={cn('font-medium', getChangeColor())}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="text-muted-foreground">from last period</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}