import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { CourseSidebar } from '../components/course-sidebar'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('CourseSidebar', () => {
  const mockCourse = {
    id: 1,
    title: 'Curso de React',
    is_free: false,
    price: '49.99',
    difficulty_level: 'intermediate',
    duration_minutes: 1200,
    sections: [
      { id: 1, title: 'Introducción', lessons: 5, duration: 300 },
      { id: 2, title: 'Contenido Principal', lessons: 10, duration: 600 },
    ],
  } as any

  const mockProps = {
    course: mockCourse,
    isSaved: false,
    onSaveClick: vi.fn(),
    onShareClick: vi.fn(),
    formatPrice: (price: string) => `$${price}`,
    formatDifficulty: (level: string) => level.charAt(0).toUpperCase() + level.slice(1),
  }

  it('renders course pricing information correctly', () => {
    render(<CourseSidebar {...mockProps} />)

    expect(screen.getByText('$49.99')).toBeInTheDocument()
    expect(screen.getByText('Acceso completo de por vida')).toBeInTheDocument()
  })

  it('shows free pricing for free courses', () => {
    const freeCourse = { ...mockCourse, is_free: true }
    render(<CourseSidebar {...mockProps} course={freeCourse} />)

    expect(screen.getByText('Gratis')).toBeInTheDocument()
  })

  it('renders enroll button', () => {
    render(<CourseSidebar {...mockProps} />)

    expect(screen.getByText('Inscribirse al curso')).toBeInTheDocument()
  })

  it('renders save button with correct state', () => {
    render(<CourseSidebar {...mockProps} />)

    expect(screen.getByText('Guardar')).toBeInTheDocument()

    // Test saved state
    render(<CourseSidebar {...mockProps} isSaved={true} />)
    expect(screen.getByText('Guardado')).toBeInTheDocument()
  })

  it('handles save button click', () => {
    render(<CourseSidebar {...mockProps} />)

    const saveButton = screen.getByText('Guardar')
    fireEvent.click(saveButton)

    expect(mockProps.onSaveClick).toHaveBeenCalled()
  })

  it('handles share button click', () => {
    render(<CourseSidebar {...mockProps} />)

    const shareButton = screen.getByText('Compartir')
    fireEvent.click(shareButton)

    expect(mockProps.onShareClick).toHaveBeenCalled()
  })

  it('displays course details correctly', () => {
    render(<CourseSidebar {...mockProps} />)

    expect(screen.getByText('Intermediate')).toBeInTheDocument() // Formatted difficulty
    expect(screen.getByText('20 horas')).toBeInTheDocument() // Duration
    expect(screen.getByText('15')).toBeInTheDocument() // Total lessons
    expect(screen.getByText('Español')).toBeInTheDocument() // Language
    expect(screen.getByText('De por vida')).toBeInTheDocument() // Access
  })
})