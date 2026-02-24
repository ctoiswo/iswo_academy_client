import * as cookieUtils from '../cookies'
import {
  tokenStorage,
  type AuthTokens,
  type StoredTokens,
} from '../token-storage'

// Mock the cookies utility
jest.mock('../cookies', () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
  removeCookie: jest.fn(),
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock data
const mockTokens: AuthTokens = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
}

const mockStoredTokens: StoredTokens = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_at: Date.now() + 3600000, // 1 hour from now
}

describe('TokenStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset localStorage mock
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockImplementation(() => {})
    localStorageMock.removeItem.mockImplementation(() => {})

    // Reset cookie mocks
    jest.mocked(cookieUtils.getCookie).mockReturnValue(undefined)
    jest.mocked(cookieUtils.setCookie).mockImplementation(() => {})
    jest.mocked(cookieUtils.removeCookie).mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('setTokens', () => {
    it('should store tokens in both cookies and localStorage', () => {
      tokenStorage.setTokens(mockTokens)

      // Check cookies
      expect(cookieUtils.setCookie).toHaveBeenCalledWith(
        'iswo_access_token',
        mockTokens.access_token,
        mockTokens.expires_in
      )
      expect(cookieUtils.setCookie).toHaveBeenCalledWith(
        'iswo_refresh_token',
        mockTokens.refresh_token,
        mockTokens.expires_in
      )
      expect(cookieUtils.setCookie).toHaveBeenCalledWith(
        'iswo_token_expires',
        expect.any(String),
        mockTokens.expires_in
      )

      // Check localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'iswo_auth_tokens',
        expect.stringContaining(mockTokens.access_token)
      )
    })

    it('should handle storage errors gracefully', () => {
      jest.mocked(cookieUtils.setCookie).mockImplementation(() => {
        throw new Error('Cookie storage failed')
      })

      expect(() => tokenStorage.setTokens(mockTokens)).toThrow(
        'Token storage failed'
      )
    })
  })

  describe('getTokens', () => {
    it('should retrieve tokens from cookies first', () => {
      const expiresAt = Date.now() + 3600000

      jest.mocked(cookieUtils.getCookie).mockImplementation((key) => {
        switch (key) {
          case 'iswo_access_token':
            return mockTokens.access_token
          case 'iswo_refresh_token':
            return mockTokens.refresh_token
          case 'iswo_token_expires':
            return expiresAt.toString()
          default:
            return undefined
        }
      })

      const tokens = tokenStorage.getTokens()

      expect(tokens).toEqual({
        access_token: mockTokens.access_token,
        refresh_token: mockTokens.refresh_token,
        expires_at: expiresAt,
      })
    })

    it('should fallback to localStorage when cookies are not available', () => {
      jest.mocked(cookieUtils.getCookie).mockReturnValue(undefined)
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockStoredTokens))

      const tokens = tokenStorage.getTokens()

      expect(tokens).toEqual(mockStoredTokens)
      expect(localStorageMock.getItem).toHaveBeenCalledWith('iswo_auth_tokens')
    })

    it('should return null when no tokens are stored', () => {
      jest.mocked(cookieUtils.getCookie).mockReturnValue(undefined)
      localStorageMock.getItem.mockReturnValue(null)

      const tokens = tokenStorage.getTokens()

      expect(tokens).toBeNull()
    })

    it('should handle JSON parsing errors gracefully', () => {
      jest.mocked(cookieUtils.getCookie).mockReturnValue(undefined)
      localStorageMock.getItem.mockReturnValue('invalid-json')

      const tokens = tokenStorage.getTokens()

      expect(tokens).toBeNull()
    })
  })

  describe('getAccessToken', () => {
    it('should return access token when tokens exist', () => {
      jest.mocked(cookieUtils.getCookie).mockImplementation((key) => {
        if (key === 'iswo_access_token') return mockTokens.access_token
        if (key === 'iswo_refresh_token') return mockTokens.refresh_token
        if (key === 'iswo_token_expires')
          return (Date.now() + 3600000).toString()
        return undefined
      })

      const accessToken = tokenStorage.getAccessToken()

      expect(accessToken).toBe(mockTokens.access_token)
    })

    it('should return null when no tokens exist', () => {
      jest.mocked(cookieUtils.getCookie).mockReturnValue(undefined)
      localStorageMock.getItem.mockReturnValue(null)

      const accessToken = tokenStorage.getAccessToken()

      expect(accessToken).toBeNull()
    })
  })

  describe('getRefreshToken', () => {
    it('should return refresh token when tokens exist', () => {
      jest.mocked(cookieUtils.getCookie).mockImplementation((key) => {
        if (key === 'iswo_access_token') return mockTokens.access_token
        if (key === 'iswo_refresh_token') return mockTokens.refresh_token
        if (key === 'iswo_token_expires')
          return (Date.now() + 3600000).toString()
        return undefined
      })

      const refreshToken = tokenStorage.getRefreshToken()

      expect(refreshToken).toBe(mockTokens.refresh_token)
    })

    it('should return null when no tokens exist', () => {
      jest.mocked(cookieUtils.getCookie).mockReturnValue(undefined)
      localStorageMock.getItem.mockReturnValue(null)

      const refreshToken = tokenStorage.getRefreshToken()

      expect(refreshToken).toBeNull()
    })
  })

  describe('isTokenExpired', () => {
    it('should return false for valid tokens', () => {
      const validTokens: StoredTokens = {
        access_token: 'token',
        refresh_token: 'refresh',
        expires_at: Date.now() + 3600000, // 1 hour from now
      }

      const isExpired = tokenStorage.isTokenExpired(validTokens)

      expect(isExpired).toBe(false)
    })

    it('should return true for expired tokens', () => {
      const expiredTokens: StoredTokens = {
        access_token: 'token',
        refresh_token: 'refresh',
        expires_at: Date.now() - 1000, // 1 second ago
      }

      const isExpired = tokenStorage.isTokenExpired(expiredTokens)

      expect(isExpired).toBe(true)
    })

    it('should return true for tokens expiring soon (within buffer)', () => {
      const soonToExpireTokens: StoredTokens = {
        access_token: 'token',
        refresh_token: 'refresh',
        expires_at: Date.now() + 60000, // 1 minute from now (less than 5 minute buffer)
      }

      const isExpired = tokenStorage.isTokenExpired(soonToExpireTokens)

      expect(isExpired).toBe(true)
    })

    it('should return true when no tokens provided', () => {
      const isExpired = tokenStorage.isTokenExpired()

      expect(isExpired).toBe(true)
    })

    it('should check stored tokens when no tokens provided', () => {
      jest.mocked(cookieUtils.getCookie).mockImplementation((key) => {
        if (key === 'iswo_access_token') return 'token'
        if (key === 'iswo_refresh_token') return 'refresh'
        if (key === 'iswo_token_expires')
          return (Date.now() + 3600000).toString()
        return undefined
      })

      const isExpired = tokenStorage.isTokenExpired()

      expect(isExpired).toBe(false)
    })
  })

  describe('hasValidTokens', () => {
    it('should return true for valid stored tokens', () => {
      jest.mocked(cookieUtils.getCookie).mockImplementation((key) => {
        if (key === 'iswo_access_token') return 'token'
        if (key === 'iswo_refresh_token') return 'refresh'
        if (key === 'iswo_token_expires')
          return (Date.now() + 3600000).toString()
        return undefined
      })

      const hasValid = tokenStorage.hasValidTokens()

      expect(hasValid).toBe(true)
    })

    it('should return false for expired tokens', () => {
      jest.mocked(cookieUtils.getCookie).mockImplementation((key) => {
        if (key === 'iswo_access_token') return 'token'
        if (key === 'iswo_refresh_token') return 'refresh'
        if (key === 'iswo_token_expires') return (Date.now() - 1000).toString()
        return undefined
      })

      const hasValid = tokenStorage.hasValidTokens()

      expect(hasValid).toBe(false)
    })

    it('should return false when no tokens exist', () => {
      jest.mocked(cookieUtils.getCookie).mockReturnValue(undefined)
      localStorageMock.getItem.mockReturnValue(null)

      const hasValid = tokenStorage.hasValidTokens()

      expect(hasValid).toBe(false)
    })
  })

  describe('clearTokens', () => {
    it('should clear tokens from both cookies and localStorage', () => {
      tokenStorage.clearTokens()

      expect(cookieUtils.removeCookie).toHaveBeenCalledWith('iswo_access_token')
      expect(cookieUtils.removeCookie).toHaveBeenCalledWith(
        'iswo_refresh_token'
      )
      expect(cookieUtils.removeCookie).toHaveBeenCalledWith(
        'iswo_token_expires'
      )
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        'iswo_auth_tokens'
      )
    })

    it('should handle clearing errors gracefully', () => {
      jest.mocked(cookieUtils.removeCookie).mockImplementation(() => {
        throw new Error('Clear failed')
      })

      expect(() => tokenStorage.clearTokens()).not.toThrow()
    })
  })

  describe('getTimeUntilExpiration', () => {
    it('should return correct time until expiration', () => {
      const expiresAt = Date.now() + 3600000 // 1 hour from now
      jest.mocked(cookieUtils.getCookie).mockImplementation((key) => {
        if (key === 'iswo_access_token') return 'token'
        if (key === 'iswo_refresh_token') return 'refresh'
        if (key === 'iswo_token_expires') return expiresAt.toString()
        return undefined
      })

      const timeUntilExpiration = tokenStorage.getTimeUntilExpiration()

      expect(timeUntilExpiration).toBeGreaterThan(3590000) // Close to 1 hour
      expect(timeUntilExpiration).toBeLessThanOrEqual(3600000)
    })

    it('should return 0 for expired tokens', () => {
      const expiresAt = Date.now() - 1000 // 1 second ago
      jest.mocked(cookieUtils.getCookie).mockImplementation((key) => {
        if (key === 'iswo_access_token') return 'token'
        if (key === 'iswo_refresh_token') return 'refresh'
        if (key === 'iswo_token_expires') return expiresAt.toString()
        return undefined
      })

      const timeUntilExpiration = tokenStorage.getTimeUntilExpiration()

      expect(timeUntilExpiration).toBe(0)
    })

    it('should return 0 when no tokens exist', () => {
      jest.mocked(cookieUtils.getCookie).mockReturnValue(undefined)
      localStorageMock.getItem.mockReturnValue(null)

      const timeUntilExpiration = tokenStorage.getTimeUntilExpiration()

      expect(timeUntilExpiration).toBe(0)
    })
  })

  describe('willExpireSoon', () => {
    it('should return true for tokens expiring within specified time', () => {
      const expiresAt = Date.now() + 60000 // 1 minute from now
      jest.mocked(cookieUtils.getCookie).mockImplementation((key) => {
        if (key === 'iswo_access_token') return 'token'
        if (key === 'iswo_refresh_token') return 'refresh'
        if (key === 'iswo_token_expires') return expiresAt.toString()
        return undefined
      })

      const willExpire = tokenStorage.willExpireSoon(120000) // 2 minutes

      expect(willExpire).toBe(true)
    })

    it('should return false for tokens not expiring soon', () => {
      const expiresAt = Date.now() + 3600000 // 1 hour from now
      jest.mocked(cookieUtils.getCookie).mockImplementation((key) => {
        if (key === 'iswo_access_token') return 'token'
        if (key === 'iswo_refresh_token') return 'refresh'
        if (key === 'iswo_token_expires') return expiresAt.toString()
        return undefined
      })

      const willExpire = tokenStorage.willExpireSoon(300000) // 5 minutes

      expect(willExpire).toBe(false)
    })

    it('should use default 5 minute threshold', () => {
      const expiresAt = Date.now() + 60000 // 1 minute from now
      jest.mocked(cookieUtils.getCookie).mockImplementation((key) => {
        if (key === 'iswo_access_token') return 'token'
        if (key === 'iswo_refresh_token') return 'refresh'
        if (key === 'iswo_token_expires') return expiresAt.toString()
        return undefined
      })

      const willExpire = tokenStorage.willExpireSoon()

      expect(willExpire).toBe(true)
    })
  })

  describe('updateAccessToken', () => {
    beforeEach(() => {
      // Set up existing tokens
      jest.mocked(cookieUtils.getCookie).mockImplementation((key) => {
        if (key === 'iswo_access_token') return 'old-token'
        if (key === 'iswo_refresh_token') return 'refresh-token'
        if (key === 'iswo_token_expires')
          return (Date.now() + 3600000).toString()
        return undefined
      })
    })

    it('should update only the access token', () => {
      tokenStorage.updateAccessToken('new-access-token', 7200)

      expect(cookieUtils.setCookie).toHaveBeenCalledWith(
        'iswo_access_token',
        'new-access-token',
        7200
      )
      expect(cookieUtils.setCookie).toHaveBeenCalledWith(
        'iswo_refresh_token',
        'refresh-token',
        7200
      )
    })

    it('should throw error when no existing tokens', () => {
      jest.mocked(cookieUtils.getCookie).mockReturnValue(undefined)
      localStorageMock.getItem.mockReturnValue(null)

      expect(() => tokenStorage.updateAccessToken('new-token', 3600)).toThrow(
        'No existing tokens to update'
      )
    })
  })

  describe('getTokenInfo', () => {
    it('should return correct token info for valid tokens', () => {
      const expiresAt = Date.now() + 3600000
      jest.mocked(cookieUtils.getCookie).mockImplementation((key) => {
        if (key === 'iswo_access_token') return 'token'
        if (key === 'iswo_refresh_token') return 'refresh'
        if (key === 'iswo_token_expires') return expiresAt.toString()
        return undefined
      })

      const tokenInfo = tokenStorage.getTokenInfo()

      expect(tokenInfo.hasTokens).toBe(true)
      expect(tokenInfo.isExpired).toBe(false)
      expect(tokenInfo.expiresAt).toBe(new Date(expiresAt).toISOString())
      expect(tokenInfo.timeUntilExpiration).toBeGreaterThan(0)
    })

    it('should return correct token info when no tokens exist', () => {
      jest.mocked(cookieUtils.getCookie).mockReturnValue(undefined)
      localStorageMock.getItem.mockReturnValue(null)

      const tokenInfo = tokenStorage.getTokenInfo()

      expect(tokenInfo.hasTokens).toBe(false)
      expect(tokenInfo.isExpired).toBe(true)
      expect(tokenInfo.expiresAt).toBeNull()
      expect(tokenInfo.timeUntilExpiration).toBe(0)
    })
  })
})
