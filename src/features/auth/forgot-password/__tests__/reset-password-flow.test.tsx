import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ResetPassword } from '../reset-password'
import * as apiClient from '@/lib/api-client'

// Create mock functions first
const mockNavigate = vi.fn()
const mockUseSearch = vi.fn()

// Mock dependencies
vi.mock('@/lib/api-client')
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useSearch: () => mockUseSearch(),
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const mockAuthApi = vi.mocked(apiClient.authApi)
const mockGetErrorMessage = vi.mocked(apiClient.getErrorMessage)

describe('Reset Password Flow Integration', () => {
  beforeEach(() => {
    // Reset mocks
    mockNavigate.mockClear()
    
    // Mock getErrorMessage to return the error message
    mockGetErrorMessage.mockImplementation((error: any) => {
      if (error?.message) return error.message
      if (error?.details?.length > 0) return error.details.join(', ')
      return 'An unexpected error occurred'
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('with valid token', () => {
    beforeEach(() => {
      // Mock search with valid token
      mockUseSearch.mockReturnValue({ token: 'valid-reset-token-123' })
    })

    it('renders the complete reset password page', () => {
      render(<ResetPassword />)

      // Check for the card title
      expect(screen.getByText('Reset Your Password')).toBeInTheDocument()
      expect(screen.getByText(/enter your new password below/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/enter your new password/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/confirm your new password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument()
      expect(screen.getByText(/remember your password/i)).toBeInTheDocument()
    })

    it('completes successful password reset flow', async () => {
      const user = userEvent.setup()
      const testPassword = 'NewPassword123'
      const mockResponse = {
        message: 'Password has been reset successfully. Please log in with your new password.'
      }

      // Mock successful API call
      mockAuthApi.resetPassword.mockResolvedValue(mockResponse)

      render(<ResetPassword />)

      // Fill out the form
      await user.type(screen.getByPlaceholderText(/enter your new password/i), testPassword)
      await user.type(screen.getByPlaceholderText(/confirm your new password/i), testPassword)

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /reset password/i })
      await user.click(submitButton)

      // Wait for the API call
      await waitFor(() => {
        expect(mockAuthApi.resetPassword).toHaveBeenCalledWith(
          'valid-reset-token-123',
          testPassword,
          testPassword
        )
      })

      // Should navigate to sign-in page
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/sign-in' })
      })
    })

    it('validates password requirements', async () => {
      const user = userEvent.setup()
      render(<ResetPassword />)

      // Try with password that doesn't meet requirements
      await user.type(screen.getByPlaceholderText(/enter your new password/i), 'weak')
      await user.type(screen.getByPlaceholderText(/confirm your new password/i), 'weak')

      // Try to submit
      const submitButton = screen.getByRole('button', { name: /reset password/i })
      await user.click(submitButton)

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
      })

      // API should not be called
      expect(mockAuthApi.resetPassword).not.toHaveBeenCalled()
    })

    it('validates password confirmation match', async () => {
      const user = userEvent.setup()
      render(<ResetPassword />)

      // Enter mismatched passwords
      await user.type(screen.getByPlaceholderText(/enter your new password/i), 'ValidPassword123')
      await user.type(screen.getByPlaceholderText(/confirm your new password/i), 'DifferentPassword123')

      // Try to submit
      const submitButton = screen.getByRole('button', { name: /reset password/i })
      await user.click(submitButton)

      // Should show password mismatch error
      await waitFor(() => {
        expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument()
      })

      // API should not be called
      expect(mockAuthApi.resetPassword).not.toHaveBeenCalled()
    })

    it('handles invalid token error', async () => {
      const user = userEvent.setup()
      const testPassword = 'NewPassword123'
      const mockError = {
        type: 'AuthenticationError',
        message: 'Invalid or expired reset token',
        code: 'INVALID_RESET_TOKEN'
      }

      // Mock API error
      mockAuthApi.resetPassword.mockRejectedValue(mockError)

      render(<ResetPassword />)

      // Fill out the form
      await user.type(screen.getByPlaceholderText(/enter your new password/i), testPassword)
      await user.type(screen.getByPlaceholderText(/confirm your new password/i), testPassword)

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /reset password/i })
      await user.click(submitButton)

      // Wait for the API call
      await waitFor(() => {
        expect(mockAuthApi.resetPassword).toHaveBeenCalled()
      })

      // Should redirect to forgot password page after 3 seconds
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/forgot-password' })
      }, { timeout: 4000 })
    })
  })

  describe('without token', () => {
    beforeEach(() => {
      // Mock search without token
      mockUseSearch.mockReturnValue({})
    })

    it('renders invalid reset link page when token is missing', () => {
      render(<ResetPassword />)

      // Check for error state
      expect(screen.getByText('Invalid Reset Link')).toBeInTheDocument()
      expect(screen.getByText(/the password reset link is invalid or missing/i)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /request new password reset/i })).toBeInTheDocument()

      // Should not show the reset form
      expect(screen.queryByPlaceholderText(/enter your new password/i)).not.toBeInTheDocument()
      expect(screen.queryByPlaceholderText(/confirm your new password/i)).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /reset password/i })).not.toBeInTheDocument()
    })

    it('has correct navigation link for invalid token', () => {
      render(<ResetPassword />)

      // Check for forgot password link
      const forgotPasswordLink = screen.getByRole('link', { name: /request new password reset/i })
      expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password')
    })
  })
})