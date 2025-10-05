import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useAuthStore } from '@/stores/auth-store'
import { 
  AuthGuard, 
  GuestGuard, 
  AdminGuard, 
  AcademyGuard,
  withAuthGuard, 
  withGuestGuard, 
  withAdminGuard,
  withAcademyGuard
} from '../route-guards'
import type { AuthUser, AcademyData, AcademyMembership } from '@/stores/auth-store'

// Mock the auth store
vi.mock('@/stores/auth-store', () => ({
  useAuthStore: vi.fn()
}))

// Mock the router
const mockNavigate = vi.fn()
const mockRouter = {
  navigate: mockNavigate,
  state: {
    location: {
      pathname: '/dashboard'
    }
  }
}

vi.mock('@tanstack/react-router', () => ({
  useRouter: vi.fn(() => mockRouter)
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

const mockAdminUser: AuthUser = {
  ...mockUser,
  is_super_admin: true
}

// Mock academy data
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

const mockMultipleAcademies: AcademyMembership[] = [
  mockSingleAcademy,
  {
    id: 2,
    name: 'Art Academy',
    description: 'Learn art skills',
    logo_url: null,
    user_role: 'admin',
    user_role_display: 'Administrator',
    created_at: '2024-01-02T00:00:00Z',
    last_accessed: '2024-01-15T10:00:00Z'
  }
]

const mockSingleAcademyData: AcademyData = {
  count: 1,
  academies: [mockSingleAcademy]
}

const mockMultipleAcademyData: AcademyData = {
  count: 2,
  academies: mockMultipleAcademies
}

const mockNoAcademyData: AcademyData = {
  count: 0,
  academies: []
}

// Test component
function TestComponent({ text = 'Protected Content' }: { text?: string }) {
  return <div>{text}</div>
}



describe('Route Guards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('AuthGuard', () => {
    beforeEach(() => {
      mockNavigate.mockClear()
      mockRouter.state.location.pathname = '/dashboard'
    })

    it('should render children when user is authenticated and on academy-specific route', () => {
      // Mock router to return academy-specific path
      mockRouter.state.location.pathname = '/academy/1/dashboard'

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

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      expect(screen.getByText('Protected Content')).toBeInTheDocument()
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it('should redirect to single academy dashboard when user has one academy', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: mockUser,
        academyData: mockSingleAcademyData,
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

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      expect(mockNavigate).toHaveBeenCalledWith({ 
        to: '/academy/1/dashboard',
        replace: true 
      })
    })

    it('should redirect to academy selection when user has multiple academies', () => {
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

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      expect(mockNavigate).toHaveBeenCalledWith({ 
        to: '/academy-selection',
        replace: true 
      })
    })

    it('should redirect to create academy when user has no academies', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: mockUser,
        academyData: mockNoAcademyData,
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

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      expect(mockNavigate).toHaveBeenCalledWith({ to: '/create-academy' })
    })

    it('should show loading state when authentication is loading', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        academyData: null,
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
          user: null,
          setUser: vi.fn(),
          accessToken: '',
          setAccessToken: vi.fn(),
          refreshToken: '',
          setRefreshToken: vi.fn(),
          resetAccessToken: vi.fn(),
          reset: vi.fn()
        }
      })

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      expect(screen.getByText('Checking authentication...')).toBeInTheDocument()
    })

    it('should not render children when user is not authenticated', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        academyData: null,
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
          user: null,
          setUser: vi.fn(),
          accessToken: '',
          setAccessToken: vi.fn(),
          refreshToken: '',
          setRefreshToken: vi.fn(),
          resetAccessToken: vi.fn(),
          reset: vi.fn()
        }
      })

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })

    it('should call initialize when not authenticated and not loading', () => {
      const mockInitialize = vi.fn()
      
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        academyData: null,
        currentAcademy: null,
        initialize: mockInitialize,
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
          user: null,
          setUser: vi.fn(),
          accessToken: '',
          setAccessToken: vi.fn(),
          refreshToken: '',
          setRefreshToken: vi.fn(),
          resetAccessToken: vi.fn(),
          reset: vi.fn()
        }
      })

      render(
        <AuthGuard>
          <TestComponent />
        </AuthGuard>
      )

      expect(mockInitialize).toHaveBeenCalled()
    })

    it('should render custom fallback when provided', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        academyData: null,
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
          user: null,
          setUser: vi.fn(),
          accessToken: '',
          setAccessToken: vi.fn(),
          refreshToken: '',
          setRefreshToken: vi.fn(),
          resetAccessToken: vi.fn(),
          reset: vi.fn()
        }
      })

      const customFallback = <div>Custom Loading...</div>

      render(
        <AuthGuard fallback={customFallback}>
          <TestComponent />
        </AuthGuard>
      )

      expect(screen.getByText('Custom Loading...')).toBeInTheDocument()
    })
  })

  describe('GuestGuard', () => {
    beforeEach(() => {
      mockNavigate.mockClear()
    })

    it('should render children when user is not authenticated', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        academyData: null,
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
          user: null,
          setUser: vi.fn(),
          accessToken: '',
          setAccessToken: vi.fn(),
          refreshToken: '',
          setRefreshToken: vi.fn(),
          resetAccessToken: vi.fn(),
          reset: vi.fn()
        }
      })

      render(
        <GuestGuard>
          <TestComponent text="Guest Content" />
        </GuestGuard>
      )

      expect(screen.getByText('Guest Content')).toBeInTheDocument()
    })

    it('should redirect to single academy dashboard when authenticated user has one academy', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: mockUser,
        academyData: mockSingleAcademyData,
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

      render(
        <GuestGuard>
          <TestComponent text="Guest Content" />
        </GuestGuard>
      )

      expect(screen.queryByText('Guest Content')).not.toBeInTheDocument()
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/academy/1/dashboard' })
    })

    it('should redirect to academy selection when authenticated user has multiple academies', () => {
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

      render(
        <GuestGuard>
          <TestComponent text="Guest Content" />
        </GuestGuard>
      )

      expect(screen.queryByText('Guest Content')).not.toBeInTheDocument()
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/academy-selection' })
    })

    it('should redirect to create academy when authenticated user has no academies', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: mockUser,
        academyData: mockNoAcademyData,
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

      render(
        <GuestGuard>
          <TestComponent text="Guest Content" />
        </GuestGuard>
      )

      expect(screen.queryByText('Guest Content')).not.toBeInTheDocument()
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/create-academy' })
    })

    it('should show loading state when authentication is loading', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        academyData: null,
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
          user: null,
          setUser: vi.fn(),
          accessToken: '',
          setAccessToken: vi.fn(),
          refreshToken: '',
          setRefreshToken: vi.fn(),
          resetAccessToken: vi.fn(),
          reset: vi.fn()
        }
      })

      render(
        <GuestGuard>
          <TestComponent text="Guest Content" />
        </GuestGuard>
      )

      expect(screen.getByText('Checking authentication...')).toBeInTheDocument()
    })
  })

  describe('AdminGuard', () => {
    it('should render children when user is authenticated and is admin', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: mockAdminUser,
        academyData: null,
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
          user: mockAdminUser,
          setUser: vi.fn(),
          accessToken: 'token',
          setAccessToken: vi.fn(),
          refreshToken: 'refresh',
          setRefreshToken: vi.fn(),
          resetAccessToken: vi.fn(),
          reset: vi.fn()
        }
      })

      render(
        <AdminGuard>
          <TestComponent text="Admin Content" />
        </AdminGuard>
      )

      expect(screen.getByText('Admin Content')).toBeInTheDocument()
    })

    it('should not render children when user is authenticated but not admin', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: mockUser, // Regular user, not admin
        academyData: null,
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

      render(
        <AdminGuard>
          <TestComponent text="Admin Content" />
        </AdminGuard>
      )

      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument()
    })

    it('should not render children when user is not authenticated', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        academyData: null,
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
          user: null,
          setUser: vi.fn(),
          accessToken: '',
          setAccessToken: vi.fn(),
          refreshToken: '',
          setRefreshToken: vi.fn(),
          resetAccessToken: vi.fn(),
          reset: vi.fn()
        }
      })

      render(
        <AdminGuard>
          <TestComponent text="Admin Content" />
        </AdminGuard>
      )

      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument()
    })
  })

  describe('AcademyGuard', () => {
    beforeEach(() => {
      mockNavigate.mockClear()
    })

    it('should render children when user has access to academy', () => {
      const mockSelectAcademy = vi.fn()
      
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: mockUser,
        academyData: mockMultipleAcademyData,
        currentAcademy: mockSingleAcademy,
        initialize: vi.fn(),
        selectAcademy: mockSelectAcademy,
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

      render(
        <AcademyGuard academyId={1}>
          <TestComponent text="Academy Content" />
        </AcademyGuard>
      )

      expect(screen.getByText('Academy Content')).toBeInTheDocument()
    })

    it('should redirect to academy selection when user does not have access to academy', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: mockUser,
        academyData: mockSingleAcademyData, // Only has access to academy 1
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

      render(
        <AcademyGuard academyId={999}> {/* Academy user doesn't have access to */}
          <TestComponent text="Academy Content" />
        </AcademyGuard>
      )

      expect(screen.queryByText('Academy Content')).not.toBeInTheDocument()
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/academy-selection' })
    })

    it('should redirect to academy dashboard when user does not have required role', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: mockUser,
        academyData: mockSingleAcademyData, // User has 'student' role
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

      render(
        <AcademyGuard academyId={1} requiredRole="admin"> {/* Requires admin but user is student */}
          <TestComponent text="Academy Content" />
        </AcademyGuard>
      )

      expect(screen.queryByText('Academy Content')).not.toBeInTheDocument()
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/academy/1/dashboard' })
    })

    it('should select academy when user has access but no current academy set', () => {
      const mockSelectAcademy = vi.fn()
      
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: mockUser,
        academyData: mockSingleAcademyData,
        currentAcademy: null, // No current academy set
        initialize: vi.fn(),
        selectAcademy: mockSelectAcademy,
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

      render(
        <AcademyGuard academyId={1}>
          <TestComponent text="Academy Content" />
        </AcademyGuard>
      )

      expect(mockSelectAcademy).toHaveBeenCalledWith(1)
    })

    it('should not render children when user is not authenticated', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        academyData: null,
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
          user: null,
          setUser: vi.fn(),
          accessToken: '',
          setAccessToken: vi.fn(),
          refreshToken: '',
          setRefreshToken: vi.fn(),
          resetAccessToken: vi.fn(),
          reset: vi.fn()
        }
      })

      render(
        <AcademyGuard academyId={1}>
          <TestComponent text="Academy Content" />
        </AcademyGuard>
      )

      expect(screen.queryByText('Academy Content')).not.toBeInTheDocument()
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/sign-in' })
    })
  })

  describe('Higher-Order Components', () => {
    it('should work with withAuthGuard HOC', () => {
      // Mock router to return academy-specific path
      mockRouter.state.location.pathname = '/academy/1/dashboard'

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

      const GuardedComponent = withAuthGuard(TestComponent)

      render(<GuardedComponent text="HOC Protected Content" />)

      expect(screen.getByText('HOC Protected Content')).toBeInTheDocument()
    })

    it('should work with withGuestGuard HOC', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        academyData: null,
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
          user: null,
          setUser: vi.fn(),
          accessToken: '',
          setAccessToken: vi.fn(),
          refreshToken: '',
          setRefreshToken: vi.fn(),
          resetAccessToken: vi.fn(),
          reset: vi.fn()
        }
      })

      const GuardedComponent = withGuestGuard(TestComponent)

      render(<GuardedComponent text="HOC Guest Content" />)

      expect(screen.getByText('HOC Guest Content')).toBeInTheDocument()
    })

    it('should work with withAdminGuard HOC', () => {
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: mockAdminUser,
        academyData: null,
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
          user: mockAdminUser,
          setUser: vi.fn(),
          accessToken: 'token',
          setAccessToken: vi.fn(),
          refreshToken: 'refresh',
          setRefreshToken: vi.fn(),
          resetAccessToken: vi.fn(),
          reset: vi.fn()
        }
      })

      const GuardedComponent = withAdminGuard(TestComponent)

      render(<GuardedComponent text="HOC Admin Content" />)

      expect(screen.getByText('HOC Admin Content')).toBeInTheDocument()
    })

    it('should work with withAcademyGuard HOC', () => {
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

      const GuardedComponent = withAcademyGuard(TestComponent, 1)

      render(<GuardedComponent text="HOC Academy Content" />)

      expect(screen.getByText('HOC Academy Content')).toBeInTheDocument()
    })
  })
})