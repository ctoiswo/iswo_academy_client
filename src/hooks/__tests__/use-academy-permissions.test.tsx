import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthStore } from '@/stores/auth-store'
import {
  useAcademyPermissions,
  useGlobalPermissions,
} from '../use-academy-permissions'

// Mock the auth store
vi.mock('@/stores/auth-store', () => ({
  useAuthStore: vi.fn(),
}))

const mockUseAuthStore = vi.mocked(useAuthStore)

describe('useAcademyPermissions', () => {
  const mockAcademyData = {
    count: 3,
    academies: [
      {
        id: 1,
        name: 'Tech Academy',
        user_role: 'admin',
        user_role_display: 'Administrator',
      },
      {
        id: 2,
        name: 'Art Academy',
        user_role: 'teacher',
        user_role_display: 'Teacher',
      },
      {
        id: 3,
        name: 'Music Academy',
        user_role: 'student',
        user_role_display: 'Student',
      },
    ],
  }

  const mockCurrentAcademy = mockAcademyData.academies[0]
  const mockUser = { id: 1, is_super_admin: false }

  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      academyData: mockAcademyData,
      currentAcademy: mockCurrentAcademy,
      user: mockUser,
    } as any)
  })

  describe('with admin role', () => {
    it('should return correct permissions for admin user', () => {
      const { result } = renderHook(() => useAcademyPermissions(1))

      expect(result.current.hasAccess).toBe(true)
      expect(result.current.userRole).toBe('admin')
      expect(result.current.isAdmin).toBe(true)
      expect(result.current.isTeacher).toBe(true)
      expect(result.current.isStudent).toBe(false)

      expect(result.current.canRead).toBe(true)
      expect(result.current.canCreate).toBe(true)
      expect(result.current.canUpdate).toBe(true)
      expect(result.current.canDelete).toBe(true)
      expect(result.current.canManageUsers).toBe(true)
      expect(result.current.canManageCourses).toBe(true)
      expect(result.current.canManagePayments).toBe(true)
    })

    it('should allow admin to access with any role requirement', () => {
      const { result } = renderHook(() => useAcademyPermissions(1))

      expect(result.current.checkAccess.academy('student')).toBe(true)
      expect(result.current.checkAccess.academy('teacher')).toBe(true)
      expect(result.current.checkAccess.academy('admin')).toBe(true)
    })

    it('should allow admin to perform any action', () => {
      const { result } = renderHook(() => useAcademyPermissions(1))

      expect(result.current.checkAccess.permission('read')).toBe(true)
      expect(result.current.checkAccess.permission('delete')).toBe(true)
      expect(result.current.checkAccess.permission('manage_users')).toBe(true)
    })
  })

  describe('with teacher role', () => {
    it('should return correct permissions for teacher user', () => {
      const { result } = renderHook(() => useAcademyPermissions(2))

      expect(result.current.hasAccess).toBe(true)
      expect(result.current.userRole).toBe('teacher')
      expect(result.current.isAdmin).toBe(false)
      expect(result.current.isTeacher).toBe(true)
      expect(result.current.isStudent).toBe(false)

      expect(result.current.canRead).toBe(true)
      expect(result.current.canCreate).toBe(true)
      expect(result.current.canUpdate).toBe(true)
      expect(result.current.canDelete).toBe(false)
      expect(result.current.canManageUsers).toBe(false)
      expect(result.current.canManageCourses).toBe(true)
      expect(result.current.canManagePayments).toBe(false)
    })

    it('should allow teacher to access student and teacher requirements', () => {
      const { result } = renderHook(() => useAcademyPermissions(2))

      expect(result.current.checkAccess.academy('student')).toBe(true)
      expect(result.current.checkAccess.academy('teacher')).toBe(true)
      expect(result.current.checkAccess.academy('admin')).toBe(false)
    })
  })

  describe('with student role', () => {
    it('should return correct permissions for student user', () => {
      const { result } = renderHook(() => useAcademyPermissions(3))

      expect(result.current.hasAccess).toBe(true)
      expect(result.current.userRole).toBe('student')
      expect(result.current.isAdmin).toBe(false)
      expect(result.current.isTeacher).toBe(false)
      expect(result.current.isStudent).toBe(true)

      expect(result.current.canRead).toBe(true)
      expect(result.current.canCreate).toBe(false)
      expect(result.current.canUpdate).toBe(false)
      expect(result.current.canDelete).toBe(false)
      expect(result.current.canManageUsers).toBe(false)
      expect(result.current.canManageCourses).toBe(false)
      expect(result.current.canManagePayments).toBe(false)
      expect(result.current.canEnroll).toBe(true)
    })

    it('should only allow student to access student requirements', () => {
      const { result } = renderHook(() => useAcademyPermissions(3))

      expect(result.current.checkAccess.academy('student')).toBe(true)
      expect(result.current.checkAccess.academy('teacher')).toBe(false)
      expect(result.current.checkAccess.academy('admin')).toBe(false)
    })
  })

  describe('without academy access', () => {
    it('should return no access for non-member academy', () => {
      const { result } = renderHook(() => useAcademyPermissions(999))

      expect(result.current.hasAccess).toBe(false)
      expect(result.current.userRole).toBe(null)
      expect(result.current.canRead).toBe(false)
      expect(result.current.canCreate).toBe(false)
    })

    it('should return no access when no academy data', () => {
      mockUseAuthStore.mockReturnValue({
        academyData: null,
        currentAcademy: null,
        user: mockUser,
      } as any)

      const { result } = renderHook(() => useAcademyPermissions(1))

      expect(result.current.hasAccess).toBe(false)
      expect(result.current.userRole).toBe(null)
    })
  })

  describe('route validation', () => {
    it('should validate route access correctly', () => {
      const { result } = renderHook(() => useAcademyPermissions(1))

      const validation = result.current.checkAccess.route('student', 'read')
      expect(validation.hasAccess).toBe(true)
      expect(validation.userRole).toBe('admin')
      expect(validation.reason).toBeUndefined()
    })

    it('should deny route access for insufficient permissions', () => {
      const { result } = renderHook(() => useAcademyPermissions(3))

      const validation = result.current.checkAccess.route('admin', 'delete')
      expect(validation.hasAccess).toBe(false)
      expect(validation.userRole).toBe('student')
      expect(validation.reason).toContain('Insufficient role')
    })
  })

  describe('user management permissions', () => {
    it('should allow admin to manage other users', () => {
      const { result } = renderHook(() => useAcademyPermissions(1))

      expect(result.current.checkAccess.userManagement('student', false)).toBe(
        true
      )
      expect(result.current.checkAccess.userManagement('teacher', false)).toBe(
        true
      )
      expect(result.current.checkAccess.userManagement('admin', false)).toBe(
        true
      )
    })

    it('should allow users to manage themselves', () => {
      const { result } = renderHook(() => useAcademyPermissions(3))

      expect(result.current.checkAccess.userManagement('student', true)).toBe(
        true
      )
    })

    it('should deny non-admin from managing other users', () => {
      const { result } = renderHook(() => useAcademyPermissions(3))

      expect(result.current.checkAccess.userManagement('teacher', false)).toBe(
        false
      )
    })
  })

  describe('helper functions', () => {
    it('should get academies with specific role', () => {
      const { result } = renderHook(() => useAcademyPermissions())

      const adminAcademies =
        result.current.helpers.getAcademiesWithRole('admin')
      expect(adminAcademies).toHaveLength(1)
      expect(adminAcademies[0].id).toBe(1)

      const teacherAcademies =
        result.current.helpers.getAcademiesWithRole('teacher')
      expect(teacherAcademies).toHaveLength(2)
    })

    it('should get current role correctly', () => {
      const { result } = renderHook(() => useAcademyPermissions(1))

      expect(result.current.helpers.getCurrentRole()).toBe('admin')
    })

    it('should check super admin status', () => {
      const { result } = renderHook(() => useAcademyPermissions())

      expect(result.current.helpers.isSuperAdmin()).toBe(false)
    })

    it('should provide permission summary', () => {
      const { result } = renderHook(() => useAcademyPermissions(1))

      const summary = result.current.helpers.getPermissionSummary()
      expect(summary.academyId).toBe(1)
      expect(summary.userRole).toBe('admin')
      expect(summary.hasAccess).toBe(true)
      expect(summary.permissions.read).toBe(true)
      expect(summary.permissions.delete).toBe(true)
      expect(summary.roles.isAdmin).toBe(true)
    })
  })
})

describe('useGlobalPermissions', () => {
  const mockAcademyData = {
    count: 3,
    academies: [
      {
        id: 1,
        name: 'Tech Academy',
        user_role: 'admin',
        user_role_display: 'Administrator',
      },
      {
        id: 2,
        name: 'Art Academy',
        user_role: 'teacher',
        user_role_display: 'Teacher',
      },
      {
        id: 3,
        name: 'Music Academy',
        user_role: 'student',
        user_role_display: 'Student',
      },
    ],
  }

  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      academyData: mockAcademyData,
      user: { id: 1, is_super_admin: false },
    } as any)
  })

  it('should return correct global permissions for regular user', () => {
    const { result } = renderHook(() => useGlobalPermissions())

    expect(result.current.canCreateAcademy).toBe(true) // Has admin role in one academy
    expect(result.current.canAccessAnyAcademy).toBe(true)
    expect(result.current.hasAdminRole).toBe(true)
    expect(result.current.hasTeacherRole).toBe(true)
    expect(result.current.academyCount).toBe(3)
    expect(result.current.adminAcademies).toHaveLength(1)
    expect(result.current.teacherAcademies).toHaveLength(2)
    expect(result.current.studentAcademies).toHaveLength(3)
  })

  it('should return super admin permissions for super admin user', () => {
    mockUseAuthStore.mockReturnValue({
      academyData: mockAcademyData,
      user: { id: 1, is_super_admin: true },
    } as any)

    const { result } = renderHook(() => useGlobalPermissions())

    expect(result.current.canCreateAcademy).toBe(true)
    expect(result.current.canAccessAnyAcademy).toBe(true)
    expect(result.current.hasAdminRole).toBe(true)
    expect(result.current.hasTeacherRole).toBe(true)
  })

  it('should handle user with no academies', () => {
    mockUseAuthStore.mockReturnValue({
      academyData: { count: 0, academies: [] },
      user: { id: 1, is_super_admin: false },
    } as any)

    const { result } = renderHook(() => useGlobalPermissions())

    expect(result.current.canCreateAcademy).toBe(false)
    expect(result.current.canAccessAnyAcademy).toBe(false)
    expect(result.current.hasAdminRole).toBe(false)
    expect(result.current.hasTeacherRole).toBe(false)
    expect(result.current.academyCount).toBe(0)
  })

  it('should handle missing academy data', () => {
    mockUseAuthStore.mockReturnValue({
      academyData: null,
      user: { id: 1, is_super_admin: false },
    } as any)

    const { result } = renderHook(() => useGlobalPermissions())

    expect(result.current.canCreateAcademy).toBe(false)
    expect(result.current.canAccessAnyAcademy).toBe(false)
    expect(result.current.academyCount).toBe(0)
  })
})
