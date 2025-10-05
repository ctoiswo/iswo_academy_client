import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AcademyCard, type AcademyMembership } from '../academy-card'

// Mock academy data for testing
const mockAcademy: AcademyMembership = {
  id: 1,
  name: 'Technology Academy',
  description: 'Learn cutting-edge technology skills and advance your career in tech',
  logo_url: 'https://example.com/logo.png',
  user_role: 'admin',
  user_role_display: 'Administrator',
  created_at: '2024-01-01T00:00:00Z',
  last_accessed: '2024-02-01T10:30:00Z'
}

const mockAcademyWithoutLogo: AcademyMembership = {
  ...mockAcademy,
  id: 2,
  name: 'Art Academy',
  logo_url: null,
  user_role: 'student',
  user_role_display: 'Student'
}

const mockAcademyNeverAccessed: AcademyMembership = {
  ...mockAcademy,
  id: 3,
  name: 'Music Academy',
  last_accessed: null
}

const mockAcademyNoDescription: AcademyMembership = {
  ...mockAcademy,
  id: 4,
  name: 'Business Academy',
  description: ''
}

describe('AcademyCard', () => {
  const mockOnSelect = vi.fn()

  beforeEach(() => {
    mockOnSelect.mockClear()
  })

  describe('Rendering', () => {
    it('renders academy information correctly', () => {
      render(<AcademyCard academy={mockAcademy} onSelect={mockOnSelect} />)

      expect(screen.getByText('Technology Academy')).toBeInTheDocument()
      expect(screen.getByText('Learn cutting-edge technology skills and advance your career in tech')).toBeInTheDocument()
      expect(screen.getByTestId('role-badge')).toHaveTextContent('Administrator')
      expect(screen.getByText('Last accessed:')).toBeInTheDocument()
    })

    it('renders academy logo when logo_url is provided', () => {
      render(<AcademyCard academy={mockAcademy} onSelect={mockOnSelect} />)

      const logo = screen.getByAltText('Technology Academy logo')
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute('src', 'https://example.com/logo.png')
    })

    it('renders default icon when logo_url is null', () => {
      render(<AcademyCard academy={mockAcademyWithoutLogo} onSelect={mockOnSelect} />)

      expect(screen.queryByAltText('Art Academy logo')).not.toBeInTheDocument()
      // Default icon should be visible
      const defaultIcon = screen.getByRole('button').querySelector('svg')
      expect(defaultIcon).toBeInTheDocument()
    })

    it('displays correct role badge', () => {
      render(<AcademyCard academy={mockAcademyWithoutLogo} onSelect={mockOnSelect} />)

      const roleBadge = screen.getByTestId('role-badge')
      expect(roleBadge).toHaveTextContent('Student')
    })

    it('shows "Never accessed" when last_accessed is null', () => {
      render(<AcademyCard academy={mockAcademyNeverAccessed} onSelect={mockOnSelect} />)

      expect(screen.getByText('Never accessed')).toBeInTheDocument()
    })

    it('shows "No description available" when description is empty', () => {
      render(<AcademyCard academy={mockAcademyNoDescription} onSelect={mockOnSelect} />)

      expect(screen.getByText('No description available')).toBeInTheDocument()
    })

    it('applies custom className when provided', () => {
      render(<AcademyCard academy={mockAcademy} onSelect={mockOnSelect} className="custom-class" />)

      const card = screen.getByRole('button')
      expect(card).toHaveClass('custom-class')
    })
  })

  describe('Interactions', () => {
    it('calls onSelect when card is clicked', async () => {
      const user = userEvent.setup()
      render(<AcademyCard academy={mockAcademy} onSelect={mockOnSelect} />)

      const card = screen.getByRole('button')
      await user.click(card)

      expect(mockOnSelect).toHaveBeenCalledTimes(1)
      expect(mockOnSelect).toHaveBeenCalledWith(mockAcademy)
    })

    it('calls onSelect when Enter key is pressed', async () => {
      const user = userEvent.setup()
      render(<AcademyCard academy={mockAcademy} onSelect={mockOnSelect} />)

      const card = screen.getByRole('button')
      card.focus()
      await user.keyboard('{Enter}')

      expect(mockOnSelect).toHaveBeenCalledTimes(1)
      expect(mockOnSelect).toHaveBeenCalledWith(mockAcademy)
    })

    it('calls onSelect when Space key is pressed', async () => {
      const user = userEvent.setup()
      render(<AcademyCard academy={mockAcademy} onSelect={mockOnSelect} />)

      const card = screen.getByRole('button')
      card.focus()
      await user.keyboard(' ')

      expect(mockOnSelect).toHaveBeenCalledTimes(1)
      expect(mockOnSelect).toHaveBeenCalledWith(mockAcademy)
    })

    it('does not call onSelect for other keys', async () => {
      const user = userEvent.setup()
      render(<AcademyCard academy={mockAcademy} onSelect={mockOnSelect} />)

      const card = screen.getByRole('button')
      card.focus()
      await user.keyboard('{Escape}')
      await user.keyboard('{Tab}')

      expect(mockOnSelect).not.toHaveBeenCalled()
    })

    it('is focusable and has correct accessibility attributes', () => {
      render(<AcademyCard academy={mockAcademy} onSelect={mockOnSelect} />)

      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('tabIndex', '0')
      expect(card).toHaveAttribute('aria-label', 'Select Technology Academy academy where you are Administrator')
    })
  })

  describe('Image Error Handling', () => {
    it('shows default icon when image fails to load', () => {
      render(<AcademyCard academy={mockAcademy} onSelect={mockOnSelect} />)

      const logo = screen.getByAltText('Technology Academy logo')
      
      // Simulate image load error
      fireEvent.error(logo)

      // The image should be hidden and default icon should be shown
      expect(logo).toHaveStyle('display: none')
    })
  })

  describe('Date Formatting', () => {
    it('formats recent dates correctly', () => {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      const academyToday: AcademyMembership = {
        ...mockAcademy,
        last_accessed: today.toISOString()
      }

      const academyYesterday: AcademyMembership = {
        ...mockAcademy,
        last_accessed: yesterday.toISOString()
      }

      // Test today
      const { rerender } = render(<AcademyCard academy={academyToday} onSelect={mockOnSelect} />)
      expect(screen.getByText('Today')).toBeInTheDocument()

      // Test yesterday
      rerender(<AcademyCard academy={academyYesterday} onSelect={mockOnSelect} />)
      expect(screen.getByText('Yesterday')).toBeInTheDocument()
    })

    it('formats older dates as days ago', () => {
      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

      const academyOld: AcademyMembership = {
        ...mockAcademy,
        last_accessed: threeDaysAgo.toISOString()
      }

      render(<AcademyCard academy={academyOld} onSelect={mockOnSelect} />)
      expect(screen.getByText('3 days ago')).toBeInTheDocument()
    })
  })

  describe('Hover Effects', () => {
    it('has hover effect classes applied', () => {
      render(<AcademyCard academy={mockAcademy} onSelect={mockOnSelect} />)

      const card = screen.getByRole('button')
      expect(card).toHaveClass('hover:shadow-lg', 'hover:-translate-y-1', 'transition-all')
    })

    it('has focus-visible styles applied', () => {
      render(<AcademyCard academy={mockAcademy} onSelect={mockOnSelect} />)

      const card = screen.getByRole('button')
      expect(card).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-primary')
    })

    it('has active state styles applied', () => {
      render(<AcademyCard academy={mockAcademy} onSelect={mockOnSelect} />)

      const card = screen.getByRole('button')
      expect(card).toHaveClass('active:scale-[0.98]')
    })
  })

  describe('Content Truncation', () => {
    it('applies line-clamp to long descriptions', () => {
      const longDescription = 'This is a very long description that should be truncated after two lines to prevent the card from becoming too tall and maintain a consistent layout across all academy cards in the grid'
      
      const academyLongDesc: AcademyMembership = {
        ...mockAcademy,
        description: longDescription
      }

      render(<AcademyCard academy={academyLongDesc} onSelect={mockOnSelect} />)

      const description = screen.getByText(longDescription)
      expect(description).toHaveClass('line-clamp-2')
    })

    it('truncates long academy names', () => {
      const longName = 'This is a Very Long Academy Name That Should Be Truncated'
      
      const academyLongName: AcademyMembership = {
        ...mockAcademy,
        name: longName
      }

      render(<AcademyCard academy={academyLongName} onSelect={mockOnSelect} />)

      const title = screen.getByText(longName)
      expect(title).toHaveClass('truncate')
    })
  })
})