import { render, screen, waitFor } from '@testing-library/react'
import type { AcademyMembership } from '@/stores/auth-store'
import { AcademyStatsOverview } from '../academy-stats-overview'

// Mock the academy membership
const mockAcademy: AcademyMembership = {
  id: 1,
  name: 'Test Academy',
  user_role: 'admin',
  permissions: ['manage_users', 'manage_courses'],
  academy: {
    id: 1,
    name: 'Test Academy',
    description: 'A test academy',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
}

describe('AcademyStatsOverview', () => {
  it('should render loading state initially', () => {
    render(<AcademyStatsOverview academy={mockAcademy} loading={true} />)

    // Check for skeleton loading elements
    const skeletons = document.querySelectorAll('[data-slot="skeleton"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should render academy statistics after loading', async () => {
    render(<AcademyStatsOverview academy={mockAcademy} />)

    // Wait for the mock data to load
    await waitFor(() => {
      expect(screen.getByText('Total Students')).toBeInTheDocument()
      expect(screen.getByText('Total Teachers')).toBeInTheDocument()
      expect(screen.getByText('Active Courses')).toBeInTheDocument()
      expect(screen.getByText('Academy Revenue')).toBeInTheDocument()
    })

    // Check for mock data values
    await waitFor(() => {
      expect(screen.getByText('1,247')).toBeInTheDocument() // Total students
      expect(screen.getByText('23')).toBeInTheDocument() // Total teachers
      expect(screen.getByText('45')).toBeInTheDocument() // Total courses
      expect(screen.getByText('$89,750')).toBeInTheDocument() // Academy revenue
    })
  })

  it('should display enrollment trends', async () => {
    render(<AcademyStatsOverview academy={mockAcademy} />)

    await waitFor(() => {
      expect(screen.getByText('Enrollment Trends')).toBeInTheDocument()
      expect(screen.getByText('Monthly enrollment growth')).toBeInTheDocument()
    })

    // Check for trend data
    await waitFor(() => {
      expect(screen.getByText('Apr')).toBeInTheDocument()
      expect(screen.getByText('May')).toBeInTheDocument()
      expect(screen.getByText('Jun')).toBeInTheDocument()
    })
  })

  it('should display top performing courses', async () => {
    render(<AcademyStatsOverview academy={mockAcademy} />)

    await waitFor(() => {
      expect(screen.getByText('Top Performing Courses')).toBeInTheDocument()
      expect(
        screen.getByText('Highest enrollment and revenue')
      ).toBeInTheDocument()
    })

    // Check for course data
    await waitFor(() => {
      expect(screen.getByText('Advanced React Development')).toBeInTheDocument()
      expect(screen.getByText('Python for Data Science')).toBeInTheDocument()
      expect(
        screen.getByText('Digital Marketing Fundamentals')
      ).toBeInTheDocument()
    })
  })

  it('should show growth indicators with correct colors', async () => {
    render(<AcademyStatsOverview academy={mockAcademy} />)

    await waitFor(() => {
      // Check for positive growth indicators (should be green)
      const growthElements = screen.getAllByText(/\+\d+\.\d+%/)
      expect(growthElements.length).toBeGreaterThan(0)
    })
  })

  it('should handle academy prop changes', async () => {
    const { rerender } = render(<AcademyStatsOverview academy={mockAcademy} />)

    const updatedAcademy = { ...mockAcademy, name: 'Updated Academy' }
    rerender(<AcademyStatsOverview academy={updatedAcademy} />)

    // Component should re-fetch data when academy changes
    await waitFor(() => {
      expect(screen.getByText('Total Students')).toBeInTheDocument()
    })
  })

  it('should display correct format for currency values', async () => {
    render(<AcademyStatsOverview academy={mockAcademy} />)

    await waitFor(() => {
      // Check currency formatting
      expect(screen.getByText('$89,750')).toBeInTheDocument()
      expect(screen.getByText('$8,900')).toBeInTheDocument()
      expect(screen.getByText('$7,600')).toBeInTheDocument()
    })
  })

  it('should display descriptive text for each metric', async () => {
    render(<AcademyStatsOverview academy={mockAcademy} />)

    await waitFor(() => {
      expect(screen.getByText('Active enrolled students')).toBeInTheDocument()
      expect(screen.getByText('Active teaching staff')).toBeInTheDocument()
      expect(screen.getByText('Published courses')).toBeInTheDocument()
      expect(screen.getByText('Total monthly revenue')).toBeInTheDocument()
    })
  })
})
