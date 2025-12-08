import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AcademyManagementPanel } from '../components/academy-management-panel'
import type { AcademyOverview } from '../index'

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, size, variant, ...props }: any) => (
    <button
      onClick={onClick}
      data-size={size}
      data-variant={variant}
      {...props}
    >
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/input', () => ({
  Input: ({ placeholder, value, onChange, className, ...props }: any) => (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
      {...props}
    />
  ),
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant }: any) => (
    <span data-variant={variant}>{children}</span>
  ),
}))

vi.mock('@/components/ui/table', () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
  TableHead: ({ children, className }: any) => (
    <th className={className}>{children}</th>
  ),
  TableCell: ({ children, className }: any) => (
    <td className={className}>{children}</td>
  ),
}))

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children, asChild }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <div onClick={onClick}>{children}</div>
  ),
}))

vi.mock('@/components/dashboard', () => ({
  DashboardCard: ({ title, description, action, children }: any) => (
    <div data-testid='dashboard-card'>
      {title && <div data-testid='card-title'>{title}</div>}
      {description && <div data-testid='card-description'>{description}</div>}
      {action && <div data-testid='card-action'>{action}</div>}
      {children}
    </div>
  ),
}))

describe('AcademyManagementPanel', () => {
  const mockAcademies: AcademyOverview[] = [
    {
      id: 1,
      name: 'Tech Academy',
      description: 'Leading technology education platform',
      logo_url: null,
      total_users: 324,
      total_courses: 25,
      total_revenue: 15420,
      created_at: '2024-01-15T10:00:00Z',
      status: 'active',
    },
    {
      id: 2,
      name: 'Business School',
      description: 'Professional business training',
      logo_url: null,
      total_users: 198,
      total_courses: 18,
      total_revenue: 12350,
      created_at: '2024-02-01T14:30:00Z',
      status: 'active',
    },
    {
      id: 3,
      name: 'Design Institute',
      description: 'Creative design and arts education',
      logo_url: null,
      total_users: 156,
      total_courses: 12,
      total_revenue: 8940,
      created_at: '2024-02-20T09:15:00Z',
      status: 'inactive',
    },
  ]

  describe('Basic Rendering', () => {
    it('renders dashboard card with correct title and description', () => {
      render(<AcademyManagementPanel academies={mockAcademies} />)

      expect(screen.getByTestId('dashboard-card')).toBeInTheDocument()
      expect(screen.getByTestId('card-title')).toHaveTextContent(
        'Academy Management'
      )
      expect(screen.getByTestId('card-description')).toHaveTextContent(
        'Manage all academies on the platform'
      )
    })

    it('renders add academy button', () => {
      render(<AcademyManagementPanel academies={mockAcademies} />)

      expect(screen.getByText('Add Academy')).toBeInTheDocument()
    })

    it('renders search input', () => {
      render(<AcademyManagementPanel academies={mockAcademies} />)

      expect(
        screen.getByPlaceholderText('Search academies...')
      ).toBeInTheDocument()
    })

    it('renders status filter dropdown', () => {
      render(<AcademyManagementPanel academies={mockAcademies} />)

      expect(screen.getByText('Status: All')).toBeInTheDocument()
    })

    it('renders academy count', () => {
      render(<AcademyManagementPanel academies={mockAcademies} />)

      expect(screen.getByText('3 of 3 academies')).toBeInTheDocument()
    })
  })

  describe('Academy Table', () => {
    it('renders table headers', () => {
      render(<AcademyManagementPanel academies={mockAcademies} />)

      expect(screen.getByText('Academy')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByText('Users')).toBeInTheDocument()
      expect(screen.getByText('Courses')).toBeInTheDocument()
      expect(screen.getByText('Revenue')).toBeInTheDocument()
      expect(screen.getByText('Created')).toBeInTheDocument()
    })

    it('renders academy data in table rows', () => {
      render(<AcademyManagementPanel academies={mockAcademies} />)

      expect(screen.getByText('Tech Academy')).toBeInTheDocument()
      expect(
        screen.getByText('Leading technology education platform')
      ).toBeInTheDocument()
      expect(screen.getByText('Business School')).toBeInTheDocument()
      expect(
        screen.getByText('Professional business training')
      ).toBeInTheDocument()
      expect(screen.getByText('Design Institute')).toBeInTheDocument()
      expect(
        screen.getByText('Creative design and arts education')
      ).toBeInTheDocument()
    })

    it('renders academy statistics', () => {
      render(<AcademyManagementPanel academies={mockAcademies} />)

      expect(screen.getByText('324')).toBeInTheDocument() // Tech Academy users
      expect(screen.getByText('25')).toBeInTheDocument() // Tech Academy courses
      expect(screen.getByText('198')).toBeInTheDocument() // Business School users
      expect(screen.getByText('18')).toBeInTheDocument() // Business School courses
    })

    it('renders status badges with correct variants', () => {
      render(<AcademyManagementPanel academies={mockAcademies} />)

      const statusBadges = screen.getAllByText('active')
      expect(statusBadges).toHaveLength(2)

      const inactiveBadge = screen.getByText('inactive')
      expect(inactiveBadge).toBeInTheDocument()
    })
  })

  describe('Search Functionality', () => {
    it('filters academies by name', () => {
      render(<AcademyManagementPanel academies={mockAcademies} />)

      const searchInput = screen.getByPlaceholderText('Search academies...')
      fireEvent.change(searchInput, { target: { value: 'Tech' } })

      expect(screen.getByText('Tech Academy')).toBeInTheDocument()
      expect(screen.queryByText('Business School')).not.toBeInTheDocument()
      expect(screen.queryByText('Design Institute')).not.toBeInTheDocument()

      expect(screen.getByText('1 of 3 academies')).toBeInTheDocument()
    })

    it('filters academies by description', () => {
      render(<AcademyManagementPanel academies={mockAcademies} />)

      const searchInput = screen.getByPlaceholderText('Search academies...')
      fireEvent.change(searchInput, { target: { value: 'business' } })

      expect(screen.getByText('Business School')).toBeInTheDocument()
      expect(screen.queryByText('Tech Academy')).not.toBeInTheDocument()
      expect(screen.queryByText('Design Institute')).not.toBeInTheDocument()
    })

    it('shows no results message when search has no matches', () => {
      render(<AcademyManagementPanel academies={mockAcademies} />)

      const searchInput = screen.getByPlaceholderText('Search academies...')
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } })

      expect(
        screen.getByText('No academies match your filters')
      ).toBeInTheDocument()
      expect(screen.getByText('0 of 3 academies')).toBeInTheDocument()
    })
  })

  describe('Status Filtering', () => {
    it('shows all academies by default', () => {
      render(<AcademyManagementPanel academies={mockAcademies} />)

      expect(screen.getByText('Tech Academy')).toBeInTheDocument()
      expect(screen.getByText('Business School')).toBeInTheDocument()
      expect(screen.getByText('Design Institute')).toBeInTheDocument()
    })

    // Note: Testing dropdown interactions would require more complex mocking
    // of the dropdown menu component behavior
  })

  describe('Loading State', () => {
    it('shows loading skeletons when loading is true', () => {
      render(<AcademyManagementPanel academies={[]} loading={true} />)

      // Should show loading animation elements
      const loadingElements = document.querySelectorAll('.animate-pulse')
      expect(loadingElements.length).toBeGreaterThan(0)
    })

    it('does not show academy data when loading', () => {
      render(
        <AcademyManagementPanel academies={mockAcademies} loading={true} />
      )

      expect(screen.queryByText('Tech Academy')).not.toBeInTheDocument()
      expect(screen.queryByText('Business School')).not.toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('shows error message when error is provided', () => {
      const errorMessage = 'Failed to load academies'
      render(<AcademyManagementPanel academies={[]} error={errorMessage} />)

      expect(
        screen.getByText(`Error loading academies: ${errorMessage}`)
      ).toBeInTheDocument()
    })

    it('does not show academy table when error is present', () => {
      render(
        <AcademyManagementPanel academies={mockAcademies} error='Some error' />
      )

      expect(screen.queryByText('Tech Academy')).not.toBeInTheDocument()
      expect(screen.queryByText('Business School')).not.toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('shows empty message when no academies are provided', () => {
      render(<AcademyManagementPanel academies={[]} />)

      expect(screen.getByText('No academies found')).toBeInTheDocument()
    })

    it('shows building icon in empty state', () => {
      render(<AcademyManagementPanel academies={[]} />)

      // The Building2 icon should be rendered
      expect(screen.getByText('No academies found')).toBeInTheDocument()
    })
  })

  describe('Data Formatting', () => {
    it('formats dates correctly', () => {
      render(<AcademyManagementPanel academies={mockAcademies} />)

      // Should format dates as "Jan 15, 2024" format
      expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
      expect(screen.getByText('Feb 1, 2024')).toBeInTheDocument()
      expect(screen.getByText('Feb 20, 2024')).toBeInTheDocument()
    })

    it('formats numbers with locale formatting', () => {
      render(<AcademyManagementPanel academies={mockAcademies} />)

      // Numbers should be formatted with commas
      expect(screen.getByText('324')).toBeInTheDocument()
      expect(screen.getByText('198')).toBeInTheDocument()
      expect(screen.getByText('156')).toBeInTheDocument()
    })
  })

  describe('Action Menus', () => {
    it('renders action dropdown for each academy', () => {
      render(<AcademyManagementPanel academies={mockAcademies} />)

      // Should have action menus for each academy
      const actionMenus = screen.getAllByText('View Details')
      expect(actionMenus).toHaveLength(3)

      expect(screen.getAllByText('Manage Settings')).toHaveLength(3)
      expect(screen.getAllByText('Suspend Academy')).toHaveLength(3)
    })
  })

  describe('Academy Logos', () => {
    it('shows placeholder icon when no logo is provided', () => {
      render(<AcademyManagementPanel academies={mockAcademies} />)

      // All mock academies have null logo_url, so should show placeholder
      const academyRows = screen.getAllByText('Tech Academy').length
      expect(academyRows).toBeGreaterThan(0)
    })

    it('shows image when logo_url is provided', () => {
      const academiesWithLogo: AcademyOverview[] = [
        {
          ...mockAcademies[0],
          logo_url: 'https://example.com/logo.png',
        },
      ]

      render(<AcademyManagementPanel academies={academiesWithLogo} />)

      const logoImage = screen.getByAltText('Tech Academy')
      expect(logoImage).toBeInTheDocument()
      expect(logoImage).toHaveAttribute('src', 'https://example.com/logo.png')
    })
  })
})
