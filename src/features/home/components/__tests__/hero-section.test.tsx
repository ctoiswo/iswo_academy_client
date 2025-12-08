import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HeroSection } from '../hero-section'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'home.hero.title': 'Descubre tu próxima',
        'home.hero.titleHighlight': 'oportunidad de aprendizaje',
        'home.hero.description':
          'Explora miles de cursos creados por expertos en academias especializadas',
        'home.hero.imageAlt': 'Fondo de hero section',
      }
      return translations[key] || key
    },
  }),
}))

// Mock GlobalSearchBar component
vi.mock('@/components/search/global-search-bar', () => ({
  GlobalSearchBar: () => <div data-testid='global-search-bar'>Search Bar</div>,
}))

describe('HeroSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Content rendering', () => {
    it('should render hero title and highlight', () => {
      render(<HeroSection />)

      expect(screen.getByText('Descubre tu próxima')).toBeInTheDocument()
      expect(screen.getByText('oportunidad de aprendizaje')).toBeInTheDocument()
    })

    it('should render hero description', () => {
      render(<HeroSection />)

      expect(
        screen.getByText(
          'Explora miles de cursos creados por expertos en academias especializadas'
        )
      ).toBeInTheDocument()
    })

    it('should render background image with proper attributes', () => {
      render(<HeroSection />)

      const image = screen.getByRole('img')
      expect(image).toHaveAttribute(
        'src',
        'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      )
      expect(image).toHaveAttribute('alt', 'Fondo de hero section')
    })

    it('should render GlobalSearchBar component', () => {
      render(<HeroSection />)

      expect(screen.getByTestId('global-search-bar')).toBeInTheDocument()
      expect(screen.getByText('Search Bar')).toBeInTheDocument()
    })
  })

  describe('Layout and styling', () => {
    it('should apply proper CSS classes for responsive design', () => {
      render(<HeroSection />)

      const section = screen.getByRole('img').closest('section')
      expect(section).toHaveClass('relative', 'py-20', 'lg:py-32')
    })

    it('should have proper heading hierarchy', () => {
      render(<HeroSection />)

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveClass(
        'text-4xl',
        'font-bold',
        'tracking-tight',
        'sm:text-6xl',
        'lg:text-7xl'
      )
    })

    it('should highlight title portion correctly', () => {
      render(<HeroSection />)

      const highlightSpan = screen.getByText('oportunidad de aprendizaje')
      expect(highlightSpan.closest('span')).toHaveClass('text-primary')
    })
  })

  describe('Background and overlay', () => {
    it('should render background image with opacity', () => {
      render(<HeroSection />)

      const image = screen.getByRole('img')
      expect(image).toHaveClass(
        'h-full',
        'w-full',
        'object-cover',
        'opacity-10'
      )
    })

    it('should render gradient overlay', () => {
      render(<HeroSection />)

      // Check for gradient overlay div structure
      const section = screen.getByRole('img').closest('section')
      expect(section?.querySelector('.bg-gradient-to-br')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(<HeroSection />)

      const section = screen.getByRole('img').closest('section')
      expect(section).toBeInTheDocument()

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()

      const image = screen.getByRole('img')
      expect(image).toBeInTheDocument()
    })

    it('should have descriptive alt text for background image', () => {
      render(<HeroSection />)

      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('alt', 'Fondo de hero section')
    })
  })

  describe('Content positioning', () => {
    it('should center content properly', () => {
      render(<HeroSection />)

      const container = document.querySelector('.container')
      expect(container).toBeInTheDocument()
    })

    it('should have proper z-index layering', () => {
      render(<HeroSection />)

      // Background should have z-0
      const backgroundDiv = screen
        .getByRole('img')
        .closest('.absolute.inset-0.z-0')
      expect(backgroundDiv).toBeInTheDocument()
    })
  })
})
