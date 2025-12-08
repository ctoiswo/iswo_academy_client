import { useMemo } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  BarChart3,
  GraduationCap,
  Calendar,
  MessageSquare,
  Award,
  CreditCard,
  FileText,
  ChevronRight,
  Home,
} from 'lucide-react'
import type { AuthUser, AcademyMembership } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { useAcademyPermissions } from '@/hooks/use-academy-permissions'
import type { DashboardType } from '@/components/dashboard-router'

export interface NavigationItem {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
  permissions?: string[]
  badge?: string | number
  disabled?: boolean
  children?: NavigationItem[]
  requiresAcademy?: boolean
  description?: string
}

interface RoleNavigationProps {
  user: AuthUser | null
  academy: AcademyMembership | null
  dashboardType: DashboardType
  currentPath: string
  className?: string
}

/**
 * Role-based navigation component that adapts menu items based on user permissions
 */
export function RoleNavigation({
  user,
  academy,
  dashboardType,
  currentPath,
  className,
}: RoleNavigationProps) {
  const { checkAccess, helpers } = useAcademyPermissions(academy?.id)

  // Get navigation items based on dashboard type
  const navigationItems = getNavigationItems(dashboardType, academy?.id)

  // Filter items based on user permissions with enhanced navigation guards
  const filteredItems = useNavigationGuards(navigationItems, {
    user,
    academy,
    checkAccess,
    helpers,
  })

  return (
    <nav
      className={cn('space-y-1', className)}
      role='navigation'
      aria-label='Main navigation'
    >
      {filteredItems.map((item) => (
        <NavigationLink
          key={item.path}
          item={item}
          currentPath={currentPath}
          academyId={academy?.id}
        />
      ))}
    </nav>
  )
}

/**
 * Enhanced navigation guards that hide/show options based on user role and academy access
 */
function useNavigationGuards(
  items: NavigationItem[],
  context: {
    user: AuthUser | null
    academy: AcademyMembership | null
    checkAccess: ReturnType<typeof useAcademyPermissions>['checkAccess']
    helpers: ReturnType<typeof useAcademyPermissions>['helpers']
  }
) {
  return useMemo(() => {
    const { user, academy, checkAccess, helpers } = context

    return items.filter((item) => {
      // Skip items that require academy when no academy is selected
      if (item.requiresAcademy && !academy) {
        return false
      }

      // Check if user has required role
      if (item.roles.length > 0) {
        const hasRole = item.roles.some((role) => {
          if (role === 'super_admin') return helpers.isSuperAdmin()
          if (role === 'any') return !!user // Any authenticated user
          return checkAccess.role(role as 'admin' | 'teacher' | 'student')
        })
        if (!hasRole) return false
      }

      // Check if user has required permissions
      if (item.permissions && item.permissions.length > 0) {
        const hasPermission = item.permissions.some((permission) =>
          checkAccess.permission(permission as string)
        )
        if (!hasPermission) return false
      }

      // Check if item is disabled
      if (item.disabled) return false

      // Recursively filter children if they exist
      if (item.children) {
        const filteredChildren = item.children.filter((child) => {
          // Apply same filtering logic to children
          if (child.requiresAcademy && !academy) return false

          if (child.roles.length > 0) {
            const hasRole = child.roles.some((role) => {
              if (role === 'super_admin') return helpers.isSuperAdmin()
              if (role === 'any') return !!user
              return checkAccess.role(role as 'admin' | 'teacher' | 'student')
            })
            if (!hasRole) return false
          }

          if (child.permissions && child.permissions.length > 0) {
            const hasPermission = child.permissions.some((permission) =>
              checkAccess.permission(permission as string)
            )
            if (!hasPermission) return false
          }

          return !child.disabled
        })

        // Only show parent if it has visible children or is itself accessible
        if (filteredChildren.length === 0 && item.children.length > 0) {
          return false
        }

        // Update item with filtered children
        item.children = filteredChildren
      }

      return true
    })
  }, [items, context])
}

/**
 * Individual navigation link component with enhanced accessibility
 */
function NavigationLink({
  item,
  currentPath,
  academyId: _academyId,
}: {
  item: NavigationItem
  currentPath: string
  academyId?: number
}) {
  const IconComponent = item.icon

  // Build the full path with academy ID if needed
  const fullPath = item.path

  // Check if this item is active based on the full path
  const isActive =
    currentPath === fullPath || currentPath.startsWith(fullPath + '/')

  return (
    <Link
      to={fullPath}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
        isActive && 'bg-accent text-accent-foreground',
        item.disabled && 'cursor-not-allowed opacity-50'
      )}
      disabled={item.disabled}
      aria-current={isActive ? 'page' : undefined}
      aria-describedby={item.description ? `nav-desc-${item.path}` : undefined}
    >
      <IconComponent className='h-4 w-4' aria-hidden='true' />
      <span className='flex-1'>{item.label}</span>
      {item.badge && (
        <span
          className='bg-primary text-primary-foreground ml-auto rounded-full px-2 py-0.5 text-xs'
          aria-label={`${item.badge} notifications`}
        >
          {item.badge}
        </span>
      )}
      {item.description && (
        <span id={`nav-desc-${item.path}`} className='sr-only'>
          {item.description}
        </span>
      )}
    </Link>
  )
}

/**
 * Get navigation items based on dashboard type with enhanced role-based configuration
 */
function getNavigationItems(
  dashboardType: DashboardType,
  academyId?: number
): NavigationItem[] {
  const baseItems: Record<DashboardType, NavigationItem[]> = {
    'super-admin': [
      {
        label: 'Dashboard',
        path: '/super-admin/dashboard',
        icon: LayoutDashboard,
        roles: ['super_admin'],
        description: 'Global system overview and statistics',
      },
      {
        label: 'Academies',
        path: '/super-admin/academies',
        icon: BookOpen,
        roles: ['super_admin'],
        description: 'Manage all academies in the system',
      },
      {
        label: 'Users',
        path: '/super-admin/users',
        icon: Users,
        roles: ['super_admin'],
        description: 'Manage all users across academies',
      },
      {
        label: 'Analytics',
        path: '/super-admin/analytics',
        icon: BarChart3,
        roles: ['super_admin'],
        description: 'Platform-wide analytics and reports',
      },
      {
        label: 'System Settings',
        path: '/super-admin/settings',
        icon: Settings,
        roles: ['super_admin'],
        description: 'Global system configuration',
      },
    ],

    'academy-admin': [
      {
        label: 'Dashboard',
        path: 'dashboard',
        icon: LayoutDashboard,
        roles: ['admin'],
        requiresAcademy: true,
        description: 'Academy overview and key metrics',
      },
      {
        label: 'Users',
        path: 'users',
        icon: Users,
        roles: ['admin'],
        permissions: ['manage_users'],
        requiresAcademy: true,
        description: 'Manage academy users',
        children: [
          {
            label: 'Students',
            path: 'users/students',
            icon: Users,
            roles: ['admin'],
            permissions: ['manage_users'],
            requiresAcademy: true,
            description: 'Manage student accounts',
          },
          {
            label: 'Teachers',
            path: 'users/teachers',
            icon: GraduationCap,
            roles: ['admin'],
            permissions: ['manage_users'],
            requiresAcademy: true,
            description: 'Manage teacher accounts',
          },
        ],
      },
      {
        label: 'Courses',
        path: 'courses',
        icon: BookOpen,
        roles: ['admin'],
        permissions: ['manage_courses'],
        requiresAcademy: true,
        description: 'Manage academy courses and content',
      },
      {
        label: 'Analytics',
        path: 'analytics',
        icon: BarChart3,
        roles: ['admin'],
        requiresAcademy: true,
        description: 'Academy performance analytics',
      },
      {
        label: 'Payments',
        path: 'payments',
        icon: CreditCard,
        roles: ['admin'],
        permissions: ['manage_payments'],
        requiresAcademy: true,
        description: 'Payment management and billing',
      },
      {
        label: 'Reports',
        path: 'reports',
        icon: FileText,
        roles: ['admin'],
        requiresAcademy: true,
        description: 'Generate academy reports',
      },
      {
        label: 'Settings',
        path: 'settings',
        icon: Settings,
        roles: ['admin'],
        requiresAcademy: true,
        description: 'Academy configuration settings',
      },
    ],

    teacher: [
      {
        label: 'Dashboard',
        path: 'dashboard',
        icon: LayoutDashboard,
        roles: ['teacher', 'admin'],
        requiresAcademy: true,
        description: 'Teaching overview and course progress',
      },
      {
        label: 'My Courses',
        path: 'teaching',
        icon: BookOpen,
        roles: ['teacher', 'admin'],
        permissions: ['manage_courses'],
        requiresAcademy: true,
        description: 'Manage your assigned courses',
      },
      {
        label: 'Students',
        path: 'students',
        icon: Users,
        roles: ['teacher', 'admin'],
        requiresAcademy: true,
        description: 'View and manage your students',
      },
      {
        label: 'Calendar',
        path: 'calendar',
        icon: Calendar,
        roles: ['teacher', 'admin'],
        requiresAcademy: true,
        description: 'Schedule and upcoming events',
      },
      {
        label: 'Messages',
        path: 'messages',
        icon: MessageSquare,
        roles: ['teacher', 'admin'],
        requiresAcademy: true,
        description: 'Communication with students',
      },
      {
        label: 'Achievements',
        path: 'achievements',
        icon: Award,
        roles: ['teacher', 'admin'],
        requiresAcademy: true,
        description: 'Student achievements and certificates',
      },
    ],

    student: [
      {
        label: 'Dashboard',
        path: 'dashboard',
        icon: LayoutDashboard,
        roles: ['student', 'teacher', 'admin'],
        requiresAcademy: true,
        description: 'Your learning progress overview',
      },
      {
        label: 'My Courses',
        path: 'courses',
        icon: BookOpen,
        roles: ['student', 'teacher', 'admin'],
        requiresAcademy: true,
        description: 'Access your enrolled courses',
      },
      {
        label: 'Calendar',
        path: 'calendar',
        icon: Calendar,
        roles: ['student', 'teacher', 'admin'],
        requiresAcademy: true,
        description: 'Upcoming lessons and deadlines',
      },
      {
        label: 'Achievements',
        path: 'achievements',
        icon: Award,
        roles: ['student', 'teacher', 'admin'],
        requiresAcademy: true,
        description: 'Your certificates and badges',
      },
      {
        label: 'Messages',
        path: 'messages',
        icon: MessageSquare,
        roles: ['student', 'teacher', 'admin'],
        requiresAcademy: true,
        description: 'Communication with teachers',
      },
    ],
  }

  return baseItems[dashboardType] || []
}

/**
 * Enhanced breadcrumb component that reflects current academy and role context
 */
interface BreadcrumbProps {
  academy: AcademyMembership | null
  currentPath: string
  user?: AuthUser | null
  className?: string
}

export function RoleBreadcrumb({
  academy,
  currentPath,
  user,
  className,
}: BreadcrumbProps) {
  const { helpers } = useAcademyPermissions(academy?.id)

  const breadcrumbItems = useMemo(() => {
    const items: Array<{
      label: string
      path?: string
      icon?: React.ComponentType<{ className?: string }>
      isHome?: boolean
    }> = []

    const pathSegments = currentPath.split('/').filter(Boolean)

    // Add home/root context
    if (helpers.isSuperAdmin()) {
      items.push({
        label: 'System Admin',
        path: '/super-admin/dashboard',
        icon: Home,
        isHome: true,
      })
    } else if (academy) {
      items.push({
        label: academy.name,
        path: `/academy/${academy.id}/dashboard`,
        icon: Home,
        isHome: true,
      })

      // Add role context for academy users
      if (academy.user_role && user) {
        items.push({
          label: `${academy.user_role_display} Dashboard`,
          path: `/academy/${academy.id}/dashboard`,
        })
      }
    }

    // Process path segments with enhanced context
    let currentSegmentPath = ''
    let skipNext = false

    pathSegments.forEach((segment, index) => {
      if (skipNext) {
        skipNext = false
        return
      }

      // Skip academy ID segment in path
      if (segment === 'academy' && pathSegments[index + 1]) {
        currentSegmentPath = `/academy/${pathSegments[index + 1]}`
        skipNext = true
        return
      }

      // Skip super-admin prefix for super admin paths
      if (segment === 'super-admin') {
        currentSegmentPath = '/super-admin'
        return
      }

      currentSegmentPath += `/${segment}`

      // Enhanced segment labeling with context
      const label = formatBreadcrumbLabel(segment, {
        academy,
        isLast: index === pathSegments.length - 1,
        previousSegment: pathSegments[index - 1],
      })

      // Don't add if it's the same as the last item
      if (items.length > 0 && items[items.length - 1].label === label) {
        return
      }

      items.push({
        label,
        path:
          index === pathSegments.length - 1 ? undefined : currentSegmentPath,
      })
    })

    return items
  }, [academy, currentPath, user, helpers])

  return (
    <nav
      className={cn(
        'text-muted-foreground flex items-center space-x-2 text-sm',
        className
      )}
      aria-label='Breadcrumb navigation'
    >
      <ol className='flex items-center space-x-2'>
        {breadcrumbItems.map((item, index) => (
          <li key={index} className='flex items-center space-x-2'>
            {index > 0 && (
              <ChevronRight
                className='text-muted-foreground/50 h-3 w-3'
                aria-hidden='true'
              />
            )}
            {item.path ? (
              <Link
                to={item.path}
                className='hover:text-foreground flex items-center gap-1 transition-colors'
                aria-current={
                  index === breadcrumbItems.length - 1 ? 'page' : undefined
                }
              >
                {item.icon && (
                  <item.icon className='h-3 w-3' aria-hidden='true' />
                )}
                {item.label}
              </Link>
            ) : (
              <span className='text-foreground flex items-center gap-1 font-medium'>
                {item.icon && (
                  <item.icon className='h-3 w-3' aria-hidden='true' />
                )}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/**
 * Format breadcrumb labels with enhanced context awareness
 */
function formatBreadcrumbLabel(
  segment: string,
  context: {
    academy: AcademyMembership | null
    isLast: boolean
    previousSegment?: string
  }
): string {
  const { academy, previousSegment } = context

  // Special cases for common segments
  const specialLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    courses: 'Courses',
    students: 'Students',
    teachers: 'Teachers',
    users: 'Users',
    analytics: 'Analytics',
    settings: 'Settings',
    payments: 'Payments',
    reports: 'Reports',
    messages: 'Messages',
    calendar: 'Calendar',
    achievements: 'Achievements',
    teaching: 'My Courses',
    academies: 'Academies',
  }

  if (specialLabels[segment]) {
    return specialLabels[segment]
  }

  // Handle ID segments (numeric)
  if (/^\d+$/.test(segment)) {
    if (previousSegment === 'academy') {
      return academy?.name || `Academy ${segment}`
    }
    if (previousSegment === 'course') {
      return `Course ${segment}`
    }
    if (previousSegment === 'user') {
      return `User ${segment}`
    }
    return `Item ${segment}`
  }

  // Default formatting: capitalize and replace hyphens with spaces
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Hook for getting current navigation state
 */
export function useRoleNavigation(academy: AcademyMembership | null) {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return {
    currentPath,
    isAcademyRoute: currentPath.startsWith(`/academy/${academy?.id}`),
    academyId: academy?.id,
  }
}
