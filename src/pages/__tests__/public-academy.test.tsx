import type { AcademySummary } from '@/types'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { toast } from 'sonner'
import { vi, beforeEach, describe, it, expect } from 'vitest'
import { PublicAcademyPage } from '../../features/public-academy/index'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => (
      <section {...props}>{children}</section>
    ),
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}))

// Mock TanStack Router
const mockUseParams = vi.fn()
const mockNavigate = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useParams: () => mockUseParams(),
  useNavigate: () => mockNavigate,
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

// Mock useAcademy hook
const mockUseAcademy = vi.fn()
vi.mock('@/hooks/use-academy', () => ({
  useAcademy: (slug: string) => mockUseAcademy(slug),
}))

// Mock useWishlist hook
const mockUseWishlist = vi.fn()
vi.mock('@/hooks/use-wishlist', () => ({
  useWishlist: () => mockUseWishlist(),
}))

// Mock auth store
const mockUseAuthStore = vi.fn()
vi.mock('@/stores/auth-store', () => ({
  useAuthStore: () => mockUseAuthStore(),
}))

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))

// Mock UI components
vi.mock('@/components/ui/alert', () => ({
  Alert: ({ children, variant, ...props }: any) => (
    <div data-testid={`alert-${variant}`} {...props}>
      {children}
    </div>
  ),
  AlertDescription: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
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

// Mock Lucide React icons
vi.mock('lucide-react', () => {
  const MockIcon = ({ className, ...props }: any) => (
    <span className={className} {...props} />
  )
  return {
    Loader2: MockIcon,
    AlertCircle: MockIcon,
  }
})

// Mock components
vi.mock('./components/page-header', () => ({
  PageHeader: () => <header data-testid='page-header'>Header</header>,
}))

vi.mock('./components/page-footer', () => ({
  PageFooter: () => <footer data-testid='page-footer'>Footer</footer>,
}))

vi.mock('./components/academy-hero', () => ({
  AcademyHero: ({ academy, isSaved, onSave, onShare }: any) => (
    <div data-testid='academy-hero'>
      <h1>{academy.name}</h1>
      <p>{academy.description}</p>
      <button onClick={onSave} data-testid='save-button'>
        {isSaved ? 'Guardado' : 'Guardar'}
      </button>
      <button onClick={onShare} data-testid='share-button'>
        Compartir
      </button>
    </div>
  ),
}))

vi.mock('./components/academy-info', () => ({
  AcademyInfo: ({ academy }: any) => (
    <div data-testid='academy-info'>
      <span>Cursos: {academy.courses_count}</span>
      <span>Estudiantes: {academy.enrolled_users_count}</span>
    </div>
  ),
}))

vi.mock('./components/courses-section', () => ({
  CoursesSection: ({ courses, academyName }: any) => (
    <div data-testid='courses-section'>
      <h2>Cursos de {academyName}</h2>
      {courses.map((course: any) => (
        <div key={course.id} data-testid='course-item'>
          {course.title}
        </div>
      ))}
    </div>
  ),
}))

describe('PublicAcademyPage', () => {
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
    ],
  }

  const mockRefetch = vi.fn()
  const mockToggleWishlist = vi.fn()
  const mockIsInWishlist = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Default mocks
    mockUseParams.mockReturnValue({ slug: 'react-avanzado' })
    mockUseAuthStore.mockReturnValue({ isAuthenticated: true })
    mockUseWishlist.mockReturnValue({
      isInWishlist: mockIsInWishlist,
      toggleWishlist: mockToggleWishlist,
    })
    mockIsInWishlist.mockReturnValue(false)
    mockToggleWishlist.mockReturnValue(true)

    // Mock clipboard and share APIs
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      share: vi.fn().mockResolvedValue(undefined),
    })
  })

  describe('Loading State', () => {
    it('should show loading spinner when academy is loading', () => {
      mockUseAcademy.mockReturnValue({
        academy: null,
        loading: true,
        error: null,
        refetch: mockRefetch,
      })

      render(<PublicAcademyPage />)

      expect(screen.getByText('Cargando academia...')).toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('should show error alert when academy is not found', () => {
      mockUseAcademy.mockReturnValue({
        academy: null,
        loading: false,
        error: 'Academia no encontrada',
        refetch: mockRefetch,
      })

      render(<PublicAcademyPage />)

      expect(screen.getByTestId('alert-destructive')).toBeInTheDocument()
      expect(screen.getByText('Academia no encontrada')).toBeInTheDocument()
      expect(screen.getByText('Reintentar')).toBeInTheDocument()
    })

    it('should show default error message when no specific error', () => {
      mockUseAcademy.mockReturnValue({
        academy: null,
        loading: false,
        error: null,
        refetch: mockRefetch,
      })

      render(<PublicAcademyPage />)

      expect(screen.getByText('No se encontró la academia')).toBeInTheDocument()
    })

    it('should handle retry button click', () => {
      mockUseAcademy.mockReturnValue({
        academy: null,
        loading: false,
        error: 'Error de conexión',
        refetch: mockRefetch,
      })

      render(<PublicAcademyPage />)

      const retryButton = screen.getByText('Reintentar')
      fireEvent.click(retryButton)

      expect(mockRefetch).toHaveBeenCalled()
    })
  })

  describe('Success State', () => {
    beforeEach(() => {
      mockUseAcademy.mockReturnValue({
        academy: mockAcademy,
        loading: false,
        error: null,
        refetch: mockRefetch,
      })
    })

    it('should render all main components', () => {
      render(<PublicAcademyPage />)

      expect(screen.getByTestId('page-header')).toBeInTheDocument()
      expect(screen.getByTestId('academy-hero')).toBeInTheDocument()
      expect(screen.getByTestId('academy-info')).toBeInTheDocument()
      expect(screen.getByTestId('courses-section')).toBeInTheDocument()
      expect(screen.getByTestId('page-footer')).toBeInTheDocument()
    })

    it('should display academy information', () => {
      render(<PublicAcademyPage />)

      expect(screen.getByText('React Avanzado')).toBeInTheDocument()
      expect(
        screen.getByText('Aprende React desde cero hasta nivel avanzado')
      ).toBeInTheDocument()
      expect(screen.getByText('Cursos: 8')).toBeInTheDocument()
      expect(screen.getByText('Estudiantes: 1250')).toBeInTheDocument()
    })

    it('should display courses', () => {
      render(<PublicAcademyPage />)

      expect(screen.getByText('Cursos de React Avanzado')).toBeInTheDocument()
      expect(screen.getByText('Introducción a React')).toBeInTheDocument()
    })
  })

  describe('Wishlist Functionality', () => {
    beforeEach(() => {
      mockUseAcademy.mockReturnValue({
        academy: mockAcademy,
        loading: false,
        error: null,
        refetch: mockRefetch,
      })
    })

    it('should show "Guardar" when academy is not saved', () => {
      mockIsInWishlist.mockReturnValue(false)

      render(<PublicAcademyPage />)

      expect(screen.getByText('Guardar')).toBeInTheDocument()
    })

    it('should show "Guardado" when academy is saved', () => {
      mockIsInWishlist.mockReturnValue(true)

      render(<PublicAcademyPage />)

      expect(screen.getByText('Guardado')).toBeInTheDocument()
    })

    it('should handle wishlist toggle when authenticated', () => {
      mockUseAuthStore.mockReturnValue({ isAuthenticated: true })
      mockToggleWishlist.mockReturnValue(true)

      render(<PublicAcademyPage />)

      const saveButton = screen.getByTestId('save-button')
      fireEvent.click(saveButton)

      expect(mockToggleWishlist).toHaveBeenCalledWith(
        'academy',
        mockAcademy.id,
        mockAcademy.slug,
        mockAcademy.name
      )
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith(
        `${mockAcademy.name} guardada en tu lista`
      )
    })

    it('should show removal message when removing from wishlist', () => {
      mockUseAuthStore.mockReturnValue({ isAuthenticated: true })
      mockToggleWishlist.mockReturnValue(false)

      render(<PublicAcademyPage />)

      const saveButton = screen.getByTestId('save-button')
      fireEvent.click(saveButton)

      expect(vi.mocked(toast.info)).toHaveBeenCalledWith(
        `${mockAcademy.name} removida de tu lista`
      )
    })

    it('should redirect to sign-in when not authenticated', () => {
      mockUseAuthStore.mockReturnValue({ isAuthenticated: false })

      render(<PublicAcademyPage />)

      const saveButton = screen.getByTestId('save-button')
      fireEvent.click(saveButton)

      expect(vi.mocked(toast.info)).toHaveBeenCalledWith(
        'Inicia sesión para guardar academias'
      )
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/sign-in' })
    })
  })

  describe('Share Functionality', () => {
    beforeEach(() => {
      mockUseAcademy.mockReturnValue({
        academy: mockAcademy,
        loading: false,
        error: null,
        refetch: mockRefetch,
      })
    })

    it('should use native share API when available', async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, { share: mockShare })

      render(<PublicAcademyPage />)

      const shareButton = screen.getByTestId('share-button')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(mockShare).toHaveBeenCalledWith({
          title: mockAcademy.name,
          text: mockAcademy.description,
          url: window.location.href,
        })
      })
    })

    it('should copy to clipboard when native share is not available', async () => {
      // Remove native share API
      Object.assign(navigator, { share: undefined })
      const mockWriteText = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText },
      })

      render(<PublicAcademyPage />)

      const shareButton = screen.getByTestId('share-button')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith(window.location.href)
        expect(vi.mocked(toast.success)).toHaveBeenCalledWith(
          'Enlace copiado al portapapeles'
        )
      })
    })

    it('should handle clipboard error', async () => {
      Object.assign(navigator, { share: undefined })
      const mockWriteText = vi
        .fn()
        .mockRejectedValue(new Error('Clipboard error'))
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText },
      })

      render(<PublicAcademyPage />)

      const shareButton = screen.getByTestId('share-button')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
          'No se pudo copiar el enlace'
        )
      })
    })

    it('should handle native share cancellation silently', async () => {
      const mockShare = vi.fn().mockRejectedValue(new Error('User cancelled'))
      Object.assign(navigator, { share: mockShare })

      render(<PublicAcademyPage />)

      const shareButton = screen.getByTestId('share-button')
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(mockShare).toHaveBeenCalled()
        // Should not show any error toast
        expect(vi.mocked(toast.error)).not.toHaveBeenCalled()
      })
    })
  })

  describe('Academy without courses', () => {
    it('should handle academy with no courses', () => {
      const academyWithoutCourses = {
        ...mockAcademy,
        courses: [],
        courses_count: 0,
      }

      mockUseAcademy.mockReturnValue({
        academy: academyWithoutCourses,
        loading: false,
        error: null,
        refetch: mockRefetch,
      })

      render(<PublicAcademyPage />)

      expect(screen.getByTestId('courses-section')).toBeInTheDocument()
      expect(screen.getByText('Cursos de React Avanzado')).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('should handle missing slug parameter', () => {
      mockUseParams.mockReturnValue({ slug: undefined })

      mockUseAcademy.mockReturnValue({
        academy: null,
        loading: false,
        error: 'No slug provided',
        refetch: mockRefetch,
      })

      render(<PublicAcademyPage />)

      expect(screen.getByTestId('alert-destructive')).toBeInTheDocument()
    })

    it('should not attempt wishlist operations without academy', () => {
      mockUseAcademy.mockReturnValue({
        academy: null,
        loading: false,
        error: 'Academia no encontrada',
        refetch: mockRefetch,
      })

      render(<PublicAcademyPage />)

      // No wishlist button should be rendered in error state
      expect(screen.queryByTestId('save-button')).not.toBeInTheDocument()
    })
  })
})
