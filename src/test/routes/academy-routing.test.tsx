import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useAuthStore } from '@/stores/auth-store'
import type { AuthUser, AcademyData, AcademyMembership } from '@/stores/auth-store'

// Mock the auth store
vi.mock('@/stores/auth-store', () => ({
  useAuthStore: vi.fn()
}))

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  useParams: vi.fn(() => ({ academyId: '1' })),
  useRouter: vi.fn(() => ({
    navigate: vi.fn(),
    state: {
      location: {
        pathname: '/academy/1/dashboard'
      }
    }
  })),
  createFileRoute: vi.fn((path: string) => (config: any) => ({
    ...config,
    useParams: vi.fn(() => ({ academyId: '1' }))
  })),
  Outlet: () => <div>Outlet</div>
}))

// Mock components to avoid complex rendering
vi.mock('@/pages/landing', () => ({
  LandingPage: () => <div>Landing Page</div>
}))

vi.mock('@/pages/academy-selection', () => ({
  AcademySelectionPage: () => <div>Academy Selection Page</div>
}))

vi.mock('@/features/dashboard', () => ({
  Dashboard: () => <div>Dashboard</div>
}))

vi.mock('@/components/coming-soon', () => ({
  ComingSoon: ({ feature }: { feature: string }) => <div>Coming Soon: {feature}</div>
}))

vi.mock('@/components/layout/academy-layout', () => ({
  AcademyLayout: ({ children }: { children?: React.ReactNode }) => (
    <div>
      <div>Academy Layout</div>
      {children}
    </div>
  )
}))

vi.mock('@/components/route-guards', () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AcademyGuard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

const mockUseAuthStore = vi.mocked(useAuthStore)

// Mock data
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
  last_login_at: '2024-01-01T12:00:00Z'
}

const mockSingleAcademy: AcademyMembership = {
  id: 1,
  name: 'Tech Academy',
  description: 'Learn technology skills',
  logo_url: null,
  user_role: 'student',
  user_role_display: 'Student',
  created_at: '2024-01-01T00:00:00Z',
  last_accessed: null
}

const mockAdminAcademy: AcademyMembership = {
  id: 2,
  name: 'Art Academy',
  description: 'Learn art skills',
  logo_url: null,
  user_role: 'admin',
  user_role_display: 'Administrator',
  created_at: '2024-01-02T00:00:00Z',
  last_accessed: '2024-01-15T10:00:00Z'
}

const mockTeacherAcademy: AcademyMembership = {
  id: 3,
  name: 'Music Academy',
  description: 'Learn music skills',
  logo_url: null,
  user_role: 'teacher',
  user_role_display: 'Teacher',
  created_at: '2024-01-03T00:00:00Z',
  last_accessed: null
}

const mockSingleAcademyData: AcademyData = {
  count: 1,
  academies: [mockSingleAcademy]
}

const mockMultipleAcademyData: AcademyData = {
  count: 3,
  academies: [mockSingleAcademy, mockAdminAcademy, mockTeacherAcademy]
}

const mockNoAcademyData: AcademyData = {
  count: 0,
  academies: []
}

// Import route components for testing
import { Route as AcademySelectionRoute } from '../academy-selection'
import { Route as CreateAcademyRoute } from '../create-academy'
import { Route as AcademyRoute } from '../academy/$academyId'
import { Route as AcademyDashboardRoute } from '../academy/$academyId/dashboard'
import { Route as AcademyCoursesRoute } from '../academy/$academyId/courses'
import { Route as AcademyStudentsRoute } from '../academy/$academyId/students'
import { Route as AcademySettingsRoute } from '../academy/$academyId/settings'

describe('Academy Routing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Route Components', () => {
    it('should have academy selection route component', () => {
      expect(AcademySelectionRoute).toBeDefined()
      expect(typeof AcademySelectionRoute.component).toBe('function')
    })

    it('should have create academy route component', () => {
      expect(CreateAcademyRoute).toBeDefined()
      expect(typeof CreateAcademyRoute.component).toBe('function')
    })

    it('should have academy layout route component', () => {
      expect(AcademyRoute).toBeDefined()
      expect(typeof AcademyRoute.component).toBe('function')
    })

    it('should have academy dashboard route component', () => {
      expect(AcademyDashboardRoute).toBeDefined()
      expect(typeof AcademyDashboardRoute.component).toBe('function')
    })

    it('should have academy courses route component', () => {
      expect(AcademyCoursesRoute).toBeDefined()
      expect(typeof AcademyCoursesRoute.component).toBe('function')
    })

    it('should have academy students route component', () => {
      expect(AcademyStudentsRoute).toBeDefined()
      expect(typeof AcademyStudentsRoute.component).toBe('function')
    })

    it('should have academy settings route component', () => {
      expect(AcademySettingsRoute).toBeDefined()
      expect(typeof AcademySettingsRoute.component).toBe('function')
    })
  })

  describe('Academy Selection Route', () => {
    it('should render academy selection page component', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: mockUser,
        academyData: mockMultipleAcademyData,
        currentAcademy: null,
        initialize: vi.fn(),
        selectAcademy: vi.fn(),
        switchAcademy: vi.fn(),
        refreshAcademies: vi.fn(),
        setAcademyData: vi.fn(),
        setCurrentAcademy: vi.fn(),
        tokens: null,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshTokens: vi.fn(),
        setUser: vi.fn(),
        setTokens: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        reset: vi.fn(),
        auth: {
          user: mockUser,
          setUser: vi.fn(),
          accessToken: 'token',
          setAccessToken: vi.fn(),
          refreshToken: 'refresh',
          setRefreshToken: vi.fn(),
          resetAccessToken: vi.fn(),
          reset: vi.fn()
        }
      })

      const Component = AcademySelectionRoute.component
      render(<Component />)

      expect(screen.getByText('Academy Selection Page')).toBeInTheDocument()
    })
  })

  describe('Academy-Specific Routes', () => {
    it('should render academy dashboard component', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: mockUser,
        academyData: mockSingleAcademyData,
        currentAcademy: mockSingleAcademy,
        initialize: vi.fn(),
        selectAcademy: vi.fn(),
        switchAcademy: vi.fn(),
        refreshAcademies: vi.fn(),
        setAcademyData: vi.fn(),
        setCurrentAcademy: vi.fn(),
        tokens: null,
        error: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshTokens: vi.fn(),
        setUser: vi.fn(),
        setTokens: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        reset: vi.fn(),
        auth: {
          user: mockUser,
          setUser: vi.fn(),
          accessToken: 'token',
          setAccessToken: vi.fn(),
          refreshToken: 'refresh',
          setRefreshToken: vi.fn(),
          resetAccessToken: vi.fn(),
          reset: vi.fn()
        }
      })

      const Component = AcademyDashboardRoute.component
      render(<Component />)

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    it('should render academy courses component', () => {
      const Component = AcademyCoursesRoute.component
      render(<Component />)

      expect(screen.getByText('Coming Soon: Courses')).toBeInTheDocument()
    })

    it('should render academy students component', () => {
      const Component = AcademyStudentsRoute.component
      render(<Component />)

      expect(screen.getByText('Coming Soon: Students')).toBeInTheDocument()
    })
  })

  describe('Create Academy Route', () => {
    it('should render create academy component', () => {
      const Component = CreateAcademyRoute.component
      render(<Component />)

      expect(screen.getByText('Coming Soon: Academy Creation')).toBeInTheDocument()
    })
  })

  describe('Route Configuration', () => {
    it('should have correct route paths configured', () => {
      // Test that routes are properly configured with expected paths
      expect(AcademySelectionRoute).toBeDefined()
      expect(CreateAcademyRoute).toBeDefined()
      expect(AcademyRoute).toBeDefined()
      expect(AcademyDashboardRoute).toBeDefined()
      expect(AcademyCoursesRoute).toBeDefined()
      expect(AcademyStudentsRoute).toBeDefined()
      expect(AcademySettingsRoute).toBeDefined()
    })

    it('should have components that render without errors', () => {
      const routes = [
        AcademySelectionRoute,
        CreateAcademyRoute,
        AcademyDashboardRoute,
        AcademyCoursesRoute,
        AcademyStudentsRoute
      ]

      routes.forEach(route => {
        const Component = route.component
        expect(() => render(<Component />)).not.toThrow()
      })
    })
  })

  describe('Academy Layout Integration', () => {
    it('should render academy layout component', () => {
      const Component = AcademyRoute.component
      render(<Component />)

      expect(screen.getByText('Academy Layout')).toBeInTheDocument()
    })
  })
})