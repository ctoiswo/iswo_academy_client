import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { 
  ChartWidget, 
  TrendChart, 
  ComparisonChart, 
  DistributionChart 
} from '../dashboard/chart-widget'

// Mock recharts components since they don't render properly in test environment
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => <div data-testid="area" />,
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: () => <div data-testid="bar" />,
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />
}))

const mockData = [
  { name: 'Jan', value: 100, sales: 200 },
  { name: 'Feb', value: 150, sales: 250 },
  { name: 'Mar', value: 120, sales: 180 },
  { name: 'Apr', value: 200, sales: 300 }
]

describe('ChartWidget', () => {
  describe('Basic Rendering', () => {
    it('renders title and description when provided', () => {
      render(
        <ChartWidget
          title="Sales Chart"
          description="Monthly sales data"
          data={mockData}
          type="line"
        />
      )

      expect(screen.getByText('Sales Chart')).toBeInTheDocument()
      expect(screen.getByText('Monthly sales data')).toBeInTheDocument()
    })

    it('renders without title and description', () => {
      render(
        <ChartWidget
          data={mockData}
          type="line"
        />
      )

      // Should not have header section
      expect(screen.queryByRole('generic', { name: /card-header/ })).not.toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(
        <ChartWidget
          data={mockData}
          type="line"
          className="custom-chart-class"
        />
      )

      const card = screen.getByTestId('responsive-container').closest('[data-slot="card"]')
      expect(card).toHaveClass('custom-chart-class')
    })
  })

  describe('Chart Types', () => {
    it('renders line chart', () => {
      render(
        <ChartWidget
          data={mockData}
          type="line"
        />
      )

      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
      expect(screen.getByTestId('line')).toBeInTheDocument()
    })

    it('renders area chart', () => {
      render(
        <ChartWidget
          data={mockData}
          type="area"
        />
      )

      expect(screen.getByTestId('area-chart')).toBeInTheDocument()
      expect(screen.getByTestId('area')).toBeInTheDocument()
    })

    it('renders bar chart', () => {
      render(
        <ChartWidget
          data={mockData}
          type="bar"
        />
      )

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
      expect(screen.getByTestId('bar')).toBeInTheDocument()
    })

    it('renders pie chart', () => {
      render(
        <ChartWidget
          data={mockData}
          type="pie"
        />
      )

      expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
      expect(screen.getByTestId('pie')).toBeInTheDocument()
    })
  })

  describe('Chart Configuration', () => {
    it('renders with multiple data keys', () => {
      render(
        <ChartWidget
          data={mockData}
          type="line"
          dataKeys={['value', 'sales']}
        />
      )

      const lines = screen.getAllByTestId('line')
      expect(lines).toHaveLength(2)
    })

    it('shows grid when showGrid is true', () => {
      render(
        <ChartWidget
          data={mockData}
          type="line"
          showGrid={true}
        />
      )

      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument()
    })

    it('hides grid when showGrid is false', () => {
      render(
        <ChartWidget
          data={mockData}
          type="line"
          showGrid={false}
        />
      )

      expect(screen.queryByTestId('cartesian-grid')).not.toBeInTheDocument()
    })

    it('shows legend when showLegend is true', () => {
      render(
        <ChartWidget
          data={mockData}
          type="line"
          showLegend={true}
        />
      )

      expect(screen.getByTestId('legend')).toBeInTheDocument()
    })

    it('hides legend when showLegend is false', () => {
      render(
        <ChartWidget
          data={mockData}
          type="line"
          showLegend={false}
        />
      )

      expect(screen.queryByTestId('legend')).not.toBeInTheDocument()
    })

    it('shows tooltip when showTooltip is true', () => {
      render(
        <ChartWidget
          data={mockData}
          type="line"
          showTooltip={true}
        />
      )

      expect(screen.getByTestId('tooltip')).toBeInTheDocument()
    })

    it('hides tooltip when showTooltip is false', () => {
      render(
        <ChartWidget
          data={mockData}
          type="line"
          showTooltip={false}
        />
      )

      expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('renders skeleton when loading', () => {
      render(
        <ChartWidget
          title="Loading Chart"
          description="Chart description"
          data={mockData}
          type="line"
          loading={true}
          height={400}
        />
      )

      // Should show skeletons instead of actual content
      const skeletons = screen.getAllByRole('generic').filter(el => 
        el.getAttribute('data-slot') === 'skeleton'
      )
      expect(skeletons.length).toBeGreaterThan(0)

      // Should not show actual chart
      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument()
      expect(screen.queryByText('Loading Chart')).not.toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('renders empty message when no data', () => {
      render(
        <ChartWidget
          title="Empty Chart"
          data={[]}
          type="line"
          emptyMessage="No chart data available"
        />
      )

      expect(screen.getByText('No chart data available')).toBeInTheDocument()
      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument()
    })

    it('renders default empty message when no data and no custom message', () => {
      render(
        <ChartWidget
          data={[]}
          type="line"
        />
      )

      expect(screen.getByText('No data available')).toBeInTheDocument()
    })

    it('renders empty message when data is null', () => {
      render(
        <ChartWidget
          data={null as any}
          type="line"
        />
      )

      expect(screen.getByText('No data available')).toBeInTheDocument()
    })
  })

  describe('Custom Height', () => {
    it('applies custom height', () => {
      render(
        <ChartWidget
          data={mockData}
          type="line"
          height={500}
        />
      )

      const container = screen.getByTestId('responsive-container')
      // Note: In a real test environment, you might check the style attribute
      expect(container).toBeInTheDocument()
    })
  })
})

describe('TrendChart', () => {
  const trendData = [
    { date: '2024-01-01', value: 100 },
    { date: '2024-01-02', value: 120 },
    { date: '2024-01-03', value: 110 }
  ]

  it('renders trend chart with up trend', () => {
    render(
      <TrendChart
        title="Upward Trend"
        data={trendData}
        trend="up"
      />
    )

    expect(screen.getByText('Upward Trend')).toBeInTheDocument()
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
  })

  it('renders trend chart with down trend', () => {
    render(
      <TrendChart
        title="Downward Trend"
        data={trendData}
        trend="down"
      />
    )

    expect(screen.getByText('Downward Trend')).toBeInTheDocument()
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
  })

  it('renders trend chart with stable trend', () => {
    render(
      <TrendChart
        title="Stable Trend"
        data={trendData}
        trend="stable"
      />
    )

    expect(screen.getByText('Stable Trend')).toBeInTheDocument()
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
  })

  it('passes through other props', () => {
    render(
      <TrendChart
        title="Custom Trend"
        data={trendData}
        className="custom-trend-class"
        height={400}
      />
    )

    const card = screen.getByTestId('responsive-container').closest('[data-slot="card"]')
    expect(card).toHaveClass('custom-trend-class')
  })
})

describe('ComparisonChart', () => {
  const comparisonData = [
    { category: 'Q1', current: 100, previous: 80 },
    { category: 'Q2', current: 120, previous: 90 },
    { category: 'Q3', current: 110, previous: 95 }
  ]

  it('renders comparison chart', () => {
    render(
      <ComparisonChart
        title="Current vs Previous"
        data={comparisonData}
      />
    )

    expect(screen.getByText('Current vs Previous')).toBeInTheDocument()
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
    
    // Should have two bars for current and previous
    const bars = screen.getAllByTestId('bar')
    expect(bars).toHaveLength(2)
  })

  it('passes through other props', () => {
    render(
      <ComparisonChart
        title="Comparison"
        data={comparisonData}
        description="Quarterly comparison"
        className="comparison-class"
      />
    )

    expect(screen.getByText('Quarterly comparison')).toBeInTheDocument()
    
    const card = screen.getByTestId('responsive-container').closest('[data-slot="card"]')
    expect(card).toHaveClass('comparison-class')
  })
})

describe('DistributionChart', () => {
  const distributionData = [
    { name: 'Desktop', value: 60, color: '#8884d8' },
    { name: 'Mobile', value: 30, color: '#82ca9d' },
    { name: 'Tablet', value: 10, color: '#ffc658' }
  ]

  it('renders distribution chart', () => {
    render(
      <DistributionChart
        title="Device Distribution"
        data={distributionData}
      />
    )

    expect(screen.getByText('Device Distribution')).toBeInTheDocument()
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
    expect(screen.getByTestId('pie')).toBeInTheDocument()
  })

  it('handles data without custom colors', () => {
    const dataWithoutColors = [
      { name: 'A', value: 50 },
      { name: 'B', value: 30 },
      { name: 'C', value: 20 }
    ]

    render(
      <DistributionChart
        title="Simple Distribution"
        data={dataWithoutColors}
      />
    )

    expect(screen.getByText('Simple Distribution')).toBeInTheDocument()
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
  })

  it('passes through other props', () => {
    render(
      <DistributionChart
        title="Distribution"
        data={distributionData}
        description="Usage by device type"
        className="distribution-class"
      />
    )

    expect(screen.getByText('Usage by device type')).toBeInTheDocument()
    
    const card = screen.getByTestId('responsive-container').closest('[data-slot="card"]')
    expect(card).toHaveClass('distribution-class')
  })
})