import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { StudentDashboard } from '@/features/dashboard/student'

function AcademyStudentDashboardRoute() {
  const { user, currentAcademy } = useAuthStore()
  return <StudentDashboard user={user} academy={currentAcademy} />
}

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/dashboard/student'
)({
  component: AcademyStudentDashboardRoute,
})
