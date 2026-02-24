import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useAuthStore } from '@/stores/auth-store'
import { SignUp } from '../index'

// Create mock navigate function
const mockNavigate = jest.fn()

// Mock dependencies
jest.mock('@/lib/api-client')
jest.mock('@/stores/auth-store')
jest.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

const mockUseAuthStore = jest.mocked(useAuthStore)

// Create default mock store to reuse
const defaultMockStore = {
  register: jest.fn(),
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: jest.fn(),
  logout: jest.fn(),
  refreshTokens: jest.fn(),
  setUser: jest.fn(),
  setTokens: jest.fn(),
  setLoading: jest.fn(),
  setError: jest.fn(),
  reset: jest.fn(),
  initialize: jest.fn(),
  auth: {
    user: null,
    setUser: jest.fn(),
    accessToken: '',
    setAccessToken: jest.fn(),
    refreshToken: '',
    setRefreshToken: jest.fn(),
    resetAccessToken: jest.fn(),
    reset: jest.fn(),
  },
}

describe('Registration Flow Integration', () => {
  beforeEach(() => {
    // Mock auth store with default values
    mockUseAuthStore.mockReturnValue(defaultMockStore)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the complete sign-up page', () => {
    render(<SignUp />)

    expect(screen.getAllByText(/crear una cuenta/i)[0]).toBeInTheDocument()
    expect(
      screen.getByText(/ingresa tu información personal para comenzar/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/¿ya tienes una cuenta?/i)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /inicia sesión/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/términos de servicio/i)).toBeInTheDocument()
    expect(screen.getByText(/política de privacidad/i)).toBeInTheDocument()
  })

  it('completes successful registration flow', async () => {
    const user = userEvent.setup()
    const mockRegisterResponse = {
      message:
        'Registration successful! Please check your email to confirm your account.',
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
      },
    }

    const mockRegister = jest.fn().mockResolvedValue(mockRegisterResponse)
    mockUseAuthStore.mockReturnValue({
      ...defaultMockStore,
      register: mockRegister,
    })

    render(<SignUp />)

    // Fill out the registration form
    await user.type(screen.getByPlaceholderText(/juan/i), 'John')
    await user.type(screen.getByPlaceholderText(/pérez/i), 'Doe')
    await user.type(
      screen.getByPlaceholderText(/nombre@ejemplo.com/i),
      'john.doe@example.com'
    )
    await user.type(
      screen.getAllByPlaceholderText('********')[0],
      'ValidPassword123'
    )
    await user.type(
      screen.getAllByPlaceholderText('********')[1],
      'ValidPassword123'
    )

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
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

    // Check that navigation to success page occurred
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/sign-up-success' })
    })
  })

  it('handles email already taken error', async () => {
    const user = userEvent.setup()
    const mockError = {
      type: 'ValidationError',
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: ['Email has already been taken'],
    }

    const mockRegister = jest.fn().mockRejectedValue(mockError)
    mockUseAuthStore.mockReturnValue({
      ...defaultMockStore,
      register: mockRegister,
    })

    render(<SignUp />)

    // Fill out the form with existing email
    await user.type(screen.getByPlaceholderText(/juan/i), 'John')
    await user.type(screen.getByPlaceholderText(/pérez/i), 'Doe')
    await user.type(
      screen.getByPlaceholderText(/nombre@ejemplo.com/i),
      'existing@example.com'
    )
    await user.type(
      screen.getAllByPlaceholderText('********')[0],
      'ValidPassword123'
    )
    await user.type(
      screen.getAllByPlaceholderText('********')[1],
      'ValidPassword123'
    )

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled()
    })

    // The form should remain visible (not show success message)
    expect(
      screen.queryByRole('heading', { name: /¡registro exitoso!/i })
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /crear cuenta/i })
    ).toBeInTheDocument()
  })

  it('handles server error during registration', async () => {
    const user = userEvent.setup()
    const mockError = {
      type: 'ServerError',
      message: 'Internal server error',
      code: 'SERVER_ERROR',
    }

    const mockRegister = jest.fn().mockRejectedValue(mockError)
    mockUseAuthStore.mockReturnValue({
      ...defaultMockStore,
      register: mockRegister,
    })

    render(<SignUp />)

    // Fill out the form
    await user.type(screen.getByPlaceholderText(/juan/i), 'John')
    await user.type(screen.getByPlaceholderText(/pérez/i), 'Doe')
    await user.type(
      screen.getByPlaceholderText(/nombre@ejemplo.com/i),
      'john.doe@example.com'
    )
    await user.type(
      screen.getAllByPlaceholderText('********')[0],
      'ValidPassword123'
    )
    await user.type(
      screen.getAllByPlaceholderText('********')[1],
      'ValidPassword123'
    )

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled()
    })

    // The form should remain visible
    expect(
      screen.queryByRole('heading', { name: /¡registro exitoso!/i })
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /crear cuenta/i })
    ).toBeInTheDocument()
  })

  it('handles network error during registration', async () => {
    const user = userEvent.setup()
    const mockError = {
      type: 'NetworkError',
      message: 'Network connection failed',
      code: 'NETWORK_ERROR',
    }

    const mockRegister = jest.fn().mockRejectedValue(mockError)
    mockUseAuthStore.mockReturnValue({
      ...defaultMockStore,
      register: mockRegister,
    })

    render(<SignUp />)

    // Fill out the form
    await user.type(screen.getByPlaceholderText(/juan/i), 'John')
    await user.type(screen.getByPlaceholderText(/pérez/i), 'Doe')
    await user.type(
      screen.getByPlaceholderText(/nombre@ejemplo.com/i),
      'john.doe@example.com'
    )
    await user.type(
      screen.getAllByPlaceholderText('********')[0],
      'ValidPassword123'
    )
    await user.type(
      screen.getAllByPlaceholderText('********')[1],
      'ValidPassword123'
    )

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled()
    })

    // The form should remain visible
    expect(
      screen.queryByRole('heading', { name: /¡registro exitoso!/i })
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /crear cuenta/i })
    ).toBeInTheDocument()
  })

  it('allows user to navigate back to form after success', async () => {
    const user = userEvent.setup()
    const mockRegisterResponse = {
      message: 'Registration successful! Please check your email.',
    }

    const mockRegister = jest.fn().mockResolvedValue(mockRegisterResponse)
    mockUseAuthStore.mockReturnValue({
      ...defaultMockStore,
      register: mockRegister,
    })

    render(<SignUp />)

    // Complete registration
    await user.type(screen.getByPlaceholderText(/juan/i), 'John')
    await user.type(screen.getByPlaceholderText(/pérez/i), 'Doe')
    await user.type(
      screen.getByPlaceholderText(/nombre@ejemplo.com/i),
      'john.doe@example.com'
    )
    await user.type(
      screen.getAllByPlaceholderText('********')[0],
      'ValidPassword123'
    )
    await user.type(
      screen.getAllByPlaceholderText('********')[1],
      'ValidPassword123'
    )

    const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
    await user.click(submitButton)

    // Wait for navigation to success page
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/sign-up-success' })
    })
  })

  it('validates all form fields before submission', async () => {
    const user = userEvent.setup()
    render(<SignUp />)

    // Try to submit empty form
    const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
    await user.click(submitButton)

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/El nombre es obligatorio/i)).toBeInTheDocument()
      expect(
        screen.getByText(/El apellido es obligatorio/i)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/El correo electrónico es obligatorio/i)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/La contraseña es obligatoria/i)
      ).toBeInTheDocument()
    })

    // Form should not be submitted
    expect(defaultMockStore.register).not.toHaveBeenCalled()
  })
})
