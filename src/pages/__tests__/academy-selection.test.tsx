import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react'
import { vi, beforeEach, describe, it, expect } from 'vitest'
import { AcademySelectionPage } from '../../features/academy-selection/index'
import type { AcademyMembership, AcademyData } from '../../features/academy-selection/types'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    footer: ({ children, ...props }: any) => <footer {...props}>{children}</footer>,
  },
}))

// Mock TanStack Router
const mockNavigate = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}))

// Mock auth store
const mockUseAuthStore = vi.fn()
vi.mock('@/stores/auth-store', () => ({
  useAuthStore: () => mockUseAuthStore(),
}))

// Mock UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, onClick, ...props }: any) => (
    <div onClick={onClick} {...props}>{children}</div>
  ),
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}))

// Mock Lucide React icons
vi.mock('lucide-react', () => {
  const MockIcon = ({ ...props }) => <span {...props} />
  return {
    Building: MockIcon,
    Users: MockIcon,
    GraduationCap: MockIcon,
    ArrowRight: MockIcon,
    Plus: MockIcon,
    Shield: MockIcon,
    BookOpen: MockIcon,
    Clock: MockIcon,
    Sparkles: MockIcon,
  }
})

describe('AcademySelectionPage', () => {
  const mockUser = {
    id: 1,
    first_name: 'Juan',
    last_name: 'Pérez',
    email: 'juan@example.com',
  }

  const mockAcademies: AcademyMembership[] = [
    {
      id: 1,
      name: 'Academia de Desarrollo Web',
      slug: 'desarrollo-web',
      description: 'Aprende desarrollo web desde cero',
      logo_url: 'https://example.com/logo1.jpg',
      user_role: 'student',
      user_role_display: 'Estudiante',
      created_at: '2024-01-01',
      last_accessed: '2024-01-15',
      last_accessed_at: '2024-01-15',
    },
    {
      id: 2,
      name: 'Academia de Ciencias',
      slug: 'ciencias',
      description: 'Explora el mundo de las ciencias',
      logo_url: null,
      user_role: 'admin',
      user_role_display: 'Administrador',
      created_at: '2024-01-01',
      last_accessed: null,
      last_accessed_at: null,
    },
    {
      id: 3,
      name: 'Academia de Arte',
      slug: 'arte',
      description: 'Desarrolla tu creatividad artística',
      logo_url: 'https://example.com/logo3.jpg',
      user_role: 'teacher',
      user_role_display: 'Profesor',
      created_at: '2024-01-01',
      last_accessed: '2024-01-10',
      last_accessed_at: '2024-01-10',
    },
  ]

  const mockAcademyData: AcademyData = {
    count: 3,
    academies: mockAcademies,
  }

  const mockSelectAcademy = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Loading State', () => {
    it('should show loading spinner when user data is not available', () => {
      mockUseAuthStore.mockReturnValue({
        user: null,
        academyData: null,
        selectAcademy: mockSelectAcademy,
      })

      render(<AcademySelectionPage />)

      expect(screen.getByText('Cargando tus academias...')).toBeInTheDocument()
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('should show loading spinner when academy data is not available', () => {
      mockUseAuthStore.mockReturnValue({
        user: mockUser,
        academyData: null,
        selectAcademy: mockSelectAcademy,
      })

      render(<AcademySelectionPage />)

      expect(screen.getByText('Cargando tus academias...')).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should show empty state when user has no academies', () => {
      mockUseAuthStore.mockReturnValue({
        user: mockUser,
        academyData: { count: 0, academies: [] },
        selectAcademy: mockSelectAcademy,
      })

      render(<AcademySelectionPage />)

      expect(screen.getByText('No tienes academias')).toBeInTheDocument()
      expect(screen.getByText('Aún no perteneces a ninguna academia. Crea tu propia academia o solicita una invitación a un administrador.')).toBeInTheDocument()
      expect(screen.getByText('Crear Academia')).toBeInTheDocument()
      expect(screen.getByText('Solicitar Invitación')).toBeInTheDocument()
    })
  })

  describe('Academy List', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        user: mockUser,
        academyData: mockAcademyData,
        selectAcademy: mockSelectAcademy,
      })
    })

    it('should render page header with user name', () => {
      render(<AcademySelectionPage />)

      expect(screen.getByText('Selecciona tu Academia')).toBeInTheDocument()
      expect(screen.getByText(/¡Bienvenido de nuevo,/)).toBeInTheDocument()
      expect(screen.getByText('Juan')).toBeInTheDocument()
    })

    it('should display academy count', () => {
      render(<AcademySelectionPage />)

      expect(screen.getByText(/Tienes acceso a/)).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText(/academias/)).toBeInTheDocument()
    })

    it('should render all academies', () => {
      render(<AcademySelectionPage />)

      expect(screen.getByText('Academia de Desarrollo Web')).toBeInTheDocument()
      expect(screen.getByText('Academia de Ciencias')).toBeInTheDocument()
      expect(screen.getByText('Academia de Arte')).toBeInTheDocument()
    })

    it('should display academy descriptions', () => {
      render(<AcademySelectionPage />)

      expect(screen.getByText('Aprende desarrollo web desde cero')).toBeInTheDocument()
      expect(screen.getByText('Explora el mundo de las ciencias')).toBeInTheDocument()
      expect(screen.getByText('Desarrolla tu creatividad artística')).toBeInTheDocument()
    })

    it('should display correct role badges', () => {
      render(<AcademySelectionPage />)

      expect(screen.getByText('Estudiante')).toBeInTheDocument()
      expect(screen.getByText('Administrador')).toBeInTheDocument()
      expect(screen.getByText('Profesor')).toBeInTheDocument()
    })

    it('should show last accessed dates correctly', () => {
      render(<AcademySelectionPage />)

      expect(screen.getAllByText(/Último acceso:/)).toHaveLength(2)
      expect(screen.getByText('Nueva academia')).toBeInTheDocument()
    })

    it('should display building icon for academies without logo', () => {
      render(<AcademySelectionPage />)

      expect(screen.getByTestId('building-icon')).toBeInTheDocument()
    })

    it('should render page footer', () => {
      render(<AcademySelectionPage />)

      expect(screen.getByText('¿Necesitas ayuda? Contacta al administrador de tu academia o')).toBeInTheDocument()
      expect(screen.getByText('visita nuestro centro de ayuda')).toBeInTheDocument()
    })
  })

  describe('Academy Selection', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        user: mockUser,
        academyData: mockAcademyData,
        selectAcademy: mockSelectAcademy,
      })
    })

    it('should call selectAcademy and navigate when academy is clicked', async () => {
      render(<AcademySelectionPage />)

      const academyCard = screen.getByText('Academia de Desarrollo Web').closest('.academy-card')
      expect(academyCard).toBeInTheDocument()

      fireEvent.click(academyCard!)

      await waitFor(() => {
        expect(mockSelectAcademy).toHaveBeenCalledWith(1)
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/academy/desarrollo-web/dashboard' })
      })
    })

    it('should handle academy selection for different academies', async () => {
      render(<AcademySelectionPage />)

      const academyCard = screen.getByText('Academia de Ciencias').closest('.academy-card')
      fireEvent.click(academyCard!)

      await waitFor(() => {
        expect(mockSelectAcademy).toHaveBeenCalledWith(2)
        expect(mockNavigate).toHaveBeenCalledWith({ to: '/academy/ciencias/dashboard' })
      })
    })

    it('should handle errors during academy selection gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const errorMessage = 'Selection failed'
      mockSelectAcademy.mockImplementation(() => {
        throw new Error(errorMessage)
      })

      render(<AcademySelectionPage />)

      const academyCard = screen.getByText('Academia de Arte').closest('.academy-card')
      fireEvent.click(academyCard!)

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to select academy:', expect.any(Error))
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Singular vs Plural Text', () => {
    it('should show singular text for one academy', () => {
      mockUseAuthStore.mockReturnValue({
        user: mockUser,
        academyData: { count: 1, academies: [mockAcademies[0]] },
        selectAcademy: mockSelectAcademy,
      })

      render(<AcademySelectionPage />)

      expect(screen.getByText('1')).toBeInTheDocument()
      // Find the container element that has the count text
      const countContainer = screen.getByText(/Tienes acceso a/).closest('p')
      expect(countContainer).toHaveTextContent('Tienes acceso a 1 academia')
    })
  })

  describe('Role-based styling', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        user: mockUser,
        academyData: mockAcademyData,
        selectAcademy: mockSelectAcademy,
      })
    })

    it('should apply correct CSS classes for different roles', () => {
      render(<AcademySelectionPage />)

      const adminBadge = screen.getByText('Administrador').parentElement
      const teacherBadge = screen.getByText('Profesor').parentElement
      const studentBadge = screen.getByText('Estudiante').parentElement

      expect(adminBadge).toHaveClass('bg-red-100', 'text-red-700', 'border-red-200')
      expect(teacherBadge).toHaveClass('bg-blue-100', 'text-blue-700', 'border-blue-200')
      expect(studentBadge).toHaveClass('bg-green-100', 'text-green-700', 'border-green-200')
    })
  })
})