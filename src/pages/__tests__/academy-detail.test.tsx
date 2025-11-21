import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AcademyDetailPage } from '../academy-detail'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock hooks
vi.mock('@/hooks/use-academy.ts')

// Mock TanStack Router
const mockParams = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useParams: () => mockParams(),
  useNavigate: () => vi.fn(),
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

// Mock components
vi.mock('@/components/layout/public-header.tsx', () => ({
  PublicHeader: () => <header data-testid="public-header">Header</header>,
}))

vi.mock('@/components/course-card.tsx', () => ({
  CourseCard: ({ course }: any) => (
    <div data-testid={`course-${course.id}`}>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
    </div>
  ),
}))

import { useAcademy } from '@/hooks/use-academy.ts'

const mockUseAcademy = vi.mocked(useAcademy)

describe('AcademyDetailPage', () => {
  let queryClient: QueryClient

  const mockAcademy = {
    id: 1,
    name: 'Academia de JavaScript Avanzado',
    slug: 'javascript-avanzado',
    description: 'Aprende JavaScript moderno desde cero hasta nivel avanzado',
    banner_url: 'https://example.com/banner.jpg',
    logo_url: 'https://example.com/logo.jpg',
    monthly_price: 49.99,
    rating: 4.8,
    reviews_count: 150,
    enrolled_users_count: 1250,
    courses_count: 12,
    total_duration_hours: 45,
    total_lessons: 120,
    category: {
      id: 1,
      name: 'Programación',
      slug: 'programacion',
    },
    creator: {
      id: 1,
      name: 'Juan Pérez',
      avatar_url: 'https://example.com/avatar.jpg',
      bio: 'Desarrollador senior con 10 años de experiencia',
    },
    courses: [
      {
        id: 1,
        title: 'Curso de JavaScript Básico',
        description: 'Fundamentos de JavaScript',
        slug: 'javascript-basico',
        duration_hours: 10,
        lessons_count: 25,
      },
      {
        id: 2,
        title: 'Curso de JavaScript Avanzado',
        description: 'Conceptos avanzados de JavaScript',
        slug: 'javascript-avanzado',
        duration_hours: 15,
        lessons_count: 35,
      },
    ],
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })

    mockParams.mockReturnValue({ slug: 'javascript-avanzado' })
    mockUseAcademy.mockReturnValue({
      academy: mockAcademy,
      loading: false,
      error: null,
    } as any)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    )
  }

  it('renderiza la página correctamente con todos los elementos', async () => {
    renderWithProvider(<AcademyDetailPage />)

    // Header
    expect(screen.getByTestId('public-header')).toBeInTheDocument()

    // Hero section
    expect(screen.getByText(mockAcademy.name)).toBeInTheDocument()
    expect(screen.getByText(mockAcademy.category.name)).toBeInTheDocument()

    // Stats en el hero - usar queries más específicas
    expect(screen.getByText(/estudiantes/)).toBeInTheDocument()
    expect(screen.getByText('12 cursos')).toBeInTheDocument()
    expect(screen.getByText(/45h de contenido/)).toBeInTheDocument()

    // Verificar que hay botones de suscripción
    const subscribeButtons = screen.getAllByRole('button', { name: /Suscribirse/i })
    expect(subscribeButtons.length).toBeGreaterThan(0)
  })

  it('muestra loader durante la carga', () => {
    mockUseAcademy.mockReturnValue({
      academy: null,
      loading: true,
      error: null,
    } as any)

    renderWithProvider(<AcademyDetailPage />)

    expect(screen.getByText(/Cargando academia/i)).toBeInTheDocument()
  })

  it('muestra error cuando no se encuentra la academia', () => {
    mockUseAcademy.mockReturnValue({
      academy: null,
      loading: false,
      error: 'Academia no encontrada',
    } as any)

    renderWithProvider(<AcademyDetailPage />)

    expect(screen.getAllByText('Academia no encontrada').length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: /Volver a Academias/i })).toBeInTheDocument()
  })

  it('muestra mensaje por defecto cuando academy es null sin error', () => {
    mockUseAcademy.mockReturnValue({
      academy: null,
      loading: false,
      error: null,
    } as any)

    renderWithProvider(<AcademyDetailPage />)

    expect(screen.getByText(/La academia que buscas no existe o no está disponible/i)).toBeInTheDocument()
  })

  it('renderiza la información del instructor correctamente', () => {
    renderWithProvider(<AcademyDetailPage />)

    expect(screen.getByText('Instructor')).toBeInTheDocument()
    expect(screen.getByText(mockAcademy.creator.name)).toBeInTheDocument()
    expect(screen.getByText('Creador de la Academia')).toBeInTheDocument()
    expect(screen.getByText(mockAcademy.creator.bio)).toBeInTheDocument()
  })

  it('renderiza las estadísticas en la sidebar', () => {
    renderWithProvider(<AcademyDetailPage />)

    expect(screen.getByText('Estadísticas')).toBeInTheDocument()
    
    // Verificar valores de estadísticas
    const statsSection = screen.getByText('Estadísticas').closest('div')
    expect(statsSection).toBeInTheDocument()
    
    expect(screen.getByText('1,250')).toBeInTheDocument() // Estudiantes
    expect(screen.getByText('120')).toBeInTheDocument() // Lecciones
    expect(screen.getByText('45h')).toBeInTheDocument() // Duración
  })

  it('renderiza la tarjeta de suscripción con beneficios', () => {
    renderWithProvider(<AcademyDetailPage />)

    expect(screen.getByText('Acceso Completo')).toBeInTheDocument()
    expect(screen.getByText('$49.99')).toBeInTheDocument()
    
    // Beneficios
    expect(screen.getByText('Acceso a todos los cursos')).toBeInTheDocument()
    expect(screen.getByText('Nuevos cursos cada mes')).toBeInTheDocument()
    expect(screen.getByText('Certificados al completar')).toBeInTheDocument()
    expect(screen.getByText('Soporte del instructor')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /Suscribirse Ahora/i })).toBeInTheDocument()
  })

  it('renderiza los cursos de la academia', () => {
    renderWithProvider(<AcademyDetailPage />)

    expect(screen.getByText(/Cursos \(12\)/)).toBeInTheDocument()
    expect(screen.getByTestId('course-1')).toBeInTheDocument()
    expect(screen.getByTestId('course-2')).toBeInTheDocument()
    expect(screen.getByText('Curso de JavaScript Básico')).toBeInTheDocument()
    expect(screen.getByText('Curso de JavaScript Avanzado')).toBeInTheDocument()
  })

  it('muestra mensaje cuando no hay cursos disponibles', () => {
    const academyWithoutCourses = { ...mockAcademy, courses: [], courses_count: 0 }
    mockUseAcademy.mockReturnValue({
      academy: academyWithoutCourses,
      loading: false,
      error: null,
    } as any)

    renderWithProvider(<AcademyDetailPage />)

    expect(screen.getByText('Próximamente')).toBeInTheDocument()
    expect(screen.getByText(/Esta academia está preparando contenido increíble/i)).toBeInTheDocument()
  })

  it('renderiza las pestañas de cursos y reseñas', async () => {
    const user = userEvent.setup()
    renderWithProvider(<AcademyDetailPage />)

    // Verificar que la pestaña de cursos está activa por defecto
    expect(screen.getByText(/Cursos \(12\)/)).toBeInTheDocument()
    
    // Click en la pestaña de reseñas
    const reviewsTab = screen.getByText(/Reseñas \(150\)/)
    await user.click(reviewsTab)

    // Verificar que se muestra el mensaje de reseñas próximamente
    await waitFor(() => {
      expect(screen.getByText('Reseñas próximamente')).toBeInTheDocument()
      expect(screen.getByText(/Las reseñas de estudiantes estarán disponibles pronto/i)).toBeInTheDocument()
    })
  })

  it('renderiza el rating con estrellas correctamente', () => {
    renderWithProvider(<AcademyDetailPage />)

    // En el hero y en las estadísticas hay rating
    const ratings = screen.getAllByText('4.8')
    expect(ratings.length).toBeGreaterThan(0)
    expect(screen.getByText('(150 reseñas)')).toBeInTheDocument()
  })

  it('renderiza los botones de acción en el hero', () => {
    renderWithProvider(<AcademyDetailPage />)

    // Botón de suscripción principal
    const subscribeButtons = screen.getAllByRole('button', { name: /Suscribirse/i })
    expect(subscribeButtons.length).toBeGreaterThan(0)

    // Los botones de Heart y Share2 están presentes (aunque sin texto visible)
    const allButtons = screen.getAllByRole('button')
    expect(allButtons.length).toBeGreaterThan(3)
  })

  it('renderiza el botón de volver a academias', () => {
    renderWithProvider(<AcademyDetailPage />)

    const backLink = screen.getByRole('link', { name: /Volver/i })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/academies')
  })

  it('renderiza el banner y logo de la academia cuando están disponibles', () => {
    renderWithProvider(<AcademyDetailPage />)

    const bannerImage = screen.getByAltText(`${mockAcademy.name} banner`)
    expect(bannerImage).toBeInTheDocument()
    expect(bannerImage).toHaveAttribute('src', mockAcademy.banner_url)

    const logoImage = screen.getByAltText(`${mockAcademy.name} logo`)
    expect(logoImage).toBeInTheDocument()
    expect(logoImage).toHaveAttribute('src', mockAcademy.logo_url)
  })

  it('muestra ícono por defecto cuando no hay logo', () => {
    const academyWithoutLogo = { ...mockAcademy, logo_url: null }
    mockUseAcademy.mockReturnValue({
      academy: academyWithoutLogo,
      loading: false,
      error: null,
    } as any)

    renderWithProvider(<AcademyDetailPage />)

    // No debe haber imagen de logo pero sí el contenedor
    expect(screen.queryByAltText(`${mockAcademy.name} logo`)).not.toBeInTheDocument()
  })

  it('renderiza el avatar del instructor correctamente', () => {
    renderWithProvider(<AcademyDetailPage />)

    // Verificar que el nombre del instructor está presente
    expect(screen.getByText(mockAcademy.creator.name)).toBeInTheDocument()
    expect(screen.getByText('Creador de la Academia')).toBeInTheDocument()
  })

  it('muestra la sección "Acerca de esta Academia"', () => {
    renderWithProvider(<AcademyDetailPage />)

    expect(screen.getByText('Acerca de esta Academia')).toBeInTheDocument()
  })

  it('formatea correctamente los números grandes', () => {
    const academyWithLargeNumbers = {
      ...mockAcademy,
      enrolled_users_count: 15000,
    }
    mockUseAcademy.mockReturnValue({
      academy: academyWithLargeNumbers,
      loading: false,
      error: null,
    } as any)

    renderWithProvider(<AcademyDetailPage />)

    // Debe formatear con separadores de miles
    expect(screen.getByText('15,000')).toBeInTheDocument()
  })

  it('llama al hook useAcademy con el slug correcto', () => {
    renderWithProvider(<AcademyDetailPage />)

    expect(mockUseAcademy).toHaveBeenCalledWith('javascript-avanzado')
  })

  it('renderiza todos los beneficios de la suscripción', () => {
    renderWithProvider(<AcademyDetailPage />)

    const benefits = [
      'Acceso a todos los cursos',
      'Nuevos cursos cada mes',
      'Certificados al completar',
      'Soporte del instructor',
    ]

    benefits.forEach(benefit => {
      expect(screen.getByText(benefit)).toBeInTheDocument()
    })
  })
})
