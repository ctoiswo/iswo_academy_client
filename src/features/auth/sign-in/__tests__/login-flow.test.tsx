import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useAuthStore } from '@/stores/auth-store'
import { SignIn } from '../index'

// Create mock functions first
const mockNavigate = vi.fn()
const mockUseSearch = vi.fn(() => ({ redirect: undefined }))

// Mock dependencies
vi.mock('@/lib/api-client')
vi.mock('@/stores/auth-store')
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

const mockUseAuthStore = vi.mocked(useAuthStore)

// Default mock store configuration
const defaultMockStore = {
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
}

describe('Login Flow Integration', () => {
  beforeEach(() => {
    // Reset mocks
    mockNavigate.mockClear()
    mockUseSearch.mockReturnValue({ redirect: undefined })

    // Mock auth store with default configuration
    mockUseAuthStore.mockReturnValue(defaultMockStore)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the complete sign-in page', () => {
    render(<SignIn />)

    // Check for the card title specifically using querySelector
    const cardTitle = document.querySelector('[data-slot="card-title"]')
    expect(cardTitle).toHaveTextContent('Iniciar sesión')
    expect(
      screen.getByText(/ingresa tu correo electrónico y contraseña/i)
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /iniciar sesión/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/olvidaste tu contraseña/i)).toBeInTheDocument()
    expect(screen.getByText(/términos de servicio/i)).toBeInTheDocument()
    expect(screen.getByText(/política de privacidad/i)).toBeInTheDocument()
  })

  it('completes successful login flow', async () => {
    const user = userEvent.setup()

    // Mock successful login
    const mockLogin = vi.fn().mockResolvedValue(undefined)
    mockUseAuthStore.mockReturnValue({
      ...defaultMockStore,
      login: mockLogin,
      error: null,
      setError: vi.fn(),
    })

    render(<SignIn />)

    // Fill out the login form
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'test@example.com'
    )
    await user.type(screen.getByLabelText(/contraseña/i), 'password123')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)

    // Wait for the login to complete
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    // Should navigate to academies
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/academies',
        replace: true,
      })
    })
  })

  it('handles invalid credentials error', async () => {
    const user = userEvent.setup()
    const mockError = {
      type: 'AuthenticationError',
      message: 'Credenciales inválidas',
      code: 'INVALID_CREDENTIALS',
    }

    const mockLogin = vi.fn().mockRejectedValue(mockError)
    const mockSetError = vi.fn()
    mockUseAuthStore.mockReturnValue({
      ...defaultMockStore,
      login: mockLogin,
      error: null,
      setError: mockSetError,
    })

    render(<SignIn />)

    // Fill out the form with invalid credentials
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'invalid@example.com'
    )
    await user.type(screen.getByLabelText(/contraseña/i), 'wrongpassword')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'invalid@example.com',
        password: 'wrongpassword',
      })
    })

    // Should clear error and then handle the error
    expect(mockSetError).toHaveBeenCalledWith(null)
  })

  it('handles unconfirmed account error', async () => {
    const user = userEvent.setup()
    const mockError = {
      type: 'AuthenticationError',
      message: 'Account not confirmed',
      code: 'ACCOUNT_NOT_CONFIRMED',
    }

    const mockLogin = vi.fn().mockRejectedValue(mockError)
    const mockSetError = vi.fn()
    mockUseAuthStore.mockReturnValue({
      ...defaultMockStore,
      login: mockLogin,
      error: null,
      setError: mockSetError,
    })

    render(<SignIn />)

    // Fill out the form
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'unconfirmed@example.com'
    )
    await user.type(screen.getByLabelText(/contraseña/i), 'password123')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'unconfirmed@example.com',
        password: 'password123',
      })
    })

    // Should clear error first
    expect(mockSetError).toHaveBeenCalledWith(null)
  })

  it('handles validation errors', async () => {
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
      ...defaultMockStore,
      login: mockLogin,
      error: null,
      setError: mockSetError,
    })

    render(<SignIn />)

    // Fill out the form with valid data (client-side validation will pass)
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'test@example.com'
    )
    await user.type(screen.getByLabelText(/contraseña/i), 'password123')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled()
    })

    // Should clear error first
    expect(mockSetError).toHaveBeenCalledWith(null)
  })

  it('handles network error', async () => {
    const user = userEvent.setup()
    const mockError = {
      type: 'NetworkError',
      message: 'Network connection failed',
      code: 'NETWORK_ERROR',
    }

    const mockLogin = vi.fn().mockRejectedValue(mockError)
    const mockSetError = vi.fn()
    mockUseAuthStore.mockReturnValue({
      ...defaultMockStore,
      login: mockLogin,
      error: null,
      setError: mockSetError,
    })

    render(<SignIn />)

    // Fill out the form
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'test@example.com'
    )
    await user.type(screen.getByLabelText(/contraseña/i), 'password123')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled()
    })

    // Should clear error first
    expect(mockSetError).toHaveBeenCalledWith(null)
  })

  it('handles rate limit error', async () => {
    const user = userEvent.setup()
    const mockError = {
      type: 'RateLimitError',
      message: 'Too many requests',
      code: 'RATE_LIMIT_EXCEEDED',
    }

    const mockLogin = vi.fn().mockRejectedValue(mockError)
    const mockSetError = vi.fn()
    mockUseAuthStore.mockReturnValue({
      ...defaultMockStore,
      login: mockLogin,
      error: null,
      setError: mockSetError,
    })

    render(<SignIn />)

    // Fill out the form
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'test@example.com'
    )
    await user.type(screen.getByLabelText(/contraseña/i), 'password123')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled()
    })

    // Should clear error first
    expect(mockSetError).toHaveBeenCalledWith(null)
  })

  it('validates form fields before submission', async () => {
    const user = userEvent.setup()
    render(<SignIn />)

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

    // Form should not be submitted
    const mockLogin = defaultMockStore.login
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    render(<SignIn />)

    // Enter invalid email
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'invalid-email'
    )
    await user.type(screen.getByLabelText(/contraseña/i), 'password123')

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

    // Form should not be submitted
    const mockLogin = defaultMockStore.login
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('validates password length', async () => {
    const user = userEvent.setup()
    render(<SignIn />)

    // Enter short password
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'test@example.com'
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

    // Form should not be submitted
    const mockLogin = defaultMockStore.login
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('shows loading state during login', async () => {
    const user = userEvent.setup()

    // Mock login that takes time to resolve
    const mockLogin = vi
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      )
    mockUseAuthStore.mockReturnValue({
      ...defaultMockStore,
      login: mockLogin,
      error: null,
      setError: vi.fn(),
    })

    render(<SignIn />)

    // Fill out the form
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'test@example.com'
    )
    await user.type(screen.getByLabelText(/contraseña/i), 'password123')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)

    // Should show loading state
    expect(submitButton).toBeDisabled()
    expect(
      screen.getByRole('button', { name: /iniciar sesión/i })
    ).toBeDisabled()

    // Wait for login to complete
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled()
    })
  })

  it('displays auth store error when present', () => {
    const mockError = 'Authentication failed'
    mockUseAuthStore.mockReturnValue({
      ...defaultMockStore,
      error: mockError,
    })

    render(<SignIn />)

    // Should display the error
    expect(screen.getByText(mockError)).toBeInTheDocument()
  })

  it('redirects to specified redirect URL after successful login', async () => {
    const user = userEvent.setup()
    const redirectUrl = '/dashboard/settings'

    // Mock successful login
    const mockLogin = vi.fn().mockResolvedValue(undefined)
    mockUseAuthStore.mockReturnValue({
      ...defaultMockStore,
      login: mockLogin,
      error: null,
      setError: vi.fn(),
    })

    // Mock search with redirect
    mockUseSearch.mockReturnValue({ redirect: redirectUrl as any })

    render(<SignIn />)

    // Fill out and submit the form
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'test@example.com'
    )
    await user.type(screen.getByLabelText(/contraseña/i), 'password123')

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)

    // Wait for login and navigation
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({
        to: redirectUrl,
        replace: true,
      })
    })
  })
})
