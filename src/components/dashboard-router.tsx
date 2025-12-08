import { useMemo } from 'react'
import {
  useAuthStore,
  type AcademyMembership,
  type AuthUser,
} from '@/stores/auth-store'
import { useAcademyPermissions } from '@/hooks/use-academy-permissions'
import { AdminDashboard } from '@/features/dashboard/admin/index'
import { StudentDashboard } from '@/features/dashboard/student/index'
/**
 * Get dashboard configuration for a specific dashboard type
 */
// Import dashboard components directly for now (can be made lazy later)
import { SuperAdminDashboard } from '@/features/dashboard/super-admin/index'
import { TeacherDashboard } from '@/features/dashboard/teacher/index'

// Dashboard component types
export type DashboardType =
  | 'super-admin'
  | 'academy-admin'
  | 'teacher'
  | 'student'

export interface DashboardConfig {
  component: React.ComponentType<DashboardProps>
  layout: 'full' | 'sidebar' | 'compact'
  permissions: string[]
}

export interface DashboardProps {
  user: AuthUser | null
  academy?: AcademyMembership | null
}

interface DashboardRouterProps {
  user: AuthUser | null
  currentAcademy: AcademyMembership | null
  fallbackComponent?: React.ComponentType<DashboardProps>
}

/**
 * Determines the appropriate dashboard type based on user role and context
 */
export function getDashboardType(
  user: AuthUser | null,
  academy: AcademyMembership | null
): DashboardType {
  // Handle null user case
  if (!user) {
    return 'student' // Default fallback
  }

  // If academy is selected, use academy role (even for super admins in academy context)
  if (academy) {
    // Determine dashboard based on academy role
    switch (academy.user_role) {
      case 'admin':
        return 'academy-admin'
      case 'teacher':
        return 'teacher'
      case 'student':
      default:
        return 'student'
    }
  }

  // Super Admin dashboard only when no academy is selected (global context)
  if (user.is_super_admin) {
    return 'super-admin'
  }

  // Default fallback
  return 'student'
}

/**
 * Dashboard router component that renders the appropriate dashboard based on user role
 */
export function DashboardRouter({
  user,
  currentAcademy,
  fallbackComponent: FallbackComponent,
}: DashboardRouterProps) {
  // Always call hooks at the top level, never conditionally
  const { helpers, hasAccess } = useAcademyPermissions(currentAcademy?.id)

  // Handle unauthenticated user
  if (!user) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold'>Authentication Required</h2>
          <p className='text-muted-foreground mt-2'>
            Please log in to access the dashboard.
          </p>
        </div>
      </div>
    )
  }

  // Determine dashboard type
  const dashboardType = getDashboardType(user, currentAcademy)

  // Get dashboard configuration
  const dashboardConfig = getDashboardConfig(dashboardType)

  // Validate permissions if academy is selected
  if (currentAcademy && !helpers.isSuperAdmin() && !hasAccess) {
    // User doesn't have access to this academy
    if (FallbackComponent) {
      return <FallbackComponent user={user} academy={currentAcademy} />
    }

    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold'>Access Denied</h2>
          <p className='text-muted-foreground mt-2'>
            You don't have permission to access this academy.
          </p>
        </div>
      </div>
    )
  }

  // Render the appropriate dashboard component
  const DashboardComponent = dashboardConfig.component

  return <DashboardComponent user={user} academy={currentAcademy} />
}

function getDashboardConfig(dashboardType: DashboardType): DashboardConfig {
  const configs: Record<DashboardType, DashboardConfig> = {
    'super-admin': {
      component: SuperAdminDashboard,
      layout: 'full',
      permissions: ['manage_system'],
    },
    'academy-admin': {
      component: AdminDashboard,
      layout: 'sidebar',
      permissions: ['manage_users', 'manage_courses', 'manage_payments'],
    },
    teacher: {
      component: TeacherDashboard,
      layout: 'sidebar',
      permissions: ['manage_courses', 'read'],
    },
    student: {
      component: StudentDashboard,
      layout: 'compact',
      permissions: ['read', 'enroll'],
    },
  }

  return configs[dashboardType]
}

/**
 * Hook for getting dashboard routing information
 */
export function useDashboardRouting() {
  const { user, currentAcademy } = useAuthStore()

  const dashboardType = useMemo(() => {
    if (!user) return null
    return getDashboardType(user, currentAcademy)
  }, [user, currentAcademy])

  const dashboardConfig = useMemo(() => {
    if (!dashboardType) return null
    return getDashboardConfig(dashboardType)
  }, [dashboardType])

  return {
    dashboardType,
    dashboardConfig,
    user,
    currentAcademy,
  }
}
