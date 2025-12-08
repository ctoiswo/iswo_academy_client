import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useAuthStore, type AuthUser, type AuthTokens, type LoginCredentials, type RegisterData, type AcademyMembership, type AcademyData } from '../auth-store'
import { tokenStorage } from '@/lib/token-storage'
import { tokenManager } from '@/lib/api-client'
import { authApi } from '@/services'

// Mock dependencies
vi.mock('@/lib/token-storage', () => ({
  tokenStorage: {
    setTokens: vi.fn(),
    getTokens: vi.fn(),
    clearTokens: vi.fn(),
    isTokenExpired: vi.fn(),
    getAccessToken: vi.fn(),
    getRefreshToken: vi.fn(),
    hasValidTokens: vi.fn()
  }
}))

vi.mock('@/services', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    refreshTokens: vi.fn()
  },
  userApi: {
    getProfile: vi.fn()
  }
}))

vi.mock('@/lib/api-client', () => ({
  academyApi: {
    getUserAcademies: vi.fn()
  },
  tokenManager: {
    initialize: vi.fn(),
    refreshTokens: vi.fn(),
    hasValidTokens: vi.fn(),
    getTokenInfo: vi.fn(),
    clearTokens: vi.fn()
  }
}))

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

const mockTokens: AuthTokens = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600
}

const mockLoginCredentials: LoginCredentials = {
  email: 'john@example.com',
  password: 'password123'
}

const mockRegisterData: RegisterData = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  password: 'password123',
  password_confirmation: 'password123'
}

// Mock academy data
const mockAcademyMembership: AcademyMembership = {
  id: 1,
  name: 'Technology Academy',
  description: 'Learn cutting-edge technology skills',
  logo_url: 'https://example.com/logo1.png',
  user_role: 'admin',
  user_role_display: 'Administrator',
  created_at: '2024-01-01T00:00:00Z',
  last_accessed: '2024-02-01T10:30:00Z'
}

const mockMultipleAcademies: AcademyMembership[] = [
  mockAcademyMembership,
  {
    id: 2,
    name: 'Cooking Academy',
    description: 'Master culinary arts and techniques',
    logo_url: null,
    user_role: 'student',
    user_role_display: 'Student',
    created_at: '2024-01-15T00:00:00Z',
    last_accessed: null
  }
]

const mockSingleAcademyData: AcademyData = {
  count: 1,
  academies: [mockAcademyMembership]
}

const mockMultipleAcademyData: AcademyData = {
  count: 2,
  academies: mockMultipleAcademies
}

const mockEmptyAcademyData: AcademyData = {
  count: 0,
  academies: []
}

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.getState().reset()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState()

      expect(state.user).toBeNull()
      expect(state.tokens).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
      expect(state.academyData).toBeNull()
      expect(state.currentAcademy).toBeNull()
    })

    it('should provide legacy auth object for backward compatibility', () => {
      const state = useAuthStore.getState()

      expect(state.auth).toBeDefined()
      expect(state.auth.user).toBeNull()
      expect(state.auth.accessToken).toBe('')
      expect(state.auth.refreshToken).toBe('')
      expect(typeof state.auth.setUser).toBe('function')
      expect(typeof state.auth.setAccessToken).toBe('function')
      expect(typeof state.auth.setRefreshToken).toBe('function')
      expect(typeof state.auth.resetAccessToken).toBe('function')
      expect(typeof state.auth.reset).toBe('function')
    })
  })

  describe('Login', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        user: mockUser,
        access_token: mockTokens.access_token,
        refresh_token: mockTokens.refresh_token,
        expires_in: mockTokens.expires_in,
        message: 'Login successful'
      }

      vi.mocked(authApi.login).mockResolvedValue(mockResponse)

      const { login } = useAuthStore.getState()
      await login(mockLoginCredentials)

      const state = useAuthStore.getState()

      expect(authApi.login).toHaveBeenCalledWith(mockLoginCredentials)
      expect(tokenStorage.setTokens).toHaveBeenCalledWith(mockTokens)
      expect(state.user).toEqual(mockUser)
      expect(state.tokens).toEqual(mockTokens)
      expect(state.isAuthenticated).toBe(true)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })

    it('should handle login failure', async () => {
      const mockError = new Error('Invalid credentials')
      vi.mocked(authApi.login).mockRejectedValue(mockError)

      const { login } = useAuthStore.getState()

      await expect(login(mockLoginCredentials)).rejects.toThrow('Invalid credentials')

      const state = useAuthStore.getState()

      expect(state.user).toBeNull()
      expect(state.tokens).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBe('Invalid credentials')
    })

    it('should set loading state during login', async () => {
      let resolveLogin: (value: any) => void
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve
      })

      vi.mocked(authApi.login).mockReturnValue(loginPromise)

      const { login } = useAuthStore.getState()
      const loginCall = login(mockLoginCredentials)

      // Check loading state is true during login
      expect(useAuthStore.getState().isLoading).toBe(true)

      // Resolve the login
      resolveLogin!({
        user: mockUser,
        access_token: mockTokens.access_token,
        refresh_token: mockTokens.refresh_token,
        expires_in: mockTokens.expires_in,
        message: 'Login successful'
      })

      await loginCall

      // Check loading state is false after login
      expect(useAuthStore.getState().isLoading).toBe(false)
    })
  })

  describe('Register', () => {
    it('should register successfully', async () => {
      const mockResponse = {
        message: 'Registration successful. Please check your email.',
        user: mockUser
      }

      vi.mocked(authApi.register).mockResolvedValue(mockResponse)

      const { register } = useAuthStore.getState()
      const result = await register(mockRegisterData)

      expect(authApi.register).toHaveBeenCalledWith(mockRegisterData)
      expect(result).toEqual(mockResponse)
      expect(useAuthStore.getState().isLoading).toBe(false)
      expect(useAuthStore.getState().error).toBeNull()
    })

    it('should handle registration failure', async () => {
      const mockError = new Error('Email already exists')
      vi.mocked(authApi.register).mockRejectedValue(mockError)

      const { register } = useAuthStore.getState()

      await expect(register(mockRegisterData)).rejects.toThrow('Email already exists')

      const state = useAuthStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBe('Email already exists')
    })
  })

  describe('Logout', () => {
    beforeEach(() => {
      // Set up authenticated state
      const { setUser, setTokens } = useAuthStore.getState()
      setUser(mockUser)
      setTokens(mockTokens)
    })

    it('should logout successfully', async () => {
      vi.mocked(authApi.logout).mockResolvedValue({ message: 'Logged out successfully' })

      const { logout } = useAuthStore.getState()
      await logout()

      expect(authApi.logout).toHaveBeenCalledWith(mockTokens.refresh_token)
      expect(tokenStorage.clearTokens).toHaveBeenCalled()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.tokens).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })

    it('should logout even if API call fails', async () => {
      vi.mocked(authApi.logout).mockRejectedValue(new Error('Network error'))

      const { logout } = useAuthStore.getState()
      await logout()

      expect(tokenStorage.clearTokens).toHaveBeenCalled()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.tokens).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })

    it('should handle logout when no tokens exist', async () => {
      // Clear tokens first
      const { reset } = useAuthStore.getState()
      reset()

      const { logout } = useAuthStore.getState()
      await logout()

      expect(authApi.logout).not.toHaveBeenCalled()
      expect(tokenStorage.clearTokens).toHaveBeenCalled()
    })
  })

  describe('Token Refresh', () => {
    beforeEach(() => {
      // Set up authenticated state with tokens
      const { setTokens } = useAuthStore.getState()
      setTokens(mockTokens)
    })

    it('should refresh tokens successfully using token manager', async () => {
      const newStoredTokens = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
        expires_at: Date.now() + 3600000
      }

      vi.mocked(tokenManager.refreshTokens).mockResolvedValue(true)
      vi.mocked(tokenStorage.getTokens).mockReturnValue(newStoredTokens)

      const { refreshTokens } = useAuthStore.getState()
      const result = await refreshTokens()

      expect(result).toBe(true)
      expect(tokenManager.refreshTokens).toHaveBeenCalled()

      const state = useAuthStore.getState()
      expect(state.tokens?.access_token).toBe(newStoredTokens.access_token)
      expect(state.tokens?.refresh_token).toBe(newStoredTokens.refresh_token)
      expect(state.error).toBeNull()
    })

    it('should handle refresh failure using token manager', async () => {
      // Clear tokens first to ensure clean state
      const { reset } = useAuthStore.getState()
      reset()

      vi.mocked(tokenManager.refreshTokens).mockResolvedValue(false)

      const { refreshTokens } = useAuthStore.getState()
      const result = await refreshTokens()

      expect(result).toBe(false)
      expect(tokenManager.refreshTokens).toHaveBeenCalled()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.tokens).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.error).toBe('Session expired')
    })

    it('should handle token manager throwing error', async () => {
      vi.mocked(tokenManager.refreshTokens).mockRejectedValue(new Error('Token manager error'))

      const { refreshTokens } = useAuthStore.getState()
      const result = await refreshTokens()

      expect(result).toBe(false)
      expect(tokenManager.refreshTokens).toHaveBeenCalled()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.tokens).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.error).toBe('Session expired')
    })

    it('should handle successful refresh with no updated tokens', async () => {
      vi.mocked(tokenManager.refreshTokens).mockResolvedValue(true)
      vi.mocked(tokenStorage.getTokens).mockReturnValue(null)

      const { refreshTokens } = useAuthStore.getState()
      const result = await refreshTokens()

      expect(result).toBe(true)
      expect(tokenManager.refreshTokens).toHaveBeenCalled()

      const state = useAuthStore.getState()
      expect(state.error).toBeNull()
    })
  })

  describe('State Management', () => {
    it('should set user correctly', () => {
      const { setUser } = useAuthStore.getState()
      setUser(mockUser)

      const state = useAuthStore.getState()
      expect(state.user).toEqual(mockUser)
      expect(state.isAuthenticated).toBe(true)
    })

    it('should clear user correctly', () => {
      const { setUser } = useAuthStore.getState()
      setUser(mockUser)
      setUser(null)

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })

    it('should set tokens correctly', () => {
      const { setTokens } = useAuthStore.getState()
      setTokens(mockTokens)

      expect(tokenStorage.setTokens).toHaveBeenCalledWith(mockTokens)

      const state = useAuthStore.getState()
      expect(state.tokens).toEqual(mockTokens)
      expect(state.isAuthenticated).toBe(true)
    })

    it('should clear tokens correctly', () => {
      const { setTokens } = useAuthStore.getState()
      setTokens(mockTokens)
      setTokens(null)

      expect(tokenStorage.clearTokens).toHaveBeenCalled()

      const state = useAuthStore.getState()
      expect(state.tokens).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })

    it('should set loading state', () => {
      const { setLoading } = useAuthStore.getState()
      setLoading(true)

      expect(useAuthStore.getState().isLoading).toBe(true)

      setLoading(false)
      expect(useAuthStore.getState().isLoading).toBe(false)
    })

    it('should set error state', () => {
      const { setError } = useAuthStore.getState()
      setError('Test error')

      expect(useAuthStore.getState().error).toBe('Test error')

      setError(null)
      expect(useAuthStore.getState().error).toBeNull()
    })

    it('should reset state completely', () => {
      const { setUser, setTokens, setError, setLoading, reset } = useAuthStore.getState()

      // Set some state
      setUser(mockUser)
      setTokens(mockTokens)
      setError('Some error')
      setLoading(true)

      // Reset
      reset()

      expect(tokenStorage.clearTokens).toHaveBeenCalled()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.tokens).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('Initialize', () => {
    it('should initialize token manager and handle no stored tokens', async () => {
      vi.mocked(tokenStorage.getTokens).mockReturnValue(null)

      const { initialize } = useAuthStore.getState()
      await initialize()

      expect(tokenManager.initialize).toHaveBeenCalled()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.tokens).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
    })

    it('should handle valid stored tokens', async () => {
      const mockStoredTokens = {
        access_token: 'stored-token',
        refresh_token: 'stored-refresh',
        expires_at: Date.now() + 3600000
      }

      vi.mocked(tokenStorage.getTokens).mockReturnValue(mockStoredTokens)
      vi.mocked(tokenStorage.isTokenExpired).mockReturnValue(false)

      // Mock successful profile fetch
      const { userApi } = await import('@/lib/api-client')
      vi.mocked(userApi.getProfile).mockResolvedValue(mockUser)

      const { initialize } = useAuthStore.getState()
      await initialize()

      expect(tokenManager.initialize).toHaveBeenCalled()

      const state = useAuthStore.getState()
      expect(state.user).toEqual(mockUser)
      expect(state.tokens?.access_token).toBe(mockStoredTokens.access_token)
      expect(state.isAuthenticated).toBe(true)
      expect(state.isLoading).toBe(false)
    })

    it('should refresh expired tokens during initialization', async () => {
      const mockStoredTokens = {
        access_token: 'expired-token',
        refresh_token: 'stored-refresh',
        expires_at: Date.now() - 1000 // Expired
      }

      vi.mocked(tokenStorage.getTokens).mockReturnValue(mockStoredTokens)
      vi.mocked(tokenStorage.isTokenExpired).mockReturnValue(true)

      // Mock successful refresh
      const mockRefreshStore = useAuthStore.getState()
      const refreshSpy = vi.spyOn(mockRefreshStore, 'refreshTokens').mockResolvedValue(true)

      // Mock successful profile fetch after refresh
      const { userApi } = await import('@/lib/api-client')
      vi.mocked(userApi.getProfile).mockResolvedValue(mockUser)

      const { initialize } = useAuthStore.getState()
      await initialize()

      expect(tokenManager.initialize).toHaveBeenCalled()
      expect(refreshSpy).toHaveBeenCalled()

      const state = useAuthStore.getState()
      expect(state.user).toEqual(mockUser)
      expect(state.isLoading).toBe(false)

      refreshSpy.mockRestore()
    })

    it('should handle profile fetch failure with retry', async () => {
      const mockStoredTokens = {
        access_token: 'stored-token',
        refresh_token: 'stored-refresh',
        expires_at: Date.now() + 3600000
      }

      vi.mocked(tokenStorage.getTokens).mockReturnValue(mockStoredTokens)
      vi.mocked(tokenStorage.isTokenExpired).mockReturnValue(false)

      // Mock profile fetch failure, then successful refresh and retry
      const { userApi } = await import('@/lib/api-client')
      vi.mocked(userApi.getProfile)
        .mockRejectedValueOnce(new Error('Profile fetch failed'))
        .mockResolvedValueOnce(mockUser)

      const mockRefreshStore = useAuthStore.getState()
      const refreshSpy = vi.spyOn(mockRefreshStore, 'refreshTokens').mockResolvedValue(true)

      const { initialize } = useAuthStore.getState()
      await initialize()

      expect(refreshSpy).toHaveBeenCalled()
      expect(userApi.getProfile).toHaveBeenCalledTimes(2)

      const state = useAuthStore.getState()
      expect(state.user).toEqual(mockUser)
      expect(state.isLoading).toBe(false)

      refreshSpy.mockRestore()
    })

    it('should reset state on persistent profile fetch failure', async () => {
      const mockStoredTokens = {
        access_token: 'stored-token',
        refresh_token: 'stored-refresh',
        expires_at: Date.now() + 3600000
      }

      vi.mocked(tokenStorage.getTokens).mockReturnValue(mockStoredTokens)
      vi.mocked(tokenStorage.isTokenExpired).mockReturnValue(false)

      // Mock profile fetch failure and refresh failure
      const { userApi } = await import('@/lib/api-client')
      vi.mocked(userApi.getProfile).mockRejectedValue(new Error('Profile fetch failed'))

      // Mock the refresh to fail
      vi.mocked(tokenManager.refreshTokens).mockResolvedValue(false)

      const { initialize } = useAuthStore.getState()
      await initialize()

      // Should have attempted to refresh tokens
      expect(tokenManager.refreshTokens).toHaveBeenCalled()

      const state = useAuthStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.user).toBeNull()
      expect(state.tokens).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })

    it('should handle initialization errors gracefully', async () => {
      vi.mocked(tokenStorage.getTokens).mockImplementation(() => {
        throw new Error('Storage error')
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
      const mockRefreshStore = useAuthStore.getState()
      const resetSpy = vi.spyOn(mockRefreshStore, 'reset')

      const { initialize } = useAuthStore.getState()
      await initialize()

      expect(consoleSpy).toHaveBeenCalledWith('Auth initialization failed:', expect.any(Error))
      expect(resetSpy).toHaveBeenCalled()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.tokens).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)

      consoleSpy.mockRestore()
      resetSpy.mockRestore()
    })
  })

  describe('Legacy Auth Object', () => {
    it('should maintain backward compatibility with legacy auth object', () => {
      const { setUser, setTokens } = useAuthStore.getState()
      setUser(mockUser)
      setTokens(mockTokens)

      const { auth } = useAuthStore.getState()

      expect(auth.user).toEqual(mockUser)
      expect(auth.accessToken).toBe(mockTokens.access_token)
      expect(auth.refreshToken).toBe(mockTokens.refresh_token)
    })

    it('should update tokens through legacy methods', () => {
      const { setTokens } = useAuthStore.getState()
      setTokens(mockTokens)

      const { auth } = useAuthStore.getState()
      auth.setAccessToken('new-access-token')

      const state = useAuthStore.getState()
      expect(state.tokens?.access_token).toBe('new-access-token')
      expect(state.tokens?.refresh_token).toBe(mockTokens.refresh_token)
    })

    it('should reset through legacy method', () => {
      const { setUser, setTokens } = useAuthStore.getState()
      setUser(mockUser)
      setTokens(mockTokens)

      const { auth } = useAuthStore.getState()
      auth.reset()

      expect(tokenStorage.clearTokens).toHaveBeenCalled()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.tokens).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('Academy Management', () => {
    describe('Login with Academy Data', () => {
      it('should handle login with single academy and return redirect info', async () => {
        const mockResponse = {
          user: mockUser,
          access_token: mockTokens.access_token,
          refresh_token: mockTokens.refresh_token,
          expires_in: mockTokens.expires_in,
          message: 'Login successful',
          academies: mockSingleAcademyData
        }

        vi.mocked(authApi.login).mockResolvedValue(mockResponse)

        const { login } = useAuthStore.getState()
        const result = await login(mockLoginCredentials)

        expect(result).toEqual({
          shouldRedirect: true,
          redirectPath: '/academy/1/dashboard',
          showAcademySelection: false
        })

        const state = useAuthStore.getState()
        expect(state.academyData).toEqual(mockSingleAcademyData)
        expect(state.currentAcademy).toEqual(mockAcademyMembership)
      })

      it('should handle login with multiple academies and return selection info', async () => {
        const mockResponse = {
          user: mockUser,
          access_token: mockTokens.access_token,
          refresh_token: mockTokens.refresh_token,
          expires_in: mockTokens.expires_in,
          message: 'Login successful',
          academies: mockMultipleAcademyData
        }

        vi.mocked(authApi.login).mockResolvedValue(mockResponse)

        const { login } = useAuthStore.getState()
        const result = await login(mockLoginCredentials)

        expect(result).toEqual({
          shouldRedirect: true,
          redirectPath: '/academy-selection',
          showAcademySelection: true
        })

        const state = useAuthStore.getState()
        expect(state.academyData).toEqual(mockMultipleAcademyData)
        expect(state.currentAcademy).toBeNull()
      })

      it('should handle login with no academies and return create academy info', async () => {
        const mockResponse = {
          user: mockUser,
          access_token: mockTokens.access_token,
          refresh_token: mockTokens.refresh_token,
          expires_in: mockTokens.expires_in,
          message: 'Login successful',
          academies: mockEmptyAcademyData
        }

        vi.mocked(authApi.login).mockResolvedValue(mockResponse)

        const { login } = useAuthStore.getState()
        const result = await login(mockLoginCredentials)

        expect(result).toEqual({
          shouldRedirect: true,
          redirectPath: '/create-academy',
          showAcademySelection: false
        })

        const state = useAuthStore.getState()
        expect(state.academyData).toEqual(mockEmptyAcademyData)
        expect(state.currentAcademy).toBeNull()
      })

      it('should handle login without academy data in response', async () => {
        const mockResponse = {
          user: mockUser,
          access_token: mockTokens.access_token,
          refresh_token: mockTokens.refresh_token,
          expires_in: mockTokens.expires_in,
          message: 'Login successful'
          // No academies field
        }

        vi.mocked(authApi.login).mockResolvedValue(mockResponse)

        const { login } = useAuthStore.getState()
        const result = await login(mockLoginCredentials)

        expect(result).toEqual({
          shouldRedirect: true,
          redirectPath: '/create-academy',
          showAcademySelection: false
        })

        const state = useAuthStore.getState()
        expect(state.academyData).toEqual({ count: 0, academies: [] })
        expect(state.currentAcademy).toBeNull()
      })
    })

    describe('Academy Selection', () => {
      beforeEach(() => {
        // Set up state with multiple academies
        const { setAcademyData } = useAuthStore.getState()
        setAcademyData(mockMultipleAcademyData)
      })

      it('should select academy by ID', () => {
        const { selectAcademy } = useAuthStore.getState()
        selectAcademy(2)

        const state = useAuthStore.getState()
        expect(state.currentAcademy).toEqual(mockMultipleAcademies[1])
      })

      it('should not select academy if ID not found', () => {
        const { selectAcademy } = useAuthStore.getState()
        selectAcademy(999)

        const state = useAuthStore.getState()
        expect(state.currentAcademy).toBeNull()
      })

      it('should not select academy if no academy data exists', () => {
        const { reset, selectAcademy } = useAuthStore.getState()
        reset()
        selectAcademy(1)

        const state = useAuthStore.getState()
        expect(state.currentAcademy).toBeNull()
      })
    })

    describe('Academy Switching', () => {
      beforeEach(() => {
        // Set up state with current academy
        const { setAcademyData, setCurrentAcademy } = useAuthStore.getState()
        setAcademyData(mockMultipleAcademyData)
        setCurrentAcademy(mockAcademyMembership)
      })

      it('should clear current academy when switching', () => {
        const { switchAcademy } = useAuthStore.getState()
        switchAcademy()

        const state = useAuthStore.getState()
        expect(state.currentAcademy).toBeNull()
        expect(state.academyData).toEqual(mockMultipleAcademyData) // Should preserve academy data
      })
    })

    describe('Academy Data Refresh', () => {
      beforeEach(() => {
        // Set up authenticated state
        const { setUser, setTokens } = useAuthStore.getState()
        setUser(mockUser)
        setTokens(mockTokens)
      })

      it('should refresh academy data successfully', async () => {
        const { academyApi } = await import('@/lib/api-client')
        vi.mocked(academyApi.getUserAcademies).mockResolvedValue(mockSingleAcademyData)

        const { refreshAcademies } = useAuthStore.getState()
        await refreshAcademies()

        expect(academyApi.getUserAcademies).toHaveBeenCalled()

        const state = useAuthStore.getState()
        expect(state.academyData).toEqual(mockSingleAcademyData)
      })

      it('should handle refresh failure gracefully', async () => {
        const { academyApi } = await import('@/lib/api-client')
        vi.mocked(academyApi.getUserAcademies).mockRejectedValue(new Error('Network error'))

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

        const { refreshAcademies } = useAuthStore.getState()
        await refreshAcademies()

        expect(consoleSpy).toHaveBeenCalledWith('Failed to refresh academy data:', expect.any(Error))

        // Should not throw error
        const state = useAuthStore.getState()
        expect(state.academyData).toBeNull() // Should remain unchanged

        consoleSpy.mockRestore()
      })

      it('should not refresh if user is not authenticated', async () => {
        const { reset, refreshAcademies } = useAuthStore.getState()
        reset()

        const { academyApi } = await import('@/lib/api-client')
        const academyApiSpy = vi.mocked(academyApi.getUserAcademies)

        await refreshAcademies()

        expect(academyApiSpy).not.toHaveBeenCalled()
      })
    })

    describe('Academy State Management', () => {
      it('should set academy data correctly', () => {
        const { setAcademyData } = useAuthStore.getState()
        setAcademyData(mockSingleAcademyData)

        const state = useAuthStore.getState()
        expect(state.academyData).toEqual(mockSingleAcademyData)
      })

      it('should clear academy data correctly', () => {
        const { setAcademyData } = useAuthStore.getState()
        setAcademyData(mockSingleAcademyData)
        setAcademyData(null)

        const state = useAuthStore.getState()
        expect(state.academyData).toBeNull()
      })

      it('should set current academy correctly', () => {
        const { setCurrentAcademy } = useAuthStore.getState()
        setCurrentAcademy(mockAcademyMembership)

        const state = useAuthStore.getState()
        expect(state.currentAcademy).toEqual(mockAcademyMembership)
      })

      it('should clear current academy correctly', () => {
        const { setCurrentAcademy } = useAuthStore.getState()
        setCurrentAcademy(mockAcademyMembership)
        setCurrentAcademy(null)

        const state = useAuthStore.getState()
        expect(state.currentAcademy).toBeNull()
      })
    })

    describe('Logout with Academy Data', () => {
      beforeEach(() => {
        // Set up authenticated state with academy data
        const { setUser, setTokens, setAcademyData, setCurrentAcademy } = useAuthStore.getState()
        setUser(mockUser)
        setTokens(mockTokens)
        setAcademyData(mockSingleAcademyData)
        setCurrentAcademy(mockAcademyMembership)
      })

      it('should clear academy data on logout', async () => {
        vi.mocked(authApi.logout).mockResolvedValue({ message: 'Logged out successfully' })

        const { logout } = useAuthStore.getState()
        await logout()

        const state = useAuthStore.getState()
        expect(state.academyData).toBeNull()
        expect(state.currentAcademy).toBeNull()
      })
    })

    describe('Reset with Academy Data', () => {
      beforeEach(() => {
        // Set up state with academy data
        const { setUser, setTokens, setAcademyData, setCurrentAcademy } = useAuthStore.getState()
        setUser(mockUser)
        setTokens(mockTokens)
        setAcademyData(mockSingleAcademyData)
        setCurrentAcademy(mockAcademyMembership)
      })

      it('should clear academy data on reset', () => {
        const { reset } = useAuthStore.getState()
        reset()

        const state = useAuthStore.getState()
        expect(state.academyData).toBeNull()
        expect(state.currentAcademy).toBeNull()
      })
    })
  })
})