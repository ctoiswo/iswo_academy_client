import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AcademiesPage } from '../academies'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock hooks
vi.mock('@/hooks/use-academies')
vi.mock('@/hooks/use-categories')
vi.mock('@/hooks/use-statistics')

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

// Mock components
vi.mock('@/components/category-carousel', () => ({
  CategoryCarousel: ({ title, academies }: any) => (
    <div data-testid="category-carousel">
      <h2>{title}</h2>
      <div data-testid="academies-list">
        {academies.map((academy: any) => (
          <div key={academy.id} data-testid={`academy-${academy.slug}`}>
            {academy.name}
          </div>
        ))}
      </div>
    </div>
  ),
}))

vi.mock('@/components/layout/public-header', () => ({
  PublicHeader: () => <header data-testid="public-header">Header</header>,
}))

import { useAcademies } from '@/hooks/use-academies'
import { useCategories } from '@/hooks/use-categories'
import { useGeneralStatistics } from '@/hooks/use-statistics'

const mockUseAcademies = vi.mocked(useAcademies)
const mockUseCategories = vi.mocked(useCategories)
const mockUseGeneralStatistics = vi.mocked(useGeneralStatistics)

describe('AcademiesPage', () => {
  let queryClient: QueryClient

  const mockAcademies = [
    {
      id: 1,
      name: 'Academia de JavaScript',
      slug: 'javascript',
      monthly_price: 49.99,
      enrolled_users_count: 150,
      courses_count: 10,
      academy_category: {
        id: 1,
        name: 'Programación',
        slug: 'programacion',
      },
    },
    {
      id: 2,
      name: 'Academia de Design',
      slug: 'design',
      monthly_price: 39.99,
      enrolled_users_count: 200,
      courses_count: 8,
      academy_category: {
        id: 2,
        name: 'Diseño',
        slug: 'diseno',
      },
    },
  ]

  const mockCategories = [
    { id: 1, name: 'Programación', slug: 'programacion', academies_count: 15 },
    { id: 2, name: 'Diseño', slug: 'diseno', academies_count: 10 },
  ]

  const mockStats = {
    total_academies: 25,
    total_students: 1500,
    total_categories: 5,
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })

    mockUseAcademies.mockReturnValue({
      data: mockAcademies,
      isLoading: false,
      error: null,
    } as any)

    mockUseCategories.mockReturnValue({
      categories: mockCategories,
      loading: false,
      error: null,
    } as any)

    mockUseGeneralStatistics.mockReturnValue({
      data: mockStats,
      isLoading: false,
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
    renderWithProvider(<AcademiesPage />)

    // Header
    expect(screen.getByTestId('public-header')).toBeInTheDocument()
    expect(screen.getByText(/Explora Nuestras/)).toBeInTheDocument()

    // Stats
    await waitFor(() => {
      expect(screen.getByText('25+')).toBeInTheDocument()
      expect(screen.getByText('Academias Disponibles')).toBeInTheDocument()
      expect(screen.getByText('1500')).toBeInTheDocument()
      expect(screen.getByText('Estudiantes Activos')).toBeInTheDocument()
      expect(screen.getByText('5+')).toBeInTheDocument()
    })

    // Search input
    expect(screen.getByPlaceholderText(/Buscar academias/i)).toBeInTheDocument()
  })

  it('muestra loader durante la carga inicial', () => {
    mockUseAcademies.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any)

    mockUseCategories.mockReturnValue({
      categories: [],
      loading: true,
      error: null,
    } as any)

    renderWithProvider(<AcademiesPage />)

    expect(screen.getByText(/Cargando academias/i)).toBeInTheDocument()
  })

  it('muestra error cuando falla la carga de datos', () => {
    const error = new Error('Error al cargar academias')
    mockUseAcademies.mockReturnValue({
      data: undefined,
      isLoading: false,
      error,
    } as any)

    renderWithProvider(<AcademiesPage />)

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText(error.message)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Intentar de nuevo/i })).toBeInTheDocument()
  })

  it('renderiza las academias agrupadas por categoría cuando no hay filtros', async () => {
    renderWithProvider(<AcademiesPage />)

    // Esperar a que se rendericen los carruseles
    await waitFor(() => {
      const carousels = screen.getAllByTestId('category-carousel')
      expect(carousels.length).toBeGreaterThan(0)
    })

    // Verificar que las academias están presentes
    expect(screen.getByTestId('academy-javascript')).toBeInTheDocument()
    expect(screen.getByTestId('academy-design')).toBeInTheDocument()
  })

  it('actualiza la búsqueda con debounce', async () => {
    const user = userEvent.setup()
    renderWithProvider(<AcademiesPage />)

    const searchInput = screen.getByPlaceholderText(/Buscar academias/i)
    await user.type(searchInput, 'JavaScript')

    // El hook debería ser llamado después del debounce
    await waitFor(
      () => {
        expect(mockUseAcademies).toHaveBeenCalledWith(
          expect.objectContaining({
            search: 'JavaScript',
          })
        )
      },
      { timeout: 500 }
    )
  })

  it('verifica que el ordenamiento por defecto es popular', () => {
    renderWithProvider(<AcademiesPage />)

    // Verificar que se llama con el sort_by correcto por defecto
    expect(mockUseAcademies).toHaveBeenCalledWith(
      expect.objectContaining({
        sort_by: 'popular',
      })
    )
  })

  it('muestra filtros activos y permite limpiarlos', async () => {
    const user = userEvent.setup()
    renderWithProvider(<AcademiesPage />)

    // Agregar búsqueda
    const searchInput = screen.getByPlaceholderText(/Buscar academias/i)
    await user.type(searchInput, 'JavaScript')

    // Esperar a que aparezcan los filtros activos
    await waitFor(() => {
      expect(screen.getByText(/Filtros activos:/)).toBeInTheDocument()
      expect(screen.getByText(/Búsqueda: "JavaScript"/)).toBeInTheDocument()
    })

    // Limpiar todos los filtros
    const clearAllButton = screen.getByRole('button', { name: /Limpiar todos/i })
    await user.click(clearAllButton)

    await waitFor(() => {
      expect(searchInput).toHaveValue('')
    })
  })

  it('limpia búsqueda individualmente desde el badge', async () => {
    const user = userEvent.setup()
    renderWithProvider(<AcademiesPage />)

    const searchInput = screen.getByPlaceholderText(/Buscar academias/i)
    await user.type(searchInput, 'Test')

    await waitFor(() => {
      expect(screen.getByText(/Búsqueda: "Test"/)).toBeInTheDocument()
    })

    // Click en la X del badge de búsqueda
    const clearSearchButton = screen.getByText(/Búsqueda: "Test"/).parentElement?.querySelector('button')
    if (clearSearchButton) {
      await user.click(clearSearchButton)
    }

    await waitFor(() => {
      expect(searchInput).toHaveValue('')
    })
  })

  it('muestra mensaje cuando no hay resultados', async () => {
    mockUseAcademies.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any)

    const user = userEvent.setup()
    renderWithProvider(<AcademiesPage />)

    const searchInput = screen.getByPlaceholderText(/Buscar academias/i)
    await user.type(searchInput, 'NoExiste')

    await waitFor(() => {
      expect(screen.getByText(/No se encontraron academias/)).toBeInTheDocument()
    })
  })

  it('renderiza botones de categorías con sus contadores', () => {
    renderWithProvider(<AcademiesPage />)

    // Verificar que los botones de categoría se renderizan
    expect(screen.getByRole('button', { name: /Todas/i })).toBeInTheDocument()
    
    // Verificar que hay múltiples botones de categorías
    const allButtons = screen.getAllByRole('button')
    expect(allButtons.length).toBeGreaterThan(2)
  })

  it('muestra botón "Todas" seleccionado por defecto', () => {
    renderWithProvider(<AcademiesPage />)

    const allButton = screen.getByRole('button', { name: /Todas/i })
    expect(allButton).toHaveClass('bg-primary') // Variante default tiene esta clase
  })

  it('recarga la página cuando se hace click en "Intentar de nuevo" tras error', async () => {
    const user = userEvent.setup()
    const error = new Error('Error de red')
    mockUseAcademies.mockReturnValue({
      data: undefined,
      isLoading: false,
      error,
    } as any)

    const originalReload = window.location.reload
    window.location.reload = vi.fn()

    renderWithProvider(<AcademiesPage />)

    const retryButton = screen.getByRole('button', { name: /Intentar de nuevo/i })
    await user.click(retryButton)

    expect(window.location.reload).toHaveBeenCalled()

    window.location.reload = originalReload
  })

  it('muestra CTA para crear academia', () => {
    renderWithProvider(<AcademiesPage />)

    expect(screen.getByText(/¿No encuentras lo que buscas?/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Crear Mi Academia/i })).toBeInTheDocument()
  })

  it('muestra mensaje correcto cuando hay resultados de búsqueda', async () => {
    const user = userEvent.setup()
    renderWithProvider(<AcademiesPage />)

    const searchInput = screen.getByPlaceholderText(/Buscar academias/i)
    await user.type(searchInput, 'JavaScript')

    await waitFor(() => {
      // Debe mostrar mensaje de resultados encontrados
      expect(screen.getByText(/Encontramos.*academias que coinciden/i)).toBeInTheDocument()
    })
  })

  it('muestra mensaje apropiado cuando no hay academias sin filtros', () => {
    mockUseAcademies.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any)

    renderWithProvider(<AcademiesPage />)

    expect(screen.getByText(/No hay academias disponibles en esta categoría/i)).toBeInTheDocument()
  })
})
