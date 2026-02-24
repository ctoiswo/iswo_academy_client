import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmEmail } from '../confirm-email'

// Create mock functions
const mockNavigate = jest.fn()
const mockUseSearch = jest.fn()

// Mock dependencies
jest.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useSearch: () => mockUseSearch(),
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

// Mock fetch
global.fetch = jest.fn()

describe('ConfirmEmail Flow Integration', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockUseSearch.mockClear()
    jest.mocked(fetch).mockClear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('muestra mensaje de error cuando no hay token', async () => {
    mockUseSearch.mockReturnValue({ token: undefined })

    render(<ConfirmEmail />)

    await waitFor(() => {
      expect(screen.getByText('Error de confirmación')).toBeInTheDocument()
      expect(
        screen.getByText(/token de confirmación no encontrado/i)
      ).toBeInTheDocument()
    })

    // Debe mostrar botones de error
    expect(
      screen.getByRole('button', { name: /intentar nuevamente/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /ir a iniciar sesión/i })
    ).toBeInTheDocument()
  })

  it('confirma el email exitosamente con token válido', async () => {
    const mockToken = 'valid-token-123'
    mockUseSearch.mockReturnValue({ token: mockToken })

    jest.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Email confirmed' }),
    } as Response)

    render(<ConfirmEmail />)

    // Primero debe mostrar loading
    expect(screen.getByText(/confirmando tu email/i)).toBeInTheDocument()

    // Luego debe mostrar éxito
    await waitFor(() => {
      expect(screen.getByText(/email confirmado/i)).toBeInTheDocument()
      expect(
        screen.getByText(/tu email ha sido confirmado exitosamente/i)
      ).toBeInTheDocument()
    })

    // Debe llamar a la API correctamente
    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:3001/api/v1/auth/confirm/${mockToken}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    // Debe mostrar botón para ir a login
    expect(
      screen.getByRole('button', { name: /iniciar sesión/i })
    ).toBeInTheDocument()
  })

  it('maneja token inválido correctamente', async () => {
    const mockToken = 'invalid-token'
    mockUseSearch.mockReturnValue({ token: mockToken })

    jest.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: {
          code: 'INVALID_CONFIRMATION_TOKEN',
          message: 'Invalid token',
        },
      }),
    } as Response)

    render(<ConfirmEmail />)

    await waitFor(() => {
      expect(screen.getByText(/error de confirmación/i)).toBeInTheDocument()
      expect(
        screen.getByText(/token de confirmación inválido/i)
      ).toBeInTheDocument()
    })

    // Debe mostrar botones de error
    expect(
      screen.getByRole('button', { name: /intentar nuevamente/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /ir a iniciar sesión/i })
    ).toBeInTheDocument()
  })

  it('maneja cuenta ya confirmada correctamente', async () => {
    const mockToken = 'already-confirmed-token'
    mockUseSearch.mockReturnValue({ token: mockToken })

    jest.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: {
          code: 'ALREADY_CONFIRMED',
          message: 'Account already confirmed',
        },
      }),
    } as Response)

    render(<ConfirmEmail />)

    await waitFor(() => {
      expect(screen.getByText(/email ya confirmado/i)).toBeInTheDocument()
      expect(
        screen.getByText(/tu cuenta ya ha sido confirmada/i)
      ).toBeInTheDocument()
    })

    // Debe mostrar botón para ir a login
    expect(
      screen.getByRole('button', { name: /iniciar sesión/i })
    ).toBeInTheDocument()
  })

  it('maneja token expirado correctamente', async () => {
    const mockToken = 'expired-token'
    mockUseSearch.mockReturnValue({ token: mockToken })

    jest.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: {
          code: 'EXPIRED_CONFIRMATION_TOKEN',
          message: 'Token expired',
        },
      }),
    } as Response)

    render(<ConfirmEmail />)

    await waitFor(() => {
      expect(screen.getByText(/token expirado/i)).toBeInTheDocument()
      expect(
        screen.getByText(/el token de confirmación ha expirado/i)
      ).toBeInTheDocument()
    })

    // Debe mostrar ambos botones
    expect(
      screen.getByRole('button', { name: /solicitar nuevo token/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /ir a iniciar sesión/i })
    ).toBeInTheDocument()
  })

  it('maneja errores de red correctamente', async () => {
    const mockToken = 'valid-token'
    mockUseSearch.mockReturnValue({ token: mockToken })

    jest.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

    render(<ConfirmEmail />)

    await waitFor(() => {
      expect(screen.getByText(/error de confirmación/i)).toBeInTheDocument()
      expect(screen.getByText(/error de conexión/i)).toBeInTheDocument()
    })

    // Debe mostrar botones de error
    expect(
      screen.getByRole('button', { name: /intentar nuevamente/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /ir a iniciar sesión/i })
    ).toBeInTheDocument()
  })

  it('navega a login cuando se hace clic en el botón después de éxito', async () => {
    const user = userEvent.setup()
    const mockToken = 'valid-token'
    mockUseSearch.mockReturnValue({ token: mockToken })

    jest.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Email confirmed' }),
    } as Response)

    render(<ConfirmEmail />)

    await waitFor(() => {
      expect(screen.getByText(/email confirmado/i)).toBeInTheDocument()
    })

    const loginButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(loginButton)

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/sign-in' })
  })

  it('navega a sign-up cuando se solicita nuevo token', async () => {
    const user = userEvent.setup()
    const mockToken = 'expired-token'
    mockUseSearch.mockReturnValue({ token: mockToken })

    jest.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: {
          code: 'EXPIRED_CONFIRMATION_TOKEN',
          message: 'Token expired',
        },
      }),
    } as Response)

    render(<ConfirmEmail />)

    await waitFor(() => {
      expect(screen.getByText(/token expirado/i)).toBeInTheDocument()
    })

    const newTokenButton = screen.getByRole('button', {
      name: /solicitar nuevo token/i,
    })
    await user.click(newTokenButton)

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/sign-up' })
  })

  it('recarga la página cuando se hace clic en intentar nuevamente', async () => {
    const user = userEvent.setup()
    const mockToken = 'error-token'
    mockUseSearch.mockReturnValue({ token: mockToken })

    // Mock window.location.reload
    const originalReload = window.location.reload
    window.location.reload = jest.fn()

    jest.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

    render(<ConfirmEmail />)

    await waitFor(() => {
      expect(screen.getByText(/error de conexión/i)).toBeInTheDocument()
    })

    const retryButton = screen.getByRole('button', {
      name: /intentar nuevamente/i,
    })
    await user.click(retryButton)

    expect(window.location.reload).toHaveBeenCalled()

    // Restore original
    window.location.reload = originalReload
  })

  it('previene múltiples llamadas a la API', async () => {
    const mockToken = 'valid-token'
    mockUseSearch.mockReturnValue({ token: mockToken })

    jest.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Email confirmed' }),
    } as Response)

    const { rerender } = render(<ConfirmEmail />)

    // Esperar a que se complete la primera llamada
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    // Re-renderizar el componente
    rerender(<ConfirmEmail />)

    // Debe seguir siendo solo 1 llamada
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })
})
