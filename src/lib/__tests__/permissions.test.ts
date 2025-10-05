import { describe, it, expect } from 'vitest'
import {
  hasRoleLevel,
  getRolePermissions,
  hasPermission,
  canPerformAction,
  canAccessAcademy,
  getUserAcademyRole,
  filterAcademiesByRole,
  canManageUser,
  validateRouteAccess,
  AcademyAccessError,
  InsufficientRoleError,
  MissingPermissionError,
  type AcademyRole,
  type Permission
} from '../permissions'

describe('Permission System', () => {
  const mockAcademyMemberships = [
    { id: 1, user_role: 'admin' },
    { id: 2, user_role: 'teacher' },
    { id: 3, user_role: 'student' }
  ]

  describe('hasRoleLevel', () => {
    it('should correctly compare role hierarchy', () => {
      expect(hasRoleLevel('admin', 'student')).toBe(true)
      expect(hasRoleLevel('admin', 'teacher')).toBe(true)
      expect(hasRoleLevel('admin', 'admin')).toBe(true)
      
      expect(hasRoleLevel('teacher', 'student')).toBe(true)
      expect(hasRoleLevel('teacher', 'teacher')).toBe(true)
      expect(hasRoleLevel('teacher', 'admin')).toBe(false)
      
      expect(hasRoleLevel('student', 'student')).toBe(true)
      expect(hasRoleLevel('student', 'teacher')).toBe(false)
      expect(hasRoleLevel('student', 'admin')).toBe(false)
    })
  })

  describe('getRolePermissions', () => {
    it('should return correct permissions for admin role', () => {
      const permissions = getRolePermissions('admin')
      expect(permissions).toContain('read')
      expect(permissions).toContain('create')
      expect(permissions).toContain('update')
      expect(permissions).toContain('delete')
      expect(permissions).toContain('manage_users')
      expect(permissions).toContain('manage_courses')
      expect(permissions).toContain('manage_payments')
    })

    it('should return correct permissions for teacher role', () => {
      const permissions = getRolePermissions('teacher')
      expect(permissions).toContain('read')
      expect(permissions).toContain('create')
      expect(permissions).toContain('update')
      expect(permissions).toContain('manage_courses')
      expect(permissions).not.toContain('delete')
      expect(permissions).not.toContain('manage_users')
      expect(permissions).not.toContain('manage_payments')
    })

    it('should return correct permissions for student role', () => {
      const permissions = getRolePermissions('student')
      expect(permissions).toContain('read')
      expect(permissions).toContain('enroll')
      expect(permissions).not.toContain('create')
      expect(permissions).not.toContain('update')
      expect(permissions).not.toContain('delete')
    })
  })

  describe('hasPermission', () => {
    it('should correctly check role permissions', () => {
      expect(hasPermission('admin', 'delete')).toBe(true)
      expect(hasPermission('teacher', 'manage_courses')).toBe(true)
      expect(hasPermission('student', 'enroll')).toBe(true)
      
      expect(hasPermission('student', 'delete')).toBe(false)
      expect(hasPermission('teacher', 'manage_users')).toBe(false)
      expect(hasPermission('student', 'create')).toBe(false)
    })
  })

  describe('canPerformAction', () => {
    it('should allow action when user has permission', () => {
      const adminMembership = { user_role: 'admin' }
      const teacherMembership = { user_role: 'teacher' }
      const studentMembership = { user_role: 'student' }
      
      expect(canPerformAction(adminMembership, 'delete')).toBe(true)
      expect(canPerformAction(teacherMembership, 'manage_courses')).toBe(true)
      expect(canPerformAction(studentMembership, 'read')).toBe(true)
    })

    it('should deny action when user lacks permission', () => {
      const studentMembership = { user_role: 'student' }
      
      expect(canPerformAction(studentMembership, 'delete')).toBe(false)
      expect(canPerformAction(studentMembership, 'manage_users')).toBe(false)
      expect(canPerformAction(null, 'read')).toBe(false)
    })
  })

  describe('canAccessAcademy', () => {
    it('should allow access when user is member with sufficient role', () => {
      expect(canAccessAcademy(mockAcademyMemberships, 1, 'student')).toBe(true)
      expect(canAccessAcademy(mockAcademyMemberships, 1, 'admin')).toBe(true)
      expect(canAccessAcademy(mockAcademyMemberships, 2, 'teacher')).toBe(true)
    })

    it('should deny access when user is not member', () => {
      expect(canAccessAcademy(mockAcademyMemberships, 999, 'student')).toBe(false)
    })

    it('should deny access when user has insufficient role', () => {
      expect(canAccessAcademy(mockAcademyMemberships, 3, 'teacher')).toBe(false)
      expect(canAccessAcademy(mockAcademyMemberships, 2, 'admin')).toBe(false)
    })
  })

  describe('getUserAcademyRole', () => {
    it('should return correct role for academy member', () => {
      expect(getUserAcademyRole(mockAcademyMemberships, 1)).toBe('admin')
      expect(getUserAcademyRole(mockAcademyMemberships, 2)).toBe('teacher')
      expect(getUserAcademyRole(mockAcademyMemberships, 3)).toBe('student')
    })

    it('should return null for non-member', () => {
      expect(getUserAcademyRole(mockAcademyMemberships, 999)).toBe(null)
    })
  })

  describe('filterAcademiesByRole', () => {
    it('should filter academies by minimum role requirement', () => {
      const adminAcademies = filterAcademiesByRole(mockAcademyMemberships, 'admin')
      expect(adminAcademies).toHaveLength(1)
      expect(adminAcademies[0].id).toBe(1)

      const teacherAcademies = filterAcademiesByRole(mockAcademyMemberships, 'teacher')
      expect(teacherAcademies).toHaveLength(2)
      expect(teacherAcademies.map(a => a.id)).toEqual([1, 2])

      const studentAcademies = filterAcademiesByRole(mockAcademyMemberships, 'student')
      expect(studentAcademies).toHaveLength(3)
    })
  })

  describe('canManageUser', () => {
    it('should allow users to manage themselves', () => {
      expect(canManageUser('student', 'admin', true)).toBe(true)
      expect(canManageUser('teacher', 'admin', true)).toBe(true)
    })

    it('should allow admins to manage other users', () => {
      expect(canManageUser('admin', 'student', false)).toBe(true)
      expect(canManageUser('admin', 'teacher', false)).toBe(true)
      expect(canManageUser('admin', 'admin', false)).toBe(true)
    })

    it('should deny non-admins from managing other users', () => {
      expect(canManageUser('teacher', 'student', false)).toBe(false)
      expect(canManageUser('student', 'teacher', false)).toBe(false)
    })
  })

  describe('validateRouteAccess', () => {
    it('should validate successful access', () => {
      const result = validateRouteAccess(mockAcademyMemberships, 1, 'student')
      
      expect(result.hasAccess).toBe(true)
      expect(result.userRole).toBe('admin')
      expect(result.reason).toBeUndefined()
    })

    it('should validate access with permission requirement', () => {
      const result = validateRouteAccess(mockAcademyMemberships, 1, undefined, 'manage_users')
      
      expect(result.hasAccess).toBe(true)
      expect(result.userRole).toBe('admin')
    })

    it('should deny access for non-members', () => {
      const result = validateRouteAccess(mockAcademyMemberships, 999)
      
      expect(result.hasAccess).toBe(false)
      expect(result.userRole).toBe(null)
      expect(result.reason).toBe('Not a member of this academy')
    })

    it('should deny access for insufficient role', () => {
      const result = validateRouteAccess(mockAcademyMemberships, 3, 'teacher')
      
      expect(result.hasAccess).toBe(false)
      expect(result.userRole).toBe('student')
      expect(result.reason).toContain('Insufficient role')
    })

    it('should deny access for missing permission', () => {
      const result = validateRouteAccess(mockAcademyMemberships, 3, undefined, 'delete')
      
      expect(result.hasAccess).toBe(false)
      expect(result.userRole).toBe('student')
      expect(result.reason).toBe('Missing permission: delete')
    })
  })

  describe('Error Classes', () => {
    it('should create AcademyAccessError with correct properties', () => {
      const error = new AcademyAccessError(123, 'Test reason')
      
      expect(error.name).toBe('PermissionError')
      expect(error.code).toBe('ACADEMY_ACCESS_DENIED')
      expect(error.message).toContain('Access denied to academy 123')
      expect(error.details?.academyId).toBe(123)
      expect(error.details?.reason).toBe('Test reason')
    })

    it('should create InsufficientRoleError with correct properties', () => {
      const error = new InsufficientRoleError('admin', 'student')
      
      expect(error.code).toBe('INSUFFICIENT_ROLE')
      expect(error.message).toContain('Required: admin, Current: student')
      expect(error.details?.required).toBe('admin')
      expect(error.details?.current).toBe('student')
    })

    it('should create MissingPermissionError with correct properties', () => {
      const error = new MissingPermissionError('delete', 'student')
      
      expect(error.code).toBe('MISSING_PERMISSION')
      expect(error.message).toContain("Missing permission 'delete' for role 'student'")
      expect(error.details?.permission).toBe('delete')
      expect(error.details?.role).toBe('student')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty academy memberships', () => {
      expect(canAccessAcademy([], 1)).toBe(false)
      expect(getUserAcademyRole([], 1)).toBe(null)
      expect(filterAcademiesByRole([], 'student')).toEqual([])
    })

    it('should handle invalid role values gracefully', () => {
      const invalidMemberships = [{ id: 1, user_role: 'invalid_role' }]
      
      // Should not throw errors, but return false/null for safety
      expect(canAccessAcademy(invalidMemberships, 1)).toBe(false)
      expect(hasRoleLevel('invalid_role' as AcademyRole, 'student')).toBe(false)
    })

    it('should handle null/undefined inputs', () => {
      expect(canPerformAction(null, 'read')).toBe(false)
      expect(getUserAcademyRole([], 1)).toBe(null)
      expect(validateRouteAccess([], 1).hasAccess).toBe(false)
    })
  })
})