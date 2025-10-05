import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { Skeleton } from '@/components/ui/skeleton'
import { validateRouteAccess } from '@/lib/permissions'
import type { AcademyRole, Permission } from '@/lib/permissions'

interface RouteGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * AuthGuard component that protects routes requiring authentication
 * Redirects unauthenticated users to the sign-in page
 * Handles academy-aware routing decisions based on user's academy memberships
 */
export function AuthGuard({ children, fallback }: RouteGuardProps) {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    initialize, 
    academyData, 
    currentAcademy 
  } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Initialize auth state if not already done
    if (!isAuthenticated && !isLoading && !user) {
      initialize()
    }
  }, [isAuthenticated, isLoading, user, initialize])

  useEffect(() => {
    // Redirect to sign-in if not authenticated and not loading
    if (!isLoading && !isAuthenticated) {
      router.navigate({ to: '/sign-in' })
      return
    }

    // Handle academy-aware routing for authenticated users
    if (!isLoading && isAuthenticated && academyData) {
      const currentPath = router.state.location.pathname
      
      // Skip academy routing logic if already on academy-specific routes
      if (currentPath.startsWith('/academy/') || 
          currentPath === '/academy-selection' || 
          currentPath === '/create-academy') {
        return
      }

      // Handle routing based on academy count
      if (academyData.count === 0) {
        // No academies - redirect to academy creation
        if (currentPath === '/dashboard' || currentPath === '/') {
          router.navigate({ to: '/create-academy' })
        }
      } else if (academyData.count === 1) {
        // Single academy - auto-redirect to academy dashboard
        const singleAcademy = academyData.academies[0]
        if (currentPath === '/dashboard' || currentPath === '/') {
          router.navigate({ 
            to: `/academy/${singleAcademy.id}/dashboard`,
            replace: true 
          })
        }
      } else if (academyData.count > 1) {
        // Multiple academies - show academy selection if no current academy selected
        if (!currentAcademy && (currentPath === '/dashboard' || currentPath === '/')) {
          router.navigate({ 
            to: '/academy-selection',
            replace: true 
          })
        }
      }
    }
  }, [isAuthenticated, isLoading, router, academyData, currentAcademy])

  // Show loading state while checking authentication
  if (isLoading) {
    return fallback || <AuthLoadingFallback />
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

/**
 * GuestGuard component that redirects authenticated users
 * Used for auth pages like sign-in, sign-up that should not be accessible to authenticated users
 * Handles academy-aware redirects for authenticated users
 */
export function GuestGuard({ children, fallback }: RouteGuardProps) {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    initialize, 
    academyData, 
    currentAcademy 
  } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Initialize auth state if not already done
    if (!isAuthenticated && !isLoading && !user) {
      initialize()
    }
  }, [isAuthenticated, isLoading, user, initialize])

  useEffect(() => {
    // Redirect authenticated users based on their academy status
    if (!isLoading && isAuthenticated && academyData) {
      if (academyData.count === 0) {
        // No academies - redirect to academy creation
        router.navigate({ to: '/create-academy' })
      } else if (academyData.count === 1) {
        // Single academy - redirect to academy dashboard
        const singleAcademy = academyData.academies[0]
        router.navigate({ to: `/academy/${singleAcademy.id}/dashboard` })
      } else if (academyData.count > 1) {
        // Multiple academies - redirect based on current academy selection
        if (currentAcademy) {
          router.navigate({ to: `/academy/${currentAcademy.id}/dashboard` })
        } else {
          router.navigate({ to: '/academy-selection' })
        }
      }
    } else if (!isLoading && isAuthenticated && !academyData) {
      // Fallback to dashboard if academy data is not available yet
      router.navigate({ to: '/dashboard' })
    }
  }, [isAuthenticated, isLoading, router, academyData, currentAcademy])

  // Show loading state while checking authentication
  if (isLoading) {
    return fallback || <AuthLoadingFallback />
  }

  // Don't render children if authenticated
  if (isAuthenticated) {
    return null
  }

  return <>{children}</>
}

/**
 * AdminGuard component that protects routes requiring admin privileges
 * Redirects non-admin users to the dashboard
 */
export function AdminGuard({ children, fallback }: RouteGuardProps) {
  const { isAuthenticated, isLoading, user, initialize } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Initialize auth state if not already done
    if (!isAuthenticated && !isLoading && !user) {
      initialize()
    }
  }, [isAuthenticated, isLoading, user, initialize])

  useEffect(() => {
    // Redirect to sign-in if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.navigate({ to: '/sign-in' })
      return
    }

    // Redirect to dashboard if authenticated but not admin
    if (!isLoading && isAuthenticated && user && !user.is_super_admin) {
      router.navigate({ to: '/dashboard' })
    }
  }, [isAuthenticated, isLoading, user, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return fallback || <AuthLoadingFallback />
  }

  // Don't render children if not authenticated or not admin
  if (!isAuthenticated || !user?.is_super_admin) {
    return null
  }

  return <>{children}</>
}

interface AcademyGuardProps extends RouteGuardProps {
  academyId?: string | number
  requiredRole?: string
  requiredPermission?: string
  showUnauthorized?: boolean
}

/**
 * AcademyGuard component that protects academy-specific routes
 * Validates user has access to the specified academy and optional role/permission requirements
 */
export function AcademyGuard({ 
  children, 
  fallback, 
  academyId, 
  requiredRole,
  requiredPermission,
  showUnauthorized = false
}: AcademyGuardProps) {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    initialize, 
    academyData, 
    currentAcademy,
    selectAcademy 
  } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Initialize auth state if not already done
    if (!isAuthenticated && !isLoading && !user) {
      initialize()
    }
  }, [isAuthenticated, isLoading, user, initialize])

  useEffect(() => {
    // Redirect to sign-in if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.navigate({ to: '/sign-in' })
      return
    }

    // Handle academy access validation for authenticated users
    if (!isLoading && isAuthenticated && academyData && academyId) {
      const academyIdNum = typeof academyId === 'string' ? parseInt(academyId, 10) : academyId
      
      const validation = validateRouteAccess(
        academyData.academies,
        academyIdNum,
        requiredRole as AcademyRole,
        requiredPermission as Permission
      )
      
      if (!validation.hasAccess) {
        console.warn('Academy access denied:', validation.reason)
        
        if (validation.reason === 'Not a member of this academy') {
          // User doesn't have access to this academy - redirect to academy selection
          router.navigate({ to: '/academy-selection' })
        } else {
          // User has access but insufficient permissions - redirect to academy dashboard
          router.navigate({ to: `/academy/${academyIdNum}/dashboard` })
        }
        return
      }

      // Set current academy if not already set or different
      if (!currentAcademy || currentAcademy.id !== academyIdNum) {
        selectAcademy(academyIdNum)
      }
    }
  }, [
    isAuthenticated, 
    isLoading, 
    router, 
    academyData, 
    academyId, 
    requiredRole,
    requiredPermission,
    currentAcademy, 
    selectAcademy
  ])

  // Show loading state while checking authentication and academy access
  if (isLoading) {
    return fallback || <AuthLoadingFallback />
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Don't render children if academy validation is still in progress
  if (academyId && academyData) {
    const academyIdNum = typeof academyId === 'string' ? parseInt(academyId, 10) : academyId
    
    // Use synchronous validation for rendering decision
    const academyMembership = academyData.academies.find(a => a.id === academyIdNum)
    
    if (!academyMembership) {
      return showUnauthorized ? <UnauthorizedFallback reason="Not a member of this academy" /> : null
    }

    // Basic role check (more detailed validation happens in useEffect)
    if (requiredRole && academyMembership.user_role !== requiredRole) {
      // Allow higher roles to access lower role requirements
      const roleHierarchy: Record<string, number> = { student: 1, teacher: 2, admin: 3 }
      const userLevel = roleHierarchy[academyMembership.user_role] || 0
      const requiredLevel = roleHierarchy[requiredRole] || 0
      
      if (userLevel < requiredLevel) {
        return showUnauthorized ? <UnauthorizedFallback reason={`Insufficient role: ${academyMembership.user_role}`} /> : null
      }
    }
  }

  return <>{children}</>
}

/**
 * Default loading fallback component for route guards
 */
function AuthLoadingFallback() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Checking authentication...
        </div>
      </div>
    </div>
  )
}

/**
 * Unauthorized access fallback component
 */
function UnauthorizedFallback({ reason }: { reason: string }) {
  const router = useRouter()
  
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-4 text-center max-w-md">
        <div className="text-6xl">🚫</div>
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">
          {reason || 'You do not have permission to access this page.'}
        </p>
        <div className="flex space-x-2">
          <button 
            onClick={() => router.history.back()}
            className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
          >
            Go Back
          </button>
          <button 
            onClick={() => router.navigate({ to: '/academy-selection' })}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Select Academy
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Higher-order component that wraps a component with AuthGuard
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard fallback={fallback}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}

/**
 * Higher-order component that wraps a component with GuestGuard
 */
export function withGuestGuard<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function GuestGuardedComponent(props: P) {
    return (
      <GuestGuard fallback={fallback}>
        <Component {...props} />
      </GuestGuard>
    )
  }
}

/**
 * Higher-order component that wraps a component with AdminGuard
 */
export function withAdminGuard<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function AdminGuardedComponent(props: P) {
    return (
      <AdminGuard fallback={fallback}>
        <Component {...props} />
      </AdminGuard>
    )
  }
}

/**
 * Higher-order component that wraps a component with AcademyGuard
 */
export function withAcademyGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    academyId?: string | number
    requiredRole?: string
    requiredPermission?: string
    showUnauthorized?: boolean
    fallback?: React.ReactNode
  }
) {
  return function AcademyGuardedComponent(props: P) {
    return (
      <AcademyGuard 
        academyId={options?.academyId} 
        requiredRole={options?.requiredRole}
        requiredPermission={options?.requiredPermission}
        showUnauthorized={options?.showUnauthorized}
        fallback={options?.fallback}
      >
        <Component {...props} />
      </AcademyGuard>
    )
  }
}

/**
 * Permission-based component wrapper
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permission: string,
  academyId?: number,
  fallback?: React.ReactNode
) {
  return function PermissionGuardedComponent(props: P) {
    // This would use the permission hook to check access
    // For now, we'll use the AcademyGuard with permission
    return (
      <AcademyGuard 
        academyId={academyId}
        requiredPermission={permission}
        fallback={fallback}
        showUnauthorized={true}
      >
        <Component {...props} />
      </AcademyGuard>
    )
  }
}