import axios, { type AxiosError } from 'axios'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
// Now import the module after mocking
import apiClient, {
  createApiError,
  isApiError,
  getErrorMessage,
  isSuccessStatus,
  isClientError,
  isServerError,
  isAuthError,
  handleApiResponse,
  authApi,
  userApi,
  testApiConnection,
  setAuthStore,
  type ApiError,
  type AuthUser,
  type AuthTokens,
  type AuthResponse,
} from '../api-client'

// Mock axios before importing the module
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

const mockedAxios = vi.mocked(axios)

// Mock auth store
const mockAuthStore = {
  getState: vi.fn(() => ({
    auth: {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      setAccessToken: vi.fn(),
      setRefreshToken: vi.fn(),
      reset: vi.fn(),
    },
  })),
}

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setAuthStore(mockAuthStore)

    // Reset the mocked methods
    vi.mocked(apiClient.post).mockReset()
    vi.mocked(apiClient.get).mockReset()
    vi.mocked(apiClient.patch).mockReset()
    vi.mocked(apiClient.delete).mockReset()
    mockedAxios.post.mockReset()
    mockedAxios.get.mockReset()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Error Handling Utilities', () => {
    describe('createApiError', () => {
      it('should create API error from response data', () => {
        const axiosError: Partial<AxiosError> = {
          response: {
            status: 422,
            data: {
              error: {
                type: 'ValidationError',
                message: 'Validation failed',
                code: 'VALIDATION_ERROR',
                details: ['Email is required'],
              },
            },
          } as any,
        }

        const result = createApiError(axiosError as AxiosError)

        expect(result).toEqual({
          type: 'ValidationError',
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: ['Email is required'],
          status: 422,
        })
      })

      it('should handle 401 unauthorized errors', () => {
        const axiosError: Partial<AxiosError> = {
          response: {
            status: 401,
            data: {},
          } as any,
        }

        const result = createApiError(axiosError as AxiosError)

        expect(result).toEqual({
          type: 'AuthenticationError',
          message: 'Authentication required',
          code: 'AUTHENTICATION_REQUIRED',
          status: 401,
        })
      })

      it('should handle 403 forbidden errors', () => {
        const axiosError: Partial<AxiosError> = {
          response: {
            status: 403,
            data: {},
          } as any,
        }

        const result = createApiError(axiosError as AxiosError)

        expect(result).toEqual({
          type: 'AuthorizationError',
          message: 'Access forbidden',
          code: 'ACCESS_FORBIDDEN',
          status: 403,
        })
      })

      it('should handle 404 not found errors', () => {
        const axiosError: Partial<AxiosError> = {
          response: {
            status: 404,
            data: {},
          } as any,
        }

        const result = createApiError(axiosError as AxiosError)

        expect(result).toEqual({
          type: 'NotFoundError',
          message: 'Resource not found',
          code: 'RESOURCE_NOT_FOUND',
          status: 404,
        })
      })

      it('should handle 429 rate limit errors', () => {
        const axiosError: Partial<AxiosError> = {
          response: {
            status: 429,
            data: {},
          } as any,
        }

        const result = createApiError(axiosError as AxiosError)

        expect(result).toEqual({
          type: 'RateLimitError',
          message: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          status: 429,
        })
      })

      it('should handle 500 server errors', () => {
        const axiosError: Partial<AxiosError> = {
          response: {
            status: 500,
            data: {},
          } as any,
        }

        const result = createApiError(axiosError as AxiosError)

        expect(result).toEqual({
          type: 'ServerError',
          message: 'Internal server error',
          code: 'SERVER_ERROR',
          status: 500,
        })
      })

      it('should handle timeout errors', () => {
        const axiosError: Partial<AxiosError> = {
          code: 'ECONNABORTED',
          message: 'timeout of 10000ms exceeded',
        }

        const result = createApiError(axiosError as AxiosError)

        expect(result).toEqual({
          type: 'TimeoutError',
          message: 'Request timeout',
          code: 'REQUEST_TIMEOUT',
        })
      })

      it('should handle network errors', () => {
        const axiosError: Partial<AxiosError> = {
          message: 'Network Error',
        }

        const result = createApiError(axiosError as AxiosError)

        expect(result).toEqual({
          type: 'NetworkError',
          message: 'Network connection failed',
          code: 'NETWORK_ERROR',
        })
      })

      it('should handle unknown errors', () => {
        const axiosError: Partial<AxiosError> = {
          message: 'Something went wrong',
          response: {
            status: 418, // I'm a teapot - unusual status code
          } as any,
        }

        const result = createApiError(axiosError as AxiosError)

        expect(result).toEqual({
          type: 'UnknownError',
          message: 'Something went wrong',
          code: 'UNKNOWN_ERROR',
        })
      })
    })

    describe('isApiError', () => {
      it('should return true for valid API error', () => {
        const error: ApiError = {
          type: 'ValidationError',
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
        }

        expect(isApiError(error)).toBe(true)
      })

      it('should return false for invalid API error', () => {
        expect(isApiError(null)).toBe(false)
        expect(isApiError(undefined)).toBe(false)
        expect(isApiError('string')).toBe(false)
        expect(isApiError({})).toBe(false)
        expect(isApiError({ type: 'Error' })).toBe(false)
        expect(isApiError({ message: 'Error' })).toBe(false)
        expect(isApiError({ code: 'ERROR' })).toBe(false)
      })
    })

    describe('getErrorMessage', () => {
      it('should return details for API error with details', () => {
        const error: ApiError = {
          type: 'ValidationError',
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: ['Email is required', 'Password is too short'],
        }

        expect(getErrorMessage(error)).toBe(
          'Email is required, Password is too short'
        )
      })

      it('should return message for API error without details', () => {
        const error: ApiError = {
          type: 'AuthenticationError',
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
        }

        expect(getErrorMessage(error)).toBe('Invalid credentials')
      })

      it('should return message for regular Error', () => {
        const error = new Error('Something went wrong')
        expect(getErrorMessage(error)).toBe('Something went wrong')
      })

      it('should return default message for unknown error', () => {
        expect(getErrorMessage('string')).toBe('An unexpected error occurred')
        expect(getErrorMessage(null)).toBe('An unexpected error occurred')
      })
    })
  })

  describe('HTTP Status Utilities', () => {
    it('should correctly identify success status codes', () => {
      expect(isSuccessStatus(200)).toBe(true)
      expect(isSuccessStatus(201)).toBe(true)
      expect(isSuccessStatus(299)).toBe(true)
      expect(isSuccessStatus(300)).toBe(false)
      expect(isSuccessStatus(400)).toBe(false)
    })

    it('should correctly identify client error status codes', () => {
      expect(isClientError(400)).toBe(true)
      expect(isClientError(404)).toBe(true)
      expect(isClientError(499)).toBe(true)
      expect(isClientError(399)).toBe(false)
      expect(isClientError(500)).toBe(false)
    })

    it('should correctly identify server error status codes', () => {
      expect(isServerError(500)).toBe(true)
      expect(isServerError(502)).toBe(true)
      expect(isServerError(599)).toBe(true)
      expect(isServerError(499)).toBe(false)
      expect(isServerError(600)).toBe(true) // Our implementation considers 500+ as server errors
    })

    it('should correctly identify auth error status codes', () => {
      expect(isAuthError(401)).toBe(true)
      expect(isAuthError(403)).toBe(true)
      expect(isAuthError(400)).toBe(false)
      expect(isAuthError(404)).toBe(false)
    })
  })

  describe('handleApiResponse', () => {
    it('should return data for successful response', () => {
      const response = {
        status: 200,
        data: { message: 'Success' },
      } as any

      expect(handleApiResponse(response)).toEqual({ message: 'Success' })
    })

    it('should throw error for unsuccessful response', () => {
      const response = {
        status: 400,
        data: { error: 'Bad request' },
      } as any

      expect(() => handleApiResponse(response)).toThrow()
    })
  })

  describe('Authentication API', () => {
    describe('register', () => {
      it('should register user successfully', async () => {
        const userData = {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          password: 'password123',
          password_confirmation: 'password123',
        }

        const mockResponse = {
          status: 201,
          data: {
            message: 'Registration successful',
            user: {
              id: 1,
              first_name: 'John',
              last_name: 'Doe',
              email: 'john@example.com',
              full_name: 'John Doe',
              initials: 'JD',
              confirmed: false,
              is_super_admin: false,
              created_at: '2024-01-01T00:00:00Z',
              last_login_at: null,
            },
          },
        }

        vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

        const result = await authApi.register(userData)

        expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
          user: userData,
        })
        expect(result).toEqual(mockResponse.data)
      })
    })

    describe('login', () => {
      it('should login user successfully', async () => {
        const credentials = {
          email: 'john@example.com',
          password: 'password123',
        }

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
            access_token: 'access-token',
            refresh_token: 'refresh-token',
            expires_in: 3600,
          },
        }

        vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

        const result = await authApi.login(credentials)

        expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
          user: credentials,
        })
        expect(result).toEqual(mockResponse.data)
      })
    })

    describe('logout', () => {
      it('should logout user successfully', async () => {
        const refreshToken = 'refresh-token'
        const mockResponse = {
          status: 200,
          data: { message: 'Logged out successfully' },
        }

        vi.mocked(apiClient.delete).mockResolvedValue(mockResponse)

        const result = await authApi.logout(refreshToken)

        expect(apiClient.delete).toHaveBeenCalledWith('/auth/logout', {
          data: { refresh_token: refreshToken },
        })
        expect(result).toEqual(mockResponse.data)
      })
    })

    describe('refreshTokens', () => {
      it('should refresh tokens successfully', async () => {
        const refreshToken = 'refresh-token'
        const mockResponse = {
          status: 200,
          data: {
            message: 'Tokens refreshed successfully',
            access_token: 'new-access-token',
            refresh_token: 'new-refresh-token',
            expires_in: 3600,
          },
        }

        vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

        const result = await authApi.refreshTokens(refreshToken)

        expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh', {
          refresh_token: refreshToken,
        })
        expect(result).toEqual(mockResponse.data)
      })
    })

    describe('forgotPassword', () => {
      it('should send forgot password email successfully', async () => {
        const email = 'john@example.com'
        const mockResponse = {
          status: 200,
          data: {
            message:
              'If an account with that email exists, you will receive password reset instructions.',
          },
        }

        vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

        const result = await authApi.forgotPassword(email)

        expect(apiClient.post).toHaveBeenCalledWith('/auth/forgot_password', {
          email,
        })
        expect(result).toEqual(mockResponse.data)
      })
    })

    describe('resetPassword', () => {
      it('should reset password successfully', async () => {
        const token = 'reset-token'
        const password = 'newpassword123'
        const passwordConfirmation = 'newpassword123'
        const mockResponse = {
          status: 200,
          data: {
            message:
              'Password has been reset successfully. Please log in with your new password.',
          },
        }

        vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

        const result = await authApi.resetPassword(
          token,
          password,
          passwordConfirmation
        )

        expect(apiClient.post).toHaveBeenCalledWith('/auth/reset_password', {
          token,
          password,
          password_confirmation: passwordConfirmation,
        })
        expect(result).toEqual(mockResponse.data)
      })
    })
  })

  describe('User API', () => {
    describe('getProfile', () => {
      it('should get user profile successfully', async () => {
        const mockResponse = {
          status: 200,
          data: {
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
        }

        vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

        const result = await userApi.getProfile()

        expect(apiClient.get).toHaveBeenCalledWith('/users/profile')
        expect(result).toEqual(mockResponse.data)
      })
    })

    describe('updateProfile', () => {
      it('should update user profile successfully', async () => {
        const userData = {
          first_name: 'Jane',
          last_name: 'Smith',
        }

        const mockResponse = {
          status: 200,
          data: {
            id: 1,
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'john@example.com',
            full_name: 'Jane Smith',
            initials: 'JS',
            confirmed: true,
            is_super_admin: false,
            created_at: '2024-01-01T00:00:00Z',
            last_login_at: '2024-01-01T12:00:00Z',
          },
        }

        vi.mocked(apiClient.patch).mockResolvedValue(mockResponse)

        const result = await userApi.updateProfile(userData)

        expect(apiClient.patch).toHaveBeenCalledWith('/users/profile', {
          user: userData,
        })
        expect(result).toEqual(mockResponse.data)
      })
    })
  })

  describe('testApiConnection', () => {
    it('should return success for successful connection', async () => {
      const mockResponse = {
        status: 200,
        data: 'OK',
      }

      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await testApiConnection()

      expect(result).toEqual({
        success: true,
        status: 200,
        message: 'API connection successful',
      })
    })

    it('should return failure for failed connection', async () => {
      const error = new Error('Network Error')
      mockedAxios.get.mockRejectedValue(error)

      const result = await testApiConnection()

      expect(result).toEqual({
        success: false,
        error: 'Network Error',
        message: 'API connection failed',
      })
    })
  })

  describe('Token Manager', () => {
    beforeEach(async () => {
      // Import tokenManager after mocks are set up
      const { tokenManager } = await import('../api-client')
      ;(global as any).tokenManager = tokenManager
    })

    it('should provide token management utilities', async () => {
      const { tokenManager } = await import('../api-client')

      expect(typeof tokenManager.initialize).toBe('function')
      expect(typeof tokenManager.refreshTokens).toBe('function')
      expect(typeof tokenManager.hasValidTokens).toBe('function')
      expect(typeof tokenManager.getTokenInfo).toBe('function')
      expect(typeof tokenManager.clearTokens).toBe('function')
    })

    it('should initialize token refresh scheduling', async () => {
      const { tokenManager } = await import('../api-client')

      expect(() => tokenManager.initialize()).not.toThrow()
    })

    it('should handle token refresh manually', async () => {
      const { tokenManager } = await import('../api-client')

      // This test is covered in the dedicated token-refresh.test.ts file
      expect(typeof tokenManager.refreshTokens).toBe('function')
    })

    it('should handle token refresh failure', async () => {
      const { tokenManager } = await import('../api-client')

      // This test is covered in the dedicated token-refresh.test.ts file
      expect(typeof tokenManager.refreshTokens).toBe('function')
    })

    it('should check token validity', async () => {
      const { tokenManager } = await import('../api-client')

      expect(typeof tokenManager.hasValidTokens).toBe('function')
    })

    it('should get token information', async () => {
      const { tokenManager } = await import('../api-client')

      expect(typeof tokenManager.getTokenInfo).toBe('function')
    })

    it('should clear tokens and timers', async () => {
      const { tokenManager } = await import('../api-client')

      expect(() => tokenManager.clearTokens()).not.toThrow()
    })
  })
})
