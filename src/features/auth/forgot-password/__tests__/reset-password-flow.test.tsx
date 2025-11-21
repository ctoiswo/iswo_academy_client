import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ResetPassword } from '../reset-password'
import { authApi, getErrorMessage } from '@/lib/api-client'

// Create mock functions first
const mockNavigate = vi.fn()
const mockUseSearch = vi.fn()

// Mock dependencies
vi.mock('@/lib/api-client', () => ({
  authApi: {
    resetPassword: vi.fn(),
  },
  getErrorMessage: vi.fn(),
}))
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useSearch: () => mockUseSearch(),
  useLocation: () => ({ pathname: '/reset-password' }),
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

const mockResetPassword = vi.mocked(authApi.resetPassword)
const mockGetErrorMessage = vi.mocked(getErrorMessage)

describe('Flujo de Restablecimiento de Contraseña', () => {
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

  describe('con token válido', () => {
    beforeEach(() => {
      // Mock search con token válido
      mockUseSearch.mockReturnValue({ token: 'token-valido-123' })
    })

    it('renderiza la página completa de restablecimiento de contraseña', () => {
      render(<ResetPassword />)

      // Check for the card title
      expect(screen.getByText('Restablecer tu Contraseña')).toBeInTheDocument()
      expect(screen.getByText(/ingresa tu nueva contraseña/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/ingresa tu nueva contraseña/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/confirma tu nueva contraseña/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /restablecer contraseña/i })).toBeInTheDocument()
      expect(screen.getByText(/recuerdas tu contraseña/i)).toBeInTheDocument()
    })

    it('completa el flujo exitoso de restablecimiento de contraseña', async () => {
      const user = userEvent.setup()
      const testPassword = 'NuevaContraseña123'
      const mockResponse = {
        message: 'La contraseña ha sido restablecida exitosamente. Por favor inicia sesión con tu nueva contraseña.'
      }

      // Mock successful API call
      mockResetPassword.mockResolvedValue(mockResponse)

      render(<ResetPassword />)

      // Fill out the form
      await user.type(screen.getByPlaceholderText(/ingresa tu nueva contraseña/i), testPassword)
      await user.type(screen.getByPlaceholderText(/confirma tu nueva contraseña/i), testPassword)

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /restablecer contraseña/i })
      await user.click(submitButton)

      // Wait for the API call
      await waitFor(() => {
        expect(mockResetPassword).toHaveBeenCalledWith(
          'token-valido-123',
          testPassword,
          testPassword
        )
      })

      // Should navigate to sign-in page
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/sign-in' })
      })
    })

    it('valida los requisitos de contraseña', async () => {
      const user = userEvent.setup()
      render(<ResetPassword />)

      // Try with password that doesn't meet requirements
      await user.type(screen.getByPlaceholderText(/ingresa tu nueva contraseña/i), 'weak')
      await user.type(screen.getByPlaceholderText(/confirma tu nueva contraseña/i), 'weak')

      // Try to submit
      const submitButton = screen.getByRole('button', { name: /restablecer contraseña/i })
      await user.click(submitButton)

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/la contraseña debe tener al menos 8 caracteres/i)).toBeInTheDocument()
      })

      // API should not be called
      expect(mockResetPassword).not.toHaveBeenCalled()
    })

    it('valida que las contraseñas coincidan', async () => {
      const user = userEvent.setup()
      render(<ResetPassword />)

      // Enter mismatched passwords
      await user.type(screen.getByPlaceholderText(/ingresa tu nueva contraseña/i), 'ValidPassword123')
      await user.type(screen.getByPlaceholderText(/confirma tu nueva contraseña/i), 'DifferentPassword123')

      // Try to submit
      const submitButton = screen.getByRole('button', { name: /restablecer contraseña/i })
      await user.click(submitButton)

      // Should show password mismatch error
      await waitFor(() => {
        expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument()
      })

      // API should not be called
      expect(mockResetPassword).not.toHaveBeenCalled()
    })

    it('maneja error de token inválido', async () => {
      const user = userEvent.setup()
      const testPassword = 'NuevaContraseña123'
      const mockError = {
        type: 'AuthenticationError',
        message: 'Invalid or expired reset token',
        code: 'INVALID_RESET_TOKEN'
      }

      // Mock API error
      mockResetPassword.mockRejectedValue(mockError)

      render(<ResetPassword />)

      // Fill out the form
      await user.type(screen.getByPlaceholderText(/ingresa tu nueva contraseña/i), testPassword)
      await user.type(screen.getByPlaceholderText(/confirma tu nueva contraseña/i), testPassword)

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /restablecer contraseña/i })
      await user.click(submitButton)

      // Wait for the API call
      await waitFor(() => {
        expect(mockResetPassword).toHaveBeenCalled()
      })

      // Should redirect to forgot password page after 3 seconds
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/forgot-password' })
      }, { timeout: 4000 })
    })
  })

  describe('sin token', () => {
    beforeEach(() => {
      // Mock search sin token
      mockUseSearch.mockReturnValue({})
    })

    it('renderiza página de enlace inválido cuando falta el token', () => {
      render(<ResetPassword />)

      // Check for error state
      expect(screen.getByText('Enlace de Restablecimiento Inválido')).toBeInTheDocument()
      expect(screen.getByText(/el enlace de restablecimiento de contraseña es inválido o falta/i)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /solicitar nuevo restablecimiento/i })).toBeInTheDocument()

      // Should not show the reset form
      expect(screen.queryByPlaceholderText(/ingresa tu nueva contraseña/i)).not.toBeInTheDocument()
      expect(screen.queryByPlaceholderText(/confirma tu nueva contraseña/i)).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /restablecer contraseña/i })).not.toBeInTheDocument()
    })

    it('tiene el link de navegación correcto para token inválido', () => {
      render(<ResetPassword />)

      // Check for forgot password link
      const forgotPasswordLink = screen.getByRole('link', { name: /solicitar nuevo restablecimiento/i })
      expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password')
    })
  })
})