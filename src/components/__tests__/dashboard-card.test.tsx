import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'
import { Users, Settings } from 'lucide-react'
import { 
  DashboardCard, 
  MetricCard, 
  ListCard 
} from '../dashboard/dashboard-card'

describe('DashboardCard', () => {
  describe('Basic Rendering', () => {
    it('renders children content', () => {
      render(
        <DashboardCard>
          <div>Test content</div>
        </DashboardCard>
      )

      expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('renders title and description when provided', () => {
      render(
        <DashboardCard
          title="Test Title"
          description="Test description"
        >
          <div>Content</div>
        </DashboardCard>
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test description')).toBeInTheDocument()
    })

    it('renders action element when provided', () => {
      render(
        <DashboardCard
          title="Test Title"
          action={<Button>Action</Button>}
        >
          <div>Content</div>
        </DashboardCard>
      )

      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    it('renders footer when provided', () => {
      render(
        <DashboardCard
          footer={<div>Footer content</div>}
        >
          <div>Content</div>
        </DashboardCard>
      )

      expect(screen.getByText('Footer content')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(
        <DashboardCard className="custom-class">
          <div>Content</div>
        </DashboardCard>
      )

      const card = screen.getByText('Content').closest('[data-slot="card"]')
      expect(card).toHaveClass('custom-class')
    })

    it('applies custom contentClassName', () => {
      render(
        <DashboardCard contentClassName="custom-content-class">
          <div>Content</div>
        </DashboardCard>
      )

      const content = screen.getByText('Content').closest('[data-slot="card-content"]')
      expect(content).toHaveClass('custom-content-class')
    })
  })

  describe('Variants', () => {
    it('applies outline variant styles', () => {
      render(
        <DashboardCard variant="outline">
          <div>Content</div>
        </DashboardCard>
      )

      const card = screen.getByText('Content').closest('[data-slot="card"]')
      expect(card).toHaveClass('border-2', 'border-dashed')
    })

    it('applies ghost variant styles', () => {
      render(
        <DashboardCard variant="ghost">
          <div>Content</div>
        </DashboardCard>
      )

      const card = screen.getByText('Content').closest('[data-slot="card"]')
      expect(card).toHaveClass('border-0', 'shadow-none', 'bg-transparent')
    })

    it('applies default variant styles', () => {
      render(
        <DashboardCard variant="default">
          <div>Content</div>
        </DashboardCard>
      )

      const card = screen.getByText('Content').closest('[data-slot="card"]')
      expect(card).not.toHaveClass('border-2', 'border-dashed', 'border-0', 'shadow-none', 'bg-transparent')
    })
  })

  describe('Sizes', () => {
    it('applies small size styles', () => {
      render(
        <DashboardCard size="sm">
          <div>Content</div>
        </DashboardCard>
      )

      const card = screen.getByText('Content').closest('[data-slot="card"]')
      expect(card).toHaveClass('p-4')
    })

    it('applies large size styles', () => {
      render(
        <DashboardCard size="lg">
          <div>Content</div>
        </DashboardCard>
      )

      const card = screen.getByText('Content').closest('[data-slot="card"]')
      expect(card).toHaveClass('p-8')
    })

    it('applies medium size styles by default', () => {
      render(
        <DashboardCard>
          <div>Content</div>
        </DashboardCard>
      )

      const card = screen.getByText('Content').closest('[data-slot="card"]')
      expect(card).toHaveClass('p-6')
    })
  })

  describe('Loading State', () => {
    it('renders skeleton when loading', () => {
      render(
        <DashboardCard
          loading={true}
          title="Test Title"
          description="Test description"
          action={<Button>Action</Button>}
          footer={<div>Footer</div>}
        >
          <div>Content</div>
        </DashboardCard>
      )

      // Should show skeletons instead of actual content
      const skeletons = screen.getAllByRole('generic').filter(el => 
        el.getAttribute('data-slot') === 'skeleton'
      )
      expect(skeletons.length).toBeGreaterThan(0)

      // Should not show actual content
      expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
      expect(screen.queryByText('Content')).not.toBeInTheDocument()
    })

    it('renders skeleton for footer when loading and footer is provided', () => {
      render(
        <DashboardCard
          loading={true}
          footer={<div>Footer</div>}
        >
          <div>Content</div>
        </DashboardCard>
      )

      const skeletons = screen.getAllByRole('generic').filter(el => 
        el.getAttribute('data-slot') === 'skeleton'
      )
      expect(skeletons.length).toBeGreaterThanOrEqual(4) // Content skeletons + footer skeleton
    })
  })
})

describe('MetricCard', () => {
  describe('Basic Rendering', () => {
    it('renders metric and label correctly', () => {
      render(
        <MetricCard
          metric={1234}
          label="Total Users"
        />
      )

      expect(screen.getByText('1234')).toBeInTheDocument()
      expect(screen.getByText('Total Users')).toBeInTheDocument()
    })

    it('renders with icon', () => {
      render(
        <MetricCard
          metric={100}
          label="Active Users"
          icon={Users}
        />
      )

      // Look for the SVG element directly
      const icon = document.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('shows change with correct styling', () => {
      render(
        <MetricCard
          metric={100}
          label="Users"
          change={15}
          changeType="positive"
        />
      )

      const changeText = screen.getByText('+15% from last period')
      expect(changeText).toBeInTheDocument()
      expect(changeText).toHaveClass('text-green-600')
    })

    it('shows negative change with correct styling', () => {
      render(
        <MetricCard
          metric={100}
          label="Users"
          change={-10}
          changeType="negative"
        />
      )

      const changeText = screen.getByText('-10% from last period')
      expect(changeText).toHaveClass('text-red-600')
    })

    it('shows neutral change with correct styling', () => {
      render(
        <MetricCard
          metric={100}
          label="Users"
          change={0}
          changeType="neutral"
        />
      )

      const changeText = screen.getByText('0% from last period')
      expect(changeText).toHaveClass('text-gray-500')
    })
  })

  describe('Inherited Props', () => {
    it('passes through DashboardCard props', () => {
      render(
        <MetricCard
          metric={100}
          label="Users"
          title="User Statistics"
          className="custom-class"
          variant="outline"
        />
      )

      expect(screen.getByText('User Statistics')).toBeInTheDocument()
      
      const card = screen.getByText('Users').closest('[data-slot="card"]')
      expect(card).toHaveClass('custom-class', 'border-2', 'border-dashed')
    })
  })
})

describe('ListCard', () => {
  const mockItems = [
    {
      id: 1,
      title: 'Item 1',
      subtitle: 'Subtitle 1',
      value: '100',
      action: <Button size="sm">Edit</Button>
    },
    {
      id: 2,
      title: 'Item 2',
      subtitle: 'Subtitle 2',
      value: 200
    },
    {
      id: 3,
      title: 'Item 3'
    }
  ]

  describe('Basic Rendering', () => {
    it('renders list items correctly', () => {
      render(
        <ListCard items={mockItems} />
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Subtitle 1')).toBeInTheDocument()
      expect(screen.getByText('100')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()

      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('200')).toBeInTheDocument()

      expect(screen.getByText('Item 3')).toBeInTheDocument()
    })

    it('renders empty state when no items', () => {
      render(
        <ListCard items={[]} />
      )

      expect(screen.getByText('No items to display')).toBeInTheDocument()
    })

    it('renders custom empty message', () => {
      render(
        <ListCard 
          items={[]} 
          emptyMessage="No courses available"
        />
      )

      expect(screen.getByText('No courses available')).toBeInTheDocument()
    })

    it('handles items without optional properties', () => {
      const simpleItems = [
        { id: 1, title: 'Simple Item' }
      ]

      render(
        <ListCard items={simpleItems} />
      )

      expect(screen.getByText('Simple Item')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('allows interaction with action buttons', async () => {
      const mockAction = vi.fn()
      const itemsWithAction = [
        {
          id: 1,
          title: 'Item 1',
          action: <Button onClick={mockAction}>Click me</Button>
        }
      ]

      const user = userEvent.setup()
      render(
        <ListCard items={itemsWithAction} />
      )

      const button = screen.getByRole('button', { name: 'Click me' })
      await user.click(button)

      expect(mockAction).toHaveBeenCalledTimes(1)
    })
  })

  describe('Inherited Props', () => {
    it('passes through DashboardCard props', () => {
      render(
        <ListCard
          items={mockItems}
          title="My List"
          description="List of items"
          className="custom-list-class"
        />
      )

      expect(screen.getByText('My List')).toBeInTheDocument()
      expect(screen.getByText('List of items')).toBeInTheDocument()
      
      const card = screen.getByText('Item 1').closest('[data-slot="card"]')
      expect(card).toHaveClass('custom-list-class')
    })
  })

  describe('Edge Cases', () => {
    it('handles mixed value types', () => {
      const mixedItems = [
        { id: 1, title: 'String Value', value: 'Active' },
        { id: 2, title: 'Number Value', value: 42 },
        { id: 3, title: 'No Value' }
      ]

      render(
        <ListCard items={mixedItems} />
      )

      expect(screen.getByText('Active')).toBeInTheDocument()
      expect(screen.getByText('42')).toBeInTheDocument()
      expect(screen.getByText('No Value')).toBeInTheDocument()
    })

    it('handles long titles and subtitles', () => {
      const longItems = [
        {
          id: 1,
          title: 'This is a very long title that might wrap to multiple lines',
          subtitle: 'This is also a very long subtitle that provides additional context'
        }
      ]

      render(
        <ListCard items={longItems} />
      )

      expect(screen.getByText('This is a very long title that might wrap to multiple lines')).toBeInTheDocument()
      expect(screen.getByText('This is also a very long subtitle that provides additional context')).toBeInTheDocument()
    })
  })
})