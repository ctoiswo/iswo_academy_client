import { Users, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SystemHealth } from '@/lib/super-admin-api'

interface ActivityStatsCardProps {
  health: SystemHealth
}

export function ActivityStatsCard({ health }: ActivityStatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-sm font-medium'>
          <Activity className='h-4 w-4 text-blue-500' />
          Actividad de usuarios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-3 gap-4 text-center'>
          <div>
            <p className='text-2xl font-bold'>{health.active_users_1h}</p>
            <p className='text-muted-foreground text-xs'>Última hora</p>
          </div>
          <div>
            <p className='text-2xl font-bold'>{health.active_users_24h}</p>
            <p className='text-muted-foreground text-xs'>Últimas 24 h</p>
          </div>
          <div>
            <p className='text-2xl font-bold'>{health.active_users_7d}</p>
            <p className='text-muted-foreground text-xs'>Últimos 7 días</p>
          </div>
        </div>
        <div className='mt-4 border-t pt-4'>
          <div className='flex items-center gap-2 text-sm'>
            <Users className='text-muted-foreground h-4 w-4' />
            <span className='text-muted-foreground'>Nuevos hoy:</span>
            <span className='font-semibold'>{health.new_users_today}</span>
            <span className='text-muted-foreground ml-2'>Esta semana:</span>
            <span className='font-semibold'>{health.new_users_this_week}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
