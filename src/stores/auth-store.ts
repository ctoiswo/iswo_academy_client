import academyService, {
  type UserAcademiesResponse,
} from '@/services/academy-service'
import authService from '@/services/auth-service'
import type {
  AuthUser,
  AcademyMembership,
  AcademySummaryLight,
  AcademyData,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
} from '@/types'
import { create } from 'zustand'
import { tokenManager } from '@/lib/api-client'
import { tokenStorage } from '@/lib/token-storage'

// Re-export types for backward compatibility
export type { AuthUser, AcademyMembership, AcademyData, AuthTokens }
export type LoginCredentials = LoginRequest
export type RegisterData = RegisterRequest

export interface LoginResult {
  shouldRedirect: boolean
  redirectPath?: string
  showAcademySelection?: boolean
}

export interface AuthState {
  // State
  user: AuthUser | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  error: string | null

  // Academy state
  academyData: AcademyData | null
  currentAcademy: AcademyMembership | null

  // Actions
  login: (credentials: LoginCredentials) => Promise<LoginResult>
  register: (
    userData: RegisterData
  ) => Promise<{ message: string; user: AuthUser }>
  logout: () => Promise<void>
  refreshTokens: () => Promise<boolean>
  refreshUser: () => Promise<void>
  setUser: (user: AuthUser | null) => void
  setTokens: (tokens: AuthTokens | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
  initialize: () => Promise<void>

  // Academy actions
  selectAcademy: (academyId: number) => void
  switchAcademy: () => void
  refreshAcademies: () => Promise<void>
  setAcademyData: (academyData: UserAcademiesResponse | null) => void
  setCurrentAcademy: (academy: AcademyMembership | null) => void

  // Legacy methods for backward compatibility
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    refreshToken: string
    setRefreshToken: (refreshToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  // Initial state
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  // Academy state
  academyData: null,
  currentAcademy: null,

  // Actions
  login: async (credentials: LoginCredentials): Promise<LoginResult> => {
    try {
      set({ isLoading: true, error: null })

      const response = await authService.login(credentials)

      const tokens: AuthTokens = {
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        expires_in: response.expires_in,
      }

      // Store tokens securely
      tokenStorage.setTokens(tokens)

      // Handle academy data from login response
      // Backend returns { count, academies: [...] }
      const academyData = response.academies || { count: 0, academies: [] }

      set({
        user: response.user,
        tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        academyData,
      })

      // Determine routing based on academy count
      if (academyData.count === 0) {
        // No academies - redirect to dashboard (guest student)
        return {
          shouldRedirect: true,
          redirectPath: '/dashboard',
          showAcademySelection: false,
        }
      } else if (academyData.count === 1) {
        // Auto-select the single academy and redirect to role-specific dashboard
        const singleAcademy = academyData.academies[0]
        set({ currentAcademy: singleAcademy })
        localStorage.setItem('currentAcademyId', singleAcademy.id.toString())

        // Determine dashboard path based on user role
        let dashboardPath = `/academy/${singleAcademy.id}/dashboard`
        if (singleAcademy.user_role === 'admin') {
          dashboardPath = `/academy/${singleAcademy.id}/admin`
        } else if (singleAcademy.user_role === 'teacher') {
          dashboardPath = `/academy/${singleAcademy.id}/teacher/dashboard`
        }

        return {
          shouldRedirect: true,
          redirectPath: dashboardPath,
          showAcademySelection: false,
        }
      } else {
        // Multiple academies - show selection page
        return {
          shouldRedirect: true,
          redirectPath: '/academy-selection',
          showAcademySelection: true,
        }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Login failed'
      set({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
        academyData: null,
        currentAcademy: null,
      })
      throw error
    }
  },

  register: async (userData: RegisterData) => {
    try {
      set({ isLoading: true, error: null })

      const response = await authService.register(userData)

      set({
        isLoading: false,
        error: null,
      })

      return response
    } catch (error: any) {
      const errorMessage = error?.message || 'Registration failed'
      set({
        isLoading: false,
        error: errorMessage,
      })
      throw error
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null })

      const { tokens } = get()
      if (tokens?.refresh_token) {
        try {
          await authService.logout()
        } catch (_error) {
          // Continue with logout even if API call fails
          // console.warn('Logout API call failed:', error)
        }
      }

      // Clear tokens from storage
      tokenStorage.clearTokens()
      localStorage.removeItem('currentAcademyId')

      set({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        academyData: null,
        currentAcademy: null,
      })
    } catch (_error: any) {
      // Even if logout fails, clear local state
      tokenStorage.clearTokens()
      set({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        academyData: null,
        currentAcademy: null,
      })
    }
  },

  refreshTokens: async (): Promise<boolean> => {
    try {
      const newTokens = await tokenManager.refreshAccessToken()

      // Tokens are already stored by tokenManager
      set({
        tokens: {
          access_token: newTokens.access_token,
          refresh_token: newTokens.refresh_token,
          expires_in: newTokens.expires_in,
        },
        error: null,
      })
      return true
    } catch (_error) {
      // If refresh fails, clear tokens and redirect to login
      // console.error('Token refresh failed:', error)
      set({
        user: null,
        tokens: null,
        isAuthenticated: false,
        error: 'Session expired',
      })
      return false
    }
  },

  refreshUser: async (): Promise<void> => {
    const user = await authService.getCurrentUser()
    set({ user })
    await get().refreshAcademies()
  },

  setUser: (user: AuthUser | null) => {
    set({ user, isAuthenticated: !!user })
  },

  setTokens: (tokens: AuthTokens | null) => {
    if (tokens) {
      tokenStorage.setTokens(tokens)
    } else {
      tokenStorage.clearTokens()
    }
    set({ tokens, isAuthenticated: !!tokens })
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading })
  },

  setError: (error: string | null) => {
    set({ error })
  },

  reset: () => {
    tokenStorage.clearTokens()
    localStorage.removeItem('currentAcademyId')
    set({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,
      academyData: null,
      currentAcademy: null,
    })
  },

  initialize: async () => {
    try {
      const { isInitialized, isLoading } = get()

      // Prevent multiple initializations
      if (isInitialized || isLoading) {
        return
      }

      set({ isLoading: true })

      // Try to load refresh token from storage
      const storedTokens = tokenStorage.getTokens()

      if (!storedTokens || !storedTokens.refresh_token) {
        set({ isLoading: false, isInitialized: true, isAuthenticated: false })
        return
      }

      // We have a refresh token, so refresh to get a new access token
      // This ensures we always have a fresh access token on page reload
      try {
        const refreshed = await get().refreshTokens()

        if (!refreshed) {
          // Refresh failed, tokens should already be cleared by refreshTokens method
          set({ isLoading: false, isInitialized: true, isAuthenticated: false })
          return
        }
      } catch (_error) {
        // console.error('Failed to refresh tokens on initialization:', error)
        get().reset()
        set({ isLoading: false, isInitialized: true, isAuthenticated: false })
        return
      }

      // Fetch user profile if we have valid tokens
      try {
        const user = await authService.getCurrentUser()
        set({ user, isLoading: false, isInitialized: true })

        // Refresh academy data after successful profile fetch
        await get().refreshAcademies()
      } catch (_error) {
        // If profile fetch fails, clear everything
        // console.error('Failed to fetch user profile:', error)
        get().reset()
        set({ isLoading: false, isInitialized: true })
      }
    } catch (_error) {
      // console.error('Auth initialization failed:', error)
      get().reset()
      set({ isLoading: false, isInitialized: true })
    }
  },

  // Academy actions
  selectAcademy: (academyId: number) => {
    const { academyData } = get()
    if (!academyData) return

    const selectedAcademy = academyData.academies.find(
      (academy: AcademyMembership) => academy.id === academyId
    )
    if (selectedAcademy) {
      set({ currentAcademy: selectedAcademy as AcademyMembership })
      localStorage.setItem('currentAcademyId', academyId.toString())
    }
  },

  switchAcademy: () => {
    set({ currentAcademy: null })
  },

  refreshAcademies: async () => {
    try {
      const { isAuthenticated } = get()
      if (!isAuthenticated) return

      const academyData = (await academyService.getUserAcademies()) as unknown as UserAcademiesResponse
      set({ academyData: academyData as unknown as AcademyData })

      // If user had a currentAcademy stored, try to restore it
      const storedAcademyId = localStorage.getItem('currentAcademyId')
      if (storedAcademyId && academyData.academies.length > 0) {
        const academy = academyData.academies.find(
          (a: AcademySummaryLight) => a.id === parseInt(storedAcademyId)
        )
        if (academy) {
          set({ currentAcademy: academy as unknown as AcademyMembership })
        } else if (academyData.count === 1) {
          set({ currentAcademy: academyData.academies[0] as unknown as AcademyMembership })
          localStorage.setItem(
            'currentAcademy Id',
            academyData.academies[0].id.toString()
          )
        }
      } else if (academyData.count === 1) {
        set({ currentAcademy: academyData.academies[0] as unknown as AcademyMembership })
        localStorage.setItem(
          'currentAcademyId',
          academyData.academies[0].id.toString()
        )
      }
    } catch (_error) {
      // console.error('Failed to refresh academy data:', error)
      // Don't throw error to avoid breaking the flow
    }
  },

  setAcademyData: (academyData: UserAcademiesResponse | null) => {
    set({ academyData: academyData as unknown as AcademyData | null })
  },

  setCurrentAcademy: (academy: AcademyMembership | AcademySummaryLight | null) => {
    set({ currentAcademy: academy as AcademyMembership | null })
  },

  // Legacy auth object for backward compatibility
  auth: {
    get user() {
      return get().user
    },
    setUser: (user: AuthUser | null) => get().setUser(user),
    get accessToken() {
      return get().tokens?.access_token || ''
    },
    setAccessToken: (accessToken: string) => {
      const { tokens } = get()
      if (tokens) {
        get().setTokens({ ...tokens, access_token: accessToken })
      }
    },
    get refreshToken() {
      return get().tokens?.refresh_token || ''
    },
    setRefreshToken: (refreshToken: string) => {
      const { tokens } = get()
      if (tokens) {
        get().setTokens({ ...tokens, refresh_token: refreshToken })
      }
    },
    resetAccessToken: () => {
      get().reset()
    },
    reset: () => get().reset(),
  },
}))
