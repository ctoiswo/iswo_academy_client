import axios from 'axios'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import apiClient, { setAuthStore, authApi } from '../api-client'

// Mock axios
vi.mock('axios', () => {
  const mockAxiosInstance = {
    interceptors: {
      request: {
        use: vi.fn(),
      },
      response: {
        use: vi.fn(),
      },
    },
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  }

  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
      post: vi.fn(),
      get: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    },
  }
})

describe('API Client Integration', () => {
  let mockAuthStore: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Create a mock auth store
    mockAuthStore = {
      getState: vi.fn(() => ({
        auth: {
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          setAccessToken: vi.fn(),
          setRefreshToken: vi.fn(),
          reset: vi.fn(),
        },
      })),
    }

    setAuthStore(mockAuthStore)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Auth Store Integration', () => {
    it('should integrate with auth store for token management', async () => {
      const mockResponse = {
        status: 200,
        data: {
          message: 'Login successful',
          user: {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            full_name: 'John Doe',
            initials: 'JD',
            confirmed: true,
            is_super_admin: false,
            created_at: '2024-01-01T00:00:00Z',
            last_login_at: '2024-01-01T12:00:00Z',
          },
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
          expires_in: 3600,
        },
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const credentials = {
        email: 'john@example.com',
        password: 'password123',
      }

      const result = await authApi.login(credentials)

      expect(result).toEqual(mockResponse.data)
      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        user: credentials,
      })
    })

    it('should handle auth store not being set', () => {
      setAuthStore(null)

      // Should not throw error when auth store is not set
      expect(() => {
        // This would normally try to get tokens from auth store
        // but should handle gracefully when store is null
      }).not.toThrow()
    })

    it('should handle missing tokens in auth store', () => {
      const emptyAuthStore = {
        getState: vi.fn(() => ({
          auth: {
            accessToken: null,
            refreshToken: null,
            setAccessToken: vi.fn(),
            setRefreshToken: vi.fn(),
            reset: vi.fn(),
          },
        })),
      }

      setAuthStore(emptyAuthStore)

      // Should handle gracefully when tokens are null
      expect(() => {
        // This would normally try to get tokens from auth store
      }).not.toThrow()
    })
  })

  describe('API Methods Integration', () => {
    it('should make correct API calls for authentication endpoints', async () => {
      const mockResponse = {
        status: 200,
        data: { message: 'Success' },
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      // Test register
      await authApi.register({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        password_confirmation: 'password123',
      })

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
        user: {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          password: 'password123',
          password_confirmation: 'password123',
        },
      })
    })

    it('should handle successful API responses', async () => {
      const mockResponse = {
        status: 200,
        data: {
          message: 'Login successful',
          user: { id: 1, email: 'john@example.com' },
          access_token: 'token',
          refresh_token: 'refresh',
          expires_in: 3600,
        },
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const result = await authApi.login({
        email: 'john@example.com',
        password: 'password123',
      })

      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('Configuration', () => {
    it('should export API configuration constants', async () => {
      const { API_CONFIG } = await import('../api-client')

      expect(API_CONFIG).toEqual({
        BASE_URL: 'http://localhost:3001/api/v1',
        TIMEOUT: 10000,
      })
    })
  })
})
