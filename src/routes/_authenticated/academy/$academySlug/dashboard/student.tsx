import { createFileRoute } from '@tanstack/react-router'
import { StudentDashboard } from '@/features/dashboard/student'
import { useAuthStore } from '@/stores/auth-store'

function AcademyStudentDashboardRoute() {
  const { user, currentAcademy } = useAuthStore()
  return <StudentDashboard user={user} academy={currentAcademy} />
}

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/dashboard/student'
)({
  component: AcademyStudentDashboardRoute,
})
