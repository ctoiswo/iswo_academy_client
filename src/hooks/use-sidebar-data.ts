import { useLocation } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { useUserEnrollments } from '@/hooks/use-enrollments'
import { getAdminSidebar } from '@/components/layout/data/sidebar-admin'
import { getGuestSidebar } from '@/components/layout/data/sidebar-guest'
import { getStudentSidebar } from '@/components/layout/data/sidebar-student'
import { getSuperAdminSidebar } from '@/components/layout/data/sidebar-super-admin'
import { getTeacherSidebar } from '@/components/layout/data/sidebar-teacher'
import { type SidebarData } from '@/components/layout/types'

type UserRole = 'guest' | 'student' | 'teacher' | 'admin' | 'super_admin'

/**
 * Hook que retorna el sidebar apropiado según el rol del usuario y la ruta actual
 * Centraliza la lógica de decisión del sidebar para reutilizar en múltiples componentes
 */
export function useSidebarData(): SidebarData['navGroups'] {
  const { user, academyData, currentAcademy } = useAuthStore()
  const location = useLocation()
  const { data: enrollmentsData } = useUserEnrollments({ status: 'active' })

  // Determinar el role del usuario
  const getUserRole = (): UserRole => {
    // Super admin siempre tiene prioridad - independiente de academias
    if (user?.is_super_admin) {
      return 'super_admin'
    }

    // Si no tiene academias, es guest
    if (!academyData || academyData.count === 0) {
      return 'guest'
    }

    // Si tiene academia seleccionada, usar su role en esa academia
    if (currentAcademy) {
      const role = currentAcademy.user_role
      if (role === 'owner' || role === 'admin') return 'admin'
      if (role === 'teacher') return 'teacher'
      if (role === 'student') return 'student'
    }
    return 'student'
  }

  const userRole = getUserRole()
  const isInAcademyRoute = location.pathname.startsWith('/academy/')

  // Detectar si estamos en una ruta de curso específico
  const courseSlugMatch = location.pathname.match(
    /\/academy\/[^/]+\/courses\/([^/]+)/
  )
  const courseSlug = courseSlugMatch ? courseSlugMatch[1] : undefined

  // Detectar si estamos en una ruta de learning path específico
  const learningPathSlugMatch = location.pathname.match(
    /\/academy\/[^/]+\/learning-paths\/([^/]+)/
  )
  const learningPathSlug = learningPathSlugMatch
    ? learningPathSlugMatch[1]
    : undefined

  // Obtener el sidebar según el rol y la ubicación
  if (userRole === 'super_admin') {
    // Super admin siempre usa su sidebar especial (sin slug de academia)
    return getSuperAdminSidebar()
  }

  if (userRole === 'guest') {
    // Guest usa sidebar básico
    const showOnboarding = user && !user.onboarding_completed_at
    return getGuestSidebar(!!showOnboarding)
  }

  if (isInAcademyRoute && currentAcademy) {
    const academySlug = currentAcademy.slug

    switch (userRole) {
      case 'admin':
        return getAdminSidebar(academySlug, courseSlug, learningPathSlug)
      case 'teacher':
        return getTeacherSidebar(academySlug)
      case 'student':
        return getStudentSidebar(academySlug)
      default:
        return getStudentSidebar(academySlug)
    }
  }

  // Si es estudiante y no está en una ruta de academia, usar la primera academia de sus enrollments
  if (userRole === 'student' && enrollmentsData?.enrollments?.length) {
    const firstAcademySlug =
      enrollmentsData.enrollments[0]?.course?.academy_slug
    if (firstAcademySlug) {
      return getStudentSidebar(firstAcademySlug)
    }
  }

  // Fallback: usar el sidebar apropiado sin slug
  return getGuestSidebar(false)
}
