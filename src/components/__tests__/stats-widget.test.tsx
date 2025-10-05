import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Users, DollarSign } from 'lucide-react'
import { StatsWidget } from '../dashboard/stats-widget'

describe('StatsWidget', () => {
  describe('Basic Rendering', () => {
    it('renders title and value correctly', () => {
      render(
        <StatsWidget
          title="Total Users"
          value={1234}
        />
      )

      expect(screen.getByText('Total Users')).toBeInTheDocument()
      expect(screen.getByText('1,234')).toBeInTheDocument()
    })

    it('renders string values correctly', () => {
      render(
        <StatsWidget
          title="Status"
          value="Active"
        />
      )

      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    it('renders with custom icon', () => {
      render(
        <StatsWidget
          title="Total Users"
          value={100}
          icon={Users}
        />
      )

      // Look for the SVG element directly
      const icon = document.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(
        <StatsWidget
          title="Test"
          value={100}
          className="custom-class"
        />
      )

      const card = screen.getByText('Test').closest('[data-slot="card"]')
      expect(card).toHaveClass('custom-class')
    })
  })

  describe('Value Formatting', () => {
    it('formats numbers with default number format', () => {
      render(
        <StatsWidget
          title="Count"
          value={1234567}
          format="number"
        />
      )

      expect(screen.getByText('1,234,567')).toBeInTheDocument()
    })

    it('formats currency values', () => {
      render(
        <StatsWidget
          title="Revenue"
          value={1234.56}
          format="currency"
        />
      )

      expect(screen.getByText('$1,234.56')).toBeInTheDocument()
    })

    it('formats percentage values', () => {
      render(
        <StatsWidget
          title="Growth"
          value={25.5}
          format="percentage"
        />
      )

      expect(screen.getByText('25.5%')).toBeInTheDocument()
    })
  })

  describe('Change Indicators', () => {
    it('shows positive change with increase trend', () => {
      render(
        <StatsWidget
          title="Users"
          value={100}
          change={15}
          changeType="increase"
        />
      )

      expect(screen.getByText('+15%')).toBeInTheDocument()
      expect(screen.getByText('from last period')).toBeInTheDocument()
      
      const changeText = screen.getByText('+15%')
      expect(changeText).toHaveClass('text-green-600')
    })

    it('shows negative change with decrease trend', () => {
      render(
        <StatsWidget
          title="Users"
          value={100}
          change={-10}
          changeType="decrease"
        />
      )

      expect(screen.getByText('-10%')).toBeInTheDocument()
      
      const changeText = screen.getByText('-10%')
      expect(changeText).toHaveClass('text-red-600')
    })

    it('shows neutral change', () => {
      render(
        <StatsWidget
          title="Users"
          value={100}
          change={0}
          changeType="neutral"
        />
      )

      expect(screen.getByText('0%')).toBeInTheDocument()
      
      const changeText = screen.getByText('0%')
      expect(changeText).toHaveClass('text-gray-500')
    })

    it('does not show change indicator when change is undefined', () => {
      render(
        <StatsWidget
          title="Users"
          value={100}
        />
      )

      expect(screen.queryByText('from last period')).not.toBeInTheDocument()
    })
  })

  describe('Description', () => {
    it('renders description when provided', () => {
      render(
        <StatsWidget
          title="Users"
          value={100}
          description="Total registered users"
        />
      )

      expect(screen.getByText('Total registered users')).toBeInTheDocument()
    })

    it('does not render description when not provided', () => {
      render(
        <StatsWidget
          title="Users"
          value={100}
        />
      )

      // Should not have any description text
      const card = screen.getByText('Users').closest('[data-slot="card"]')
      const description = card?.querySelector('p.text-xs.text-muted-foreground')
      expect(description).not.toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('renders skeleton when loading', () => {
      render(
        <StatsWidget
          title="Users"
          value={100}
          loading={true}
          icon={Users}
          change={15}
          description="Test description"
        />
      )

      // Should show skeletons instead of actual content
      const skeletons = screen.getAllByRole('generic').filter(el => 
        el.getAttribute('data-slot') === 'skeleton'
      )
      expect(skeletons.length).toBeGreaterThan(0)

      // Should not show actual content
      expect(screen.queryByText('Users')).not.toBeInTheDocument()
      expect(screen.queryByText('100')).not.toBeInTheDocument()
    })

    it('renders skeleton for change when loading and change is provided', () => {
      render(
        <StatsWidget
          title="Users"
          value={100}
          loading={true}
          change={15}
        />
      )

      const skeletons = screen.getAllByRole('generic').filter(el => 
        el.getAttribute('data-slot') === 'skeleton'
      )
      // Should have skeletons for title, value, trend icon, and change text
      expect(skeletons.length).toBeGreaterThanOrEqual(3)
    })

    it('renders skeleton for description when loading and description is provided', () => {
      render(
        <StatsWidget
          title="Users"
          value={100}
          loading={true}
          description="Test description"
        />
      )

      const skeletons = screen.getAllByRole('generic').filter(el => 
        el.getAttribute('data-slot') === 'skeleton'
      )
      // Should include skeleton for description
      expect(skeletons.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(
        <StatsWidget
          title="Total Revenue"
          value={50000}
          format="currency"
          change={12}
          changeType="increase"
          description="Monthly recurring revenue"
          icon={DollarSign}
        />
      )

      // Check that the card structure is accessible
      const card = screen.getByText('Total Revenue').closest('[data-slot="card"]')
      expect(card).toBeInTheDocument()

      // Check that content is properly structured
      expect(screen.getByText('Total Revenue')).toBeInTheDocument()
      expect(screen.getByText('$50,000.00')).toBeInTheDocument()
      expect(screen.getByText('Monthly recurring revenue')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles zero values correctly', () => {
      render(
        <StatsWidget
          title="New Users"
          value={0}
        />
      )

      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('handles negative values correctly', () => {
      render(
        <StatsWidget
          title="Balance"
          value={-500}
          format="currency"
        />
      )

      expect(screen.getByText('-$500.00')).toBeInTheDocument()
    })

    it('handles very large numbers correctly', () => {
      render(
        <StatsWidget
          title="Big Number"
          value={1234567890}
        />
      )

      expect(screen.getByText('1,234,567,890')).toBeInTheDocument()
    })

    it('handles decimal numbers correctly', () => {
      render(
        <StatsWidget
          title="Average"
          value={123.456}
        />
      )

      expect(screen.getByText('123.456')).toBeInTheDocument()
    })
  })
})