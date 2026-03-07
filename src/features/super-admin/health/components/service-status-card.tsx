import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ServiceHealth, ServiceHealthStatus } from '@/lib/super-admin-api'

interface ServiceStatusCardProps {
  label: string
  health: ServiceHealth
  detail?: string
}

const STATUS_CONFIG: Record<
  ServiceHealthStatus,
  { icon: typeof CheckCircle2; color: string; badge: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }
> = {
  healthy: {
    icon: CheckCircle2,
    color: 'text-green-500',
    badge: 'default',
    label: 'Saludable',
  },
  unhealthy: {
    icon: XCircle,
    color: 'text-red-500',
    badge: 'destructive',
    label: 'Error',
  },
  not_configured: {
    icon: AlertCircle,
    color: 'text-amber-500',
    badge: 'secondary',
    label: 'No configurado',
  },
}

export function ServiceStatusCard({ label, health, detail }: ServiceStatusCardProps) {
  const cfg = STATUS_CONFIG[health.status] ?? STATUS_CONFIG['not_configured']
  const Icon = cfg.icon

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{label}</CardTitle>
        <Icon className={`h-5 w-5 ${cfg.color}`} />
      </CardHeader>
      <CardContent className='space-y-2'>
        <Badge variant={cfg.badge}>{cfg.label}</Badge>
        {health.response_time !== undefined && (
          <p className='text-muted-foreground text-xs'>
            Latencia: {health.response_time} ms
          </p>
        )}
        {health.type && (
          <p className='text-muted-foreground text-xs capitalize'>{health.type}</p>
        )}
        {health.service && (
          <p className='text-muted-foreground text-xs capitalize'>{health.service}</p>
        )}
        {health.error && (
          <p className='text-xs text-red-500 break-all'>{health.error}</p>
        )}
        {detail && (
          <p className='text-muted-foreground text-xs'>{detail}</p>
        )}
      </CardContent>
    </Card>
  )
}
