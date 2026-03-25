import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

function CourseLayoutRoute() {
  const { user, currentAcademy } = useAuthStore()
  const { pathname } = useLocation()

  // Lesson viewer and assessment viewer are full-screen — bypass DashboardLayout
  const isLessonViewer = /\/watch\//.test(pathname)

  if (isLessonViewer) {
    return <Outlet />
  }

  return (
    <DashboardLayout
      user={user}
      academy={currentAcademy}
      variant='full'
      dashboardType='academy-admin'
    >
      <Outlet />
    </DashboardLayout>
  )
}

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/courses/$courseSlug'
)({
  component: CourseLayoutRoute,
})
