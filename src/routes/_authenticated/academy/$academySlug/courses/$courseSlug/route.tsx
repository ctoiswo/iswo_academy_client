import { createFileRoute, Outlet } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuthStore } from '@/stores/auth-store'

function CourseLayoutRoute() {
  const { user, currentAcademy } = useAuthStore()

  return (
    <DashboardLayout user={user} academy={currentAcademy} variant="full" dashboardType="academy-admin">
      <Outlet />
    </DashboardLayout>
  )
}

export const Route = createFileRoute('/_authenticated/academy/$academySlug/courses/$courseSlug')({
  component: CourseLayoutRoute,
})
