import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { AdminDashboard } from '@/features/dashboard/admin'

function AcademyAdminDashboardRoute() {
  const { user, currentAcademy } = useAuthStore()
  return <AdminDashboard user={user} academy={currentAcademy} />
}

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/dashboard/admin'
)({
  component: AcademyAdminDashboardRoute,
})
