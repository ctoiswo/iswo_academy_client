import { createFileRoute, Outlet, useMatches } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

function CourseLayoutRoute() {
  const { user, currentAcademy } = useAuthStore()
  const matches = useMatches()

  // Lesson viewer is full-screen — bypass DashboardLayout
  const isLessonViewer = matches.some((m) =>
    (m.routeId as string).includes('$lessonId')
  )

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
