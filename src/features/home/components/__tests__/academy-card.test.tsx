import type { AcademyFull as Academy } from '@/types/entities/academy'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AcademyCard } from '../academy-card'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, params, ...props }: any) => (
    <a href={`${to}/${params?.slug}`} {...props}>
      {children}
    </a>
  ),
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
  BookOpen: ({ className }: { className?: string }) => (
    <div className={className} data-testid='book-icon'>
      📚
    </div>
  ),
  Users: ({ className }: { className?: string }) => (
    <div className={className} data-testid='users-icon'>
      👥
    </div>
  ),
}))

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className, ...props }: any) => (
    <div className={className} data-testid='card' {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, ...props }: any) => (
    <div data-testid='card-content' {...props}>
      {children}
    </div>
  ),
  CardDescription: ({ children, className, ...props }: any) => (
    <p className={className} data-testid='card-description' {...props}>
      {children}
    </p>
  ),
  CardHeader: ({ children, ...props }: any) => (
    <div data-testid='card-header' {...props}>
      {children}
    </div>
  ),
  CardTitle: ({ children, className, ...props }: any) => (
    <h3 className={className} data-testid='card-title' {...props}>
      {children}
    </h3>
  ),
}))

// Mock formatters
vi.mock('@/lib/formatters', () => ({
  formatPrice: (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseInt(price) : price
    return `$${numPrice.toLocaleString()}`
  },
}))

const mockAcademy: Academy = {
  id: 1,
  name: 'Academia de Programación',
  description: 'Aprende a programar desde cero con los mejores instructores',
  slug: 'academia-programacion',
  logo_url: 'https://example.com/logo.jpg',
  banner_url: null,
  monthly_price: '2999',
  subscription_required: false,
  is_public: true,
  status: 'active',
  enrolled_users_count: 1250,
  courses_count: 15,
  creator: {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@example.com',
  },
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
}

const mockAcademyWithoutOptionalFields: Academy = {
  id: 2,
  name: 'Academia Básica',
  description: 'Una academia simple',
  slug: 'academia-basica',
  logo_url: null,
  banner_url: null,
  monthly_price: '1999',
  subscription_required: false,
  is_public: true,
  status: 'active',
  enrolled_users_count: 0,
  courses_count: 0,
  creator: null,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
}

describe('AcademyCard', () => {
  describe('Content display', () => {
    it('should render academy information correctly', () => {
      render(<AcademyCard academy={mockAcademy} />)

      // Check academy name and description
      expect(screen.getByTestId('card-title')).toHaveTextContent(
        'Academia de Programación'
      )
      expect(screen.getByTestId('card-description')).toHaveTextContent(
        'Aprende a programar desde cero con los mejores instructores'
      )

      // Check creator name
      expect(screen.getByText('Por Juan Pérez')).toBeInTheDocument()

      // Check stats
      expect(screen.getByText('1,250')).toBeInTheDocument() // enrolled users
      expect(screen.getByText('15 cursos')).toBeInTheDocument() // courses count

      // Check price
      expect(screen.getByText('Desde $2,999/mes')).toBeInTheDocument()
    })

    it('should render academy image with correct alt text', () => {
      render(<AcademyCard academy={mockAcademy} />)

      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('src', mockAcademy.logo_url)
      expect(image).toHaveAttribute('alt', mockAcademy.name)
    })

    it('should use fallback image when logo_url is null', () => {
      render(<AcademyCard academy={mockAcademyWithoutOptionalFields} />)

      const image = screen.getByRole('img')
      expect(image).toHaveAttribute(
        'src',
        'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2'
      )
    })

    it('should handle null/undefined optional fields gracefully', () => {
      render(<AcademyCard academy={mockAcademyWithoutOptionalFields} />)

      // Should show 0 for null counts
      expect(screen.getByText('0')).toBeInTheDocument() // enrolled users
      expect(screen.getByText('0 cursos')).toBeInTheDocument() // courses count

      // Should not show creator name when creator is null
      expect(screen.queryByText(/Por /)).not.toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('should create correct link to academy page', () => {
      render(<AcademyCard academy={mockAcademy} />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute(
        'href',
        '/academies/$slug/academia-programacion'
      )
    })

    it('should make entire card clickable', () => {
      render(<AcademyCard academy={mockAcademy} />)

      const card = screen.getByTestId('card')
      expect(card).toHaveClass('cursor-pointer')
    })
  })

  describe('Visual elements', () => {
    it('should render statistics icons', () => {
      render(<AcademyCard academy={mockAcademy} />)

      expect(screen.getByTestId('users-icon')).toBeInTheDocument()
      expect(screen.getByTestId('book-icon')).toBeInTheDocument()
    })

    it('should apply proper CSS classes for layout', () => {
      render(<AcademyCard academy={mockAcademy} />)

      const card = screen.getByTestId('card')
      expect(card).toHaveClass(
        'group',
        'h-full',
        'cursor-pointer',
        'overflow-hidden'
      )
    })
  })

  describe('Price formatting', () => {
    it('should format price correctly', () => {
      const academyWithHighPrice: Academy = {
        ...mockAcademy,
        monthly_price: '15999',
      }

      render(<AcademyCard academy={academyWithHighPrice} />)

      expect(screen.getByText('Desde $15,999/mes')).toBeInTheDocument()
    })

    it('should handle zero price', () => {
      const academyWithZeroPrice: Academy = {
        ...mockAcademy,
        monthly_price: '0',
      }

      render(<AcademyCard academy={academyWithZeroPrice} />)

      expect(screen.getByText('Desde $0/mes')).toBeInTheDocument()
    })
  })

  describe('Animation and interaction', () => {
    it('should pass index prop for staggered animations', () => {
      const { rerender } = render(
        <AcademyCard academy={mockAcademy} index={0} />
      )
      expect(screen.getByTestId('card')).toBeInTheDocument()

      rerender(<AcademyCard academy={mockAcademy} index={5} />)
      expect(screen.getByTestId('card')).toBeInTheDocument()
    })

    it('should default to index 0 when not provided', () => {
      render(<AcademyCard academy={mockAcademy} />)
      expect(screen.getByTestId('card')).toBeInTheDocument()
    })
  })

  describe('Content truncation', () => {
    it('should apply line-clamp classes to prevent overflow', () => {
      render(<AcademyCard academy={mockAcademy} />)

      const title = screen.getByTestId('card-title')
      const description = screen.getByTestId('card-description')

      expect(title).toHaveClass('line-clamp-1')
      expect(description).toHaveClass('line-clamp-2')
    })
  })
})
