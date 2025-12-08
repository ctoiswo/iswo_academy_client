import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useAuthStore } from '@/stores/auth-store'
import * as apiClient from '@/lib/api-client'
import { UserAuthForm } from '../user-auth-form'

// Create mock functions first
const mockNavigate = vi.fn()

// Mock dependencies
vi.mock('@/stores/auth-store')
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

const mockUseAuthStore = vi.mocked(useAuthStore)

describe('UserAuthForm', () => {
  beforeEach(() => {
    // Reset mocks
    mockNavigate.mockClear()

    // Mock auth store
    mockUseAuthStore.mockReturnValue({
      login: vi.fn(),
      register: vi.fn(),
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
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

  it('renders all form fields and buttons', () => {
    render(<UserAuthForm />)

    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /iniciar sesión/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/olvidaste tu contraseña/i)).toBeInTheDocument()
    expect(screen.getByText(/o continúa con/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /github/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /facebook/i })
    ).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<UserAuthForm />)

    // Try to submit empty form
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)

    // Should show validation errors
    await waitFor(() => {
      expect(
        screen.getByText(/por favor ingresa tu correo electrónico/i)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/por favor ingresa tu contraseña/i)
      ).toBeInTheDocument()
    })

    // Should not call login
    const mockLogin = mockUseAuthStore().login
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    render(<UserAuthForm />)

    // Enter invalid email
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'invalid-email'
    )
    await user.type(screen.getByLabelText(/contraseña/i), 'ValidPassword123')

    // Try to submit
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)

    // Should show email validation error
    await waitFor(() => {
      expect(
        screen.getByText(
          /por favor ingresa una dirección de correo electrónico válida/i
        )
      ).toBeInTheDocument()
    })

    // Should not call login
    const mockLogin = mockUseAuthStore().login
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('validates password length', async () => {
    const user = userEvent.setup()
    render(<UserAuthForm />)

    // Enter short password
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'john.doe@example.com'
    )
    await user.type(screen.getByLabelText(/contraseña/i), '123')

    // Try to submit
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)

    // Should show password validation error
    await waitFor(() => {
      expect(
        screen.getByText(/la contraseña debe tener al menos 7 caracteres/i)
      ).toBeInTheDocument()
    })

    // Should not call login
    const mockLogin = mockUseAuthStore().login
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('calls login with correct credentials', async () => {
    const user = userEvent.setup()
    const mockLogin = vi.fn().mockResolvedValue(undefined)

    mockUseAuthStore.mockReturnValue({
      ...mockUseAuthStore(),
      login: mockLogin,
      error: null,
      setError: vi.fn(),
    })

    render(<UserAuthForm />)

    // Fill out the form
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'john.doe@example.com'
    )
    await user.type(screen.getByLabelText(/contraseña/i), 'ValidPassword123')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)

    // Should call login with correct credentials
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'john.doe@example.com',
        password: 'ValidPassword123',
      })
    })
  })

  it('navigates to default route after successful login', async () => {
    const user = userEvent.setup()
    const mockLogin = vi.fn().mockResolvedValue(undefined)

    mockUseAuthStore.mockReturnValue({
      ...mockUseAuthStore(),
      login: mockLogin,
      error: null,
      setError: vi.fn(),
    })

    render(<UserAuthForm />)

    // Fill out and submit the form
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'john.doe@example.com'
    )
    await user.type(screen.getByLabelText(/contraseña/i), 'ValidPassword123')

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)

    // Should navigate to default route
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/academies',
        replace: true,
      })
    })
  })

  it('navigates to redirect route after successful login', async () => {
    const user = userEvent.setup()
    const mockLogin = vi.fn().mockResolvedValue(undefined)
    const redirectTo = '/dashboard/settings'

    mockUseAuthStore.mockReturnValue({
      ...mockUseAuthStore(),
      login: mockLogin,
      error: null,
      setError: vi.fn(),
    })

    render(<UserAuthForm redirectTo={redirectTo} />)

    // Fill out and submit the form
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'john.doe@example.com'
    )
    await user.type(screen.getByLabelText(/contraseña/i), 'ValidPassword123')

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)

    // Should navigate to redirect route
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({
        to: redirectTo,
        replace: true,
      })
    })
  })

  it('shows loading state during login', async () => {
    const user = userEvent.setup()
    const mockLogin = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      )

    mockUseAuthStore.mockReturnValue({
      ...mockUseAuthStore(),
      login: mockLogin,
      error: null,
      setError: vi.fn(),
    })

    render(<UserAuthForm />)

    // Fill out the form
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'john.doe@example.com'
    )
    await user.type(screen.getByLabelText(/contraseña/i), 'ValidPassword123')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)

    // Should show loading state
    expect(submitButton).toBeDisabled()
    expect(screen.getByRole('button', { name: /github/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /facebook/i })).toBeDisabled()

    // Wait for login to complete
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled()
    })
  })

  it('clears error when form is submitted', async () => {
    const user = userEvent.setup()
    const mockLogin = vi.fn().mockResolvedValue(undefined)
    const mockSetError = vi.fn()

    mockUseAuthStore.mockReturnValue({
      ...mockUseAuthStore(),
      login: mockLogin,
      error: 'Previous error',
      setError: mockSetError,
    })

    render(<UserAuthForm />)

    // Fill out and submit the form
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'john.doe@example.com'
    )
    await user.type(screen.getByLabelText(/contraseña/i), 'ValidPassword123')

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)

    // Should clear error first
    expect(mockSetError).toHaveBeenCalledWith(null)
  })

  it('displays auth store error', () => {
    const errorMessage = 'Authentication failed'
    mockUseAuthStore.mockReturnValue({
      ...mockUseAuthStore(),
      error: errorMessage,
    })

    render(<UserAuthForm />)

    // Should display the error
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('handles API error with specific error codes', async () => {
    const user = userEvent.setup()
    const mockError = {
      type: 'AuthenticationError',
      message: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS',
    }
    const mockLogin = vi.fn().mockRejectedValue(mockError)
    const mockSetError = vi.fn()

    mockUseAuthStore.mockReturnValue({
      ...mockUseAuthStore(),
      login: mockLogin,
      error: null,
      setError: mockSetError,
    })

    render(<UserAuthForm />)

    // Fill out and submit the form
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'john.doe@example.com'
    )
    await user.type(screen.getByLabelText(/contraseña/i), 'ValidPassword123')

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)

    // Should clear error first
    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith(null)
    })
  })

  it('handles validation errors by setting field errors', async () => {
    const user = userEvent.setup()
    const mockError = {
      type: 'ValidationError',
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: ['Email is invalid', 'Password is too short'],
    }
    const mockLogin = vi.fn().mockRejectedValue(mockError)
    const mockSetError = vi.fn()

    mockUseAuthStore.mockReturnValue({
      ...mockUseAuthStore(),
      login: mockLogin,
      error: null,
      setError: mockSetError,
    })

    render(<UserAuthForm />)

    // Fill out and submit the form with valid data (client-side validation will pass)
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'test@example.com'
    )
    await user.type(screen.getByLabelText(/contraseña/i), 'ValidPassword123')

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)

    // Should clear error first
    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith(null)
    })
  })

  it('handles network error gracefully', async () => {
    const user = userEvent.setup()
    const mockError = {
      type: 'NetworkError',
      message: 'Network connection failed',
      code: 'NETWORK_ERROR',
    }
    const mockLogin = vi.fn().mockRejectedValue(mockError)
    const mockSetError = vi.fn()

    mockUseAuthStore.mockReturnValue({
      ...mockUseAuthStore(),
      login: mockLogin,
      error: null,
      setError: mockSetError,
    })

    render(<UserAuthForm />)

    // Fill out and submit the form
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'john.doe@example.com'
    )
    await user.type(screen.getByLabelText(/contraseña/i), 'ValidPassword123')

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)

    // Should clear error first
    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith(null)
    })
  })
})
