import { render, screen } from '@testing-library/react'
import { CourseHeader } from '../components/course-header'

// Mock TanStack Router
const mockUseRouter = jest.fn()
jest.mock('@tanstack/react-router', () => ({
  useRouter: () => mockUseRouter(),
  Link: ({ children, to, params, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

describe('CourseHeader', () => {
  const mockProps = {
    academy: {
      name: 'Academia de Desarrollo',
      slug: 'academia-desarrollo',
    },
    courseTitle: 'Curso de React Avanzado',
  }

  const mockHistoryBack = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      history: {
        back: mockHistoryBack,
      },
    })
  })

  it('renders breadcrumb navigation correctly', () => {
    render(<CourseHeader {...mockProps} />)

    expect(screen.getByText('Cursos')).toBeInTheDocument()
    expect(screen.getByText('Academia de Desarrollo')).toBeInTheDocument()
    expect(screen.getByText('Curso de React Avanzado')).toBeInTheDocument()
  })

  it('renders back button', () => {
    render(<CourseHeader {...mockProps} />)

    expect(screen.getByText('Volver')).toBeInTheDocument()
  })

  it('calls history back when back button is clicked', () => {
    render(<CourseHeader {...mockProps} />)

    const backButton = screen.getByText('Volver')
    backButton.click()

    expect(mockHistoryBack).toHaveBeenCalled()
  })
})
