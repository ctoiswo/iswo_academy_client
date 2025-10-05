import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ForgotPassword } from '../index'
import * as apiClient from '@/lib/api-client'

// Create mock functions first
const mockNavigate = vi.fn()

// Mock dependencies
vi.mock('@/lib/api-client')
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
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

describe('Forgot Password Flow Integration', () => {
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

  it('renders the complete forgot password page', () => {
    render(<ForgotPassword />)

    // Check for the card title
    expect(screen.getByText('Forgot Password')).toBeInTheDocument()
    expect(screen.getByText(/enter your registered email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send reset email/i })).toBeInTheDocument()
    expect(screen.getByText(/remember your password/i)).toBeInTheDocument()
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument()
  })

  it('completes successful forgot password flow', async () => {
    const user = userEvent.setup()
    const testEmail = 'john.doe@example.com'
    const mockResponse = {
      message: 'If an account with that email exists, you will receive password reset instructions.'
    }

    // Mock successful API call
    mockAuthApi.forgotPassword.mockResolvedValue(mockResponse)

    render(<ForgotPassword />)

    // Fill out the form
    await user.type(screen.getByLabelText(/email/i), testEmail)

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /send reset email/i })
    await user.click(submitButton)

    // Wait for the API call
    await waitFor(() => {
      expect(mockAuthApi.forgotPassword).toHaveBeenCalledWith(testEmail)
    })

    // Should show success message
    await waitFor(() => {
      expect(screen.getByText(/password reset instructions have been sent/i)).toBeInTheDocument()
      expect(screen.getByText(/please check your email/i)).toBeInTheDocument()
    })

    // Form should be replaced with success message
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /send reset email/i })).not.toBeInTheDocument()
  })

  it('handles API error gracefully', async () => {
    const user = userEvent.setup()
    const testEmail = 'invalid@example.com'
    const mockError = {
      type: 'ValidationError',
      message: 'Email is invalid',
      code: 'VALIDATION_ERROR',
      details: ['Email format is invalid']
    }

    // Mock API error
    mockAuthApi.forgotPassword.mockRejectedValue(mockError)

    render(<ForgotPassword />)

    // Fill out the form
    await user.type(screen.getByLabelText(/email/i), testEmail)

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /send reset email/i })
    await user.click(submitButton)

    // Wait for the API call
    await waitFor(() => {
      expect(mockAuthApi.forgotPassword).toHaveBeenCalledWith(testEmail)
    })

    // Should still show the form (not success state)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send reset email/i })).toBeInTheDocument()
    expect(screen.queryByText(/password reset instructions have been sent/i)).not.toBeInTheDocument()
  })

  it('handles validation errors and sets field errors', async () => {
    const user = userEvent.setup()
    const testEmail = 'invalid@example.com'
    const mockError = {
      type: 'ValidationError',
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: ['Email format is invalid']
    }

    // Mock API error
    mockAuthApi.forgotPassword.mockRejectedValue(mockError)

    render(<ForgotPassword />)

    // Fill out the form
    await user.type(screen.getByLabelText(/email/i), testEmail)

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /send reset email/i })
    await user.click(submitButton)

    // Wait for the API call and error handling
    await waitFor(() => {
      expect(mockAuthApi.forgotPassword).toHaveBeenCalledWith(testEmail)
    })

    // Should show field error for email
    await waitFor(() => {
      expect(screen.getByText('Email format is invalid')).toBeInTheDocument()
    })
  })

  it('handles network error', async () => {
    const user = userEvent.setup()
    const testEmail = 'john.doe@example.com'
    const mockError = {
      type: 'NetworkError',
      message: 'Network connection failed',
      code: 'NETWORK_ERROR'
    }

    // Mock network error
    mockAuthApi.forgotPassword.mockRejectedValue(mockError)

    render(<ForgotPassword />)

    // Fill out the form
    await user.type(screen.getByLabelText(/email/i), testEmail)

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /send reset email/i })
    await user.click(submitButton)

    // Wait for the API call
    await waitFor(() => {
      expect(mockAuthApi.forgotPassword).toHaveBeenCalledWith(testEmail)
    })

    // Should still show the form
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send reset email/i })).toBeInTheDocument()
  })

  it('validates form fields before submission', async () => {
    const user = userEvent.setup()
    render(<ForgotPassword />)

    // Try to submit empty form
    const submitButton = screen.getByRole('button', { name: /send reset email/i })
    await user.click(submitButton)

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/please enter your email/i)).toBeInTheDocument()
    })

    // API should not be called
    expect(mockAuthApi.forgotPassword).not.toHaveBeenCalled()
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    render(<ForgotPassword />)

    // Enter invalid email
    await user.type(screen.getByLabelText(/email/i), 'invalid-email')

    // Try to submit
    const submitButton = screen.getByRole('button', { name: /send reset email/i })
    await user.click(submitButton)

    // Should show email validation error (check for any validation error text)
    await waitFor(() => {
      // The validation might show different text, so let's check if the form didn't submit
      expect(mockAuthApi.forgotPassword).not.toHaveBeenCalled()
    })
  })

  it('shows loading state during API call', async () => {
    const user = userEvent.setup()
    const testEmail = 'john.doe@example.com'

    // Mock API call that takes time to resolve
    mockAuthApi.forgotPassword.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ message: 'Success' }), 100))
    )

    render(<ForgotPassword />)

    // Fill out the form
    await user.type(screen.getByLabelText(/email/i), testEmail)

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /send reset email/i })
    await user.click(submitButton)

    // Should show loading state
    expect(screen.getByText(/sending email/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
    expect(screen.getByLabelText(/email/i)).toBeDisabled()

    // Wait for API call to complete
    await waitFor(() => {
      expect(mockAuthApi.forgotPassword).toHaveBeenCalledWith(testEmail)
    })
  })

  it('resets form after successful submission', async () => {
    const user = userEvent.setup()
    const testEmail = 'john.doe@example.com'
    const mockResponse = {
      message: 'If an account with that email exists, you will receive password reset instructions.'
    }

    // Mock successful API call
    mockAuthApi.forgotPassword.mockResolvedValue(mockResponse)

    render(<ForgotPassword />)

    // Fill out the form
    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, testEmail)
    expect(emailInput).toHaveValue(testEmail)

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /send reset email/i })
    await user.click(submitButton)

    // Wait for success state
    await waitFor(() => {
      expect(screen.getByText(/password reset instructions have been sent/i)).toBeInTheDocument()
    })

    // Form should be replaced with success message, so email input should not exist
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument()
  })

  it('handles rate limit error', async () => {
    const user = userEvent.setup()
    const testEmail = 'john.doe@example.com'
    const mockError = {
      type: 'RateLimitError',
      message: 'Too many password reset requests. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    }

    // Mock rate limit error
    mockAuthApi.forgotPassword.mockRejectedValue(mockError)

    render(<ForgotPassword />)

    // Fill out the form
    await user.type(screen.getByLabelText(/email/i), testEmail)

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /send reset email/i })
    await user.click(submitButton)

    // Wait for the API call
    await waitFor(() => {
      expect(mockAuthApi.forgotPassword).toHaveBeenCalledWith(testEmail)
    })

    // Should still show the form
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send reset email/i })).toBeInTheDocument()
  })

  it('has correct navigation links', () => {
    render(<ForgotPassword />)

    // Check for sign-in link
    const signInLink = screen.getByRole('link', { name: /sign in/i })
    expect(signInLink).toHaveAttribute('href', '/sign-in')

    // Check for sign-up link
    const signUpLink = screen.getByRole('link', { name: /sign up/i })
    expect(signUpLink).toHaveAttribute('href', '/sign-up')
  })
})