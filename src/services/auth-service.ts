import type {
  AuthUser,
  AuthTokens,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  MessageResponse,
} from '@/types'
import apiClient, { tokenManager } from '@/lib/api-client'

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  /**
   * Login user
   * @param credentials - User email and password
   * @returns Promise with login response (user, tokens, academies)
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      auth: credentials,
    })

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
   * Note: Registration does NOT return tokens - user must confirm email first
   * @param userData - Registration data (email, password, names)
   * @returns Promise with registration response (message, user)
   */
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/auth/register', {
      auth: userData,
    })

    // Do NOT store tokens - registration requires email confirmation
    // Tokens will only be provided after successful login with confirmed account

    return response.data
  }

  /**
   * Logout user
   * Revokes refresh token and clears local tokens
   * @returns Promise that resolves when logout is complete
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = tokenManager.getRefreshToken()
      if (refreshToken) {
        await apiClient.delete('/auth/logout', {
          data: { refresh_token: refreshToken },
        })
      }
    } finally {
      tokenManager.clearTokens()
    }
  }

  /**
   * Refresh authentication tokens
   * @returns Promise with new auth tokens
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
   * @param email - User email address
   * @returns Promise with success message
   */
  async forgotPassword(email: string): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(
      '/auth/forgot_password',
      { email }
    )
    return response.data
  }

  /**
   * Reset password with token
   * @param token - Password reset token from email
   * @param password - New password
   * @param passwordConfirmation - Password confirmation
   * @returns Promise with success message
   */
  async resetPassword(
    token: string,
    password: string,
    passwordConfirmation: string
  ): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(
      '/auth/reset_password',
      {
        token,
        password,
        password_confirmation: passwordConfirmation,
      }
    )
    return response.data
  }

  /**
   * Get current authenticated user profile
   * @returns Promise with user data
   */
  async getCurrentUser(): Promise<AuthUser> {
    const response = await apiClient.get<{ user: AuthUser }>('/users/profile')
    return response.data.user
  }
}

// Export singleton instance
const authService = new AuthService()
export default authService

// Also export as named export for convenience
export { authService }
