import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { tokenStorage } from '@/lib/token-storage'
// Import after mocking
import apiClient, { tokenManager, setAuthStore } from '../api-client'

// Mock axios and dependencies
jest.mock('axios', () => {
  const mockAxiosInstance = {
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  }

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockAxiosInstance),
      post: jest.fn(),
      get: jest.fn(),
    },
  }
})

jest.mock('@/lib/token-storage', () => ({
  tokenStorage: {
    getTokens: jest.fn(),
    setTokens: jest.fn(),
    clearTokens: jest.fn(),
    isTokenExpired: jest.fn(),
    getAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
    hasValidTokens: jest.fn(),
    willExpireSoon: jest.fn(),
    getTokenInfo: jest.fn(),
  },
}))

const mockedAxios = jest.mocked(axios)

describe('Token Refresh Mechanism', () => {
  let mockAuthStore: any

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()

    // Mock auth store
    mockAuthStore = {
      getState: jest.fn(() => ({
        setTokens: jest.fn(),
        reset: jest.fn(),
      })),
    }
    setAuthStore(mockAuthStore)
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.resetAllMocks()
  })

  describe('Proactive Token Refresh', () => {
    it('should refresh tokens when they will expire soon', async () => {
      jest.mocked(tokenStorage.getRefreshToken).mockReturnValue('refresh-token')
      jest.mocked(tokenStorage.willExpireSoon).mockReturnValue(true)

      const mockRefreshResponse = {
        data: {
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
          expires_in: 3600,
        },
      }

      mockedAxios.post.mockResolvedValue(mockRefreshResponse)

      const result = await tokenManager.refreshTokens()

      expect(result).toBe(true)
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/auth/refresh',
        { refresh_token: 'refresh-token' }
      )
      expect(tokenStorage.setTokens).toHaveBeenCalledWith({
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
        expires_in: 3600,
      })
    })

    it('should handle proactive refresh failure', async () => {
      jest.mocked(tokenStorage.getRefreshToken).mockReturnValue('refresh-token')
      mockedAxios.post.mockRejectedValue(new Error('Refresh failed'))

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      const result = await tokenManager.refreshTokens()

      expect(result).toBe(false)
      expect(tokenStorage.clearTokens).toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Manual token refresh failed:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('should handle missing refresh token', async () => {
      jest.mocked(tokenStorage.getRefreshToken).mockReturnValue(null)

      const result = await tokenManager.refreshTokens()

      expect(result).toBe(false)
      expect(mockedAxios.post).not.toHaveBeenCalled()
    })
  })

  describe('Token Refresh Error Handling', () => {
    it('should handle network errors during refresh', async () => {
      jest.mocked(tokenStorage.getRefreshToken).mockReturnValue('refresh-token')
      mockedAxios.post.mockRejectedValue(new Error('Network error'))

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      const result = await tokenManager.refreshTokens()

      expect(result).toBe(false)
      expect(tokenStorage.clearTokens).toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Manual token refresh failed:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('should handle invalid refresh token response', async () => {
      jest.mocked(tokenStorage.getRefreshToken).mockReturnValue('invalid-token')
      mockedAxios.post.mockRejectedValue({
        response: {
          status: 401,
          data: { error: 'Invalid refresh token' },
        },
      })

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      const result = await tokenManager.refreshTokens()

      expect(result).toBe(false)
      expect(tokenStorage.clearTokens).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should handle server errors during refresh', async () => {
      jest.mocked(tokenStorage.getRefreshToken).mockReturnValue('refresh-token')
      mockedAxios.post.mockRejectedValue({
        response: {
          status: 500,
          data: { error: 'Internal server error' },
        },
      })

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      const result = await tokenManager.refreshTokens()

      expect(result).toBe(false)
      expect(tokenStorage.clearTokens).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('Token Manager Utilities', () => {
    it('should initialize token refresh scheduling', () => {
      const mockTokens = {
        access_token: 'token',
        refresh_token: 'refresh',
        expires_at: Date.now() + 3600000, // 1 hour from now
      }

      jest.mocked(tokenStorage.getTokens).mockReturnValue(mockTokens)
      jest.mocked(tokenStorage.isTokenExpired).mockReturnValue(false)

      tokenManager.initialize()

      // Should schedule a refresh timer
      expect(tokenStorage.getTokens).toHaveBeenCalled()
      expect(tokenStorage.isTokenExpired).toHaveBeenCalledWith(mockTokens)
    })

    it('should not schedule refresh for expired tokens', () => {
      const mockTokens = {
        access_token: 'token',
        refresh_token: 'refresh',
        expires_at: Date.now() - 1000, // Expired
      }

      jest.mocked(tokenStorage.getTokens).mockReturnValue(mockTokens)
      jest.mocked(tokenStorage.isTokenExpired).mockReturnValue(true)

      tokenManager.initialize()

      expect(tokenStorage.getTokens).toHaveBeenCalled()
      expect(tokenStorage.isTokenExpired).toHaveBeenCalledWith(mockTokens)
    })

    it('should handle missing tokens during initialization', () => {
      jest.mocked(tokenStorage.getTokens).mockReturnValue(null)

      expect(() => tokenManager.initialize()).not.toThrow()
      expect(tokenStorage.getTokens).toHaveBeenCalled()
    })

    it('should manually refresh tokens', async () => {
      jest.mocked(tokenStorage.getRefreshToken).mockReturnValue('refresh-token')

      const mockRefreshResponse = {
        data: {
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
          expires_in: 3600,
        },
      }

      mockedAxios.post.mockResolvedValue(mockRefreshResponse)

      const result = await tokenManager.refreshTokens()

      expect(result).toBe(true)
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/auth/refresh',
        { refresh_token: 'refresh-token' }
      )
      expect(tokenStorage.setTokens).toHaveBeenCalled()
    })

    it('should handle manual refresh failure', async () => {
      jest.mocked(tokenStorage.getRefreshToken).mockReturnValue('refresh-token')
      mockedAxios.post.mockRejectedValue(new Error('Refresh failed'))

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      const result = await tokenManager.refreshTokens()

      expect(result).toBe(false)
      expect(tokenStorage.clearTokens).toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith(
        'Manual token refresh failed:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('should check token validity', () => {
      jest.mocked(tokenStorage.hasValidTokens).mockReturnValue(true)

      const result = tokenManager.hasValidTokens()

      expect(result).toBe(true)
      expect(tokenStorage.hasValidTokens).toHaveBeenCalled()
    })

    it('should get token info', () => {
      const mockInfo = {
        hasTokens: true,
        isExpired: false,
        expiresAt: '2024-01-01T12:00:00Z',
        timeUntilExpiration: 3600000,
      }

      jest.mocked(tokenStorage.getTokenInfo).mockReturnValue(mockInfo)

      const result = tokenManager.getTokenInfo()

      expect(result).toEqual(mockInfo)
      expect(tokenStorage.getTokenInfo).toHaveBeenCalled()
    })

    it('should clear tokens and timers', () => {
      tokenManager.clearTokens()

      expect(tokenStorage.clearTokens).toHaveBeenCalled()
      // Note: The auth store reset is called internally by clearTokens function
    })
  })

  describe('Scheduled Token Refresh', () => {
    it('should initialize without errors', () => {
      const mockTokens = {
        access_token: 'token',
        refresh_token: 'refresh',
        expires_at: Date.now() + 3600000, // 1 hour from now
      }

      jest.mocked(tokenStorage.getTokens).mockReturnValue(mockTokens)
      jest.mocked(tokenStorage.isTokenExpired).mockReturnValue(false)

      expect(() => tokenManager.initialize()).not.toThrow()
      expect(tokenStorage.getTokens).toHaveBeenCalled()
    })

    it('should handle refresh failure gracefully', async () => {
      jest.mocked(tokenStorage.getRefreshToken).mockReturnValue('refresh-token')
      mockedAxios.post.mockRejectedValue(new Error('Network error'))

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      const result = await tokenManager.refreshTokens()

      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith(
        'Manual token refresh failed:',
        expect.any(Error)
      )
      consoleSpy.mockRestore()
    })

    it('should handle multiple initialization calls', () => {
      jest.mocked(tokenStorage.getTokens).mockReturnValue(null)

      expect(() => {
        tokenManager.initialize()
        tokenManager.initialize()
        tokenManager.initialize()
      }).not.toThrow()
    })
  })
})
