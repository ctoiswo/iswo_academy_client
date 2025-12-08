// Permission types and validation utilities for academy access control

export type AcademyRole = 'guest' | 'student' | 'teacher' | 'admin'
export type Permission =
  | 'read'
  | 'create'
  | 'update'
  | 'delete'
  | 'enroll'
  | 'manage_courses'
  | 'manage_users'
  | 'manage_payments'

export interface AcademyPermissions {
  academyId: number
  role: AcademyRole
  permissions: Permission[]
}

export interface PermissionContext {
  academyId?: number
  resourceType?: string
  resourceId?: number
  action?: string
}

// Role hierarchy for permission checking
const ROLE_HIERARCHY: Record<AcademyRole, number> = {
  guest: 0,
  student: 1,
  teacher: 2,
  admin: 3,
}

// Permissions by role
const ROLE_PERMISSIONS: Record<AcademyRole, Permission[]> = {
  admin: [
    'read',
    'create',
    'update',
    'delete',
    'enroll',
    'manage_courses',
    'manage_users',
    'manage_payments',
  ],
  teacher: ['read', 'create', 'update', 'enroll', 'manage_courses'],
  student: ['read', 'enroll'],
  guest: ['read'], // Guests can only read public content
}

/**
 * Check if a role has sufficient permissions compared to required role
 */
export function hasRoleLevel(
  userRole: AcademyRole,
  requiredRole: AcademyRole
): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] || 0
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0
  return userLevel >= requiredLevel
}

/**
 * Get permissions for a specific role
 */
export function getRolePermissions(role: AcademyRole): Permission[] {
  return ROLE_PERMISSIONS[role] || []
}

/**
 * Check if a role has a specific permission
 */
export function hasPermission(
  role: AcademyRole,
  permission: Permission
): boolean {
  const rolePermissions = getRolePermissions(role)
  return rolePermissions.includes(permission)
}

/**
 * Check if user can perform an action based on their academy membership
 */
export function canPerformAction(
  academyMembership: { user_role: string } | null,
  action: Permission,
  context?: PermissionContext
): boolean {
  if (!academyMembership) return false

  const role = academyMembership.user_role as AcademyRole
  return hasPermission(role, action)
}

/**
 * Check if user can access a specific academy
 */
export function canAccessAcademy(
  academyMemberships: Array<{ id: number; user_role: string }>,
  academyId: number,
  requiredRole: AcademyRole = 'student'
): boolean {
  const membership = academyMemberships.find((m) => m.id === academyId)
  if (!membership) return false

  return hasRoleLevel(membership.user_role as AcademyRole, requiredRole)
}

/**
 * Get user's role in a specific academy
 */
export function getUserAcademyRole(
  academyMemberships: Array<{ id: number; user_role: string }>,
  academyId: number
): AcademyRole | null {
  const membership = academyMemberships.find((m) => m.id === academyId)
  return membership ? (membership.user_role as AcademyRole) : null
}

/**
 * Filter academies based on required role
 */
export function filterAcademiesByRole(
  academyMemberships: Array<{ id: number; user_role: string }>,
  requiredRole: AcademyRole
): Array<{ id: number; user_role: string }> {
  return academyMemberships.filter((membership) =>
    hasRoleLevel(membership.user_role as AcademyRole, requiredRole)
  )
}

/**
 * Check if user can manage another user in an academy context
 */
export function canManageUser(
  currentUserRole: AcademyRole,
  targetUserRole: AcademyRole,
  isSameUser: boolean = false
): boolean {
  // Users can always manage themselves (for profile updates)
  if (isSameUser) return true

  // Only admins can manage other users
  if (currentUserRole !== 'admin') return false

  // Admins can manage users with lower or equal roles
  return hasRoleLevel(currentUserRole, targetUserRole)
}

/**
 * Validate route access based on academy membership and required permissions
 */
export function validateRouteAccess(
  academyMemberships: Array<{ id: number; user_role: string }>,
  academyId: number,
  requiredRole?: AcademyRole,
  requiredPermission?: Permission
): {
  hasAccess: boolean
  userRole: AcademyRole | null
  reason?: string
} {
  const userRole = getUserAcademyRole(academyMemberships, academyId)

  if (!userRole) {
    return {
      hasAccess: false,
      userRole: null,
      reason: 'Not a member of this academy',
    }
  }

  if (requiredRole && !hasRoleLevel(userRole, requiredRole)) {
    return {
      hasAccess: false,
      userRole,
      reason: `Insufficient role. Required: ${requiredRole}, Current: ${userRole}`,
    }
  }

  if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
    return {
      hasAccess: false,
      userRole,
      reason: `Missing permission: ${requiredPermission}`,
    }
  }

  return {
    hasAccess: true,
    userRole,
  }
}

/**
 * Error types for permission validation
 */
export class PermissionError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'PermissionError'
  }
}

export class AcademyAccessError extends PermissionError {
  constructor(academyId: number, reason: string) {
    super(
      `Access denied to academy ${academyId}: ${reason}`,
      'ACADEMY_ACCESS_DENIED',
      { academyId, reason }
    )
  }
}

export class InsufficientRoleError extends PermissionError {
  constructor(required: AcademyRole, current: AcademyRole) {
    super(
      `Insufficient role. Required: ${required}, Current: ${current}`,
      'INSUFFICIENT_ROLE',
      { required, current }
    )
  }
}

export class MissingPermissionError extends PermissionError {
  constructor(permission: Permission, role: AcademyRole) {
    super(
      `Missing permission '${permission}' for role '${role}'`,
      'MISSING_PERMISSION',
      { permission, role }
    )
  }
}
