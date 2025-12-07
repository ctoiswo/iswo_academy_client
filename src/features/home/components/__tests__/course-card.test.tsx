import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CourseCard } from '../course-card'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, params, ...props }: any) => (
    <a href={`${to}/${params?.courseSlug}`} {...props}>
      {children}
    </a>
  ),
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Clock: ({ className }: { className?: string }) => (
    <div className={className} data-testid="clock-icon">⏰</div>
  ),
  Users: ({ className }: { className?: string }) => (
    <div className={className} data-testid="users-icon">👥</div>
  ),
}))

// Mock formatters
vi.mock('@/lib/formatters', () => ({
  formatPrice: (price: number) => `$${price}`,
  formatDifficulty: (difficulty: string) => {
    const map: Record<string, string> = {
      'beginner': 'Principiante',
      'intermediate': 'Intermedio',
      'advanced': 'Avanzado'
    }
    return map[difficulty] || difficulty
  }
}))

// Mock helpers
vi.mock('@/lib/helpers', () => ({
  generateCourseSlug: (course: any) => `${course.id}-${course.title.toLowerCase().replace(/\s+/g, '-')}`
}))

// Mock UI components
vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className, ...props }: any) => (
    <span 
      className={className}
      data-variant={variant}
      data-testid="badge"
      {...props}
    >
      {children}
    </span>
  ),
}))

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className, ...props }: any) => (
    <div className={className} data-testid="card" {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, className, ...props }: any) => (
    <div className={className} data-testid="card-content" {...props}>
      {children}
    </div>
  ),
  CardDescription: ({ children, className, ...props }: any) => (
    <div className={className} data-testid="card-description" {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children, className, ...props }: any) => (
    <div className={className} data-testid="card-header" {...props}>
      {children}
    </div>
  ),
  CardTitle: ({ children, className, ...props }: any) => (
    <h3 className={className} data-testid="card-title" {...props}>
      {children}
    </h3>
  ),
}))

const mockCourse = {
  id: 1,
  title: 'Curso de React Avanzado',
  slug: 'curso-react-avanzado',
  thumbnail_url: 'https://example.com/thumbnail.jpg',
  difficulty_level: 'intermediate' as const,
  is_free: false,
  price: 99.99,
  duration_minutes: 480,
  enrollment_count: 150,
  status: 'published',
  creator: {
    id: 1,
    name: 'Juan Pérez'
  }
}

const mockFreeCourse = {
  ...mockCourse,
  id: 2,
  title: 'Introducción a JavaScript',
  is_free: true,
  price: 0,
  difficulty_level: 'beginner' as const,
  status: 'draft'
}

const mockCourseWithoutThumbnail = {
  ...mockCourse,
  id: 3,
  thumbnail_url: null
}

describe('CourseCard', () => {
  describe('Basic rendering', () => {
    it('should render course information correctly', () => {
      render(<CourseCard course={mockCourse} />)

      expect(screen.getByText('Curso de React Avanzado')).toBeInTheDocument()
      expect(screen.getByText('Por Juan Pérez')).toBeInTheDocument()
      expect(screen.getByText('Intermedio')).toBeInTheDocument()
      expect(screen.getByText('$99.99')).toBeInTheDocument()
      expect(screen.getByText('8h')).toBeInTheDocument() // 480 minutes / 60 = 8h
      expect(screen.getByText('150')).toBeInTheDocument()
      expect(screen.getByText('Disponible')).toBeInTheDocument()
    })

    it('should render card structure correctly', () => {
      render(<CourseCard course={mockCourse} />)

      expect(screen.getByTestId('card')).toBeInTheDocument()
      expect(screen.getByTestId('card-header')).toBeInTheDocument()
      expect(screen.getByTestId('card-content')).toBeInTheDocument()
      expect(screen.getByTestId('card-title')).toBeInTheDocument()
      expect(screen.getByTestId('card-description')).toBeInTheDocument()
    })

    it('should render course thumbnail with correct attributes', () => {
      render(<CourseCard course={mockCourse} />)

      const thumbnail = screen.getByRole('img', { name: 'Curso de React Avanzado' })
      expect(thumbnail).toHaveAttribute('src', 'https://example.com/thumbnail.jpg')
      expect(thumbnail).toHaveAttribute('alt', 'Curso de React Avanzado')
    })

    it('should render icons correctly', () => {
      render(<CourseCard course={mockCourse} />)

      expect(screen.getByTestId('clock-icon')).toBeInTheDocument()
      expect(screen.getByTestId('users-icon')).toBeInTheDocument()
    })

    it('should render badges correctly', () => {
      render(<CourseCard course={mockCourse} />)

      const badges = screen.getAllByTestId('badge')
      expect(badges).toHaveLength(2) // Difficulty badge and status badge
      
      // Check difficulty badge
      expect(screen.getByText('Intermedio')).toBeInTheDocument()
      // Check status badge
      expect(screen.getByText('Disponible')).toBeInTheDocument()
    })
  })

  describe('Free course handling', () => {
    it('should display "Gratis" for free courses', () => {
      render(<CourseCard course={mockFreeCourse} />)

      expect(screen.getByText('Gratis')).toBeInTheDocument()
      expect(screen.queryByText('$0')).not.toBeInTheDocument()
    })

    it('should display correct difficulty for beginner course', () => {
      render(<CourseCard course={mockFreeCourse} />)

      expect(screen.getByText('Principiante')).toBeInTheDocument()
    })

    it('should display "Próximamente" for draft courses', () => {
      render(<CourseCard course={mockFreeCourse} />)

      expect(screen.getByText('Próximamente')).toBeInTheDocument()
    })
  })

  describe('Fallback handling', () => {
    it('should use fallback thumbnail when none provided', () => {
      render(<CourseCard course={mockCourseWithoutThumbnail} />)

      const thumbnail = screen.getByRole('img')
      expect(thumbnail).toHaveAttribute(
        'src', 
        'https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2'
      )
    })

    it('should handle missing creator name gracefully', () => {
      const courseWithoutCreator = {
        ...mockCourse,
        creator: { id: 1 }
      }
      
      render(<CourseCard course={courseWithoutCreator} />)

      expect(screen.getByText('Por')).toBeInTheDocument() // Should still render "Por" prefix
    })

    it('should handle missing enrollment count', () => {
      const courseWithoutEnrollment = {
        ...mockCourse,
        enrollment_count: undefined
      }
      
      render(<CourseCard course={courseWithoutEnrollment} />)

      expect(screen.getByTestId('users-icon')).toBeInTheDocument()
      // Should not crash when enrollment_count is undefined
    })
  })

  describe('Navigation link', () => {
    it('should generate correct course link', () => {
      render(<CourseCard course={mockCourse} />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/courses/$courseSlug/1-curso-de-react-avanzado')
    })

    it('should make entire card clickable', () => {
      render(<CourseCard course={mockCourse} />)

      const link = screen.getByRole('link')
      const card = screen.getByTestId('card')
      
      expect(link).toContainElement(card)
    })
  })

  describe('Duration calculation', () => {
    it('should calculate hours correctly from minutes', () => {
      const courseWith120Minutes = {
        ...mockCourse,
        duration_minutes: 120
      }
      
      render(<CourseCard course={courseWith120Minutes} />)

      expect(screen.getByText('2h')).toBeInTheDocument()
    })

    it('should round duration correctly', () => {
      const courseWith150Minutes = {
        ...mockCourse,
        duration_minutes: 150
      }
      
      render(<CourseCard course={courseWith150Minutes} />)

      expect(screen.getByText('3h')).toBeInTheDocument() // 150/60 = 2.5 -> rounds to 3
    })
  })

  describe('Advanced difficulty', () => {
    it('should display advanced difficulty correctly', () => {
      const advancedCourse = {
        ...mockCourse,
        difficulty_level: 'advanced' as const
      }
      
      render(<CourseCard course={advancedCourse} />)

      expect(screen.getByText('Avanzado')).toBeInTheDocument()
    })
  })

  describe('Animation props', () => {
    it('should render with motion wrapper', () => {
      render(<CourseCard course={mockCourse} index={2} />)

      // The motion.div should be rendered (mocked as regular div)
      const card = screen.getByTestId('card')
      expect(card.closest('div')).toBeInTheDocument()
    })
  })
})