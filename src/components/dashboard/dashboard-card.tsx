import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export interface DashboardCardProps {
  title?: string
  description?: string
  children: React.ReactNode
  action?: React.ReactNode
  footer?: React.ReactNode
  loading?: boolean
  className?: string
  contentClassName?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function DashboardCard({
  title,
  description,
  children,
  action,
  footer,
  loading = false,
  className,
  contentClassName,
  variant = 'default',
  size = 'md',
}: DashboardCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'outline':
        return 'border-2 border-dashed'
      case 'ghost':
        return 'border-0 shadow-none bg-transparent'
      case 'default':
      default:
        return ''
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'p-4'
      case 'lg':
        return 'p-8'
      case 'md':
      default:
        return 'p-6'
    }
  }

  if (loading) {
    return (
      <Card className={cn(getVariantStyles(), getSizeStyles(), className)}>
        {(title || description || action) && (
          <CardHeader>
            <div className='flex items-start justify-between'>
              <div className='space-y-2'>
                {title && <Skeleton className='h-5 w-32' />}
                {description && <Skeleton className='h-4 w-48' />}
              </div>
              {action && <Skeleton className='h-8 w-20' />}
            </div>
          </CardHeader>
        )}
        <CardContent className={contentClassName}>
          <div className='space-y-4'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </div>
        </CardContent>
        {footer && (
          <CardFooter>
            <Skeleton className='h-8 w-24' />
          </CardFooter>
        )}
      </Card>
    )
  }

  return (
    <Card className={cn(getVariantStyles(), getSizeStyles(), className)}>
      {(title || description || action) && (
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            {action && <CardAction>{action}</CardAction>}
          </div>
        </CardHeader>
      )}
      <CardContent className={contentClassName}>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
}

// Specialized dashboard card variants for common use cases
export interface MetricCardProps extends Omit<DashboardCardProps, 'children'> {
  metric: string | number
  label: string
  change?: number
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ComponentType<{ className?: string }>
}

export function MetricCard({
  metric,
  label,
  change,
  changeType = 'neutral',
  icon: Icon,
  ...props
}: MetricCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      case 'neutral':
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <DashboardCard {...props}>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-muted-foreground text-sm font-medium'>{label}</p>
          <p className='text-2xl font-bold'>{metric}</p>
          {change !== undefined && (
            <p className={cn('text-xs', getChangeColor())}>
              {change > 0 ? '+' : ''}
              {change}% from last period
            </p>
          )}
        </div>
        {Icon && (
          <div className='bg-muted rounded-full p-2'>
            <Icon className='text-muted-foreground h-4 w-4' />
          </div>
        )}
      </div>
    </DashboardCard>
  )
}

export interface ListCardProps extends Omit<DashboardCardProps, 'children'> {
  items: Array<{
    id: string | number
    title: string
    subtitle?: string
    value?: string | number
    action?: React.ReactNode
  }>
  emptyMessage?: string
}

export function ListCard({
  items,
  emptyMessage = 'No items to display',
  ...props
}: ListCardProps) {
  return (
    <DashboardCard {...props}>
      {items.length === 0 ? (
        <div className='py-8 text-center'>
          <p className='text-muted-foreground'>{emptyMessage}</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {items.map((item) => (
            <div key={item.id} className='flex items-center justify-between'>
              <div>
                <p className='font-medium'>{item.title}</p>
                {item.subtitle && (
                  <p className='text-muted-foreground text-sm'>
                    {item.subtitle}
                  </p>
                )}
              </div>
              <div className='flex items-center space-x-2'>
                {item.value && (
                  <span className='text-sm font-medium'>{item.value}</span>
                )}
                {item.action}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  )
}
