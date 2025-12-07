import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '../footer'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'footer.allRightsReserved': 'Todos los derechos reservados',
        'navigation.login': 'Iniciar Sesión',
        'navigation.register': 'Registrarse'
      }
      return translations[key] || key
    }
  })
}))

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  GraduationCap: ({ className }: { className?: string }) => (
    <div className={className} data-testid="graduation-cap-icon">🎓</div>
  ),
}))

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, size, variant, asChild, ...props }: any) => {
    const Component = asChild ? 'div' : 'button'
    return (
      <Component 
        data-size={size}
        data-variant={variant}
        data-testid="button"
        {...props}
      >
        {children}
      </Component>
    )
  },
}))

describe('Footer', () => {
  describe('Basic structure', () => {
    it('should render as footer element', () => {
      render(<Footer />)

      const footer = screen.getByRole('contentinfo')
      expect(footer).toBeInTheDocument()
      expect(footer.tagName).toBe('FOOTER')
    })

    it('should have correct styling classes', () => {
      render(<Footer />)

      const footer = screen.getByRole('contentinfo')
      expect(footer).toHaveClass('bg-muted/50', 'border-t')
    })

    it('should have container wrapper', () => {
      render(<Footer />)

      const container = document.querySelector('.container')
      expect(container).toBeInTheDocument()
    })
  })

  describe('Branding section', () => {
    it('should render logo icon', () => {
      render(<Footer />)

      const icon = screen.getByTestId('graduation-cap-icon')
      expect(icon).toBeInTheDocument()
      expect(icon).toHaveClass('text-primary', 'h-6', 'w-6')
    })

    it('should render brand name', () => {
      render(<Footer />)

      expect(screen.getByText('ISWO Academy')).toBeInTheDocument()
    })

    it('should have brand name with correct styling', () => {
      render(<Footer />)

      const brandName = screen.getByText('ISWO Academy')
      expect(brandName).toHaveClass('font-bold')
    })

    it('should group icon and brand name together', () => {
      render(<Footer />)

      const brandContainer = document.querySelector('.flex.items-center.space-x-2')
      expect(brandContainer).toBeInTheDocument()
      
      const icon = screen.getByTestId('graduation-cap-icon')
      const brandName = screen.getByText('ISWO Academy')
      
      expect(brandContainer).toContainElement(icon)
      expect(brandContainer).toContainElement(brandName)
    })
  })

  describe('Copyright section', () => {
    it('should render copyright text', () => {
      render(<Footer />)

      expect(screen.getByText('© 2025 ISWO Academy. Todos los derechos reservados.')).toBeInTheDocument()
    })

    it('should have correct styling for copyright', () => {
      render(<Footer />)

      const copyright = screen.getByText('© 2025 ISWO Academy. Todos los derechos reservados.')
      expect(copyright).toHaveClass('text-muted-foreground', 'text-sm')
    })
  })

  describe('Navigation buttons', () => {
    it('should render login and register buttons', () => {
      render(<Footer />)

      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
      expect(screen.getByText('Registrarse')).toBeInTheDocument()
    })

    it('should have correct button properties', () => {
      render(<Footer />)

      const buttons = screen.getAllByTestId('button')
      expect(buttons).toHaveLength(2)
      
      // Login button (ghost variant)
      expect(buttons[0]).toHaveAttribute('data-size', 'sm')
      expect(buttons[0]).toHaveAttribute('data-variant', 'ghost')
      
      // Register button (default variant)
      expect(buttons[1]).toHaveAttribute('data-size', 'sm')
    })

    it('should have correct links', () => {
      render(<Footer />)

      const loginLink = screen.getByText('Iniciar Sesión').closest('a')
      const registerLink = screen.getByText('Registrarse').closest('a')

      expect(loginLink).toHaveAttribute('href', '/sign-in')
      expect(registerLink).toHaveAttribute('href', '/sign-up')
    })

    it('should group navigation buttons together', () => {
      render(<Footer />)

      const navContainer = document.querySelector('.flex.items-center.space-x-4')
      expect(navContainer).toBeInTheDocument()
      
      const loginButton = screen.getByText('Iniciar Sesión').closest('[data-testid="button"]') as HTMLElement
      const registerButton = screen.getByText('Registrarse').closest('[data-testid="button"]') as HTMLElement
      
      expect(navContainer).toContainElement(loginButton)
      expect(navContainer).toContainElement(registerButton)
    })
  })

  describe('Responsive layout', () => {
    it('should have responsive flex classes', () => {
      render(<Footer />)

      const mainContainer = document.querySelector('.flex.flex-col.items-center.justify-between.space-y-4.md\\:flex-row.md\\:space-y-0')
      expect(mainContainer).toBeInTheDocument()
    })

    it('should have proper container padding', () => {
      render(<Footer />)

      const container = document.querySelector('.container.py-8')
      expect(container).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should be accessible as contentinfo landmark', () => {
      render(<Footer />)

      const footer = screen.getByRole('contentinfo')
      expect(footer).toBeInTheDocument()
    })

    it('should have accessible navigation links', () => {
      render(<Footer />)

      const loginLink = screen.getByRole('link', { name: 'Iniciar Sesión' })
      const registerLink = screen.getByRole('link', { name: 'Registrarse' })

      expect(loginLink).toBeInTheDocument()
      expect(registerLink).toBeInTheDocument()
    })
  })

  describe('Internationalization', () => {
    it('should use translation keys for text content', () => {
      render(<Footer />)

      // Verify translated content is rendered (text may be split across elements)
      expect(screen.getByText(/Todos los derechos reservados/)).toBeInTheDocument()
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
      expect(screen.getByText('Registrarse')).toBeInTheDocument()
    })
  })

  describe('Layout sections', () => {
    it('should contain all three main sections', () => {
      render(<Footer />)

      // Branding section
      expect(screen.getByText('ISWO Academy')).toBeInTheDocument()
      
      // Copyright section
      expect(screen.getByText(/© 2025 ISWO Academy/)).toBeInTheDocument()
      
      // Navigation section
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
      expect(screen.getByText('Registrarse')).toBeInTheDocument()
    })

    it('should maintain proper visual hierarchy', () => {
      render(<Footer />)

      // Brand should be bold
      const brand = screen.getByText('ISWO Academy')
      expect(brand).toHaveClass('font-bold')
      
      // Copyright should be muted
      const copyright = screen.getByText(/© 2025 ISWO Academy/)
      expect(copyright).toHaveClass('text-muted-foreground')
    })
  })
})