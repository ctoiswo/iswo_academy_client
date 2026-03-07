import { createFileRoute } from '@tanstack/react-router'
import { TeacherDashboard } from '@/features/dashboard/teacher'
import { useAuthStore } from '@/stores/auth-store'

function TeacherDashboardRoute() {
  const { user, currentAcademy } = useAuthStore()
  return <TeacherDashboard user={user} academy={currentAcademy} />
}

export const Route = createFileRoute('/_authenticated/dashboard/teacher')({
  component: TeacherDashboardRoute,
})
