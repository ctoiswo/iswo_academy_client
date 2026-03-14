import { createFileRoute } from '@tanstack/react-router'
import { AdminDashboard } from '@/features/dashboard/admin'
import { useAuthStore } from '@/stores/auth-store'

function AcademyAdminDashboardRoute() {
  const { user, currentAcademy } = useAuthStore()
  return <AdminDashboard user={user} academy={currentAcademy} />
}

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/dashboard/admin'
)({
  component: AcademyAdminDashboardRoute,
})
