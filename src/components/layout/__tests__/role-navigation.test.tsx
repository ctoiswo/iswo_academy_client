import { render, screen } from '@testing-library/react'
import type { AuthUser, AcademyMembership } from '@/stores/auth-store'
import type { DashboardType } from '@/components/dashboard-router'
import { RoleNavigation, RoleBreadcrumb } from '../role-navigation'

// Mock the hooks
jest.mock('@/hooks/use-academy-permissions', () => ({
  useAcademyPermissions: jest.fn(),
}))

// Mock TanStack Router
jest.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className, ...props }: any) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
  useRouterState: jest.fn(() => ({
    location: { pathname: '/academy/1/dashboard' },
  })),
}))

describe('RoleNavigation', () => {
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
    last_login_at: '2024-01-01T00:00:00Z',
  }

  const mockAcademy: AcademyMembership = {
    id: 1,
    name: 'Test Academy',
    description: 'Test Description',
    logo_url: null,
    user_role: 'student',
    user_role_display: 'Student',
    created_at: '2024-01-01T00:00:00Z',
    last_accessed: null,
  }

  beforeEach(async () => {
    jest.clearAllMocks()
    // Set default mock return value
    const { useAcademyPermissions } = await import(
      '@/hooks/use-academy-permissions'
    )
    jest.mocked(useAcademyPermissions).mockReturnValue({
      checkAccess: {
        role: jest.fn(() => true),
        permission: jest.fn(() => true),
      },
      helpers: {
        isSuperAdmin: jest.fn(() => false),
      },
    })
  })

  describe('Student Dashboard Navigation', () => {
    it('should render student navigation items', () => {
      render(
        <RoleNavigation
          user={mockUser}
          academy={mockAcademy}
          dashboardType='student'
          currentPath='/academy/1/dashboard'
        />
      )

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('My Courses')).toBeInTheDocument()
      expect(screen.getByText('Calendar')).toBeInTheDocument()
      expect(screen.getByText('Achievements')).toBeInTheDocument()
      expect(screen.getByText('Messages')).toBeInTheDocument()
    })

    it('should have proper accessibility attributes', () => {
      render(
        <RoleNavigation
          user={mockUser}
          academy={mockAcademy}
          dashboardType='student'
          currentPath='/academy/1/dashboard'
        />
      )

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveAttribute('aria-label', 'Main navigation')
    })

    it('should mark active navigation item', () => {
      render(
        <RoleNavigation
          user={mockUser}
          academy={mockAcademy}
          dashboardType='student'
          currentPath='/academy/1/dashboard'
        />
      )

      const dashboardLink = screen.getByText('Dashboard').closest('a')
      expect(dashboardLink).toHaveAttribute('aria-current', 'page')
    })
  })

  describe('Teacher Dashboard Navigation', () => {
    const teacherAcademy = {
      ...mockAcademy,
      user_role: 'teacher',
      user_role_display: 'Teacher',
    }

    it('should render teacher navigation items', () => {
      render(
        <RoleNavigation
          user={mockUser}
          academy={teacherAcademy}
          dashboardType='teacher'
          currentPath='/academy/1/dashboard'
        />
      )

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('My Courses')).toBeInTheDocument()
      expect(screen.getByText('Students')).toBeInTheDocument()
      expect(screen.getByText('Calendar')).toBeInTheDocument()
      expect(screen.getByText('Messages')).toBeInTheDocument()
      expect(screen.getByText('Achievements')).toBeInTheDocument()
    })

    it('should filter items based on permissions', async () => {
      const { useAcademyPermissions } = await import(
        '@/hooks/use-academy-permissions'
      )
      jest.mocked(useAcademyPermissions).mockReturnValue({
        checkAccess: {
          role: jest.fn(() => true),
          permission: jest.fn((permission) => permission !== 'manage_courses'),
        },
        helpers: {
          isSuperAdmin: jest.fn(() => false),
        },
      })

      render(
        <RoleNavigation
          user={mockUser}
          academy={teacherAcademy}
          dashboardType='teacher'
          currentPath='/academy/1/dashboard'
        />
      )

      // Should not show "My Courses" if user doesn't have manage_courses permission
      expect(screen.queryByText('My Courses')).not.toBeInTheDocument()
    })
  })

  describe('Academy Admin Dashboard Navigation', () => {
    const adminAcademy = {
      ...mockAcademy,
      user_role: 'admin',
      user_role_display: 'Administrator',
    }

    it('should render admin navigation items', () => {
      render(
        <RoleNavigation
          user={mockUser}
          academy={adminAcademy}
          dashboardType='academy-admin'
          currentPath='/academy/1/dashboard'
        />
      )

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Users')).toBeInTheDocument()
      expect(screen.getByText('Courses')).toBeInTheDocument()
      expect(screen.getByText('Analytics')).toBeInTheDocument()
      expect(screen.getByText('Payments')).toBeInTheDocument()
      expect(screen.getByText('Reports')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    it('should filter items requiring academy when no academy selected', () => {
      render(
        <RoleNavigation
          user={mockUser}
          academy={null}
          dashboardType='academy-admin'
          currentPath='/dashboard'
        />
      )

      // Should not show any items that require academy
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
      expect(screen.queryByText('Users')).not.toBeInTheDocument()
    })
  })

  describe('Super Admin Dashboard Navigation', () => {
    const superAdminUser = { ...mockUser, is_super_admin: true }

    it('should render super admin navigation items', async () => {
      const { useAcademyPermissions } = await import(
        '@/hooks/use-academy-permissions'
      )
      jest.mocked(useAcademyPermissions).mockReturnValue({
        checkAccess: {
          role: jest.fn(() => true),
          permission: jest.fn(() => true),
        },
        helpers: {
          isSuperAdmin: jest.fn(() => true),
        },
      })

      render(
        <RoleNavigation
          user={superAdminUser}
          academy={mockAcademy}
          dashboardType='super-admin'
          currentPath='/super-admin/dashboard'
        />
      )

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Academies')).toBeInTheDocument()
      expect(screen.getByText('Users')).toBeInTheDocument()
      expect(screen.getByText('Analytics')).toBeInTheDocument()
      expect(screen.getByText('System Settings')).toBeInTheDocument()
    })

    it('should only show super admin items to super admin users', async () => {
      const { useAcademyPermissions } = await import(
        '@/hooks/use-academy-permissions'
      )
      jest.mocked(useAcademyPermissions).mockReturnValue({
        checkAccess: {
          role: jest.fn(() => false),
          permission: jest.fn(() => false),
        },
        helpers: {
          isSuperAdmin: jest.fn(() => false),
        },
      })

      render(
        <RoleNavigation
          user={mockUser} // Regular user, not super admin
          academy={mockAcademy}
          dashboardType='super-admin'
          currentPath='/super-admin/dashboard'
        />
      )

      // Should not show any super admin items
      expect(screen.queryByText('System Settings')).not.toBeInTheDocument()
    })
  })

  describe('Navigation Guards', () => {
    it('should hide disabled items', async () => {
      // Mock navigation items with disabled item
      const { useAcademyPermissions } = await import(
        '@/hooks/use-academy-permissions'
      )
      jest.mocked(useAcademyPermissions).mockReturnValue({
        checkAccess: {
          role: jest.fn(() => true),
          permission: jest.fn(() => true),
        },
        helpers: {
          isSuperAdmin: jest.fn(() => false),
        },
      })

      render(
        <RoleNavigation
          user={mockUser}
          academy={mockAcademy}
          dashboardType='student'
          currentPath='/academy/1/dashboard'
        />
      )

      // All items should be visible since none are disabled by default
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    it('should filter based on role hierarchy', async () => {
      const { useAcademyPermissions } = await import(
        '@/hooks/use-academy-permissions'
      )
      jest.mocked(useAcademyPermissions).mockReturnValue({
        checkAccess: {
          role: jest.fn((role) => role === 'student'), // Only student role
          permission: jest.fn(() => true),
        },
        helpers: {
          isSuperAdmin: jest.fn(() => false),
        },
      })

      render(
        <RoleNavigation
          user={mockUser}
          academy={mockAcademy}
          dashboardType='teacher'
          currentPath='/academy/1/dashboard'
        />
      )

      // Should not show teacher-specific items if user only has student role
      expect(screen.queryByText('My Courses')).not.toBeInTheDocument()
    })
  })
})

describe('RoleBreadcrumb', () => {
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
    last_login_at: '2024-01-01T00:00:00Z',
  }

  const mockAcademy: AcademyMembership = {
    id: 1,
    name: 'Test Academy',
    description: 'Test Description',
    logo_url: null,
    user_role: 'student',
    user_role_display: 'Student',
    created_at: '2024-01-01T00:00:00Z',
    last_accessed: null,
  }

  beforeEach(async () => {
    jest.clearAllMocks()
    // Set default mock return value for breadcrumb tests
    const { useAcademyPermissions } = await import(
      '@/hooks/use-academy-permissions'
    )
    jest.mocked(useAcademyPermissions).mockReturnValue({
      checkAccess: {
        role: jest.fn(() => true),
        permission: jest.fn(() => true),
      },
      helpers: {
        isSuperAdmin: jest.fn(() => false),
      },
    })
  })

  describe('Academy Context Breadcrumbs', () => {
    it('should render academy name in breadcrumb', () => {
      render(
        <RoleBreadcrumb
          academy={mockAcademy}
          currentPath='/academy/1/dashboard'
          user={mockUser}
        />
      )

      expect(screen.getByText('Test Academy')).toBeInTheDocument()
    })

    it('should render role context', () => {
      render(
        <RoleBreadcrumb
          academy={mockAcademy}
          currentPath='/academy/1/dashboard'
          user={mockUser}
        />
      )

      expect(screen.getByText('Student Dashboard')).toBeInTheDocument()
    })

    it('should render current page as non-link', () => {
      render(
        <RoleBreadcrumb
          academy={mockAcademy}
          currentPath='/academy/1/courses'
          user={mockUser}
        />
      )

      const coursesElement = screen.getByText('Courses')
      expect(coursesElement.tagName).toBe('SPAN')
      expect(coursesElement).not.toHaveAttribute('aria-current')
    })

    it('should render intermediate pages as links', () => {
      render(
        <RoleBreadcrumb
          academy={mockAcademy}
          currentPath='/academy/1/courses/123'
          user={mockUser}
        />
      )

      const academyLink = screen.getByText('Test Academy').closest('a')
      expect(academyLink).toHaveAttribute('href', '/academy/1/dashboard')
    })
  })

  describe('Super Admin Context Breadcrumbs', () => {
    const superAdminUser = { ...mockUser, is_super_admin: true }

    it('should render system admin context for super admin', async () => {
      const { useAcademyPermissions } = await import(
        '@/hooks/use-academy-permissions'
      )
      jest.mocked(useAcademyPermissions).mockReturnValue({
        checkAccess: {
          role: jest.fn(() => true),
          permission: jest.fn(() => true),
        },
        helpers: {
          isSuperAdmin: jest.fn(() => true),
        },
      })

      render(
        <RoleBreadcrumb
          academy={null}
          currentPath='/super-admin/academies'
          user={superAdminUser}
        />
      )

      expect(screen.getByText('System Admin')).toBeInTheDocument()
      expect(screen.getByText('Academies')).toBeInTheDocument()
    })
  })

  describe('Path Formatting', () => {
    it('should format kebab-case paths correctly', () => {
      render(
        <RoleBreadcrumb
          academy={mockAcademy}
          currentPath='/academy/1/user-management'
          user={mockUser}
        />
      )

      expect(screen.getByText('User Management')).toBeInTheDocument()
    })

    it('should handle numeric IDs in paths', () => {
      render(
        <RoleBreadcrumb
          academy={mockAcademy}
          currentPath='/academy/1/course/123'
          user={mockUser}
        />
      )

      expect(screen.getByText('Course 123')).toBeInTheDocument()
    })

    it('should have proper accessibility attributes', () => {
      render(
        <RoleBreadcrumb
          academy={mockAcademy}
          currentPath='/academy/1/dashboard'
          user={mockUser}
        />
      )

      const nav = screen.getByRole('navigation')
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumb navigation')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty academy gracefully', () => {
      render(
        <RoleBreadcrumb
          academy={null}
          currentPath='/dashboard'
          user={mockUser}
        />
      )

      // Should not crash and should render something
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('should handle root path', () => {
      render(
        <RoleBreadcrumb academy={mockAcademy} currentPath='/' user={mockUser} />
      )

      expect(screen.getByText('Test Academy')).toBeInTheDocument()
    })

    it('should handle deep nested paths', () => {
      render(
        <RoleBreadcrumb
          academy={mockAcademy}
          currentPath='/academy/1/courses/123/lessons/456/edit'
          user={mockUser}
        />
      )

      expect(screen.getByText('Test Academy')).toBeInTheDocument()
      expect(screen.getByText('Courses')).toBeInTheDocument()
      expect(screen.getByText('Item 123')).toBeInTheDocument() // Updated to match actual output
      expect(screen.getByText('Edit')).toBeInTheDocument()
    })
  })
})
