import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

function TeachingPage() {
  const { user, currentAcademy } = useAuthStore()
  return (
    <DashboardLayout
      user={user}
      academy={currentAcademy}
      variant='full'
      dashboardType='teacher'
    >
      <div className='text-muted-foreground flex items-center justify-center py-16'>
        <p>Próximamente...</p>
      </div>
    </DashboardLayout>
  )
}

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/teaching/grades'
)({
  component: TeachingPage,
})
