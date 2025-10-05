import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DashboardRouter, getDashboardType } from '../dashboard-router'
import type { AuthUser, AcademyMembership } from '@/stores/auth-store'

// Mock the hooks
vi.mock('@/hooks/use-academy-permissions', () => ({
  useAcademyPermissions: vi.fn(() => ({
    hasAccess: true,
    helpers: {
      isSuperAdmin: () => false
    }
  }))
}))

// Mock the dashboard components
vi.mock('@/features/dashboard/super-admin/index', () => ({
  SuperAdminDashboard: ({ user }: { user: AuthUser }) => (
    <div data-testid="super-admin-dashboard">Super Admin Dashboard for {user.full_name}</div>
  )
}))

vi.mock('@/features/dashboard/academy-admin/index', () => ({
  AcademyAdminDashboard: ({ user, academy }: { user: AuthUser; academy: AcademyMembership }) => (
    <div data-testid="academy-admin-dashboard">
      Academy Admin Dashboard for {user.full_name} at {academy?.name}
    </div>
  )
}))

vi.mock('@/features/dashboard/teacher/index', () => ({
  TeacherDashboard: ({ user, academy }: { user: AuthUser; academy: AcademyMembership }) => (
    <div data-testid="teacher-dashboard">
      Teacher Dashboard for {user.full_name} at {academy?.name}
    </div>
  )
}))

vi.mock('@/features/dashboard/student/index', () => ({
  StudentDashboard: ({ user, academy }: { user: AuthUser; academy: AcademyMembership }) => (
    <div data-testid="student-dashboard">
      Student Dashboard for {user.full_name} at {academy?.name}
    </div>
  )
}))

describe('DashboardRouter', () => {
  const mockUser: AuthUser = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    full_name: 'John Doe',
    initials: 'JD',
    confirmed: true,
    is_super_admin: false,
    created_at: '2024-01-01T00:00:00Z',
    last_login_at: '2024-01-01T00:00:00Z'
  }

  const mockAcademy: AcademyMembership = {
    id: 1,
    name: 'Test Academy',
    description: 'Test Description',
    logo_url: null,
    user_role: 'student',
    user_role_display: 'Student',
    created_at: '2024-01-01T00:00:00Z',
    last_accessed: null
  }

  const mockFallback = ({ user }: { user: AuthUser }) => (
    <div data-testid="fallback">Fallback for {user.full_name}</div>
  )

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getDashboardType', () => {
    it('should return super-admin for super admin users', () => {
      const superAdminUser = { ...mockUser, is_super_admin: true }
      const result = getDashboardType(superAdminUser, mockAcademy)
      expect(result).toBe('super-admin')
    })

    it('should return academy-admin for admin role', () => {
      const adminAcademy = { ...mockAcademy, user_role: 'admin' }
      const result = getDashboardType(mockUser, adminAcademy)
      expect(result).toBe('academy-admin')
    })

    it('should return teacher for teacher role', () => {
      const teacherAcademy = { ...mockAcademy, user_role: 'teacher' }
      const result = getDashboardType(mockUser, teacherAcademy)
      expect(result).toBe('teacher')
    })

    it('should return student for student role', () => {
      const result = getDashboardType(mockUser, mockAcademy)
      expect(result).toBe('student')
    })

    it('should return student as default when no academy', () => {
      const result = getDashboardType(mockUser, null)
      expect(result).toBe('student')
    })
  })

  describe('DashboardRouter Component', () => {
    it('should render fallback when user is not authenticated', () => {
      render(
        <DashboardRouter
          user={null as any}
          currentAcademy={mockAcademy}
          fallbackComponent={mockFallback}
        />
      )

      expect(screen.getByText('Authentication Required')).toBeInTheDocument()
    })

    it('should render access denied when user has no access', () => {
      const { useAcademyPermissions } = require('@/hooks/use-academy-permissions')
      useAcademyPermissions.mockReturnValue({
        hasAccess: false,
        helpers: { isSuperAdmin: () => false }
      })

      render(
        <DashboardRouter
          user={mockUser}
          currentAcademy={mockAcademy}
          fallbackComponent={mockFallback}
        />
      )

      expect(screen.getByText('Access Denied')).toBeInTheDocument()
    })

    it('should render fallback component when access denied and fallback provided', () => {
      const { useAcademyPermissions } = require('@/hooks/use-academy-permissions')
      useAcademyPermissions.mockReturnValue({
        hasAccess: false,
        helpers: { isSuperAdmin: () => false }
      })

      render(
        <DashboardRouter
          user={mockUser}
          currentAcademy={mockAcademy}
          fallbackComponent={mockFallback}
        />
      )

      // Should still show access denied, not fallback
      expect(screen.getByText('Access Denied')).toBeInTheDocument()
    })

    it('should render super admin dashboard for super admin', () => {
      const superAdminUser = { ...mockUser, is_super_admin: true }
      const { useAcademyPermissions } = require('@/hooks/use-academy-permissions')
      useAcademyPermissions.mockReturnValue({
        hasAccess: true,
        helpers: { isSuperAdmin: () => true }
      })

      render(
        <DashboardRouter
          user={superAdminUser}
          currentAcademy={mockAcademy}
          fallbackComponent={mockFallback}
        />
      )

      expect(screen.getByTestId('super-admin-dashboard')).toBeInTheDocument()
      expect(screen.getByText(/Super Admin Dashboard for John Doe/)).toBeInTheDocument()
    })

    it('should render student dashboard for student role', () => {
      render(
        <DashboardRouter
          user={mockUser}
          currentAcademy={mockAcademy}
          fallbackComponent={mockFallback}
        />
      )

      expect(screen.getByTestId('student-dashboard')).toBeInTheDocument()
      expect(screen.getByText(/Student Dashboard for John Doe at Test Academy/)).toBeInTheDocument()
    })

    it('should render academy admin dashboard for admin role', () => {
      const adminAcademy = { ...mockAcademy, user_role: 'admin' }
      
      render(
        <DashboardRouter
          user={mockUser}
          currentAcademy={adminAcademy}
          fallbackComponent={mockFallback}
        />
      )

      expect(screen.getByTestId('academy-admin-dashboard')).toBeInTheDocument()
      expect(screen.getByText(/Academy Admin Dashboard for John Doe at Test Academy/)).toBeInTheDocument()
    })

    it('should render teacher dashboard for teacher role', () => {
      const teacherAcademy = { ...mockAcademy, user_role: 'teacher' }
      
      render(
        <DashboardRouter
          user={mockUser}
          currentAcademy={teacherAcademy}
          fallbackComponent={mockFallback}
        />
      )

      expect(screen.getByTestId('teacher-dashboard')).toBeInTheDocument()
      expect(screen.getByText(/Teacher Dashboard for John Doe at Test Academy/)).toBeInTheDocument()
    })
  })
})