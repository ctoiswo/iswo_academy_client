import { createFileRoute } from '@tanstack/react-router'
import { useDashboardByRole } from '@/lib/dashboard-helper'

function AcademyDashboardRoute() {
  const dashboard = useDashboardByRole()

  if (!dashboard) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='text-center'>
          <h2 className='mb-2 text-2xl font-bold'>Academia no encontrada</h2>
          <p className='text-muted-foreground'>
            Por favor selecciona una academia para continuar
          </p>
        </div>
      </div>
    )
  }

  return dashboard
}

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/dashboard'
)({
  component: AcademyDashboardRoute,
})
