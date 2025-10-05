/**
 * Integration between auth store and API client
 * This file sets up the connection between the auth store and API client
 */

import { setAuthStore } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth-store'

/**
 * Initialize the integration between auth store and API client
 * This should be called once during app initialization
 */
export const initializeAuthIntegration = () => {
  // Connect the auth store to the API client
  setAuthStore(useAuthStore)
  
  // Initialize the auth store (load tokens from storage, etc.)
  useAuthStore.getState().initialize()
}

/**
 * Get the current authentication state
 */
export const getAuthState = () => {
  return useAuthStore.getState()
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return useAuthStore.getState().isAuthenticated
}

/**
 * Get current user
 */
export const getCurrentUser = () => {
  return useAuthStore.getState().user
}

/**
 * Get current tokens
 */
export const getCurrentTokens = () => {
  return useAuthStore.getState().tokens
}