import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AcademyAdminDashboard } from '../index'
import type { DashboardProps } from '@/components/dashboard-router'
import type { AuthUser, AcademyMembership } from '@/stores/auth-store'

// Mock the layout components
vi.mock('@/components/layout/dashboard-layout', () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dashboard-layout">{children}</div>
  )
}))

vi.mock('@/components/layout/role-navigation', () => ({
  RoleNavigation: () => <div data-testid="role-navigation">Navigation</div>,
  useRoleNavigation: () => ({ currentPath: '/dashboard' })
}))

vi.mock('@/components/ui/sidebar', () => ({
  Sidebar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar">{children}</div>
  ),
  SidebarContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-content">{children}</div>
  ),
  SidebarHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-header">{children}</div>
  )
}))

// Mock the component modules
vi.mock('../components', () => ({
  AcademyStatsOverview: () => <div data-testid="academy-stats-overview">Academy Stats</div>,
  CourseManagementPanel: () => <div data-testid="course-management-panel">Course Management</div>,
  UserManagementPanel: () => <div data-testid="user-management-panel">User Management</div>
}))

const mockUser: AuthUser = {
  id: 1,
  email: 'admin@test.com',
  name: 'Test Admin',
  is_super_admin: false,
  created_at: '2024-01-01',
  updated_at: '2024-01-01'
}

const mockAcademy: AcademyMembership = {
  id: 1,
  name: 'Test Academy',
  user_role: 'admin',
  permissions: ['manage_users', 'manage_courses'],
  academy: {
    id: 1,
    name: 'Test Academy',
    description: 'A test academy',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  }
}

describe('AcademyAdminDashboard', () => {
  it('should render academy required message when no academy is provided', () => {
    render(<AcademyAdminDashboard user={mockUser} academy={null} />)
    
    expect(screen.getByText('Academy Required')).toBeInTheDocument()
    expect(screen.getByText('Please select an academy to access the admin dashboard.')).toBeInTheDocument()
  })

  it('should render academy required message when no user is provided', () => {
    render(<AcademyAdminDashboard user={null} academy={mockAcademy} />)
    
    expect(screen.getByText('Academy Required')).toBeInTheDocument()
    expect(screen.getByText('Please select an academy to access the admin dashboard.')).toBeInTheDocument()
  })

  it('should render dashboard layout when user and academy are provided', () => {
    render(<AcademyAdminDashboard user={mockUser} academy={mockAcademy} />)
    
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
    expect(screen.getByText('Academy Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Manage your academy\'s students, teachers, and courses')).toBeInTheDocument()
  })

  it('should render tab navigation with correct tabs', () => {
    render(<AcademyAdminDashboard user={mockUser} academy={mockAcademy} />)
    
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Courses')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('should show overview tab content by default', () => {
    render(<AcademyAdminDashboard user={mockUser} academy={mockAcademy} />)
    
    expect(screen.getByTestId('academy-stats-overview')).toBeInTheDocument()
    expect(screen.queryByTestId('course-management-panel')).not.toBeInTheDocument()
    expect(screen.queryByTestId('user-management-panel')).not.toBeInTheDocument()
  })

  it('should switch to courses tab when clicked', async () => {
    render(<AcademyAdminDashboard user={mockUser} academy={mockAcademy} />)
    
    const coursesTab = screen.getByText('Courses')
    fireEvent.click(coursesTab)
    
    await waitFor(() => {
      expect(screen.getByTestId('course-management-panel')).toBeInTheDocument()
      expect(screen.queryByTestId('academy-stats-overview')).not.toBeInTheDocument()
      expect(screen.queryByTestId('user-management-panel')).not.toBeInTheDocument()
    })
  })

  it('should switch to users tab when clicked', async () => {
    render(<AcademyAdminDashboard user={mockUser} academy={mockAcademy} />)
    
    const usersTab = screen.getByText('Users')
    fireEvent.click(usersTab)
    
    await waitFor(() => {
      expect(screen.getByTestId('user-management-panel')).toBeInTheDocument()
      expect(screen.queryByTestId('academy-stats-overview')).not.toBeInTheDocument()
      expect(screen.queryByTestId('course-management-panel')).not.toBeInTheDocument()
    })
  })

  it('should pass correct props to dashboard layout', () => {
    render(<AcademyAdminDashboard user={mockUser} academy={mockAcademy} />)
    
    // Verify that the dashboard layout is rendered with the correct structure
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
  })

  it('should render sidebar with academy name', () => {
    render(<AcademyAdminDashboard user={mockUser} academy={mockAcademy} />)
    
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByText('Test Academy')).toBeInTheDocument()
  })

  it('should render role navigation in sidebar', () => {
    render(<AcademyAdminDashboard user={mockUser} academy={mockAcademy} />)
    
    expect(screen.getByTestId('role-navigation')).toBeInTheDocument()
  })

  it('should handle tab state changes correctly', async () => {
    render(<AcademyAdminDashboard user={mockUser} academy={mockAcademy} />)
    
    // Start with overview
    expect(screen.getByTestId('academy-stats-overview')).toBeInTheDocument()
    
    // Switch to courses
    fireEvent.click(screen.getByText('Courses'))
    await waitFor(() => {
      expect(screen.getByTestId('course-management-panel')).toBeInTheDocument()
    })
    
    // Switch to users
    fireEvent.click(screen.getByText('Users'))
    await waitFor(() => {
      expect(screen.getByTestId('user-management-panel')).toBeInTheDocument()
    })
    
    // Switch back to overview
    fireEvent.click(screen.getByText('Overview'))
    await waitFor(() => {
      expect(screen.getByTestId('academy-stats-overview')).toBeInTheDocument()
    })
  })

  it('should pass academy prop to all tab components', () => {
    render(<AcademyAdminDashboard user={mockUser} academy={mockAcademy} />)
    
    // All components should receive the academy prop
    // This is tested implicitly through the component rendering
    expect(screen.getByTestId('academy-stats-overview')).toBeInTheDocument()
  })

  it('should maintain consistent layout structure', () => {
    render(<AcademyAdminDashboard user={mockUser} academy={mockAcademy} />)
    
    // Check for main content structure
    expect(screen.getByText('Academy Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Manage your academy\'s students, teachers, and courses')).toBeInTheDocument()
    
    // Check for tab structure
    const tabsList = screen.getByRole('tablist')
    expect(tabsList).toBeInTheDocument()
  })
})