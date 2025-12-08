import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CTASection } from '../cta-section'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'home.cta.title': 'Crea tu propia academia online',
        'home.cta.description':
          'Únete a miles de creadores que ya están monetizando su conocimiento. Crea cursos, construye tu comunidad y genera ingresos pasivos.',
        'home.cta.button': 'Crear Mi Academia',
      }
      return translations[key] || key
    },
  }),
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
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
  ArrowRight: ({ className }: { className?: string }) => (
    <div className={className} data-testid='arrow-right-icon'>
      ➡️
    </div>
  ),
}))

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, size, asChild, ...props }: any) => {
    const Component = asChild ? 'div' : 'button'
    return (
      <Component data-size={size} data-testid='button' {...props}>
        {children}
      </Component>
    )
  },
}))

describe('CTASection', () => {
  describe('Content rendering', () => {
    it('should render all text content correctly', () => {
      render(<CTASection />)

      expect(
        screen.getByText('Crea tu propia academia online')
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          'Únete a miles de creadores que ya están monetizando su conocimiento. Crea cursos, construye tu comunidad y genera ingresos pasivos.'
        )
      ).toBeInTheDocument()
      expect(screen.getByText('Crear Mi Academia')).toBeInTheDocument()
    })

    it('should render title as heading element', () => {
      render(<CTASection />)

      const title = screen.getByRole('heading', { level: 2 })
      expect(title).toHaveTextContent('Crea tu propia academia online')
    })

    it('should render description paragraph', () => {
      render(<CTASection />)

      const description = screen.getByText(
        'Únete a miles de creadores que ya están monetizando su conocimiento. Crea cursos, construye tu comunidad y genera ingresos pasivos.'
      )
      expect(description.tagName).toBe('P')
    })
  })

  describe('Section structure', () => {
    it('should render as section element', () => {
      render(<CTASection />)

      const section = document.querySelector('section')
      expect(section).toBeInTheDocument()
      expect(section?.tagName).toBe('SECTION')
    })

    it('should have correct CSS classes for styling', () => {
      render(<CTASection />)

      const section = document.querySelector('section')
      expect(section).toHaveClass('bg-primary/5', 'border-t', 'py-20')
    })

    it('should have container wrapper', () => {
      render(<CTASection />)

      const container = document.querySelector('.container')
      expect(container).toBeInTheDocument()
    })

    it('should have centered content wrapper', () => {
      render(<CTASection />)

      const centeredDiv = document.querySelector(
        '.mx-auto.max-w-4xl.text-center'
      )
      expect(centeredDiv).toBeInTheDocument()
    })
  })

  describe('Button and navigation', () => {
    it('should render button with correct properties', () => {
      render(<CTASection />)

      const button = screen.getByTestId('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('data-size', 'lg')
    })

    it('should render link to landing page', () => {
      render(<CTASection />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/landing')
      expect(link).toHaveTextContent('Crear Mi Academia')
    })

    it('should render arrow icon in button', () => {
      render(<CTASection />)

      const arrowIcon = screen.getByTestId('arrow-right-icon')
      expect(arrowIcon).toBeInTheDocument()
      expect(arrowIcon).toHaveClass('ml-2', 'h-4', 'w-4')
    })

    it('should have button wrapping link structure', () => {
      render(<CTASection />)

      const link = screen.getByRole('link')
      const button = screen.getByTestId('button')

      expect(button).toContainElement(link)
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<CTASection />)

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toBeInTheDocument()
    })

    it('should have accessible button text', () => {
      render(<CTASection />)

      const button = screen.getByRole('link', { name: /crear mi academia/i })
      expect(button).toBeInTheDocument()
    })

    it('should provide clear call-to-action context', () => {
      render(<CTASection />)

      // Should have both title and description for context
      expect(
        screen.getByText('Crea tu propia academia online')
      ).toBeInTheDocument()
      expect(
        screen.getByText(/únete a miles de creadores/i)
      ).toBeInTheDocument()
    })
  })

  describe('Layout and styling', () => {
    it('should have responsive title classes', () => {
      render(<CTASection />)

      const title = screen.getByRole('heading', { level: 2 })
      expect(title).toHaveClass(
        'text-3xl',
        'font-bold',
        'tracking-tight',
        'sm:text-4xl'
      )
    })

    it('should have proper description styling', () => {
      render(<CTASection />)

      const description = screen.getByText(/únete a miles de creadores/i)
      expect(description).toHaveClass(
        'text-muted-foreground',
        'mt-6',
        'text-lg',
        'leading-8'
      )
    })

    it('should have proper button container spacing', () => {
      render(<CTASection />)

      const buttonContainer = document.querySelector('.mt-10')
      expect(buttonContainer).toBeInTheDocument()
    })
  })

  describe('Animation wrapper', () => {
    it('should render content within motion wrapper', () => {
      render(<CTASection />)

      // Content should be wrapped in motion.div (mocked as regular div)
      const title = screen.getByText('Crea tu propia academia online')
      const description = screen.getByText(/únete a miles de creadores/i)
      const button = screen.getByTestId('button')

      // All elements should be present
      expect(title).toBeInTheDocument()
      expect(description).toBeInTheDocument()
      expect(button).toBeInTheDocument()
    })
  })

  describe('Internationalization', () => {
    it('should use translation keys for all text content', () => {
      // This test verifies that the component calls useTranslation
      // and uses the correct translation keys
      render(<CTASection />)

      // All text should come from translations
      expect(
        screen.getByText('Crea tu propia academia online')
      ).toBeInTheDocument()
      expect(
        screen.getByText(/únete a miles de creadores/i)
      ).toBeInTheDocument()
      expect(screen.getByText('Crear Mi Academia')).toBeInTheDocument()
    })
  })
})
