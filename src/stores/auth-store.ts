import { create } from 'zustand'
import { tokenManager } from '@/lib/api-client'
import { tokenStorage } from '@/lib/token-storage'
import authService from '@/services/auth-service'

// TypeScript interfaces for auth state
export interface AuthUser {
  id: number
  first_name: string
  last_name: string
  email: string
  full_name: string
  initials: string
  confirmed: boolean
  is_super_admin: boolean
  created_at: string
  last_login_at: string | null
}

// Academy-related interfaces
export interface AcademyMembership {
  id: number
  name: string
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
  error: string | null
  
  // Academy state
  academyData: AcademyData | null
  currentAcademy: AcademyMembership | null

  // Actions
  login: (credentials: LoginCredentials) => Promise<LoginResult>
  register: (userData: RegisterData) => Promise<{ message: string }>
  logout: () => Promise<void>
  refreshTokens: () => Promise<boolean>
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
        expires_in: response.expires_in
      }

      // Store tokens securely
      tokenStorage.setTokens(tokens)
      
      // Handle academy data from login response - map to expected format
      const apiAcademies = response.academies
      const allAcademies = [
        ...(apiAcademies?.owned || []),
        ...(apiAcademies?.member || [])
      ]
      const academyData: AcademyData = {
        count: allAcademies.length,
        academies: allAcademies
      }
      
      set({
        user: response.user,
        tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        academyData
      })
      
      // Determine routing based on academy count
      if (academyData.count === 0) {
        return {
          shouldRedirect: true,
          redirectPath: '/create-academy',
          showAcademySelection: false
        }
      } else if (academyData.count === 1) {
        // Auto-select the single academy and redirect to its dashboard
        const singleAcademy = academyData.academies[0]
        set({ currentAcademy: singleAcademy })
        return {
          shouldRedirect: true,
          redirectPath: `/academy/${singleAcademy.id}/dashboard`,
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
      set({
        user: null,
        tokens: null,
        isAuthenticated: false,
        error: 'Session expired'
      })
      return false
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
    set({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      academyData: null,
      currentAcademy: null
    })
  },

  initialize: async () => {
    try {
      set({ isLoading: true })
      
      // Try to load tokens from storage
      const storedTokens = tokenStorage.getTokens()
      if (!storedTokens) {
        set({ isLoading: false })
        return
      }

      // Check if tokens are expired
      if (tokenStorage.isTokenExpired(storedTokens)) {
        // Try to refresh tokens
        const refreshed = await get().refreshTokens()
        if (!refreshed) {
          // Refresh failed, tokens should already be cleared by refreshTokens method
          set({ isLoading: false })
          return
        }
      } else {
        // Tokens are valid, convert to AuthTokens format and set them in state
        const authTokens: AuthTokens = {
          access_token: storedTokens.access_token,
          refresh_token: storedTokens.refresh_token,
          expires_in: Math.floor((storedTokens.expires_at - Date.now()) / 1000)
        }
        set({ tokens: authTokens, isAuthenticated: true })
      }

      // Fetch user profile if we have valid tokens
      try {
        const user = await authService.getCurrentUser()
        set({ user, isLoading: false })
        
        // Refresh academy data after successful profile fetch
        await get().refreshAcademies()
      } catch (error) {
        // If profile fetch fails, try to refresh tokens
        const refreshed = await get().refreshTokens()
        if (refreshed) {
          try {
            const user = await authService.getCurrentUser()
            set({ user, isLoading: false })
            
            // Refresh academy data after successful profile fetch
            await get().refreshAcademies()
          } catch (profileError) {
            // If still fails, clear everything
            get().reset()
            set({ isLoading: false })
          }
        } else {
          // Refresh failed, tokens should already be cleared by refreshTokens method
          set({ isLoading: false })
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      get().reset()
      set({ isLoading: false })
    }
  },
  
  // Academy actions
  selectAcademy: (academyId: number) => {
    const { academyData } = get()
    if (!academyData) return
    
    const selectedAcademy = academyData.academies.find(academy => academy.id === academyId)
    if (selectedAcademy) {
      set({ currentAcademy: selectedAcademy })
    }
  },
  
  switchAcademy: () => {
    set({ currentAcademy: null })
  },
  
  refreshAcademies: async () => {
    try {
      const { isAuthenticated } = get()
      if (!isAuthenticated) return
      
      // TODO: Implement academy service
      // const academyData = await academyService.getUserAcademies()
      // set({ academyData })
      
      console.warn('refreshAcademies: Academy service not yet implemented')
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
