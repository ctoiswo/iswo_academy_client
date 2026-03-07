import { StudentDashboard } from '@/features/dashboard/student'
import { useAuthStore } from '@/stores/auth-store'
import { createFileRoute } from '@tanstack/react-router'

function StudentDashboardRoute() {
  const { user, currentAcademy } = useAuthStore()
  return <StudentDashboard user={user} academy={currentAcademy} />
}

export const Route = createFileRoute('/_authenticated/dashboard/student')({
  component: StudentDashboardRoute,
})