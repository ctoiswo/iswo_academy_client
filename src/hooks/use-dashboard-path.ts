import { useAuthStore } from '@/stores/auth-store'

/**
 * Returns the correct dashboard path for the currently authenticated user,
 * mirroring the redirect logic in the auth store login action.
 * Returns null when the user is not authenticated.
 */
export function useDashboardPath(): string | null {
  const { isAuthenticated, user, academyData, currentAcademy } = useAuthStore()

  if (!isAuthenticated || !user) return null

  if (user.is_super_admin) return '/dashboard/super-admin'

  const count = academyData?.count ?? 0
  const academies = academyData?.academies ?? []

  if (count === 0) return '/dashboard/student'

  if (count === 1) {
    const slug = academyData?.academies[0]?.slug ?? currentAcademy?.slug
    if (slug) return `/academy/${slug}/dashboard`
  }

  if (count > 1) {
    if (currentAcademy?.slug) return `/academy/${currentAcademy.slug}/dashboard`

    const storedAcademyId = localStorage.getItem('currentAcademyId')
    if (storedAcademyId) {
      const restoredAcademy = academies.find(
        (academy) => academy.id === Number(storedAcademyId)
      )
      if (restoredAcademy?.slug) {
        return `/academy/${restoredAcademy.slug}/dashboard`
      }
    }
  }

  return '/academy-selection'
}
