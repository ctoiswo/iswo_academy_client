import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CoursesSection } from '../courses-section'

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
        'home.courses.title': 'Cursos Populares por Categoría',
        'home.courses.description': 'Explora los cursos más destacados organizados por áreas de conocimiento',
        'home.courses.loading': 'Cargando cursos...',
        'home.courses.exploreAll': 'Explorar Todos los Cursos',
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

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Loader2: ({ className }: { className?: string }) => (
    <div className={className} data-testid="loader-icon">Loading...</div>
  ),
  ArrowRight: ({ className }: { className?: string }) => (
    <div className={className} data-testid="arrow-icon">→</div>
  ),
  Clock: ({ className }: { className?: string }) => (
    <div className={className} data-testid="clock-icon">⏰</div>
  ),
  Users: ({ className }: { className?: string }) => (
    <div className={className} data-testid="users-icon">👥</div>
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

// Mock CourseCard component
vi.mock('../course-card', () => ({
  CourseCard: ({ course, index }: any) => (
    <div data-testid={`course-card-${course.id}`} data-index={index}>
      <h4>{course.title}</h4>
      <p>{course.description}</p>
    </div>
  ),
}))

const mockData = [
  {
    category: {
      id: 1,
      name: 'Desarrollo Web',
      description: 'Aprende a crear aplicaciones web modernas'
    },
    courses: [
      {
        id: 1,
        title: 'React Fundamentals',
        description: 'Aprende React desde cero',
        slug: 'react-fundamentals'
      },
      {
        id: 2,
        title: 'JavaScript Avanzado',
        description: 'Domina JavaScript moderno',
        slug: 'javascript-avanzado'
      }
    ]
  },
  {
    category: {
      id: 2,
      name: 'Data Science',
      description: 'Análisis de datos y machine learning'
    },
    courses: [
      {
        id: 3,
        title: 'Python para Data Science',
        description: 'Análisis de datos con Python',
        slug: 'python-data-science'
      }
    ]
  },
  {
    category: {
      id: 3,
      name: 'Categoría Vacía',
      description: 'Esta categoría no tiene cursos'
    },
    courses: []
  }
]

describe('CoursesSection', () => {
  describe('Loading state', () => {
    it('should render loading state', () => {
      render(<CoursesSection data={[]} isLoading={true} />)

      expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
      expect(screen.getByText('Cargando cursos...')).toBeInTheDocument()
    })

    it('should not render content when loading', () => {
      render(<CoursesSection data={mockData} isLoading={true} />)

      expect(screen.queryByText('Desarrollo Web')).not.toBeInTheDocument()
      expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
    })
  })

  describe('Content display', () => {
    it('should render section header', () => {
      render(<CoursesSection data={mockData} isLoading={false} />)

      expect(screen.getByText('Cursos Populares por Categoría')).toBeInTheDocument()
      expect(screen.getByText('Explora los cursos más destacados organizados por áreas de conocimiento')).toBeInTheDocument()
    })

    it('should render courses grouped by category', () => {
      render(<CoursesSection data={mockData} isLoading={false} />)

      // Check categories are rendered
      expect(screen.getByText('Desarrollo Web')).toBeInTheDocument()
      expect(screen.getByText('Aprende a crear aplicaciones web modernas')).toBeInTheDocument()

      expect(screen.getByText('Data Science')).toBeInTheDocument()
      expect(screen.getByText('Análisis de datos y machine learning')).toBeInTheDocument()

      // Check courses are rendered (using our mocked CourseCard)
      expect(screen.getByTestId('course-card-1')).toBeInTheDocument()
      expect(screen.getByTestId('course-card-2')).toBeInTheDocument()
      expect(screen.getByTestId('course-card-3')).toBeInTheDocument()

      expect(screen.getByText('React Fundamentals')).toBeInTheDocument()
      expect(screen.getByText('JavaScript Avanzado')).toBeInTheDocument()
      expect(screen.getByText('Python para Data Science')).toBeInTheDocument()
    })

    it('should skip categories with empty courses', () => {
      render(<CoursesSection data={mockData} isLoading={false} />)

      // "Categoría Vacía" should not be rendered since it has no courses
      expect(screen.queryByText('Categoría Vacía')).not.toBeInTheDocument()
      expect(screen.queryByText('Esta categoría no tiene cursos')).not.toBeInTheDocument()
    })

    it('should render "Explore All Courses" button', () => {
      render(<CoursesSection data={mockData} isLoading={false} />)

      expect(screen.getByText('Explorar Todos los Cursos')).toBeInTheDocument()
      expect(screen.getByTestId('arrow-icon')).toBeInTheDocument()

      // Find the specific link with the "Explorar Todos los Cursos" text
      const link = screen.getByRole('link', { name: /explorar todos los cursos/i })
      expect(link).toHaveAttribute('href', '/academies')
    })
  })

  describe('Empty data handling', () => {
    it('should render section header even with empty data', () => {
      render(<CoursesSection data={[]} isLoading={false} />)

      expect(screen.getByText('Cursos Populares por Categoría')).toBeInTheDocument()
      // The button text is inside a Link, so we need to search more specifically
      expect(screen.getByRole('link')).toHaveTextContent('Explorar Todos los Cursos')
    })

    it('should handle data with all empty categories', () => {
      const emptyData = [
        {
          category: { id: 1, name: 'Categoría 1', description: 'Descripción 1' },
          courses: []
        },
        {
          category: { id: 2, name: 'Categoría 2', description: 'Descripción 2' },
          courses: []
        }
      ]

      render(<CoursesSection data={emptyData} isLoading={false} />)

      // No categories should be rendered since all are empty
      expect(screen.queryByText('Categoría 1')).not.toBeInTheDocument()
      expect(screen.queryByText('Categoría 2')).not.toBeInTheDocument()
      
      // But header and explore button should still be there
      expect(screen.getByText('Cursos Populares por Categoría')).toBeInTheDocument()
      expect(screen.getByText('Explorar Todos los Cursos')).toBeInTheDocument()
    })
  })

  describe('Course card indexing', () => {
    it('should pass correct index to course cards for animations', () => {
      render(<CoursesSection data={mockData} isLoading={false} />)

      // First category courses
      const firstCourseCard = screen.getByTestId('course-card-1')
      const secondCourseCard = screen.getByTestId('course-card-2')
      
      expect(firstCourseCard).toHaveAttribute('data-index', '0')
      expect(secondCourseCard).toHaveAttribute('data-index', '1')

      // Second category course
      const thirdCourseCard = screen.getByTestId('course-card-3')
      expect(thirdCourseCard).toHaveAttribute('data-index', '0') // Resets for each category
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<CoursesSection data={mockData} isLoading={false} />)

      // Main section title (h2)
      const mainHeading = screen.getByRole('heading', { name: 'Cursos Populares por Categoría' })
      expect(mainHeading).toBeInTheDocument()

      // Category headings (h3)
      expect(screen.getByRole('heading', { name: 'Desarrollo Web' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Data Science' })).toBeInTheDocument()
    })
  })

  describe('Category descriptions', () => {
    it('should render category descriptions when provided', () => {
      render(<CoursesSection data={mockData} isLoading={false} />)

      expect(screen.getByText('Aprende a crear aplicaciones web modernas')).toBeInTheDocument()
      expect(screen.getByText('Análisis de datos y machine learning')).toBeInTheDocument()
    })

    it('should handle categories without descriptions', () => {
      const dataWithoutDescriptions = [
        {
          category: { id: 1, name: 'Categoría Sin Descripción' },
          courses: [
            { id: 1, title: 'Curso Test', description: 'Descripción test', slug: 'curso-test' }
          ]
        }
      ]

      render(<CoursesSection data={dataWithoutDescriptions} isLoading={false} />)

      expect(screen.getByText('Categoría Sin Descripción')).toBeInTheDocument()
      // Description paragraph should still exist but be empty
    })
  })
})