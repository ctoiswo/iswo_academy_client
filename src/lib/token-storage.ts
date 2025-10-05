/**
 * Secure token storage utilities
 * Handles JWT tokens with secure cookie storage and fallback to localStorage
 */

import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import type { AuthTokens } from '@/stores/auth-store'

// Cookie names for token storage
const ACCESS_TOKEN_KEY = 'iswo_access_token'
const REFRESH_TOKEN_KEY = 'iswo_refresh_token'
const TOKEN_EXPIRES_KEY = 'iswo_token_expires'

// Token expiration buffer (5 minutes before actual expiration)
const EXPIRATION_BUFFER = 5 * 60 * 1000 // 5 minutes in milliseconds

export interface StoredTokens {
  access_token: string
  refresh_token: string
  expires_at: number
}

/**
 * Token storage utility class
 */
class TokenStorage {
  /**
   * Store tokens securely in cookies with httpOnly preference
   */
  setTokens(tokens: AuthTokens): void {
    try {
      const expiresAt = Date.now() + (tokens.expires_in * 1000)
      
      // Store tokens in secure cookies
      setCookie(ACCESS_TOKEN_KEY, tokens.access_token, tokens.expires_in)
      setCookie(REFRESH_TOKEN_KEY, tokens.refresh_token, tokens.expires_in)
      setCookie(TOKEN_EXPIRES_KEY, expiresAt.toString(), tokens.expires_in)
      
      // Also store in localStorage as fallback (less secure but more reliable)
      if (typeof localStorage !== 'undefined') {
        const tokenData: StoredTokens = {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: expiresAt
        }
        localStorage.setItem('iswo_auth_tokens', JSON.stringify(tokenData))
      }
    } catch (error) {
      console.error('Failed to store tokens:', error)
      throw new Error('Token storage failed')
    }
  }

  /**
   * Retrieve tokens from storage
   */
  getTokens(): StoredTokens | null {
    try {
      // Try to get from cookies first
      const accessToken = getCookie(ACCESS_TOKEN_KEY)
      const refreshToken = getCookie(REFRESH_TOKEN_KEY)
      const expiresAt = getCookie(TOKEN_EXPIRES_KEY)

      if (accessToken && refreshToken && expiresAt) {
        return {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: parseInt(expiresAt, 10)
        }
      }

      // Fallback to localStorage
      if (typeof localStorage !== 'undefined') {
        const storedData = localStorage.getItem('iswo_auth_tokens')
        if (storedData) {
          const tokenData: StoredTokens = JSON.parse(storedData)
          return tokenData
        }
      }

      return null
    } catch (error) {
      console.error('Failed to retrieve tokens:', error)
      return null
    }
  }

  /**
   * Get only the access token
   */
  getAccessToken(): string | null {
    const tokens = this.getTokens()
    return tokens?.access_token || null
  }

  /**
   * Get only the refresh token
   */
  getRefreshToken(): string | null {
    const tokens = this.getTokens()
    return tokens?.refresh_token || null
  }

  /**
   * Check if tokens are expired or about to expire
   */
  isTokenExpired(tokens?: StoredTokens): boolean {
    const tokenData = tokens || this.getTokens()
    if (!tokenData) return true

    const now = Date.now()
    const expiresAt = tokenData.expires_at - EXPIRATION_BUFFER
    
    return now >= expiresAt
  }

  /**
   * Check if tokens exist and are valid
   */
  hasValidTokens(): boolean {
    const tokens = this.getTokens()
    return tokens !== null && !this.isTokenExpired(tokens)
  }

  /**
   * Clear all stored tokens
   */
  clearTokens(): void {
    try {
      // Clear cookies
      removeCookie(ACCESS_TOKEN_KEY)
      removeCookie(REFRESH_TOKEN_KEY)
      removeCookie(TOKEN_EXPIRES_KEY)

      // Clear localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('iswo_auth_tokens')
      }
    } catch (error) {
      console.error('Failed to clear tokens:', error)
    }
  }

  /**
   * Get time until token expiration in milliseconds
   */
  getTimeUntilExpiration(): number {
    const tokens = this.getTokens()
    if (!tokens) return 0

    const now = Date.now()
    const expiresAt = tokens.expires_at
    
    return Math.max(0, expiresAt - now)
  }

  /**
   * Check if token will expire within the specified time (in milliseconds)
   */
  willExpireSoon(withinMs: number = 5 * 60 * 1000): boolean {
    const timeUntilExpiration = this.getTimeUntilExpiration()
    return timeUntilExpiration <= withinMs
  }

  /**
   * Update only the access token (useful for token refresh)
   */
  updateAccessToken(accessToken: string, expiresIn: number): void {
    const tokens = this.getTokens()
    if (!tokens) {
      throw new Error('No existing tokens to update')
    }

    const newTokens: AuthTokens = {
      access_token: accessToken,
      refresh_token: tokens.refresh_token,
      expires_in: expiresIn
    }

    this.setTokens(newTokens)
  }

  /**
   * Get token information for debugging (without sensitive data)
   */
  getTokenInfo(): {
    hasTokens: boolean
    isExpired: boolean
    expiresAt: string | null
    timeUntilExpiration: number
  } {
    const tokens = this.getTokens()
    
    return {
      hasTokens: !!tokens,
      isExpired: this.isTokenExpired(tokens || undefined),
      expiresAt: tokens ? new Date(tokens.expires_at).toISOString() : null,
      timeUntilExpiration: this.getTimeUntilExpiration()
    }
  }
}

// Export singleton instance
export const tokenStorage = new TokenStorage()

// Export utility functions for convenience
export const getAccessToken = () => tokenStorage.getAccessToken()
export const getRefreshToken = () => tokenStorage.getRefreshToken()
export const hasValidTokens = () => tokenStorage.hasValidTokens()
export const clearTokens = () => tokenStorage.clearTokens()
export const isTokenExpired = (tokens?: StoredTokens) => tokenStorage.isTokenExpired(tokens)

// Export types
export type { StoredTokens }