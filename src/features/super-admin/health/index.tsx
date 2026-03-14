import { useState, useEffect, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { superAdminApi, type SystemHealth } from '@/lib/super-admin-api'
import { Button } from '@/components/ui/button'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { HealthDashboardPanel } from './containers/health-dashboard-panel'

export function SuperAdminHealthPage() {
  const { user: currentUser } = useAuthStore()
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadHealth = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const data = await superAdminApi.getSystemHealth()
      setHealth(data)
    } catch (_err) {
      toast.error('No se pudo cargar el estado del sistema')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadHealth()
  }, [loadHealth])

  return (
    <DashboardLayout
      user={currentUser}
      academy={null}
      variant='full'
      dashboardType='super-admin'
      title='Estado del sistema'
      subtitle='Monitoreo de servicios, recursos y actividad de la plataforma'
    >
      <div className='space-y-6'>
        <div className='flex justify-end'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => loadHealth(true)}
            disabled={refreshing || loading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            />
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </div>

        {loading ? (
          <div className='py-20 text-center'>
            <p className='text-muted-foreground'>
              Verificando estado del sistema...
            </p>
          </div>
        ) : health ? (
          <HealthDashboardPanel health={health} />
        ) : null}
      </div>
    </DashboardLayout>
  )
}
