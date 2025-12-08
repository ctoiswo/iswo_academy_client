import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CourseManagementDetailPage from '../course-management-detail'

// Mock dependencies
vi.mock('@tanstack/react-router', () => ({
  useParams: () => ({ courseId: '1' }),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))

const mockUseCourse = vi.fn()
vi.mock('@/hooks/use-courses', () => ({
  useCourse: (courseId: string) => mockUseCourse(courseId),
}))

vi.mock('@/components/access-codes/access-code-list', () => ({
  AccessCodeList: ({ courseId }: { courseId: string }) => (
    <div data-testid='access-code-list'>
      Lista de códigos de acceso para curso {courseId}
    </div>
  ),
}))

describe('CourseManagementDetailPage', () => {
  const mockCourse = {
    id: 1,
    title: 'Curso de React Avanzado',
    description: 'Aprende React a nivel profesional',
    status: 'published',
    difficulty_level: 'advanced',
    is_free: false,
    price: '99.99',
    duration_in_minutes: 360,
    total_lessons: 24,
    enrolled_count: 150,
    lessons: [
      {
        id: 1,
        title: 'Introducción a React',
        description: 'Conceptos básicos',
        order: 1,
        duration_in_minutes: 30,
        is_free_preview: true,
      },
      {
        id: 2,
        title: 'Hooks avanzados',
        description: 'useState, useEffect y custom hooks',
        order: 2,
        duration_in_minutes: 45,
        is_free_preview: false,
      },
      {
        id: 3,
        title: 'Context API y Redux',
        description: 'Gestión de estado global',
        order: 3,
        duration_in_minutes: 60,
        is_free_preview: false,
      },
    ],
    quizzes: [
      {
        id: 1,
        title: 'Quiz de React Básico',
        description: 'Evalúa tus conocimientos básicos',
        total_questions: 10,
        passing_score: 70,
      },
      {
        id: 2,
        title: 'Quiz de Hooks',
        description: 'Prueba de hooks avanzados',
        total_questions: 15,
        passing_score: 80,
      },
    ],
    objectives: [
      {
        id: 1,
        title: 'Dominar React Hooks',
        description: 'Utilizar hooks de forma efectiva',
      },
      {
        id: 2,
        title: 'Gestionar estado global',
        description: 'Implementar Context API y Redux',
      },
    ],
    students: [
      {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@example.com',
        progress: 75,
        enrolled_at: '2024-01-15',
      },
      {
        id: 2,
        name: 'María García',
        email: 'maria@example.com',
        progress: 100,
        enrolled_at: '2024-01-10',
      },
      {
        id: 3,
        name: 'Carlos López',
        email: 'carlos@example.com',
        progress: 30,
        enrolled_at: '2024-02-01',
      },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseCourse.mockReturnValue({
      data: mockCourse,
      isLoading: false,
      error: null,
    })
  })

  const renderComponent = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })
    return render(
      <QueryClientProvider client={queryClient}>
        <CourseManagementDetailPage />
      </QueryClientProvider>
    )
  }

  describe('Renderizado básico', () => {
    it('renderiza el título del curso', () => {
      renderComponent()
      expect(screen.getByText('Curso de React Avanzado')).toBeInTheDocument()
    })

    it('renderiza el botón de volver', () => {
      renderComponent()
      expect(
        screen.getByRole('link', { name: /volver a cursos/i })
      ).toBeInTheDocument()
    })

    it('renderiza las pestañas de gestión', () => {
      renderComponent()
      expect(
        screen.getByRole('tab', { name: /lecciones/i })
      ).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /tareas/i })).toBeInTheDocument()
      expect(
        screen.getByRole('tab', { name: /estudiantes/i })
      ).toBeInTheDocument()
    })

    it('renderiza la información del curso', () => {
      renderComponent()
      expect(screen.getByText(/6h/i)).toBeInTheDocument() // duration
      expect(screen.getByText('24')).toBeInTheDocument() // total lessons
      expect(screen.getByText('150')).toBeInTheDocument() // enrolled count
    })
  })

  describe('Pestaña de Lecciones', () => {
    it('muestra todas las lecciones del curso', () => {
      renderComponent()
      expect(screen.getByText('Introducción a React')).toBeInTheDocument()
      expect(screen.getByText('Hooks avanzados')).toBeInTheDocument()
      expect(screen.getByText('Context API y Redux')).toBeInTheDocument()
    })

    it('muestra la duración de cada lección', () => {
      renderComponent()
      expect(screen.getByText('30m')).toBeInTheDocument()
      expect(screen.getByText('45m')).toBeInTheDocument()
      expect(screen.getByText('1h')).toBeInTheDocument()
    })

    it('indica las lecciones de vista previa gratuita', () => {
      renderComponent()
      const freeBadges = screen.getAllByText(/vista previa gratuita/i)
      expect(freeBadges.length).toBeGreaterThan(0)
    })

    it('renderiza el botón para añadir nueva lección', () => {
      renderComponent()
      expect(
        screen.getByRole('button', { name: /nueva lección/i })
      ).toBeInTheDocument()
    })

    it('permite editar lecciones', () => {
      renderComponent()
      const editButtons = screen.getAllByRole('button', { name: /editar/i })
      expect(editButtons.length).toBeGreaterThanOrEqual(3)
    })

    it('permite eliminar lecciones', () => {
      renderComponent()
      const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i })
      expect(deleteButtons.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('Pestaña de Quizzes', () => {
    it('muestra la pestaña de quizzes', async () => {
      const user = userEvent.setup()
      renderComponent()

      const quizzesTab = screen.getByRole('tab', { name: /quizzes/i })
      await user.click(quizzesTab)

      expect(screen.getByText('Quiz de React Básico')).toBeInTheDocument()
      expect(screen.getByText('Quiz de Hooks')).toBeInTheDocument()
    })

    it('muestra el número de preguntas de cada quiz', async () => {
      const user = userEvent.setup()
      renderComponent()

      const quizzesTab = screen.getByRole('tab', { name: /quizzes/i })
      await user.click(quizzesTab)

      expect(screen.getByText('10 preguntas')).toBeInTheDocument()
      expect(screen.getByText('15 preguntas')).toBeInTheDocument()
    })

    it('muestra el puntaje mínimo para aprobar', async () => {
      const user = userEvent.setup()
      renderComponent()

      const quizzesTab = screen.getByRole('tab', { name: /quizzes/i })
      await user.click(quizzesTab)

      expect(screen.getByText(/70%/i)).toBeInTheDocument()
      expect(screen.getByText(/80%/i)).toBeInTheDocument()
    })

    it('renderiza el botón para añadir nuevo quiz', async () => {
      const user = userEvent.setup()
      renderComponent()

      const quizzesTab = screen.getByRole('tab', { name: /quizzes/i })
      await user.click(quizzesTab)

      expect(
        screen.getByRole('button', { name: /a00f1adir tarea/i })
      ).toBeInTheDocument()
    })
  })

  describe('Pestaña de Objetivos', () => {
    it('cambia a la pestaña de objetivos', async () => {
      const user = userEvent.setup()
      renderComponent()

      const objectivesTab = screen.getByRole('tab', { name: /tareas/i })
      await user.click(objectivesTab)

      expect(screen.getByText('Dominar React Hooks')).toBeInTheDocument()
      expect(screen.getByText('Gestionar estado global')).toBeInTheDocument()
    })

    it('muestra las descripciones de los objetivos', async () => {
      const user = userEvent.setup()
      renderComponent()

      const objectivesTab = screen.getByRole('tab', { name: /tareas/i })
      await user.click(objectivesTab)

      expect(
        screen.getByText('Utilizar hooks de forma efectiva')
      ).toBeInTheDocument()
      expect(
        screen.getByText('Implementar Context API y Redux')
      ).toBeInTheDocument()
    })

    it('renderiza el botón para añadir nuevo objetivo', async () => {
      const user = userEvent.setup()
      renderComponent()

      const objectivesTab = screen.getByRole('tab', { name: /tareas/i })
      await user.click(objectivesTab)

      expect(
        screen.getByRole('button', { name: /a00f1adir tarea/i })
      ).toBeInTheDocument()
    })
  })

  describe('Pestaña de Estudiantes', () => {
    it('cambia a la pestaña de estudiantes', async () => {
      const user = userEvent.setup()
      renderComponent()

      const studentsTab = screen.getByRole('tab', { name: /estudiantes/i })
      await user.click(studentsTab)

      expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
      expect(screen.getByText('María García')).toBeInTheDocument()
      expect(screen.getByText('Carlos López')).toBeInTheDocument()
    })

    it('muestra el progreso de cada estudiante', async () => {
      const user = userEvent.setup()
      renderComponent()

      const studentsTab = screen.getByRole('tab', { name: /estudiantes/i })
      await user.click(studentsTab)

      expect(screen.getByText('75%')).toBeInTheDocument()
      expect(screen.getByText('100%')).toBeInTheDocument()
      expect(screen.getByText('30%')).toBeInTheDocument()
    })

    it('muestra los emails de los estudiantes', async () => {
      const user = userEvent.setup()
      renderComponent()

      const studentsTab = screen.getByRole('tab', { name: /estudiantes/i })
      await user.click(studentsTab)

      expect(screen.getByText('juan@example.com')).toBeInTheDocument()
      expect(screen.getByText('maria@example.com')).toBeInTheDocument()
      expect(screen.getByText('carlos@example.com')).toBeInTheDocument()
    })

    it('permite ver detalles del estudiante', async () => {
      const user = userEvent.setup()
      renderComponent()

      const studentsTab = screen.getByRole('tab', { name: /estudiantes/i })
      await user.click(studentsTab)

      const viewButtons = screen.getAllByRole('button', {
        name: /ver an00e1lisis/i,
      })
      expect(viewButtons.length).toBe(3)
    })
  })

  describe('Pestaña de Códigos de Acceso', () => {
    it('renderiza la pestaña de códigos de acceso', async () => {
      const user = userEvent.setup()
      renderComponent()

      const accessCodesTab = screen.getByRole('tab', {
        name: /códigos de acceso/i,
      })
      await user.click(accessCodesTab)

      await waitFor(() => {
        expect(screen.getByTestId('access-code-list')).toBeInTheDocument()
      })
    })

    it('pasa el ID del curso al componente de códigos de acceso', async () => {
      const user = userEvent.setup()
      renderComponent()

      const accessCodesTab = screen.getByRole('tab', {
        name: /códigos de acceso/i,
      })
      await user.click(accessCodesTab)

      await waitFor(() => {
        expect(screen.getByText(/curso 1/i)).toBeInTheDocument()
      })
    })
  })

  describe('Pestaña de Configuración', () => {
    it('cambia a la pestaña de configuración', async () => {
      const user = userEvent.setup()
      renderComponent()

      const settingsTab = screen.getByRole('tab', { name: /configuración/i })
      await user.click(settingsTab)

      expect(screen.getByText(/configuración del curso/i)).toBeInTheDocument()
    })

    it('muestra opciones de configuración del curso', async () => {
      const user = userEvent.setup()
      renderComponent()

      const settingsTab = screen.getByRole('tab', { name: /configuración/i })
      await user.click(settingsTab)

      expect(
        screen.getByRole('button', { name: /configuraci00f3n del curso/i })
      ).toBeInTheDocument()
    })
  })

  describe('Estados especiales', () => {
    it('muestra estado de carga', () => {
      mockUseCourse.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      })

      renderComponent()
      const skeletons = document.querySelectorAll('[data-slot="skeleton"]')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('muestra mensaje de error cuando falla la carga', () => {
      mockUseCourse.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Error al cargar'),
      })

      renderComponent()
      expect(screen.getByText('Error al Cargar el Curso')).toBeInTheDocument()
    })

    it('muestra mensaje cuando no se encuentra el curso', () => {
      mockUseCourse.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      })

      renderComponent()
      expect(screen.getByText(/curso no encontrado/i)).toBeInTheDocument()
    })

    it('renderiza el botón de volver en estado de error', () => {
      mockUseCourse.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Error'),
      })

      renderComponent()
      expect(
        screen.getByRole('link', { name: /volver a cursos/i })
      ).toBeInTheDocument()
    })
  })

  describe('Información del curso', () => {
    it('muestra el nivel de dificultad', () => {
      renderComponent()
      expect(screen.getByText('Avanzado')).toBeInTheDocument()
    })

    it('muestra el estado del curso', () => {
      renderComponent()
      expect(screen.getByText('Publicado')).toBeInTheDocument()
    })

    it('muestra el precio del curso', () => {
      renderComponent()
      expect(screen.getByText('$99.99')).toBeInTheDocument()
    })

    it('muestra que el curso es de pago', () => {
      renderComponent()
      const freeBadges = screen.queryAllByText('Gratis')
      const paidText = screen.queryByText(/pago/i)
      expect(freeBadges.length === 0 || paidText).toBeTruthy()
    })
  })

  describe('Navegación', () => {
    it('el enlace de volver apunta a la lista de cursos', () => {
      renderComponent()
      const backLink = screen.getByRole('link', { name: /volver a cursos/i })
      expect(backLink).toHaveAttribute('href', '/admin/courses')
    })

    it('persiste la pestaña activa al cambiar entre pestañas', async () => {
      const user = userEvent.setup()
      renderComponent()

      const objectivesTab = screen.getByRole('tab', { name: /tareas/i })
      await user.click(objectivesTab)

      expect(objectivesTab).toHaveAttribute('data-state', 'active')

      const lessonsTab = screen.getByRole('tab', { name: /lecciones/i })
      await user.click(lessonsTab)

      expect(lessonsTab).toHaveAttribute('data-state', 'active')
    })
  })

  describe('Datos vacíos', () => {
    it('muestra mensaje cuando no hay lecciones', () => {
      mockUseCourse.mockReturnValue({
        data: { ...mockCourse, lessons: [] },
        isLoading: false,
        error: null,
      })

      renderComponent()
      expect(screen.getByText(/a00fan no hay lecciones/i)).toBeInTheDocument()
    })

    it('muestra mensaje cuando no hay objetivos', async () => {
      const user = userEvent.setup()
      mockUseCourse.mockReturnValue({
        data: { ...mockCourse, objectives: [] },
        isLoading: false,
        error: null,
      })

      renderComponent()
      const objectivesTab = screen.getByRole('tab', { name: /tareas/i })
      await user.click(objectivesTab)

      expect(screen.getByText(/a00fan no hay tareas/i)).toBeInTheDocument()
    })

    it('muestra mensaje cuando no hay estudiantes', async () => {
      const user = userEvent.setup()
      mockUseCourse.mockReturnValue({
        data: { ...mockCourse, students: [] },
        isLoading: false,
        error: null,
      })

      renderComponent()
      const studentsTab = screen.getByRole('tab', { name: /estudiantes/i })
      await user.click(studentsTab)

      expect(
        screen.getByText(/no hay estudiantes inscritos/i)
      ).toBeInTheDocument()
    })
  })
})
