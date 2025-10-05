import { useMemo } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import {
  type AcademyRole,
  type Permission,
  canAccessAcademy,

  getUserAcademyRole,
  hasPermission,
  hasRoleLevel,
  validateRouteAccess,
  canManageUser,
  filterAcademiesByRole
} from '@/lib/permissions'

/**
 * Hook for academy-specific permission checking
 */
export function useAcademyPermissions(academyId?: number) {
  const { academyData, currentAcademy, user } = useAuthStore()
  
  const targetAcademyId = academyId || currentAcademy?.id
  const academyMemberships = academyData?.academies || []
  
  const permissions = useMemo(() => {
    if (!targetAcademyId || !academyMemberships.length) {
      return {
        hasAccess: false,
        userRole: null,
        canRead: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false,
        canEnroll: false,
        canManageCourses: false,
        canManageUsers: false,
        canManagePayments: false,
        isStudent: false,
        isTeacher: false,
        isAdmin: false
      }
    }
    
    const userRole = getUserAcademyRole(academyMemberships, targetAcademyId)
    const membership = academyMemberships.find(m => m.id === targetAcademyId)
    
    if (!userRole || !membership) {
      return {
        hasAccess: false,
        userRole: null,
        canRead: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false,
        canEnroll: false,
        canManageCourses: false,
        canManageUsers: false,
        canManagePayments: false,
        isStudent: false,
        isTeacher: false,
        isAdmin: false
      }
    }
    
    return {
      hasAccess: true,
      userRole,
      canRead: hasPermission(userRole, 'read'),
      canCreate: hasPermission(userRole, 'create'),
      canUpdate: hasPermission(userRole, 'update'),
      canDelete: hasPermission(userRole, 'delete'),
      canEnroll: hasPermission(userRole, 'enroll'),
      canManageCourses: hasPermission(userRole, 'manage_courses'),
      canManageUsers: hasPermission(userRole, 'manage_users'),
      canManagePayments: hasPermission(userRole, 'manage_payments'),
      isStudent: userRole === 'student',
      isTeacher: hasRoleLevel(userRole, 'teacher'),
      isAdmin: userRole === 'admin'
    }
  }, [targetAcademyId, academyMemberships])
  
  const checkAccess = useMemo(() => ({
    /**
     * Check if user can access academy with optional role requirement
     */
    academy: (requiredRole?: AcademyRole) => {
      if (!targetAcademyId) return false
      return canAccessAcademy(academyMemberships, targetAcademyId, requiredRole)
    },
    
    /**
     * Check if user has specific permission
     */
    permission: (permission: Permission) => {
      if (!permissions.userRole) return false
      return hasPermission(permissions.userRole, permission)
    },
    
    /**
     * Check if user has sufficient role level
     */
    role: (requiredRole: AcademyRole) => {
      if (!permissions.userRole) return false
      return hasRoleLevel(permissions.userRole, requiredRole)
    },
    
    /**
     * Validate route access with detailed response
     */
    route: (requiredRole?: AcademyRole, requiredPermission?: Permission) => {
      if (!targetAcademyId) {
        return {
          hasAccess: false,
          userRole: null,
          reason: 'No academy specified'
        }
      }
      return validateRouteAccess(academyMemberships, targetAcademyId, requiredRole, requiredPermission)
    },
    
    /**
     * Check if user can manage another user
     */
    userManagement: (targetUserRole: AcademyRole, isSameUser: boolean = false) => {
      if (!permissions.userRole) return false
      return canManageUser(permissions.userRole, targetUserRole, isSameUser)
    }
  }), [targetAcademyId, academyMemberships, permissions.userRole])
  
  const helpers = useMemo(() => ({
    /**
     * Get academies where user has specific role or higher
     */
    getAcademiesWithRole: (requiredRole: AcademyRole) => {
      return filterAcademiesByRole(academyMemberships, requiredRole)
    },
    
    /**
     * Get user's role in current or specified academy
     */
    getCurrentRole: () => permissions.userRole,
    
    /**
     * Check if user is super admin
     */
    isSuperAdmin: () => user?.is_super_admin || false,
    
    /**
     * Get permission summary for debugging
     */
    getPermissionSummary: () => ({
      academyId: targetAcademyId,
      userRole: permissions.userRole,
      hasAccess: permissions.hasAccess,
      permissions: {
        read: permissions.canRead,
        create: permissions.canCreate,
        update: permissions.canUpdate,
        delete: permissions.canDelete,
        enroll: permissions.canEnroll,
        manageCourses: permissions.canManageCourses,
        manageUsers: permissions.canManageUsers,
        managePayments: permissions.canManagePayments
      },
      roles: {
        isStudent: permissions.isStudent,
        isTeacher: permissions.isTeacher,
        isAdmin: permissions.isAdmin
      }
    })
  }), [academyMemberships, permissions, targetAcademyId, user])
  
  return {
    ...permissions,
    checkAccess,
    helpers
  }
}

/**
 * Hook for global permission checking across all academies
 */
export function useGlobalPermissions() {
  const { academyData, user } = useAuthStore()
  const academyMemberships = academyData?.academies || []
  
  const globalPermissions = useMemo(() => {
    const isSuperAdmin = user?.is_super_admin || false
    
    // If super admin, has all permissions
    if (isSuperAdmin) {
      return {
        canCreateAcademy: true,
        canAccessAnyAcademy: true,
        hasAdminRole: true,
        hasTeacherRole: true,
        academyCount: academyMemberships.length,
        adminAcademies: academyMemberships,
        teacherAcademies: academyMemberships,
        studentAcademies: academyMemberships
      }
    }
    
    const adminAcademies = filterAcademiesByRole(academyMemberships, 'admin')
    const teacherAcademies = filterAcademiesByRole(academyMemberships, 'teacher')
    const studentAcademies = filterAcademiesByRole(academyMemberships, 'student')
    
    return {
      canCreateAcademy: adminAcademies.length > 0, // Users with admin role can create academies
      canAccessAnyAcademy: academyMemberships.length > 0,
      hasAdminRole: adminAcademies.length > 0,
      hasTeacherRole: teacherAcademies.length > 0,
      academyCount: academyMemberships.length,
      adminAcademies,
      teacherAcademies,
      studentAcademies
    }
  }, [academyMemberships, user])
  
  return globalPermissions
}

/**
 * Hook for permission-based component rendering
 */
export function usePermissionGuard() {
  const { user } = useAuthStore()
  
  return {
    /**
     * Render component only if user has permission
     */
    renderIfCan: (
      permission: Permission | AcademyRole,
      academyId?: number,
      children?: React.ReactNode
    ) => {
      const { checkAccess } = useAcademyPermissions(academyId)
      
      // Check if it's a permission or role
      const hasAccess = typeof permission === 'string' && 
        ['read', 'create', 'update', 'delete', 'enroll', 'manage_courses', 'manage_users', 'manage_payments'].includes(permission)
        ? checkAccess.permission(permission as Permission)
        : checkAccess.role(permission as AcademyRole)
      
      return hasAccess ? children : null
    },
    
    /**
     * Render component only if user is super admin
     */
    renderIfSuperAdmin: (children?: React.ReactNode) => {
      return user?.is_super_admin ? children : null
    },
    
    /**
     * Render different content based on role
     */
    renderByRole: (
      academyId: number,
      roleComponents: Partial<Record<AcademyRole | 'none', React.ReactNode>>
    ) => {
      const { userRole } = useAcademyPermissions(academyId)
      
      if (!userRole) {
        return roleComponents.none || null
      }
      
      return roleComponents[userRole] || null
    }
  }
}