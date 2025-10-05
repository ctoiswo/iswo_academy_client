import { Users, DollarSign, BookOpen, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  StatsWidget, 
  DashboardCard, 
  MetricCard, 
  ListCard, 
  ChartWidget,
  TrendChart,
  ComparisonChart,
  DistributionChart
} from '@/components/dashboard'

// Example data for charts
const salesData = [
  { name: 'Jan', value: 4000, sales: 2400 },
  { name: 'Feb', value: 3000, sales: 1398 },
  { name: 'Mar', value: 2000, sales: 9800 },
  { name: 'Apr', value: 2780, sales: 3908 },
  { name: 'May', value: 1890, sales: 4800 },
  { name: 'Jun', value: 2390, sales: 3800 }
]

const trendData = [
  { date: '2024-01-01', value: 100 },
  { date: '2024-01-02', value: 120 },
  { date: '2024-01-03', value: 110 },
  { date: '2024-01-04', value: 140 },
  { date: '2024-01-05', value: 160 }
]

const comparisonData = [
  { category: 'Q1', current: 100, previous: 80 },
  { category: 'Q2', current: 120, previous: 90 },
  { category: 'Q3', current: 110, previous: 95 },
  { category: 'Q4', current: 140, previous: 100 }
]

const distributionData = [
  { name: 'Desktop', value: 60, color: '#8884d8' },
  { name: 'Mobile', value: 30, color: '#82ca9d' },
  { name: 'Tablet', value: 10, color: '#ffc658' }
]

const listItems = [
  {
    id: 1,
    title: 'Introduction to React',
    subtitle: 'Beginner course',
    value: '150 students',
    action: <Button size="sm" variant="outline">View</Button>
  },
  {
    id: 2,
    title: 'Advanced JavaScript',
    subtitle: 'Intermediate course',
    value: '89 students',
    action: <Button size="sm" variant="outline">View</Button>
  },
  {
    id: 3,
    title: 'Node.js Fundamentals',
    subtitle: 'Beginner course',
    value: '203 students',
    action: <Button size="sm" variant="outline">View</Button>
  }
]

export function DashboardWidgetsExample() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Widgets Examples</h1>
      
      {/* Stats Widgets Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Stats Widgets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsWidget
            title="Total Users"
            value={1234}
            change={12}
            changeType="increase"
            icon={Users}
            description="Active registered users"
          />
          
          <StatsWidget
            title="Revenue"
            value={45678.90}
            format="currency"
            change={-5}
            changeType="decrease"
            icon={DollarSign}
          />
          
          <StatsWidget
            title="Courses"
            value={89}
            change={8}
            changeType="increase"
            icon={BookOpen}
          />
          
          <StatsWidget
            title="Growth Rate"
            value={23.5}
            format="percentage"
            changeType="neutral"
            icon={TrendingUp}
          />
        </div>
      </section>

      {/* Dashboard Cards Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Dashboard Cards</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardCard
            title="Recent Activity"
            description="Latest user interactions"
            action={<Button variant="outline">View All</Button>}
            footer={<Button className="w-full">Load More</Button>}
          >
            <div className="space-y-2">
              <p>User John Doe completed "React Basics"</p>
              <p>New enrollment in "JavaScript Advanced"</p>
              <p>Course "Node.js" was published</p>
            </div>
          </DashboardCard>

          <MetricCard
            metric="$12,345"
            label="Monthly Revenue"
            change={15}
            changeType="positive"
            icon={DollarSign}
            title="Revenue Overview"
          />
        </div>
      </section>

      {/* List Card Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">List Cards</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ListCard
            title="Popular Courses"
            description="Most enrolled courses this month"
            items={listItems}
          />
          
          <ListCard
            title="Empty State Example"
            items={[]}
            emptyMessage="No courses available at the moment"
          />
        </div>
      </section>

      {/* Chart Widgets Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Chart Widgets</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartWidget
            title="Sales Overview"
            description="Monthly sales and revenue data"
            data={salesData}
            type="line"
            dataKeys={['value', 'sales']}
            height={300}
          />
          
          <ChartWidget
            title="Revenue Distribution"
            data={salesData}
            type="bar"
            dataKeys={['value']}
            height={300}
          />
        </div>
      </section>

      {/* Specialized Charts Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Specialized Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TrendChart
            title="User Growth Trend"
            data={trendData}
            trend="up"
            height={250}
          />
          
          <ComparisonChart
            title="Quarterly Comparison"
            data={comparisonData}
            height={250}
          />
          
          <DistributionChart
            title="Device Usage"
            data={distributionData}
            height={250}
          />
        </div>
      </section>

      {/* Loading States Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Loading States</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsWidget
            title="Loading Widget"
            value={0}
            loading={true}
            icon={Users}
          />
          
          <DashboardCard
            title="Loading Card"
            loading={true}
            action={<Button>Action</Button>}
          >
            <div>Content</div>
          </DashboardCard>
          
          <ChartWidget
            title="Loading Chart"
            data={[]}
            type="line"
            loading={true}
            height={200}
          />
          
          <MetricCard
            metric="Loading..."
            label="Loading Metric"
            loading={true}
          />
        </div>
      </section>

      {/* Variants Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Card Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DashboardCard
            title="Default Card"
            variant="default"
          >
            <p>This is a default card variant</p>
          </DashboardCard>
          
          <DashboardCard
            title="Outline Card"
            variant="outline"
          >
            <p>This is an outline card variant</p>
          </DashboardCard>
          
          <DashboardCard
            title="Ghost Card"
            variant="ghost"
          >
            <p>This is a ghost card variant</p>
          </DashboardCard>
        </div>
      </section>
    </div>
  )
}