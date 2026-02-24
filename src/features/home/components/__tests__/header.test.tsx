import { render, screen } from '@testing-library/react'
import { Header } from '../header'

// Mock react-i18next through custom hook
jest.mock('@/hooks/use-translation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'navigation.backToHome': 'Volver al inicio',
        'navigation.exploreAcademies': 'Explorar Academias',
        'navigation.createAcademy': 'Crear Academia',
      }
      return translations[key] || key
    },
  }),
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock TanStack Router
const mockNavigate = jest.fn()
jest.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className, ...props }: any) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ArrowLeft: ({ className }: { className?: string }) => (
    <div className={className} data-testid='arrow-left-icon'>
      ←
    </div>
  ),
}))

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, size, asChild, ...props }: any) => {
    const Component = asChild ? 'div' : 'button'
    return (
      <Component
        data-variant={variant}
        data-size={size}
        data-testid='button'
        {...props}
      >
        {children}
      </Component>
    )
  },
}))

jest.mock('@/components/language-toggle', () => ({
  LanguageToggle: () => <div data-testid='language-toggle'>Lang</div>,
}))

jest.mock('@/components/large-logo', () => ({
  LargeLogo: () => <div data-testid='large-logo'>LOGO</div>,
}))

// Mock auth store for UserMenu
const mockAuthStore = {
  isAuthenticated: false,
  user: null,
  logout: jest.fn(),
  academyData: null,
  currentAcademy: null,
}

jest.mock('@/stores/auth-store', () => ({
  useAuthStore: () => mockAuthStore,
}))

jest.mock('../user-menu', () => ({
  UserMenu: () => <div data-testid='user-menu'>User Menu</div>,
}))

describe('Header', () => {
  describe('Basic structure', () => {
    it('should render as header element', () => {
      render(<Header />)

      const header = screen.getByRole('banner')
      expect(header).toBeInTheDocument()
      expect(header.tagName).toBe('HEADER')
    })

    it('should have correct styling classes', () => {
      render(<Header />)

      const header = screen.getByRole('banner')
      expect(header).toHaveClass(
        'bg-background/95',
        'supports-[backdrop-filter]:bg-background/60',
        'sticky',
        'top-0',
        'z-50',
        'border-b',
        'backdrop-blur'
      )
    })

    it('should have container with proper layout', () => {
      render(<Header />)

      const container = document.querySelector(
        '.container.flex.h-16.items-center.justify-between'
      )
      expect(container).toBeInTheDocument()
    })
  })

  describe('Logo section', () => {
    it('should render logo', () => {
      render(<Header />)

      expect(screen.getByTestId('large-logo')).toBeInTheDocument()
    })

    it('should link logo to home', () => {
      render(<Header />)

      const logoLink = screen.getByTestId('large-logo').closest('a')
      expect(logoLink).toHaveAttribute('href', '/')
    })

    it('should have motion wrapper around logo', () => {
      render(<Header />)

      const logoContainer = document.querySelector(
        '.flex.items-center.space-x-2'
      )
      expect(logoContainer).toBeInTheDocument()
      expect(logoContainer).toContainElement(
        screen.getByTestId('large-logo').closest('a')
      )
    })
  })

  describe('Navigation menu', () => {
    it('should render navigation links', () => {
      render(<Header />)

      expect(screen.getByText('Explorar Academias')).toBeInTheDocument()
      expect(screen.getByText('Crear Academia')).toBeInTheDocument()
    })

    it('should have correct navigation links', () => {
      render(<Header />)

      const academiesLink = screen.getByText('Explorar Academias').closest('a')
      const createLink = screen.getByText('Crear Academia').closest('a')

      expect(academiesLink).toHaveAttribute('href', '/academies')
      expect(createLink).toHaveAttribute('href', '/landing')
    })

    it('should have correct styling classes for nav links', () => {
      render(<Header />)

      const academiesLink = screen.getByText('Explorar Academias')
      const createLink = screen.getByText('Crear Academia')

      expect(academiesLink).toHaveClass(
        'hover:text-primary',
        'text-sm',
        'font-medium',
        'transition-colors'
      )
      expect(createLink).toHaveClass(
        'text-primary',
        'hover:text-primary/80',
        'text-sm',
        'font-medium',
        'transition-colors'
      )
    })

    it('should be hidden on mobile devices', () => {
      render(<Header />)

      const nav = document.querySelector('nav')
      expect(nav).toHaveClass('hidden', 'md:flex')
    })
  })

  describe('Utility components', () => {
    it('should render language toggle', () => {
      render(<Header />)

      expect(screen.getByTestId('language-toggle')).toBeInTheDocument()
    })

    it('should render user menu components', () => {
      render(<Header />)

      // UserMenu renders login/register buttons when not authenticated
      expect(screen.getByText(/navigation.login/)).toBeInTheDocument()
      expect(screen.getByText(/navigation.register/)).toBeInTheDocument()
    })

    it('should group utility components together', () => {
      render(<Header />)

      // Get the rightmost utility container (last one)
      const utilityContainers = document.querySelectorAll(
        '.flex.items-center.space-x-4'
      )
      const rightUtilityContainer =
        utilityContainers[utilityContainers.length - 1]
      expect(rightUtilityContainer).toBeInTheDocument()

      const languageToggle = screen.getByTestId('language-toggle')

      expect(rightUtilityContainer).toContainElement(languageToggle)
      // User menu buttons are also in this container
      expect(rightUtilityContainer?.textContent).toContain('navigation.login')
    })
  })

  describe('Back button functionality', () => {
    it('should not show back button by default', () => {
      render(<Header />)

      expect(screen.queryByTestId('arrow-left-icon')).not.toBeInTheDocument()
      expect(screen.queryByText('Volver al inicio')).not.toBeInTheDocument()
    })

    it('should show back button when showBackButton is true', () => {
      render(<Header showBackButton={true} />)

      expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument()
      expect(screen.getByText('Volver al inicio')).toBeInTheDocument()
    })

    it('should use custom back button text', () => {
      render(<Header showBackButton={true} backButtonText='Regresar' />)

      expect(screen.getByText('Regresar')).toBeInTheDocument()
      expect(screen.queryByText('Volver al inicio')).not.toBeInTheDocument()
    })

    it('should use custom back button href', () => {
      render(<Header showBackButton={true} backButtonHref='/custom-path' />)

      const backLink = screen.getByText('Volver al inicio').closest('a')
      expect(backLink).toHaveAttribute('href', '/custom-path')
    })

    it('should default to home path if no href provided', () => {
      render(<Header showBackButton={true} />)

      const backLink = screen.getByText('Volver al inicio').closest('a')
      expect(backLink).toHaveAttribute('href', '/')
    })

    it('should render back button with correct styling', () => {
      render(<Header showBackButton={true} />)

      const backButton = screen
        .getByText('Volver al inicio')
        .closest('[data-testid="button"]')
      expect(backButton).toHaveAttribute('data-variant', 'ghost')
      expect(backButton).toHaveAttribute('data-size', 'sm')
    })

    it('should include arrow icon in back button', () => {
      render(<Header showBackButton={true} />)

      const arrowIcon = screen.getByTestId('arrow-left-icon')
      expect(arrowIcon).toHaveClass('mr-2', 'h-4', 'w-4')
    })
  })

  describe('Layout structure', () => {
    it('should have three main sections', () => {
      render(<Header />)

      // Left section (back button area)
      const leftSection = document.querySelector('.flex.items-center.space-x-4')
      expect(leftSection).toBeInTheDocument()

      // Center section (logo)
      const logoSection = document.querySelector('.flex.items-center.space-x-2')
      expect(logoSection).toBeInTheDocument()

      // Right section (utilities)
      const rightSection = document.querySelector(
        '.flex.items-center.space-x-4'
      )
      expect(rightSection).toBeInTheDocument()
    })

    it('should maintain responsive layout', () => {
      render(<Header />)

      // Container should be responsive
      const container = document.querySelector('.container')
      expect(container).toBeInTheDocument()

      // Navigation should be responsive
      const nav = document.querySelector('nav.hidden.md\\:flex')
      expect(nav).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should be accessible as banner landmark', () => {
      render(<Header />)

      const header = screen.getByRole('banner')
      expect(header).toBeInTheDocument()
    })

    it('should have accessible navigation links', () => {
      render(<Header />)

      const academiesLink = screen.getByRole('link', {
        name: 'Explorar Academias',
      })
      const createLink = screen.getByRole('link', { name: 'Crear Academia' })

      expect(academiesLink).toBeInTheDocument()
      expect(createLink).toBeInTheDocument()
    })

    it('should have accessible logo link', () => {
      render(<Header />)

      const logoLinks = screen.getAllByRole('link')
      const homeLink = logoLinks.find(
        (link) => link.getAttribute('href') === '/'
      )
      expect(homeLink).toBeInTheDocument()
    })
  })

  describe('Internationalization', () => {
    it('should use translation keys for navigation text', () => {
      render(<Header />)

      expect(screen.getByText('Explorar Academias')).toBeInTheDocument()
      expect(screen.getByText('Crear Academia')).toBeInTheDocument()
    })

    it('should use translation for back button text', () => {
      render(<Header showBackButton={true} />)

      expect(screen.getByText('Volver al inicio')).toBeInTheDocument()
    })
  })
})
