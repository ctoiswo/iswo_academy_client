import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { TeacherDashboard } from '@/features/dashboard/teacher'

function TeacherDashboardRoute() {
  const { user, currentAcademy } = useAuthStore()
  return <TeacherDashboard user={user} academy={currentAcademy} />
}

export const Route = createFileRoute('/_authenticated/dashboard/teacher')({
  component: TeacherDashboardRoute,
})
