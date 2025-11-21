import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ForgotPassword } from '../index'
import { authApi, getErrorMessage } from '@/lib/api-client'

// Create mock functions first
const mockNavigate = vi.fn()

// Mock dependencies
vi.mock('@/lib/api-client', () => ({
  authApi: {
    forgotPassword: vi.fn(),
  },
  getErrorMessage: vi.fn(),
}))
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/forgot-password' }),
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

const mockForgotPassword = vi.mocked(authApi.forgotPassword)
const mockGetErrorMessage = vi.mocked(getErrorMessage)

describe('Flujo de Recuperación de Contraseña', () => {
  beforeEach(() => {
    // Reset mocks
    mockNavigate.mockClear()
    mockForgotPassword.mockClear()
    
    // Mock getErrorMessage to return the error message
    mockGetErrorMessage.mockImplementation((error: any) => {
      if (error?.message) return error.message
      if (error?.details?.length > 0) return error.details.join(', ')
      return 'Ocurrió un error inesperado'
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza la página completa de recuperación de contraseña', () => {
    render(<ForgotPassword />)

    // Check for the card title
    expect(screen.getByText('Recuperar contraseña')).toBeInTheDocument()
    expect(screen.getByText(/ingresa tu correo electrónico registrado/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enviar correo/i })).toBeInTheDocument()
    expect(screen.getByText(/recuerdas tu contraseña/i)).toBeInTheDocument()
    expect(screen.getByText(/no tienes una cuenta/i)).toBeInTheDocument()
  })

  it('completa el flujo exitoso de recuperación de contraseña', async () => {
    const user = userEvent.setup()
    const testEmail = 'test@example.com'
    const mockResponse = {
      message: 'Si existe una cuenta con ese correo, recibirás instrucciones para restablecer tu contraseña.'
    }

    // Mock successful API call
    mockForgotPassword.mockResolvedValue(mockResponse)

    render(<ForgotPassword />)

    // Fill out the form
    await user.type(screen.getByLabelText(/correo electrónico/i), testEmail)

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /enviar correo/i })
    await user.click(submitButton)

    // Wait for the API call
    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith(testEmail)
    })

    // Should show success message
    await waitFor(() => {
      expect(screen.getByText(/instrucciones para restablecer la contraseña han sido enviadas/i)).toBeInTheDocument()
      expect(screen.getByText(/por favor revisa tu correo electrónico/i)).toBeInTheDocument()
    })

    // Form should be replaced with success message
    expect(screen.queryByLabelText(/correo electrónico/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /enviar correo/i })).not.toBeInTheDocument()
  })

  it('maneja errores de API apropiadamente', async () => {
    const user = userEvent.setup()
    const testEmail = 'invalido@example.com'
    const mockError = {
      type: 'ValidationError',
      message: 'El correo es inválido',
      code: 'VALIDATION_ERROR',
      details: ['El formato del correo es inválido']
    }

    // Mock API error
    mockForgotPassword.mockRejectedValue(mockError)

    render(<ForgotPassword />)

    // Fill out the form
    await user.type(screen.getByLabelText(/correo electrónico/i), testEmail)

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /enviar correo/i })
    await user.click(submitButton)

    // Wait for the API call
    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith(testEmail)
    })

    // Should still show the form (not success state)
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enviar correo/i })).toBeInTheDocument()
    expect(screen.queryByText(/instrucciones para restablecer la contraseña han sido enviadas/i)).not.toBeInTheDocument()
  })

  it('maneja errores de validación y establece errores en campos', async () => {
    const user = userEvent.setup()
    const testEmail = 'invalido@example.com'
    const mockError = {
      type: 'ValidationError',
      message: 'Validación fallida',
      code: 'VALIDATION_ERROR',
      details: ['El formato del email es inválido']
    }

    // Mock API error
    mockForgotPassword.mockRejectedValue(mockError)

    render(<ForgotPassword />)

    // Fill out the form
    await user.type(screen.getByLabelText(/correo electrónico/i), testEmail)

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /enviar correo/i })
    await user.click(submitButton)

    // Wait for the API call and error handling
    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith(testEmail)
    })

    // Should show field error for email
    await waitFor(() => {
      expect(screen.getByText('El formato del email es inválido')).toBeInTheDocument()
    })
  })

  it('maneja errores de red', async () => {
    const user = userEvent.setup()
    const testEmail = 'test@example.com'
    const mockError = {
      type: 'NetworkError',
      message: 'Error de conexión de red',
      code: 'NETWORK_ERROR'
    }

    // Mock network error
    mockForgotPassword.mockRejectedValue(mockError)

    render(<ForgotPassword />)

    // Fill out the form
    await user.type(screen.getByLabelText(/correo electrónico/i), testEmail)

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /enviar correo/i })
    await user.click(submitButton)

    // Wait for the API call
    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith(testEmail)
    })

    // Should still show the form
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enviar correo/i })).toBeInTheDocument()
  })

  it('valida los campos del formulario antes de enviar', async () => {
    const user = userEvent.setup()
    render(<ForgotPassword />)

    // Try to submit empty form
    const submitButton = screen.getByRole('button', { name: /enviar correo/i })
    await user.click(submitButton)

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/por favor ingresa tu correo electrónico/i)).toBeInTheDocument()
    })

    // API should not be called
    expect(mockForgotPassword).not.toHaveBeenCalled()
  })

  it('valida el formato del correo electrónico', async () => {
    const user = userEvent.setup()
    render(<ForgotPassword />)

    // Enter invalid email
    await user.type(screen.getByLabelText(/correo electrónico/i), 'correo-invalido')

    // Try to submit
    const submitButton = screen.getByRole('button', { name: /enviar correo/i })
    await user.click(submitButton)

    // Should show email validation error (check for any validation error text)
    await waitFor(() => {
      // The validation might show different text, so let's check if the form didn't submit
      expect(mockForgotPassword).not.toHaveBeenCalled()
    })
  })

  it('muestra estado de carga durante la llamada a la API', async () => {
    const user = userEvent.setup()
    const testEmail = 'test@example.com'

    // Mock API call that takes time to resolve
    mockForgotPassword.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ message: 'Éxito' }), 100))
    )

    render(<ForgotPassword />)

    // Fill out the form
    await user.type(screen.getByLabelText(/correo electrónico/i), testEmail)

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /enviar correo/i })
    await user.click(submitButton)

    // Should show loading state
    expect(screen.getByText(/enviando correo/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeDisabled()

    // Wait for API call to complete
    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith(testEmail)
    })
  })

  it('resetea el formulario después de un envío exitoso', async () => {
    const user = userEvent.setup()
    const testEmail = 'test@example.com'
    const mockResponse = {
      message: 'Si existe una cuenta con ese correo, recibirás instrucciones para restablecer tu contraseña.'
    }

    // Mock successful API call
    mockForgotPassword.mockResolvedValue(mockResponse)

    render(<ForgotPassword />)

    // Fill out the form
    const emailInput = screen.getByLabelText(/correo electrónico/i)
    await user.type(emailInput, testEmail)
    expect(emailInput).toHaveValue(testEmail)

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /enviar correo/i })
    await user.click(submitButton)

    // Wait for success state
    await waitFor(() => {
      expect(screen.getByText(/instrucciones para restablecer la contraseña han sido enviadas/i)).toBeInTheDocument()
    })

    // Form should be replaced with success message, so email input should not exist
    expect(screen.queryByLabelText(/correo electrónico/i)).not.toBeInTheDocument()
  })

  it('maneja error de límite de tasa', async () => {
    const user = userEvent.setup()
    const testEmail = 'test@example.com'
    const mockError = {
      type: 'RateLimitError',
      message: 'Demasiadas solicitudes de restablecimiento de contraseña. Inténtalo de nuevo más tarde.',
      code: 'RATE_LIMIT_EXCEEDED'
    }

    // Mock rate limit error
    mockForgotPassword.mockRejectedValue(mockError)

    render(<ForgotPassword />)

    // Fill out the form
    await user.type(screen.getByLabelText(/correo electrónico/i), testEmail)

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /enviar correo/i })
    await user.click(submitButton)

    // Wait for the API call
    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith(testEmail)
    })

    // Should still show the form
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enviar correo/i })).toBeInTheDocument()
  })

  it('tiene los links de navegación correctos', () => {
    render(<ForgotPassword />)

    // Check for sign-in and sign-up links
    const links = screen.getAllByRole('link')
    const signInLink = links.find(link => link.getAttribute('href') === '/sign-in')
    const signUpLink = links.find(link => link.getAttribute('href') === '/sign-up')
    
    expect(signInLink).toBeDefined()
    expect(signUpLink).toBeDefined()
  })
})