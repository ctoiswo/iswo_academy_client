import { useAuthStore } from '@/stores/auth-store'
import { AdminDashboard } from '@/features/dashboard/admin'
import { StudentDashboard } from '@/features/dashboard/student'
import { TeacherDashboard } from '@/features/dashboard/teacher'
import { SuperAdminDashboard } from '@/features/dashboard/super-admin'

/**
 * Hook that returns the appropriate dashboard component based on user's role in the academy
 */
export function useDashboardByRole() {
  const { user, currentAcademy } = useAuthStore()

  if (!user || !currentAcademy) {
    return null
  }

  const userRole = currentAcademy.user_role

  // Return the appropriate dashboard based on role
  switch (userRole) {
    case 'super-admin':
      return <SuperAdminDashboard user={user} academy={currentAcademy} />
    case 'admin':
      return <AdminDashboard user={user} academy={currentAcademy} />
    case 'teacher':
      return <TeacherDashboard user={user} academy={currentAcademy} />
    case 'student':
      return <StudentDashboard user={user} academy={currentAcademy} />
    default:
      return <StudentDashboard user={user} academy={currentAcademy} />
  }
}
