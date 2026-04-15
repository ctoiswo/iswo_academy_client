import type { DashboardProps } from '@/components/dashboard-router'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { AcademyStatsOverview } from './components'

export function AdminDashboard({ user, academy }: DashboardProps) {
  if (!user || !academy) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold'>Academia Requerida</h2>
          <p className='text-muted-foreground mt-2'>
            Por favor selecciona una academia para acceder al panel de
            administración.
          </p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout
      user={user}
      academy={academy}
      variant='full'
      dashboardType='academy-admin'
    >
      <div className='w-full space-y-6'>

        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Panel de Administración
          </h1>
          <p className='text-muted-foreground'>
            Resumen general y estadísticas de tu academia
          </p>
        </div>

        <AcademyStatsOverview academy={academy} />
      </div>
    </DashboardLayout>
  )
}
