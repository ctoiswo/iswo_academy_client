import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AuthUser, AcademyMembership } from '@/stores/auth-store'
import { SuperAdminDashboard } from '../index'

// Mock the layout component
vi.mock('@/components/layout/dashboard-layout', () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='dashboard-layout'>{children}</div>
  ),
}))

// Mock the child components
vi.mock('../components/global-stats-overview', () => ({
  GlobalStatsOverview: ({ stats, loading, error }: any) => (
    <div data-testid='global-stats-overview'>
      {loading && <div>Loading stats...</div>}
      {error && <div>Error: {error}</div>}
      {stats && <div>Stats loaded: {stats.totalAcademies} academies</div>}
    </div>
  ),
}))

vi.mock('../components/academy-management-panel', () => ({
  AcademyManagementPanel: ({ academies, loading, error }: any) => (
    <div data-testid='academy-management-panel'>
      {loading && <div>Loading academies...</div>}
      {error && <div>Error: {error}</div>}
      {academies && <div>Academies loaded: {academies.length} items</div>}
    </div>
  ),
}))

describe('SuperAdminDashboard', () => {
  const mockUser: AuthUser = {
    id: 1,
    first_name: 'Super',
    last_name: 'Admin',
    email: 'admin@example.com',
    full_name: 'Super Admin',
    initials: 'SA',
    confirmed: true,
    is_super_admin: true,
    created_at: '2024-01-01T00:00:00Z',
    last_login_at: '2024-02-10T10:00:00Z',
  }

  const mockAcademy: AcademyMembership = {
    id: 1,
    name: 'Test Academy',
    description: 'Test Description',
    logo_url: null,
    user_role: 'admin',
    user_role_display: 'Administrator',
    created_at: '2024-01-01T00:00:00Z',
    last_accessed: null,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders dashboard layout with correct props', () => {
      render(<SuperAdminDashboard user={mockUser} academy={mockAcademy} />)

      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
    })

    it('renders dashboard title and description', () => {
      render(<SuperAdminDashboard user={mockUser} academy={mockAcademy} />)

      expect(screen.getByText('Super Admin Dashboard')).toBeInTheDocument()
      expect(
        screen.getByText('Manage all academies and system-wide settings')
      ).toBeInTheDocument()
    })

    it('renders GlobalStatsOverview component', () => {
      render(<SuperAdminDashboard user={mockUser} academy={mockAcademy} />)

      expect(screen.getByTestId('global-stats-overview')).toBeInTheDocument()
    })

    it('renders AcademyManagementPanel component', () => {
      render(<SuperAdminDashboard user={mockUser} academy={mockAcademy} />)

      expect(screen.getByTestId('academy-management-panel')).toBeInTheDocument()
    })

    it('returns null when user is not provided', () => {
      const { container } = render(
        <SuperAdminDashboard user={null} academy={mockAcademy} />
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Loading States', () => {
    it('shows loading state initially', () => {
      render(<SuperAdminDashboard user={mockUser} academy={mockAcademy} />)

      expect(screen.getByText('Loading stats...')).toBeInTheDocument()
      expect(screen.getByText('Loading academies...')).toBeInTheDocument()
    })

    it('shows loaded data after loading completes', async () => {
      render(<SuperAdminDashboard user={mockUser} academy={mockAcademy} />)

      // Wait for the mock data to load
      await waitFor(
        () => {
          expect(
            screen.getByText('Stats loaded: 12 academies')
          ).toBeInTheDocument()
        },
        { timeout: 2000 }
      )

      await waitFor(
        () => {
          expect(
            screen.getByText('Academies loaded: 3 items')
          ).toBeInTheDocument()
        },
        { timeout: 2000 }
      )
    })
  })

  describe('Data Loading', () => {
    it('loads mock global statistics', async () => {
      render(<SuperAdminDashboard user={mockUser} academy={mockAcademy} />)

      await waitFor(
        () => {
          expect(
            screen.getByText('Stats loaded: 12 academies')
          ).toBeInTheDocument()
        },
        { timeout: 2000 }
      )
    })

    it('loads mock academy data', async () => {
      render(<SuperAdminDashboard user={mockUser} academy={mockAcademy} />)

      await waitFor(
        () => {
          expect(
            screen.getByText('Academies loaded: 3 items')
          ).toBeInTheDocument()
        },
        { timeout: 2000 }
      )
    })
  })

  describe('Props Passing', () => {
    it('passes correct props to GlobalStatsOverview', async () => {
      render(<SuperAdminDashboard user={mockUser} academy={mockAcademy} />)

      // Initially should show loading
      expect(screen.getByText('Loading stats...')).toBeInTheDocument()

      // After loading should show stats
      await waitFor(
        () => {
          expect(
            screen.getByText('Stats loaded: 12 academies')
          ).toBeInTheDocument()
        },
        { timeout: 2000 }
      )
    })

    it('passes correct props to AcademyManagementPanel', async () => {
      render(<SuperAdminDashboard user={mockUser} academy={mockAcademy} />)

      // Initially should show loading
      expect(screen.getByText('Loading academies...')).toBeInTheDocument()

      // After loading should show academies
      await waitFor(
        () => {
          expect(
            screen.getByText('Academies loaded: 3 items')
          ).toBeInTheDocument()
        },
        { timeout: 2000 }
      )
    })
  })

  describe('User Permissions', () => {
    it('renders for super admin user', () => {
      render(<SuperAdminDashboard user={mockUser} academy={mockAcademy} />)

      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
      expect(screen.getByText('Super Admin Dashboard')).toBeInTheDocument()
    })

    it('renders for super admin user without academy', () => {
      render(<SuperAdminDashboard user={mockUser} academy={null} />)

      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
      expect(screen.getByText('Super Admin Dashboard')).toBeInTheDocument()
    })

    it("renders for regular user (should still work as component doesn't check permissions)", () => {
      const regularUser: AuthUser = {
        ...mockUser,
        is_super_admin: false,
      }

      render(<SuperAdminDashboard user={regularUser} academy={mockAcademy} />)

      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
      expect(screen.getByText('Super Admin Dashboard')).toBeInTheDocument()
    })
  })
})
