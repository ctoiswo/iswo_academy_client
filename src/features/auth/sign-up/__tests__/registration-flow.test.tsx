import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignUp } from '../index'
import * as apiClient from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth-store'

// Mock dependencies
vi.mock('@/lib/api-client')
vi.mock('@/stores/auth-store')
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
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
const mockUseAuthStore = vi.mocked(useAuthStore)

describe('Registration Flow Integration', () => {
  beforeEach(() => {
    // Mock auth store
    mockUseAuthStore.mockReturnValue({
      register: vi.fn(),
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      refreshTokens: vi.fn(),
      setUser: vi.fn(),
      setTokens: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
      reset: vi.fn(),
      initialize: vi.fn(),
      auth: {
        user: null,
        setUser: vi.fn(),
        accessToken: '',
        setAccessToken: vi.fn(),
        refreshToken: '',
        setRefreshToken: vi.fn(),
        resetAccessToken: vi.fn(),
        reset: vi.fn(),
      },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the complete sign-up page', () => {
    render(<SignUp />)

    expect(screen.getAllByText(/create an account/i)[0]).toBeInTheDocument()
    expect(screen.getByText(/enter your email and password to create an account/i)).toBeInTheDocument()
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByText(/terms of service/i)).toBeInTheDocument()
    expect(screen.getByText(/privacy policy/i)).toBeInTheDocument()
  })

  it('completes successful registration flow', async () => {
    const user = userEvent.setup()
    const mockRegisterResponse = {
      message: 'Registration successful! Please check your email to confirm your account.',
      user: {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        full_name: 'John Doe',
        initials: 'JD',
        confirmed: false,
        is_super_admin: false,
        created_at: '2024-01-01T00:00:00Z',
        last_login_at: null,
      }
    }

    const mockRegister = vi.fn().mockResolvedValue(mockRegisterResponse)
    mockUseAuthStore.mockReturnValue({
      ...mockUseAuthStore(),
      register: mockRegister,
    })

    render(<SignUp />)

    // Fill out the registration form
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/^email$/i), 'john.doe@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'ValidPassword123')
    await user.type(screen.getByLabelText(/confirm password/i), 'ValidPassword123')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)

    // Wait for the registration to complete
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: 'ValidPassword123',
        password_confirmation: 'ValidPassword123',
      })
    })

    // Check that success message is displayed
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /registration successful!/i })).toBeInTheDocument()
      expect(screen.getByText(/please check your email to confirm your account/i)).toBeInTheDocument()
    })
  })

  it('handles email already taken error', async () => {
    const user = userEvent.setup()
    const mockError = {
      type: 'ValidationError',
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: ['Email has already been taken']
    }

    const mockRegister = vi.fn().mockRejectedValue(mockError)
    mockUseAuthStore.mockReturnValue({
      ...mockUseAuthStore(),
      register: mockRegister,
    })

    render(<SignUp />)

    // Fill out the form with existing email
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/^email$/i), 'existing@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'ValidPassword123')
    await user.type(screen.getByLabelText(/confirm password/i), 'ValidPassword123')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled()
    })

    // The form should remain visible (not show success message)
    expect(screen.queryByRole('heading', { name: /registration successful!/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('handles server error during registration', async () => {
    const user = userEvent.setup()
    const mockError = {
      type: 'ServerError',
      message: 'Internal server error',
      code: 'SERVER_ERROR'
    }

    const mockRegister = vi.fn().mockRejectedValue(mockError)
    mockUseAuthStore.mockReturnValue({
      ...mockUseAuthStore(),
      register: mockRegister,
    })

    render(<SignUp />)

    // Fill out the form
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/^email$/i), 'john.doe@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'ValidPassword123')
    await user.type(screen.getByLabelText(/confirm password/i), 'ValidPassword123')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled()
    })

    // The form should remain visible
    expect(screen.queryByRole('heading', { name: /registration successful!/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('handles network error during registration', async () => {
    const user = userEvent.setup()
    const mockError = {
      type: 'NetworkError',
      message: 'Network connection failed',
      code: 'NETWORK_ERROR'
    }

    const mockRegister = vi.fn().mockRejectedValue(mockError)
    mockUseAuthStore.mockReturnValue({
      ...mockUseAuthStore(),
      register: mockRegister,
    })

    render(<SignUp />)

    // Fill out the form
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/^email$/i), 'john.doe@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'ValidPassword123')
    await user.type(screen.getByLabelText(/confirm password/i), 'ValidPassword123')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled()
    })

    // The form should remain visible
    expect(screen.queryByRole('heading', { name: /registration successful!/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('allows user to navigate back to form after success', async () => {
    const user = userEvent.setup()
    const mockRegisterResponse = {
      message: 'Registration successful! Please check your email.',
    }

    const mockRegister = vi.fn().mockResolvedValue(mockRegisterResponse)
    mockUseAuthStore.mockReturnValue({
      ...mockUseAuthStore(),
      register: mockRegister,
    })

    render(<SignUp />)

    // Complete registration
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/^email$/i), 'john.doe@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'ValidPassword123')
    await user.type(screen.getByLabelText(/confirm password/i), 'ValidPassword123')

    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /registration successful!/i })).toBeInTheDocument()
    })

    // Click "Register Another Account"
    const registerAnotherButton = screen.getByRole('button', { name: /register another account/i })
    await user.click(registerAnotherButton)

    // Should be back to the form
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: /registration successful!/i })).not.toBeInTheDocument()
    })
  })

  it('validates all form fields before submission', async () => {
    const user = userEvent.setup()
    render(<SignUp />)

    // Try to submit empty form
    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })

    // Form should not be submitted
    const mockRegister = mockUseAuthStore().register
    expect(mockRegister).not.toHaveBeenCalled()
  })
})