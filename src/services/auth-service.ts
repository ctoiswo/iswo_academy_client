import apiClient, { tokenManager, type AuthTokens } from '@/lib/api-client'

// TypeScript interfaces for Auth
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
  owned: AcademyMembership[]
  member: AcademyMembership[]
}

export interface AuthResponse extends AuthTokens {
  user: AuthUser
  message: string
  academies?: AcademyData
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  password_confirmation: string
  first_name: string
  last_name: string
}

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    
    // Store tokens automatically
    tokenManager.setTokens({
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
    })

    return response.data
  }

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData)
    
    // Store tokens automatically
    tokenManager.setTokens({
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
    })

    return response.data
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.delete('/auth/logout')
    } finally {
      tokenManager.clearTokens()
    }
  }

  /**
   * Refresh authentication tokens
   */
  async refreshTokens(): Promise<AuthTokens> {
    const refreshToken = tokenManager.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await apiClient.post<AuthTokens>('/auth/refresh', {
      refresh_token: refreshToken,
    })

    tokenManager.setTokens(response.data)
    return response.data
  }

  /**
   * Request password reset email
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/forgot-password', { email })
    return response.data
  }

  /**
   * Reset password with token
   */
  async resetPassword(
    token: string,
    password: string,
    passwordConfirmation: string
  ): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/reset-password', {
      token,
      password,
      password_confirmation: passwordConfirmation,
    })
    return response.data
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<AuthUser> {
    const response = await apiClient.get<AuthUser>('/auth/me')
    return response.data
  }
}

// Export singleton instance
const authService = new AuthService()
export default authService

// Also export as named export for convenience
export { authService }