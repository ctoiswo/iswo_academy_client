import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { StudentDashboard } from '@/features/dashboard/student'

function AcademyStudentDashboardRoute() {
  const { academySlug } = Route.useParams()
  const { user, currentAcademy } = useAuthStore()
  return (
    <StudentDashboard
      user={user}
      academy={currentAcademy}
      academySlug={academySlug}
    />
  )
}

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/dashboard/student'
)({
  component: AcademyStudentDashboardRoute,
})
