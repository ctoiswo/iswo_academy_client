import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserMenu } from '../user-menu'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'navigation.dashboard': 'Dashboard',
        'navigation.settings': 'Configuración',
        'navigation.logout': 'Cerrar Sesión',
        'navigation.login': 'Iniciar Sesión',
        'navigation.register': 'Registrarse',
      }
      return translations[key] || key
    },
  }),
}))

// Mock TanStack Router
const mockNavigate = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}))

// Mock auth store
const mockAuthStore = {
  isAuthenticated: false,
  user: null as any,
  logout: vi.fn(),
  academyData: null as any,
  currentAcademy: null as any,
}

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: () => mockAuthStore,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  LayoutDashboard: ({ className }: { className?: string }) => (
    <div className={className} data-testid='dashboard-icon'>
      📊
    </div>
  ),
  LogOut: ({ className }: { className?: string }) => (
    <div className={className} data-testid='logout-icon'>
      🚪
    </div>
  ),
  Settings: ({ className }: { className?: string }) => (
    <div className={className} data-testid='settings-icon'>
      ⚙️
    </div>
  ),
}))

// Mock UI components
vi.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, className, ...props }: any) => (
    <div className={className} data-testid='avatar' {...props}>
      {children}
    </div>
  ),
  AvatarFallback: ({ children, className, ...props }: any) => (
    <div className={className} data-testid='avatar-fallback' {...props}>
      {children}
    </div>
  ),
  AvatarImage: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} data-testid='avatar-image' {...props} />
  ),
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    variant,
    asChild,
    onClick,
    className,
    ...props
  }: any) => {
    const Component = asChild ? 'div' : 'button'
    return (
      <Component
        onClick={onClick}
        className={className}
        data-variant={variant}
        data-testid='button'
        {...props}
      >
        {children}
      </Component>
    )
  },
}))

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => (
    <div data-testid='dropdown-menu'>{children}</div>
  ),
  DropdownMenuTrigger: ({ children, asChild }: any) => (
    <div data-testid='dropdown-trigger' data-as-child={asChild}>
      {children}
    </div>
  ),
  DropdownMenuContent: ({ children, className, align, forceMount }: any) => (
    <div
      data-testid='dropdown-content'
      className={className}
      data-align={align}
      data-force-mount={forceMount}
    >
      {children}
    </div>
  ),
  DropdownMenuItem: ({ children, onClick, asChild, className }: any) => {
    const Component = asChild ? 'div' : 'div'
    return (
      <Component
        onClick={onClick}
        className={className}
        data-testid='dropdown-item'
        data-as-child={asChild}
      >
        {children}
      </Component>
    )
  },
  DropdownMenuLabel: ({ children, className }: any) => (
    <div className={className} data-testid='dropdown-label'>
      {children}
    </div>
  ),
  DropdownMenuSeparator: () => <hr data-testid='dropdown-separator' />,
}))

const mockAuthenticatedUser = {
  id: 1,
  full_name: 'Juan Pérez',
  email: 'juan@example.com',
  initials: 'JP',
  avatar_url: 'https://example.com/avatar.jpg',
}

const mockAcademyData = {
  academies: [
    {
      id: 1,
      name: 'Mi Academia',
      slug: 'mi-academia',
      description: 'Mi academia de prueba',
    },
  ],
}

describe('UserMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset auth store to unauthenticated state
    mockAuthStore.isAuthenticated = false
    mockAuthStore.user = null
    mockAuthStore.academyData = null
    mockAuthStore.currentAcademy = null
  })

  describe('Unauthenticated state', () => {
    it('should render login and register buttons when not authenticated', () => {
      render(<UserMenu />)

      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
      expect(screen.getByText('Registrarse')).toBeInTheDocument()
    })

    it('should have correct links for login and register', () => {
      render(<UserMenu />)

      const loginLink = screen.getByText('Iniciar Sesión').closest('a')
      const registerLink = screen.getByText('Registrarse').closest('a')

      expect(loginLink).toHaveAttribute('href', '/sign-in')
      expect(registerLink).toHaveAttribute('href', '/sign-up')
    })
  })

  describe('Authenticated state', () => {
    beforeEach(() => {
      mockAuthStore.isAuthenticated = true
      mockAuthStore.user = mockAuthenticatedUser
    })

    it('should render user avatar and dropdown when authenticated', () => {
      render(<UserMenu />)

      expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument()
      expect(screen.getByTestId('avatar')).toBeInTheDocument()
      expect(screen.getByTestId('avatar-image')).toBeInTheDocument()
      expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument()
    })

    it('should display user information correctly', () => {
      render(<UserMenu />)

      expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
      expect(screen.getByText('juan@example.com')).toBeInTheDocument()
      expect(screen.getByText('JP')).toBeInTheDocument()
    })

    it('should render avatar image with correct attributes', () => {
      render(<UserMenu />)

      const avatarImage = screen.getByTestId('avatar-image')
      expect(avatarImage).toHaveAttribute(
        'src',
        'https://example.com/avatar.jpg'
      )
      expect(avatarImage).toHaveAttribute('alt', 'Juan Pérez')
    })

    it('should render dropdown menu items', () => {
      render(<UserMenu />)

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Configuración')).toBeInTheDocument()
      expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument()
    })

    it('should render menu icons correctly', () => {
      render(<UserMenu />)

      expect(screen.getByTestId('dashboard-icon')).toBeInTheDocument()
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument()
      expect(screen.getByTestId('logout-icon')).toBeInTheDocument()
    })

    it('should have correct link for settings', () => {
      render(<UserMenu />)

      const settingsLink = screen.getByText('Configuración').closest('a')
      expect(settingsLink).toHaveAttribute('href', '/settings')
    })
  })

  describe('User actions', () => {
    beforeEach(() => {
      mockAuthStore.isAuthenticated = true
      mockAuthStore.user = mockAuthenticatedUser
    })

    it('should call logout and navigate to home when logout is clicked', async () => {
      const user = userEvent.setup()

      render(<UserMenu />)

      const logoutItem = screen.getByText('Cerrar Sesión')
      await user.click(logoutItem)

      expect(mockAuthStore.logout).toHaveBeenCalledTimes(1)
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/' })
    })
  })

  describe('Dashboard navigation', () => {
    beforeEach(() => {
      mockAuthStore.isAuthenticated = true
      mockAuthStore.user = mockAuthenticatedUser
    })

    it('should navigate to current academy dashboard when currentAcademy exists', async () => {
      const user = userEvent.setup()
      mockAuthStore.currentAcademy = { slug: 'current-academy' }

      render(<UserMenu />)

      const dashboardItem = screen.getByText('Dashboard')
      await user.click(dashboardItem)

      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/academy/$academySlug/dashboard',
        params: { academySlug: 'current-academy' },
      })
    })

    it('should navigate to first academy when no current academy but has academies', async () => {
      const user = userEvent.setup()
      mockAuthStore.academyData = mockAcademyData

      render(<UserMenu />)

      const dashboardItem = screen.getByText('Dashboard')
      await user.click(dashboardItem)

      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/academy/$academySlug/dashboard',
        params: { academySlug: 'mi-academia' },
      })
    })

    it('should navigate to academy selection when no academies', async () => {
      const user = userEvent.setup()

      render(<UserMenu />)

      const dashboardItem = screen.getByText('Dashboard')
      await user.click(dashboardItem)

      expect(mockNavigate).toHaveBeenCalledWith({ to: '/academy-selection' })
    })
  })

  describe('User without avatar', () => {
    beforeEach(() => {
      mockAuthStore.isAuthenticated = true
      mockAuthStore.user = {
        ...mockAuthenticatedUser,
        avatar_url: null,
      }
    })

    it('should handle user without avatar_url', () => {
      render(<UserMenu />)

      const avatarImage = screen.getByTestId('avatar-image')
      expect(avatarImage).not.toHaveAttribute('src')
      expect(screen.getByText('JP')).toBeInTheDocument() // Fallback initials
    })
  })
})
