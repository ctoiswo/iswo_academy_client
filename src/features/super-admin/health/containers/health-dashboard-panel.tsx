import type { SystemHealth } from '@/lib/super-admin-api'
import { ServiceStatusCard } from '../components/service-status-card'
import { SystemMetricsCard } from '../components/system-metrics-card'
import { ActivityStatsCard } from '../components/activity-stats-card'
import { PlatformSummaryCard } from '../components/platform-summary-card'
import { AppInfoCard } from '../components/app-info-card'

interface HealthDashboardPanelProps {
  health: SystemHealth
}

export function HealthDashboardPanel({ health }: HealthDashboardPanelProps) {
  return (
    <div className='space-y-6'>
      {/* Service Status */}
      <div>
        <h2 className='text-muted-foreground mb-3 text-xs font-semibold uppercase tracking-wider'>
          Estado de servicios
        </h2>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          <ServiceStatusCard
            label='Base de datos'
            health={health.database_status}
            detail={
              health.database_status.response_time !== undefined
                ? undefined
                : undefined
            }
          />
          <ServiceStatusCard
            label='Caché'
            health={health.cache_status}
          />
          <ServiceStatusCard
            label='Almacenamiento'
            health={health.storage_status}
          />
        </div>
      </div>

      {/* System & App Info */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <SystemMetricsCard load={health.system_load} />
        <AppInfoCard health={health} />
      </div>

      {/* Activity */}
      <ActivityStatsCard health={health} />

      {/* Platform Summary */}
      <PlatformSummaryCard health={health} />
    </div>
  )
}
