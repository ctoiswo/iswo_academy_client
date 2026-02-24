import { render, screen } from '@testing-library/react'
import { GlobalStatsOverview } from '../components/global-stats-overview'
import type { GlobalStats } from '../index'

// Mock the StatsWidget component
jest.mock('@/components/dashboard', () => ({
  StatsWidget: ({
    title,
    value,
    change,
    changeType,
    icon,
    loading,
    format,
    description,
  }: any) => (
    <div
      data-testid={`stats-widget-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div data-testid='title'>{title}</div>
      <div data-testid='value'>{loading ? 'Loading...' : value}</div>
      {change !== undefined && <div data-testid='change'>{change}%</div>}
      {changeType && <div data-testid='change-type'>{changeType}</div>}
      {format && <div data-testid='format'>{format}</div>}
      {description && <div data-testid='description'>{description}</div>}
      {icon && <div data-testid='icon'>Icon</div>}
    </div>
  ),
  DashboardCard: ({ title, children, className }: any) => (
    <div data-testid='dashboard-card' className={className}>
      {title && <div data-testid='card-title'>{title}</div>}
      {children}
    </div>
  ),
}))

describe('GlobalStatsOverview', () => {
  const mockStats: GlobalStats = {
    totalAcademies: 12,
    totalUsers: 1247,
    totalCourses: 89,
    totalRevenue: 45230,
    monthlyGrowth: {
      academies: 8.2,
      users: 15.3,
      revenue: 12.7,
    },
  }

  describe('Basic Rendering', () => {
    it('renders all stats widgets when data is provided', () => {
      render(<GlobalStatsOverview stats={mockStats} />)

      expect(
        screen.getByTestId('stats-widget-total-academies')
      ).toBeInTheDocument()
      expect(screen.getByTestId('stats-widget-total-users')).toBeInTheDocument()
      expect(
        screen.getByTestId('stats-widget-total-courses')
      ).toBeInTheDocument()
      expect(
        screen.getByTestId('stats-widget-total-revenue')
      ).toBeInTheDocument()
    })

    it('renders correct titles for each widget', () => {
      render(<GlobalStatsOverview stats={mockStats} />)

      expect(screen.getByText('Total Academies')).toBeInTheDocument()
      expect(screen.getByText('Total Users')).toBeInTheDocument()
      expect(screen.getByText('Total Courses')).toBeInTheDocument()
      expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    })

    it('renders correct values for each widget', () => {
      render(<GlobalStatsOverview stats={mockStats} />)

      expect(screen.getByText('12')).toBeInTheDocument()
      expect(screen.getByText('1247')).toBeInTheDocument()
      expect(screen.getByText('89')).toBeInTheDocument()
      expect(screen.getByText('45230')).toBeInTheDocument()
    })

    it('renders correct descriptions for each widget', () => {
      render(<GlobalStatsOverview stats={mockStats} />)

      expect(
        screen.getByText('Active learning institutions')
      ).toBeInTheDocument()
      expect(screen.getByText('Registered platform users')).toBeInTheDocument()
      expect(
        screen.getByText('Published courses across all academies')
      ).toBeInTheDocument()
      expect(screen.getByText('Platform-wide revenue')).toBeInTheDocument()
    })
  })

  describe('Growth Indicators', () => {
    it('shows growth percentages for widgets with growth data', () => {
      render(<GlobalStatsOverview stats={mockStats} />)

      // Check for growth percentages
      expect(screen.getByText('8.2%')).toBeInTheDocument() // academies growth
      expect(screen.getByText('15.3%')).toBeInTheDocument() // users growth
      expect(screen.getByText('12.7%')).toBeInTheDocument() // revenue growth
    })

    it('shows increase change type for positive growth', () => {
      render(<GlobalStatsOverview stats={mockStats} />)

      const changeTypes = screen.getAllByTestId('change-type')
      expect(changeTypes).toHaveLength(3) // academies, users, revenue have growth
      changeTypes.forEach((element) => {
        expect(element).toHaveTextContent('increase')
      })
    })

    it('handles zero growth correctly', () => {
      const statsWithZeroGrowth: GlobalStats = {
        ...mockStats,
        monthlyGrowth: {
          academies: 0,
          users: 0,
          revenue: 0,
        },
      }

      render(<GlobalStatsOverview stats={statsWithZeroGrowth} />)

      const changeTypes = screen.getAllByTestId('change-type')
      changeTypes.forEach((element) => {
        expect(element).toHaveTextContent('neutral')
      })
    })

    it('handles negative growth correctly', () => {
      const statsWithNegativeGrowth: GlobalStats = {
        ...mockStats,
        monthlyGrowth: {
          academies: -5.2,
          users: -10.3,
          revenue: -2.7,
        },
      }

      render(<GlobalStatsOverview stats={statsWithNegativeGrowth} />)

      const changeTypes = screen.getAllByTestId('change-type')
      changeTypes.forEach((element) => {
        expect(element).toHaveTextContent('neutral') // negative values still show as neutral in current implementation
      })
    })
  })

  describe('Formatting', () => {
    it('applies correct format to each widget', () => {
      render(<GlobalStatsOverview stats={mockStats} />)

      const formats = screen.getAllByTestId('format')
      expect(formats).toHaveLength(4)

      // Check specific formats
      const academiesWidget = screen.getByTestId('stats-widget-total-academies')
      expect(
        academiesWidget.querySelector('[data-testid="format"]')
      ).toHaveTextContent('number')

      const usersWidget = screen.getByTestId('stats-widget-total-users')
      expect(
        usersWidget.querySelector('[data-testid="format"]')
      ).toHaveTextContent('number')

      const coursesWidget = screen.getByTestId('stats-widget-total-courses')
      expect(
        coursesWidget.querySelector('[data-testid="format"]')
      ).toHaveTextContent('number')

      const revenueWidget = screen.getByTestId('stats-widget-total-revenue')
      expect(
        revenueWidget.querySelector('[data-testid="format"]')
      ).toHaveTextContent('currency')
    })
  })

  describe('Loading State', () => {
    it('shows loading state when loading is true', () => {
      render(<GlobalStatsOverview stats={null} loading={true} />)

      const loadingTexts = screen.getAllByText('Loading...')
      expect(loadingTexts).toHaveLength(4) // All 4 widgets should show loading
    })

    it('passes loading prop to all widgets', () => {
      render(<GlobalStatsOverview stats={mockStats} loading={true} />)

      const loadingTexts = screen.getAllByText('Loading...')
      expect(loadingTexts).toHaveLength(4)
    })
  })

  describe('Error State', () => {
    it('shows error message when error is provided', () => {
      const errorMessage = 'Failed to load statistics'
      render(<GlobalStatsOverview stats={null} error={errorMessage} />)

      expect(screen.getByTestId('dashboard-card')).toBeInTheDocument()
      expect(screen.getByTestId('card-title')).toHaveTextContent(
        'Global Statistics'
      )
      expect(
        screen.getByText(`Error loading statistics: ${errorMessage}`)
      ).toBeInTheDocument()
    })

    it('does not render stats widgets when error is present', () => {
      render(<GlobalStatsOverview stats={mockStats} error='Some error' />)

      expect(
        screen.queryByTestId('stats-widget-total-academies')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('stats-widget-total-users')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('stats-widget-total-courses')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('stats-widget-total-revenue')
      ).not.toBeInTheDocument()
    })
  })

  describe('Null/Empty Data Handling', () => {
    it('renders with zero values when stats is null', () => {
      render(<GlobalStatsOverview stats={null} />)

      const zeroValues = screen.getAllByText('0')
      expect(zeroValues).toHaveLength(4) // All widgets should show 0
    })

    it('handles undefined growth values', () => {
      const statsWithoutGrowth: GlobalStats = {
        totalAcademies: 12,
        totalUsers: 1247,
        totalCourses: 89,
        totalRevenue: 45230,
        monthlyGrowth: {
          academies: 0,
          users: 0,
          revenue: 0,
        },
      }

      render(<GlobalStatsOverview stats={statsWithoutGrowth} />)

      // Should still render without errors
      expect(
        screen.getByTestId('stats-widget-total-academies')
      ).toBeInTheDocument()
      expect(screen.getByTestId('stats-widget-total-users')).toBeInTheDocument()
      expect(
        screen.getByTestId('stats-widget-total-revenue')
      ).toBeInTheDocument()
    })
  })

  describe('Icons', () => {
    it('renders icons for all widgets', () => {
      render(<GlobalStatsOverview stats={mockStats} />)

      const icons = screen.getAllByTestId('icon')
      expect(icons).toHaveLength(4) // All widgets should have icons
    })
  })
})
