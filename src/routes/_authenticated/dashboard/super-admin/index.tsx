import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { SuperAdminDashboard } from '@/features/dashboard/super-admin'

function SuperAdminDashboardRoute() {
  const { user } = useAuthStore()
  return <SuperAdminDashboard user={user} academy={null} />
}

export const Route = createFileRoute('/_authenticated/dashboard/super-admin/')({
  component: SuperAdminDashboardRoute,
})
