import {
  render,
  screen,
  fireEvent
} from '@testing-library/react'
import { vi, beforeEach, describe, it, expect } from 'vitest'
import { AcademyDetailPage } from '../../features/academy-detail/index'
import type { AcademySummary } from '@/types'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock TanStack Router
const mockUseParams = vi.fn()
const mockUseRouter = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useParams: () => mockUseParams(),
  useRouter: () => mockUseRouter(),
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}))

// Mock useAcademy hook
const mockUseAcademy = vi.fn()
vi.mock('@/hooks/use-academy', () => ({
  useAcademy: () => mockUseAcademy(),
}))

// Mock Header component
vi.mock('@/features/home/components/header', () => ({
  Header: () => <header data-testid="public-header">Header</header>,
}))

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
}))

vi.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  TabsContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  TabsList: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  TabsTrigger: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}))

vi.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  AvatarFallback: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  AvatarImage: ({ src, ...props }: any) => <img src={src} {...props} />,
}))

vi.mock('@/components/ui/separator', () => ({
  Separator: (props: any) => <hr {...props} />,
}))

// Mock CourseCard component
vi.mock('@/components/course-card', () => ({
  CourseCard: ({ course }: any) => (
    <div data-testid="course-card">
      <h4>{course.title}</h4>
      <p>{course.description}</p>
    </div>
  ),
}))

// Mock Lucide React icons
vi.mock('lucide-react', () => {
  const MockIcon = ({ ...props }) => <span {...props} />
  return {
    ArrowLeft: MockIcon,
    Star: MockIcon,
    Users: MockIcon,
    BookOpen: MockIcon,
    Clock: MockIcon,
    Share2: MockIcon,
    Heart: MockIcon,
    ShoppingCart: MockIcon,
    CheckCircle: MockIcon,
  }
})

describe('AcademyDetailPage', () => {
  const mockAcademy: AcademySummary = {
    id: 1,
    name: 'React Avanzado',
    description: 'Aprende React desde cero hasta nivel avanzado',
    slug: 'react-avanzado',
    banner_url: 'https://example.com/banner.jpg',
    logo_url: 'https://example.com/logo.jpg',
    monthly_price: '29.99',
    subscription_required: true,
    enrolled_users_count: 1250,
    courses_count: 8,
    academy_category: {
      id: 1,
      name: 'Desarrollo Web',
      slug: 'desarrollo-web',
      description: null,
      academies_count: 5,
      academies: [],
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    },
    creator: {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@example.com',
    },
    academy_configuration: {
      enable_gamification: true,
    },
    badges_count: 5,
    courses: [
      {
        id: 1,
        academy_id: 1,
        title: 'Introducción a React',
        slug: 'intro-react',
        description: 'Conceptos básicos de React',
        is_free: false,
        price: 29.99,
        currency: 'USD',
        pricing_type: 'subscription' as const,
        sale_price: null,
        sale_ends_at: null,
        subscription_price_monthly: null,
        subscription_price_annual: null,
        difficulty_level: 'beginner' as const,
        status: 'published' as const,
        duration_minutes: 360,
        category: null,
        tags: null,
        prerequisites: null,
        allow_comments: true,
        certificate_enabled: true,
        progress_tracking: true,
        featured: true,
        trial_period_days: 0,
        meta_title: null,
        meta_description: null,
        thumbnail_url: 'https://example.com/course1.jpg',
        creator_id: 1,
        learning_path_id: null,
        position: 1,
        lessons_count: 30,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      {
        id: 2,
        academy_id: 1,
        title: 'React Hooks Avanzados',
        slug: 'react-hooks-avanzados',
        description: 'Hooks personalizados y avanzados',
        is_free: false,
        price: 39.99,
        currency: 'USD',
        pricing_type: 'subscription' as const,
        sale_price: null,
        sale_ends_at: null,
        subscription_price_monthly: null,
        subscription_price_annual: null,
        difficulty_level: 'advanced' as const,
        status: 'published' as const,
        duration_minutes: 480,
        category: null,
        tags: null,
        prerequisites: null,
        allow_comments: true,
        certificate_enabled: true,
        progress_tracking: true,
        featured: true,
        trial_period_days: 0,
        meta_title: null,
        meta_description: null,
        thumbnail_url: 'https://example.com/course2.jpg',
        creator_id: 1,
        learning_path_id: null,
        position: 2,
        lessons_count: 40,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
    ],
  }

  const mockRouter = {
    history: {
      back: vi.fn(),
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseParams.mockReturnValue({ slug: 'react-avanzado' })
    mockUseRouter.mockReturnValue(mockRouter)
  })

  describe('Loading State', () => {
    it('should show loading spinner when academy is loading', () => {
      mockUseAcademy.mockReturnValue({
        academy: null,
        loading: true,
        error: null,
      })

      render(<AcademyDetailPage />)

      expect(screen.getByText('Cargando academia...')).toBeInTheDocument()
      expect(screen.getByTestId('public-header')).toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('should show error card when academy is not found', () => {
      mockUseAcademy.mockReturnValue({
        academy: null,
        loading: false,
        error: 'Academia no encontrada',
      })

      render(<AcademyDetailPage />)

      expect(screen.getByRole('heading', { name: 'Academia no encontrada' })).toBeInTheDocument()
      expect(screen.getByText('Volver a Academias')).toBeInTheDocument()
    })

    it('should show default error message when no specific error', () => {
      mockUseAcademy.mockReturnValue({
        academy: null,
        loading: false,
        error: null,
      })

      render(<AcademyDetailPage />)

      expect(
        screen.getByText(
          'La academia que buscas no existe o no está disponible.'
        )
      ).toBeInTheDocument()
    })
  })

  describe('Success State', () => {
    beforeEach(() => {
      mockUseAcademy.mockReturnValue({
        academy: mockAcademy,
        loading: false,
        error: null,
      })
    })

    it('should render academy details correctly', () => {
      render(<AcademyDetailPage />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('React Avanzado')
      expect(screen.getByText('Desarrollo Web')).toBeInTheDocument()
      expect(screen.getAllByText('4.8')[0]).toBeInTheDocument()
      expect(screen.getByText('(156 reseñas)')).toBeInTheDocument()
    })

    it('should display academy statistics', () => {
      render(<AcademyDetailPage />)

      expect(screen.getByText('1,250 estudiantes')).toBeInTheDocument()
      expect(screen.getAllByText('8')[0]).toBeInTheDocument()
      expect(screen.getByText('24h de contenido')).toBeInTheDocument()
    })

    it('should show instructor information', () => {
      render(<AcademyDetailPage />)

      expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
      expect(screen.getByText('Creador de la Academia')).toBeInTheDocument()
      expect(
        screen.getByText(
          'Desarrollador Full Stack con 10 años de experiencia'
        )
      ).toBeInTheDocument()
    })

    it('should display subscription pricing', () => {
      render(<AcademyDetailPage />)

      expect(screen.getByText('$29.99')).toBeInTheDocument()
      expect(screen.getByText('/mes')).toBeInTheDocument()
      expect(screen.getByText('Suscribirse $29.99/mes')).toBeInTheDocument()
    })

    it('should render courses list', () => {
      render(<AcademyDetailPage />)

      expect(screen.getByText('Introducción a React')).toBeInTheDocument()
      expect(screen.getByText('React Hooks Avanzados')).toBeInTheDocument()
      expect(screen.getByText('Conceptos básicos de React')).toBeInTheDocument()
      expect(
        screen.getByText('Hooks personalizados y avanzados')
      ).toBeInTheDocument()
    })

    it('should show subscription benefits', () => {
      render(<AcademyDetailPage />)

      expect(screen.getByText('Acceso a todos los cursos')).toBeInTheDocument()
      expect(screen.getByText('Nuevos cursos cada mes')).toBeInTheDocument()
      expect(
        screen.getByText('Certificados al completar')
      ).toBeInTheDocument()
      expect(screen.getByText('Soporte del instructor')).toBeInTheDocument()
    })

    it('should handle back button click', () => {
      render(<AcademyDetailPage />)

      const backButton = screen.getByText('Volver')
      fireEvent.click(backButton)

      expect(mockRouter.history.back).toHaveBeenCalled()
    })
  })

  describe('Academy without courses', () => {
    it('should show empty state when academy has no courses', () => {
      const academyWithoutCourses = {
        ...mockAcademy,
        courses: [],
        courses_count: 0,
      }

      mockUseAcademy.mockReturnValue({
        academy: academyWithoutCourses,
        loading: false,
        error: null,
      })

      render(<AcademyDetailPage />)

      expect(screen.getByText('Próximamente')).toBeInTheDocument()
      expect(
        screen.getByText(
          'Esta academia está preparando contenido increíble. ¡Mantente atento!'
        )
      ).toBeInTheDocument()
    })
  })

  describe('Academy without optional data', () => {
    it('should handle academy without optional fields', () => {
      const minimalAcademy = {
        ...mockAcademy,
        banner_url: null,
        logo_url: null,
        total_duration_hours: null,
        total_lessons: null,
        monthly_price: 0,
        creator: {
          ...mockAcademy.creator,
          avatar_url: null,
          bio: null,
        },
      }

      mockUseAcademy.mockReturnValue({
        academy: minimalAcademy,
        loading: false,
        error: null,
      })

      render(<AcademyDetailPage />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('React Avanzado')
      expect(screen.getByText('Suscribirse $0/mes')).toBeInTheDocument()
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    })
  })

  describe('Tabs functionality', () => {
    beforeEach(() => {
      mockUseAcademy.mockReturnValue({
        academy: mockAcademy,
        loading: false,
        error: null,
      })
    })

    it('should show courses tab by default', () => {
      render(<AcademyDetailPage />)

      expect(screen.getByText('Cursos (8)')).toBeInTheDocument()
      expect(screen.getByText('Reseñas (156)')).toBeInTheDocument()
    })

    it('should display reviews placeholder content', () => {
      render(<AcademyDetailPage />)

      expect(screen.getByText('Reseñas próximamente')).toBeInTheDocument()
      expect(
        screen.getByText(
          'Las reseñas de estudiantes estarán disponibles pronto.'
        )
      ).toBeInTheDocument()
    })
  })
})