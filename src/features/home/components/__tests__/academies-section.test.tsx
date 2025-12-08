import type { FeaturedAcademiesByCategory } from '@/services/academy-service'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AcademiesSection } from '../academies-section'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'home.academies.title': 'Academias Destacadas',
        'home.academies.description':
          'Descubre las mejores academias especializadas en diferentes áreas',
        'home.academies.loading': 'Cargando academias...',
        'home.academies.error': 'Error al cargar las academias destacadas.',
        'home.academies.retry': 'Reintentar',
        'home.academies.notFound': 'No se encontraron academias destacadas.',
        'home.academies.viewAll': 'Ver Todas las Academias',
      }
      return translations[key] || key
    },
  }),
}))

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Loader2: ({ className }: { className?: string }) => (
    <div className={className} data-testid='loader-icon'>
      Loading...
    </div>
  ),
  AlertCircle: ({ className }: { className?: string }) => (
    <div className={className} data-testid='alert-icon'>
      Alert
    </div>
  ),
  ArrowRight: ({ className }: { className?: string }) => (
    <div className={className} data-testid='arrow-icon'>
      →
    </div>
  ),
}))

// Mock UI components
vi.mock('@/components/ui/alert', () => ({
  Alert: ({ children, variant, ...props }: any) => (
    <div data-testid='alert' data-variant={variant} {...props}>
      {children}
    </div>
  ),
  AlertDescription: ({ children, ...props }: any) => (
    <div data-testid='alert-description' {...props}>
      {children}
    </div>
  ),
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, ...props }: any) => (
    <button
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}))

// Mock AcademyCard component
vi.mock('../academy-card', () => ({
  AcademyCard: ({ academy }: any) => (
    <div data-testid={`academy-card-${academy.id}`}>
      <h3>{academy.name}</h3>
      <p>{academy.description}</p>
    </div>
  ),
}))

const mockData: FeaturedAcademiesByCategory[] = [
  {
    category: {
      id: 1,
      name: 'Tecnología',
      slug: 'tecnologia',
      description: 'Categoría de tecnología',
      academies_count: 2,
      academies: [],
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    academies: [
      {
        id: 1,
        name: 'Academia de Programación',
        slug: 'academia-programacion',
        description: 'Aprende a programar desde cero',
        logo_url: 'https://example.com/image1.jpg',
        banner_url: null,
        monthly_price: '2999',
        subscription_required: false,
        creator: {
          id: 1,
          name: 'Juan Pérez',
          email: 'juan@example.com',
        },
        academy_category: null,
        academy_configuration: {
          enable_gamification: true,
        },
        courses_count: 10,
        enrolled_users_count: 500,
        badges_count: 5,
        courses: [],
      },
      {
        id: 2,
        name: 'Academia de IA',
        slug: 'academia-ia',
        description: 'Inteligencia Artificial moderna',
        logo_url: 'https://example.com/image2.jpg',
        banner_url: null,
        monthly_price: '3999',
        subscription_required: false,
        creator: {
          id: 2,
          name: 'María González',
          email: 'maria@example.com',
        },
        academy_category: null,
        academy_configuration: {
          enable_gamification: true,
        },
        courses_count: 8,
        enrolled_users_count: 300,
        badges_count: 3,
        courses: [],
      },
    ],
  },
  {
    category: {
      id: 2,
      name: 'Diseño',
      slug: 'diseno',
      description: 'Categoría de diseño',
      academies_count: 1,
      academies: [],
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    academies: [
      {
        id: 3,
        name: 'Academia de UX/UI',
        slug: 'academia-ux-ui',
        description: 'Diseño centrado en el usuario',
        logo_url: 'https://example.com/image3.jpg',
        banner_url: null,
        monthly_price: '2499',
        subscription_required: false,
        creator: {
          id: 3,
          name: 'Carlos López',
          email: 'carlos@example.com',
        },
        academy_category: null,
        academy_configuration: {
          enable_gamification: false,
        },
        courses_count: 12,
        enrolled_users_count: 400,
        badges_count: 8,
        courses: [],
      },
    ],
  },
]

describe('AcademiesSection', () => {
  const mockOnRetry = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Loading state', () => {
    it('should render loading state', () => {
      render(
        <AcademiesSection
          data={[]}
          isLoading={true}
          isError={false}
          onRetry={mockOnRetry}
        />
      )

      expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
      expect(screen.getByText('Cargando academias...')).toBeInTheDocument()
    })
  })

  describe('Error state', () => {
    it('should render error state with retry button', () => {
      render(
        <AcademiesSection
          data={[]}
          isLoading={false}
          isError={true}
          onRetry={mockOnRetry}
        />
      )

      expect(screen.getByTestId('alert')).toBeInTheDocument()
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument()
      expect(
        screen.getByText('Error al cargar las academias destacadas.')
      ).toBeInTheDocument()
      expect(screen.getByText('Reintentar')).toBeInTheDocument()
    })

    it('should call onRetry when retry button is clicked', async () => {
      const user = userEvent.setup()

      render(
        <AcademiesSection
          data={[]}
          isLoading={false}
          isError={true}
          onRetry={mockOnRetry}
        />
      )

      const retryButton = screen.getByText('Reintentar')
      await user.click(retryButton)

      expect(mockOnRetry).toHaveBeenCalledTimes(1)
    })
  })

  describe('Data display', () => {
    it('should render section header', () => {
      render(
        <AcademiesSection
          data={mockData}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
        />
      )

      expect(screen.getByText('Academias Destacadas')).toBeInTheDocument()
      expect(
        screen.getByText(
          'Descubre las mejores academias especializadas en diferentes áreas'
        )
      ).toBeInTheDocument()
    })

    it('should render academies grouped by category', () => {
      render(
        <AcademiesSection
          data={mockData}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
        />
      )

      // Check categories are rendered
      expect(screen.getByText('Tecnología')).toBeInTheDocument()
      expect(screen.getByText('Diseño')).toBeInTheDocument()

      // Check academies are rendered (using our mocked AcademyCard)
      expect(screen.getByTestId('academy-card-1')).toBeInTheDocument()
      expect(screen.getByTestId('academy-card-2')).toBeInTheDocument()
      expect(screen.getByTestId('academy-card-3')).toBeInTheDocument()

      expect(screen.getByText('Academia de Programación')).toBeInTheDocument()
      expect(screen.getByText('Academia de IA')).toBeInTheDocument()
      expect(screen.getByText('Academia de UX/UI')).toBeInTheDocument()
    })

    it('should render "Ver Todas las Academias" link at the bottom', () => {
      render(
        <AcademiesSection
          data={mockData}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
        />
      )

      const viewAllLinks = screen.getAllByText('Ver Todas las Academias')
      expect(viewAllLinks).toHaveLength(1) // Only one at the bottom of the section
    })

    it('should skip categories with empty academies', () => {
      const dataWithEmptyCategory: FeaturedAcademiesByCategory[] = [
        ...mockData,
        {
          category: {
            id: 3,
            name: 'Categoría Vacía',
            slug: 'vacia',
            description: 'Categoría sin academias',
            academies_count: 0,
            academies: [],
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          },
          academies: [],
        },
      ]

      render(
        <AcademiesSection
          data={dataWithEmptyCategory}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
        />
      )

      expect(screen.queryByText('Categoría Vacía')).not.toBeInTheDocument()
    })
  })

  describe('Empty state', () => {
    it('should render empty state message when no data', () => {
      render(
        <AcademiesSection
          data={[]}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
        />
      )

      expect(
        screen.getByText('No se encontraron academias destacadas.')
      ).toBeInTheDocument()
    })

    it('should render empty state when data exists but all categories are empty', () => {
      const emptyData: FeaturedAcademiesByCategory[] = [
        {
          category: {
            id: 1,
            name: 'Tecnología',
            slug: 'tecnologia',
            description: 'Categoría de tecnología',
            academies_count: 0,
            academies: [],
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          },
          academies: [],
        },
      ]

      render(
        <AcademiesSection
          data={emptyData}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
        />
      )

      // The component should render the header and bottom link, but not the category content
      expect(screen.getByText('Academias Destacadas')).toBeInTheDocument()
      expect(screen.getByText('Ver Todas las Academias')).toBeInTheDocument()
      // Category name should not appear since it has no academies
      expect(screen.queryByText('Tecnología')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(
        <AcademiesSection
          data={mockData}
          isLoading={false}
          isError={false}
          onRetry={mockOnRetry}
        />
      )

      // Main section title
      const mainHeading = screen.getByRole('heading', {
        name: 'Academias Destacadas',
      })
      expect(mainHeading).toBeInTheDocument()

      // Category headings
      expect(
        screen.getByRole('heading', { name: 'Tecnología' })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: 'Diseño' })
      ).toBeInTheDocument()
    })
  })
})
