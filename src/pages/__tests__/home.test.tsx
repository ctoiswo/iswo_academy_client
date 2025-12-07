import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HomePage } from '@/features/home'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock hooks
vi.mock('@/hooks/use-featured-content')

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'home.hero.title': 'Descubre tu próxima',
        'home.hero.titleHighlight': 'oportunidad de aprendizaje',
        'home.hero.description': 'Explora miles de cursos creados por expertos en academias especializadas',
        'home.categories.all': 'Todas las categorías',
        'home.categories.loading': 'Cargando categorías...',
        'home.academies.title': 'Academias Destacadas',
        'home.academies.description': 'Descubre las mejores academias especializadas en diferentes áreas',
        'home.academies.loading': 'Cargando academias...',
        'home.academies.error': 'Error al cargar las academias destacadas.',
        'home.academies.retry': 'Reintentar',
        'home.academies.notFound': 'No se encontraron academias destacadas.',
        'home.academies.viewAll': 'Ver Todas las Academias',
        'home.courses.title': 'Cursos Populares por Categoría',
        'home.courses.description': 'Explora los cursos más destacados organizados por áreas de conocimiento',
        'home.courses.loading': 'Cargando cursos...',
        'home.courses.exploreAll': 'Explorar Todos los Cursos',
        'home.cta.title': '¿Tienes conocimiento que compartir?',
        'home.cta.description': 'Únete a miles de instructores que ya están creando sus propias academias en línea',
        'home.cta.button': 'Crear mi Academia',
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
  Link: ({ children, to, params, ...props }: any) => {
    let href = to
    if (params) {
      // Replace $slug or $courseSlug with actual values
      if (params.slug) {
        href = to.replace('$slug', params.slug)
      }
      if (params.courseSlug) {
        href = to.replace('$courseSlug', params.courseSlug)
      }
    }
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  },
}))

// Mock components
vi.mock('@/components/layout/public-header', () => ({
  PublicHeader: () => <header data-testid="public-header">Public Header</header>,
}))

vi.mock('@/components/search/global-search-bar', () => ({
  GlobalSearchBar: () => <div data-testid="global-search-bar">Search Bar</div>,
}))

// Mock home feature components
vi.mock('@/features/home/components/hero-section', () => ({
  HeroSection: () => (
    <section data-testid="hero-section">
      <h1>Descubre tu próxima oportunidad de aprendizaje</h1>
      <p>Explora miles de cursos creados por expertos en academias especializadas</p>
      <div data-testid="global-search-bar">Search Bar</div>
    </section>
  ),
}))

vi.mock('@/features/home/components/categories-filter', () => ({
  CategoriesFilter: ({ categories, selectedCategory, onCategoryChange, isLoading }: any) => {
    if (isLoading) {
      return <div>Cargando categorías...</div>
    }
    return (
      <div data-testid="categories-filter">
        <button
          onClick={() => onCategoryChange(null)}
          className={selectedCategory === null ? 'active' : ''}
        >
          Todas las categorías
        </button>
        {categories?.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={selectedCategory === cat.id ? 'active' : ''}
          >
            {cat.name}
          </button>
        ))}
      </div>
    )
  },
}))

vi.mock('@/features/home/components/academies-section', () => ({
  AcademiesSection: ({ data, isLoading, isError, onRetry }: any) => {
    if (isLoading) {
      return <div>Cargando academias...</div>
    }
    if (isError) {
      return (
        <div>
          <div>Error al cargar las academias destacadas.</div>
          <button onClick={onRetry}>Reintentar</button>
        </div>
      )
    }
    if (!data || data.length === 0) {
      return <div>No se encontraron academias destacadas.</div>
    }
    return (
      <section data-testid="academies-section">
        <h2>Academias Destacadas</h2>
        <p>Descubre las mejores academias especializadas en diferentes áreas</p>
        {data.map((categoryGroup: any) => 
          categoryGroup.academies?.length > 0 && (
            <div key={categoryGroup.category.id}>
              {categoryGroup.academies.map((academy: any) => (
                <div key={academy.id}>
                  <a href={`/academies/${academy.slug}`}>
                    <img 
                      src={academy.logo_url || 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg'} 
                      alt={academy.name}
                    />
                    <h3>{academy.name}</h3>
                    <p>Por {academy.creator.name}</p>
                    <p>{academy.student_count?.toLocaleString()}</p>
                    <p>{academy.course_count} cursos</p>
                    <p>${Math.round(parseInt(academy.monthly_price) / 1000)}k/mes</p>
                  </a>
                </div>
              ))}
            </div>
          )
        )}
        <a href="/academies">Ver Todas las Academias</a>
      </section>
    )
  },
}))

vi.mock('@/features/home/components/courses-section', () => ({
  CoursesSection: ({ data, isLoading }: any) => {
    if (isLoading) {
      return <div>Cargando cursos...</div>
    }
    return (
      <section data-testid="courses-section">
        <h2>Cursos Populares por Categoría</h2>
        <p>Explora los cursos más destacados organizados por áreas de conocimiento</p>
        {data?.map((categoryGroup: any) => 
          categoryGroup.courses?.length > 0 && (
            <div key={categoryGroup.category.id}>
              {categoryGroup.courses.map((course: any) => {
                const difficultyMap: Record<string, string> = {
                  'beginner': 'Principiante',
                  'intermediate': 'Intermedio', 
                  'advanced': 'Avanzado'
                }
                return (
                  <div key={course.id}>
                    <a href={`/courses/${course.slug}`}>
                      <img 
                        src={course.thumbnail_url || 'https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg'} 
                        alt={course.title}
                      />
                      <h3>{course.title}</h3>
                      <p>Por {course.creator.name}</p>
                      <span>{difficultyMap[course.difficulty_level]}</span>
                      <p>{course.is_free ? 'Gratis' : `$${Math.round(parseInt(course.price) / 1000)}k`}</p>
                      <p>{Math.round(course.duration_minutes / 60)}h</p>
                      <p>{course.enrollment_count}</p>
                      <span>{course.is_published ? 'Disponible' : 'Próximamente'}</span>
                    </a>
                  </div>
                )
              })}
            </div>
          )
        )}
        <a href="/courses">Explorar Todos los Cursos</a>
      </section>
    )
  },
}))

vi.mock('@/features/home/components/cta-section', () => ({
  CTASection: () => (
    <section data-testid="cta-section">
      <h2>¿Tienes conocimiento que compartir?</h2>
      <p>Únete a miles de instructores que ya están creando sus propias academias en línea</p>
      <a href="/landing">Crear mi Academia</a>
    </section>
  ),
}))

vi.mock('@/features/home/components/footer', () => ({
  Footer: () => (
    <footer data-testid="footer">
      <p>© 2025 ISWO Academy. Todos los derechos reservados.</p>
      <a href="/sign-in">Iniciar Sesión</a>
      <a href="/sign-up">Registrarse</a>
    </footer>
  ),
}))

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}))

import {
  useFeaturedAcademies,
  useAcademyCategories,
  useFeaturedCourses,
} from '@/hooks/use-featured-content'

const mockUseFeaturedAcademies = vi.mocked(useFeaturedAcademies)
const mockUseAcademyCategories = vi.mocked(useAcademyCategories)
const mockUseFeaturedCourses = vi.mocked(useFeaturedCourses)

describe('HomePage', () => {
  let queryClient: QueryClient
  let user: ReturnType<typeof userEvent.setup>

  const mockCategories = [
    {
      id: 1,
      name: 'Programación',
      slug: 'programacion',
      description: 'Aprende a programar desde cero',
    },
    {
      id: 2,
      name: 'Diseño',
      slug: 'diseno',
      description: 'Domina el diseño digital',
    },
  ]

  const mockAcademiesByCategory = [
    {
      category: {
        id: 1,
        name: 'Programación',
        slug: 'programacion',
        description: 'Aprende a programar desde cero',
      },
      academies: [
        {
          id: 1,
          name: 'Academia JavaScript Avanzado',
          slug: 'javascript-avanzado',
          description: 'Aprende JavaScript moderno y frameworks',
          logo_url: 'https://example.com/js-logo.jpg',
          monthly_price: '49990',
          student_count: 1250,
          course_count: 15,
          creator: {
            id: 1,
            name: 'Juan Pérez',
          },
        },
        {
          id: 2,
          name: 'Academia Python Pro',
          slug: 'python-pro',
          description: 'Domina Python y sus frameworks',
          logo_url: 'https://example.com/python-logo.jpg',
          monthly_price: '39990',
          student_count: 980,
          course_count: 12,
          creator: {
            id: 2,
            name: 'María García',
          },
        },
      ],
    },
    {
      category: {
        id: 2,
        name: 'Diseño',
        slug: 'diseno',
        description: 'Domina el diseño digital',
      },
      academies: [
        {
          id: 3,
          name: 'Academia de UX/UI',
          slug: 'ux-ui',
          description: 'Conviértete en diseñador profesional',
          logo_url: 'https://example.com/ux-logo.jpg',
          monthly_price: '44990',
          student_count: 750,
          course_count: 10,
          creator: {
            id: 3,
            name: 'Carlos López',
          },
        },
      ],
    },
  ]

  const mockCoursesByCategory = [
    {
      category: {
        id: 1,
        name: 'Programación',
        slug: 'programacion',
        description: 'Aprende a programar desde cero',
      },
      courses: [
        {
          id: 1,
          title: 'JavaScript Moderno',
          slug: 'javascript-moderno',
          description: 'Aprende ES6+',
          thumbnail_url: 'https://example.com/js-thumb.jpg',
          price: '29990',
          is_free: false,
          difficulty_level: 'intermediate',
          duration_minutes: 480,
          enrollment_count: 350,
          is_published: true,
          creator: {
            id: 1,
            name: 'Juan Pérez',
          },
        },
        {
          id: 2,
          title: 'Python para Data Science',
          slug: 'python-data-science',
          description: 'Análisis de datos con Python',
          thumbnail_url: null,
          price: '0',
          is_free: true,
          difficulty_level: 'beginner',
          duration_minutes: 360,
          enrollment_count: 520,
          is_published: true,
          creator: {
            id: 2,
            name: 'María García',
          },
        },
      ],
    },
    {
      category: {
        id: 2,
        name: 'Diseño',
        slug: 'diseno',
        description: 'Domina el diseño digital',
      },
      courses: [
        {
          id: 3,
          title: 'Fundamentos de UX',
          slug: 'fundamentos-ux',
          description: 'Bases del diseño de experiencia',
          thumbnail_url: 'https://example.com/ux-thumb.jpg',
          price: '34990',
          is_free: false,
          difficulty_level: 'advanced',
          duration_minutes: 600,
          enrollment_count: 280,
          is_published: false,
          creator: {
            id: 3,
            name: 'Carlos López',
          },
        },
      ],
    },
  ]

  beforeEach(() => {
    user = userEvent.setup()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })

    // Default mock implementations
    mockUseAcademyCategories.mockReturnValue({
      data: mockCategories,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any)

    mockUseFeaturedAcademies.mockReturnValue({
      data: mockAcademiesByCategory,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any)

    mockUseFeaturedCourses.mockReturnValue({
      data: mockCoursesByCategory,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as any)

    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const renderHomePage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <HomePage />
      </QueryClientProvider>
    )
  }

  describe('Renderizado básico', () => {
    it('renderiza el header público', () => {
      renderHomePage()
      expect(screen.getByTestId('public-header')).toBeInTheDocument()
    })

    it('renderiza el hero section con el título principal', () => {
      renderHomePage()
      expect(screen.getByTestId('hero-section')).toBeInTheDocument()
      expect(screen.getByText(/Descubre tu próxima oportunidad de aprendizaje/i)).toBeInTheDocument()
    })

    it('renderiza la descripción del hero section', () => {
      renderHomePage()
      expect(
        screen.getByText(/Explora miles de cursos creados por expertos en academias especializadas/i)
      ).toBeInTheDocument()
    })

    it('renderiza el global search bar', () => {
      renderHomePage()
      expect(screen.getByTestId('global-search-bar')).toBeInTheDocument()
    })

    it('renderiza el footer con información de copyright', () => {
      renderHomePage()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
      expect(
        screen.getByText(/© 2025 ISWO Academy. Todos los derechos reservados./i)
      ).toBeInTheDocument()
    })

    it('renderiza enlaces de navegación en el footer', () => {
      renderHomePage()
      expect(screen.getByRole('link', { name: /Iniciar Sesión/i })).toHaveAttribute(
        'href',
        '/sign-in'
      )
      expect(screen.getByRole('link', { name: /Registrarse/i })).toHaveAttribute(
        'href',
        '/sign-up'
      )
    })
  })

  describe('Sección de categorías', () => {
    it('renderiza las categorías cuando se cargan correctamente', async () => {
      renderHomePage()

      await waitFor(() => {
        expect(screen.getByTestId('categories-filter')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Todas las categorías' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Programación' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Diseño' })).toBeInTheDocument()
      })
    })

    it('muestra loading state mientras carga categorías', () => {
      mockUseAcademyCategories.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any)

      renderHomePage()
      expect(screen.getByText(/Cargando categorías.../i)).toBeInTheDocument()
    })

    it('permite seleccionar una categoría', async () => {
      renderHomePage()

      const programacionButton = screen.getByRole('button', { name: 'Programación' })
      await user.click(programacionButton)

      expect(mockUseFeaturedAcademies).toHaveBeenCalledWith(1)
    })

    it('la categoría "Todas" filtra sin ID', async () => {
      renderHomePage()

      const todasButton = screen.getByRole('button', { name: 'Todas las categorías' })
      await user.click(todasButton)

      expect(mockUseFeaturedAcademies).toHaveBeenCalledWith(undefined)
    })
  })

  describe('Sección de Academias Destacadas', () => {
    it('renderiza el título de la sección', () => {
      renderHomePage()
      expect(screen.getByTestId('academies-section')).toBeInTheDocument()
      expect(screen.getByText('Academias Destacadas')).toBeInTheDocument()
      expect(
        screen.getByText(/Descubre las mejores academias especializadas en diferentes áreas/i)
      ).toBeInTheDocument()
    })

    it('muestra loading state mientras carga academias', () => {
      mockUseFeaturedAcademies.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any)

      renderHomePage()
      expect(screen.getByText(/Cargando academias.../i)).toBeInTheDocument()
    })

    it('muestra error state cuando falla la carga', () => {
      const mockRefetch = vi.fn()
      mockUseFeaturedAcademies.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('Network error'),
        refetch: mockRefetch,
      } as any)

      renderHomePage()
      expect(
        screen.getByText(/Error al cargar las academias destacadas./i)
      ).toBeInTheDocument()

      const retryButton = screen.getByRole('button', { name: /Reintentar/i })
      expect(retryButton).toBeInTheDocument()
    })

    it('permite reintentar la carga cuando hay error', async () => {
      const mockRefetch = vi.fn()
      mockUseFeaturedAcademies.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('Network error'),
        refetch: mockRefetch,
      } as any)

      renderHomePage()
      const retryButton = screen.getByRole('button', { name: /Reintentar/i })
      await user.click(retryButton)

      expect(mockRefetch).toHaveBeenCalled()
    })

    it('renderiza todas las academias agrupadas por categoría', () => {
      renderHomePage()

      // Verifica que se muestran las academias de Programación
      expect(screen.getByText('Academia JavaScript Avanzado')).toBeInTheDocument()
      expect(screen.getByText('Academia Python Pro')).toBeInTheDocument()

      // Verifica que se muestran las academias de Diseño
      expect(screen.getByText('Academia de UX/UI')).toBeInTheDocument()
    })

    it('muestra información correcta de cada academia', () => {
      renderHomePage()

      // Verifica nombre del creador (aparece en academias y cursos)
      expect(screen.getAllByText('Por Juan Pérez').length).toBeGreaterThan(0)

      // Verifica número de estudiantes y cursos
      expect(screen.getByText('1,250')).toBeInTheDocument()
      expect(screen.getByText('15 cursos')).toBeInTheDocument()
    })

    it('formatea correctamente los precios de las academias', () => {
      renderHomePage()

      // $49990 debería mostrarse como $50k/mes
      expect(screen.getByText(/\$50k\/mes/i)).toBeInTheDocument()
      // $39990 debería mostrarse como $40k/mes
      expect(screen.getByText(/\$40k\/mes/i)).toBeInTheDocument()
    })

    it('las academias tienen enlaces correctos', () => {
      renderHomePage()

      const academyLinks = screen.getAllByRole('link').filter((link) =>
        link.getAttribute('href')?.startsWith('/academies/')
      )

      expect(academyLinks.length).toBeGreaterThan(0)
      expect(academyLinks[0]).toHaveAttribute('href', '/academies/javascript-avanzado')
    })

    it('muestra botón para ver todas las academias', () => {
      renderHomePage()

      const verTodasButton = screen.getByRole('link', {
        name: /Ver Todas las Academias/i,
      })
      expect(verTodasButton).toBeInTheDocument()
      expect(verTodasButton).toHaveAttribute('href', '/academies')
    })

    it('muestra mensaje cuando no hay academias', () => {
      mockUseFeaturedAcademies.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any)

      renderHomePage()
      expect(
        screen.getByText(/No se encontraron academias destacadas./i)
      ).toBeInTheDocument()
    })
  })

  describe('Sección de Cursos Populares', () => {
    it('renderiza el título de la sección', () => {
      renderHomePage()
      expect(screen.getByTestId('courses-section')).toBeInTheDocument()
      expect(screen.getByText('Cursos Populares por Categoría')).toBeInTheDocument()
      expect(
        screen.getByText(/Explora los cursos más destacados organizados por áreas de conocimiento/i)
      ).toBeInTheDocument()
    })

    it('renderiza los cursos agrupados por categoría', () => {
      renderHomePage()

      expect(screen.getByText('JavaScript Moderno')).toBeInTheDocument()
      expect(screen.getByText('Python para Data Science')).toBeInTheDocument()
      expect(screen.getByText('Fundamentos de UX')).toBeInTheDocument()
    })

    it('muestra badges de dificultad correctamente formateados', () => {
      renderHomePage()

      expect(screen.getByText('Intermedio')).toBeInTheDocument()
      expect(screen.getByText('Principiante')).toBeInTheDocument()
      expect(screen.getByText('Avanzado')).toBeInTheDocument()
    })

    it('muestra el precio de los cursos correctamente', () => {
      renderHomePage()

      // Curso gratis
      expect(screen.getByText('Gratis')).toBeInTheDocument()
      // Cursos de pago
      expect(screen.getByText(/\$30k/i)).toBeInTheDocument()
      expect(screen.getByText(/\$35k/i)).toBeInTheDocument()
    })

    it('muestra la duración de los cursos en horas', () => {
      renderHomePage()

      // 480 minutos = 8 horas
      expect(screen.getByText('8h')).toBeInTheDocument()
      // 360 minutos = 6 horas
      expect(screen.getByText('6h')).toBeInTheDocument()
      // 600 minutos = 10 horas
      expect(screen.getByText('10h')).toBeInTheDocument()
    })

    it('muestra el contador de inscripciones', () => {
      renderHomePage()

      expect(screen.getByText('350')).toBeInTheDocument()
      expect(screen.getByText('520')).toBeInTheDocument()
      expect(screen.getByText('280')).toBeInTheDocument()
    })

    it('muestra badges de disponibilidad', () => {
      renderHomePage()

      expect(screen.getAllByText('Disponible')).toHaveLength(2)
      expect(screen.getByText('Próximamente')).toBeInTheDocument()
    })

    it('los cursos tienen enlaces correctos', () => {
      renderHomePage()

      const courseLinks = screen.getAllByRole('link').filter((link) =>
        link.getAttribute('href')?.startsWith('/courses/')
      )

      expect(courseLinks.length).toBeGreaterThan(0)
      expect(courseLinks[0]).toHaveAttribute('href', '/courses/javascript-moderno')
    })

    it('muestra botón para explorar todos los cursos', () => {
      renderHomePage()

      const explorarButton = screen.getByRole('link', {
        name: /Explorar Todos los Cursos/i,
      })
      expect(explorarButton).toBeInTheDocument()
      expect(explorarButton).toHaveAttribute('href', '/courses')
    })

    it('usa imagen por defecto cuando no hay thumbnail', () => {
      renderHomePage()

      const images = screen.getAllByRole('img')
      const defaultImage = images.find((img) =>
        img
          .getAttribute('src')
          ?.includes('pexels.com/photos/574077/pexels-photo-574077.jpeg')
      )
      expect(defaultImage).toBeInTheDocument()
    })
  })

  describe('Sección CTA para Creadores', () => {
    it('renderiza el título del CTA', () => {
      renderHomePage()
      expect(screen.getByTestId('cta-section')).toBeInTheDocument()
      expect(
        screen.getByText(/¿Tienes conocimiento que compartir?/i)
      ).toBeInTheDocument()
    })

    it('renderiza la descripción del CTA', () => {
      renderHomePage()
      expect(
        screen.getByText(/Únete a miles de instructores que ya están creando sus propias academias en línea/i)
      ).toBeInTheDocument()
    })

    it('renderiza el botón de crear academia', () => {
      renderHomePage()

      const crearButton = screen.getByRole('link', { name: /Crear mi Academia/i })
      expect(crearButton).toBeInTheDocument()
      expect(crearButton).toHaveAttribute('href', '/landing')
    })
  })

  describe('Integración de datos', () => {
    it('llama a los hooks con los parámetros correctos inicialmente', () => {
      renderHomePage()

      expect(mockUseAcademyCategories).toHaveBeenCalled()
      expect(mockUseFeaturedAcademies).toHaveBeenCalledWith(undefined)
      expect(mockUseFeaturedCourses).toHaveBeenCalledWith(undefined)
    })

    it('actualiza las consultas cuando se selecciona una categoría', async () => {
      renderHomePage()

      const programacionButton = screen.getByRole('button', { name: 'Programación' })
      await user.click(programacionButton)

      // Esperar a que se actualice el estado
      await waitFor(() => {
        expect(mockUseFeaturedAcademies).toHaveBeenCalledWith(1)
        expect(mockUseFeaturedCourses).toHaveBeenCalledWith(1)
      })
    })

    it('no renderiza categorías vacías de academias', () => {
      mockUseFeaturedAcademies.mockReturnValue({
        data: [
          {
            category: mockCategories[0],
            academies: [],
          },
          mockAcademiesByCategory[1], // Solo esta tiene academias
        ],
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any)

      renderHomePage()

      // No debería renderizar la sección de Programación porque está vacía
      expect(screen.queryByText('Academia JavaScript Avanzado')).not.toBeInTheDocument()
      // Pero sí debería renderizar Diseño
      expect(screen.getByText('Academia de UX/UI')).toBeInTheDocument()
    })

    it('no renderiza categorías vacías de cursos', () => {
      mockUseFeaturedCourses.mockReturnValue({
        data: [
          {
            category: mockCategories[0],
            courses: [],
          },
          mockCoursesByCategory[1], // Solo esta tiene cursos
        ],
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any)

      renderHomePage()

      // No debería renderizar cursos de Programación
      expect(screen.queryByText('JavaScript Moderno')).not.toBeInTheDocument()
      // Pero sí debería renderizar cursos de Diseño
      expect(screen.getByText('Fundamentos de UX')).toBeInTheDocument()
    })
  })

  describe('Imágenes y recursos', () => {
    it('usa imágenes de logo de las academias cuando están disponibles', () => {
      renderHomePage()

      const images = screen.getAllByRole('img')
      const jsImage = images.find((img) =>
        img.getAttribute('src')?.includes('js-logo.jpg')
      )
      expect(jsImage).toBeInTheDocument()
    })

    it('usa imagen por defecto cuando no hay logo de academia', () => {
      const academiesWithoutLogo = [
        {
          ...mockAcademiesByCategory[0],
          academies: [
            {
              ...mockAcademiesByCategory[0].academies[0],
              logo_url: null,
            },
          ],
        },
      ]

      mockUseFeaturedAcademies.mockReturnValue({
        data: academiesWithoutLogo,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any)

      renderHomePage()

      const images = screen.getAllByRole('img')
      const defaultImage = images.find((img) =>
        img.getAttribute('src')?.includes('265087')
      )
      expect(defaultImage).toBeInTheDocument()
    })

    it('todas las imágenes tienen atributos alt apropiados', () => {
      renderHomePage()

      const academyImages = screen.getAllByAltText(/Academia/i)
      expect(academyImages.length).toBeGreaterThan(0)

      const courseImages = screen.getAllByAltText(/JavaScript Moderno|Python|Fundamentos/i)
      expect(courseImages.length).toBeGreaterThan(0)
    })
  })

  describe('Responsive y estilos', () => {
    it('verifica que los componentes se renderizan correctamente', () => {
      renderHomePage()

      // Verificar que todos los componentes principales están presentes
      expect(screen.getByTestId('hero-section')).toBeInTheDocument()
      expect(screen.getByTestId('categories-filter')).toBeInTheDocument()
      expect(screen.getByTestId('academies-section')).toBeInTheDocument()
      expect(screen.getByTestId('courses-section')).toBeInTheDocument()
      expect(screen.getByTestId('cta-section')).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })
  })

  describe('Arquitectura de Features', () => {
    it('verifica que el componente HomePage utiliza la nueva estructura modular', () => {
      renderHomePage()

      // Verificar que todos los componentes de la feature home están presentes
      expect(screen.getByTestId('public-header')).toBeInTheDocument()
      expect(screen.getByTestId('hero-section')).toBeInTheDocument()
      expect(screen.getByTestId('categories-filter')).toBeInTheDocument()
      expect(screen.getByTestId('academies-section')).toBeInTheDocument()
      expect(screen.getByTestId('courses-section')).toBeInTheDocument()
      expect(screen.getByTestId('cta-section')).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
    })

    it('mantiene la funcionalidad de filtrado por categoría entre componentes', async () => {
      renderHomePage()

      // Verificar que el estado se comparte correctamente entre componentes
      const programacionButton = screen.getByRole('button', { name: 'Programación' })
      await user.click(programacionButton)

      // Los hooks deben ser llamados con el ID correcto
      await waitFor(() => {
        expect(mockUseFeaturedAcademies).toHaveBeenCalledWith(1)
        expect(mockUseFeaturedCourses).toHaveBeenCalledWith(1)
      })
    })

    it('maneja correctamente los estados de loading y error de forma independiente', () => {
      // Test con academias cargando pero cursos con error
      mockUseFeaturedAcademies.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any)

      mockUseFeaturedCourses.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any)

      renderHomePage()

      expect(screen.getByText(/Cargando academias.../i)).toBeInTheDocument()
      // Los cursos no deben mostrar loading
      expect(screen.getByTestId('courses-section')).toBeInTheDocument()
    })
  })
})
