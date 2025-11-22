import { create } from 'zustand'
import { tokenManager } from '@/lib/api-client'
import { tokenStorage } from '@/lib/token-storage'
import authService from '@/services/auth-service'
import academyService from '@/services/academy-service'

// TypeScript interfaces for auth state
export interface AuthUser {
  id: number
  first_name: string
  last_name: string
  email: string
  full_name: string
  initials: string
  avatar_url: string | null
  confirmed: boolean
  is_super_admin: boolean
  onboarding_completed_at: string | null
  created_at: string
  last_login_at: string | null
}

// Academy-related interfaces
export interface AcademyMembership {
  id: number
  name: string
  slug: string
  description: string
  logo_url: string | null
  user_role: string
  user_role_display: string
  created_at: string
  last_accessed: string | null
}

export interface AcademyData {
  count: number
  academies: AcademyMembership[]
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  expires_in: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  first_name: string
  last_name: string
  email: string
  password: string
  password_confirmation: string
}

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
  register: (userData: RegisterData) => Promise<{ message: string; user: AuthUser }>
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
  setAcademyData: (academyData: AcademyData | null) => void
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

      // DEBUG: Ver qué trae la respuesta del backend
      console.log('🔍 DEBUG Login Response:', {
        user: response.user ? { id: response.user.id, email: response.user.email } : null,
        academies: response.academies,
        hasAcademies: !!response.academies,
        academyCount: response.academies?.count
      })

      const tokens: AuthTokens = {
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        expires_in: response.expires_in
      }

      // Store tokens securely
      tokenStorage.setTokens(tokens)

      // Handle academy data from login response
      // Backend returns { count, academies: [...] }
      const academyData = response.academies || { count: 0, academies: [] }

      console.log('🔍 DEBUG Academy Data to store:', academyData)

      set({
        user: response.user,
        tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        academyData
      })

      console.log('🔍 DEBUG Store after login:', {
        hasUser: !!response.user,
        academyData: academyData,
        willSelectAcademy: academyData.count === 1
      })

      // Determine routing based on academy count
      if (academyData.count === 0) {
        // No academies - redirect to dashboard (guest student)
        return {
          shouldRedirect: true,
          redirectPath: '/dashboard',
          showAcademySelection: false
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
          showAcademySelection: false
        }
      } else {
        // Multiple academies - show selection page
        return {
          shouldRedirect: true,
          redirectPath: '/academy-selection',
          showAcademySelection: true
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
        currentAcademy: null
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
        error: null
      })

      return response
    } catch (error: any) {
      const errorMessage = error?.message || 'Registration failed'
      set({
        isLoading: false,
        error: errorMessage
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
        } catch (error) {
          // Continue with logout even if API call fails
          console.warn('Logout API call failed:', error)
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
        currentAcademy: null
      })
    } catch (error: any) {
      // Even if logout fails, clear local state
      tokenStorage.clearTokens()
      set({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        academyData: null,
        currentAcademy: null
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
          expires_in: newTokens.expires_in
        },
        error: null
      })
      return true
    } catch (error) {
      // If refresh fails, clear tokens and redirect to login
      console.error('Token refresh failed:', error)
      set({
        user: null,
        tokens: null,
        isAuthenticated: false,
        error: 'Session expired'
      })
      return false
    }
  },

  refreshUser: async (): Promise<void> => {
    try {
      const user = await authService.getCurrentUser()
      set({ user })
      await get().refreshAcademies()
    } catch (error) {
      console.error('Failed to refresh user:', error)
      throw error
    }
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
      currentAcademy: null
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
      } catch (error) {
        console.error('Failed to refresh tokens on initialization:', error)
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
      } catch (error) {
        // If profile fetch fails, clear everything
        console.error('Failed to fetch user profile:', error)
        get().reset()
        set({ isLoading: false, isInitialized: true })
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      get().reset()
      set({ isLoading: false, isInitialized: true })
    }
  },

  // Academy actions
  selectAcademy: (academyId: number) => {
    const { academyData } = get()
    if (!academyData) return

    const selectedAcademy = academyData.academies.find((academy: AcademyMembership) => academy.id === academyId)
    if (selectedAcademy) {
      set({ currentAcademy: selectedAcademy })
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

      console.log('🔍 DEBUG refreshAcademies: Loading academies...')
      const academyData = await academyService.getUserAcademies()
      console.log('🔍 DEBUG refreshAcademies: Loaded academies:', academyData)

      set({ academyData })

      // If user had a currentAcademy stored, try to restore it
      const storedAcademyId = localStorage.getItem('currentAcademyId')
      if (storedAcademyId && academyData.academies.length > 0) {
        const academy = academyData.academies.find((a: AcademyMembership) => a.id === parseInt(storedAcademyId))
        if (academy) {
          console.log('🔍 DEBUG refreshAcademies: Restoring currentAcademy:', academy)
          set({ currentAcademy: academy })
        } else if (academyData.count === 1) {
          // Auto-select if only one academy
          console.log('🔍 DEBUG refreshAcademies: Auto-selecting single academy')
          set({ currentAcademy: academyData.academies[0] })
          localStorage.setItem('currentAcademyId', academyData.academies[0].id.toString())
        }
      } else if (academyData.count === 1) {
        // Auto-select if only one academy
        console.log('🔍 DEBUG refreshAcademies: Auto-selecting single academy')
        set({ currentAcademy: academyData.academies[0] })
        localStorage.setItem('currentAcademyId', academyData.academies[0].id.toString())
      }
    } catch (error) {
      console.error('Failed to refresh academy data:', error)
      // Don't throw error to avoid breaking the flow
    }
  },

  setAcademyData: (academyData: AcademyData | null) => {
    set({ academyData })
  },

  setCurrentAcademy: (academy: AcademyMembership | null) => {
    set({ currentAcademy: academy })
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
    reset: () => get().reset()
  }
}))
