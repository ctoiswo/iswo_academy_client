import { Code2, Server } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { SystemHealth } from '@/lib/super-admin-api'

interface AppInfoCardProps {
  health: SystemHealth
}

export function AppInfoCard({ health }: AppInfoCardProps) {
  const ENV_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    production: 'default',
    staging: 'secondary',
    development: 'outline',
    test: 'outline',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-sm font-medium'>
          <Server className='h-4 w-4 text-slate-500' />
          Información de la aplicación
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3 text-sm'>
        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground'>Entorno</span>
          <Badge variant={ENV_VARIANT[health.environment] ?? 'secondary'}>
            {health.environment}
          </Badge>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground'>Versión app</span>
          <span className='font-mono font-medium'>{health.app_version}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground'>Rails</span>
          <span className='font-mono'>{health.rails_version}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground'>Ruby</span>
          <span className='font-mono'>{health.ruby_version}</span>
        </div>
        <div className='flex items-center justify-between border-t pt-2'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <Code2 className='h-3.5 w-3.5' />
            Verificado
          </span>
          <span className='text-muted-foreground text-xs'>
            {new Date(health.checked_at).toLocaleString('es-MX', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
