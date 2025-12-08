import { TrendingUp, Clock, Target, BookOpen } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { DashboardCard, ChartWidget } from '@/components/dashboard'
import type {
  LearningProgress as LearningProgressType,
  StudentStats,
} from '../types'

interface LearningProgressProps {
  progressData: LearningProgressType[]
  stats: StudentStats
  loading?: boolean
}

export function LearningProgress({
  progressData,
  stats,
  loading = false,
}: LearningProgressProps) {
  // Prepare chart data for progress visualization
  const chartData = progressData.map((progress) => ({
    name:
      progress.course_title.length > 15
        ? progress.course_title.substring(0, 15) + '...'
        : progress.course_title,
    progress: progress.progress_percentage,
    completed: progress.completed_lessons,
    total: progress.total_lessons,
  }))

  // Calculate weekly progress data (mock data for now)
  const weeklyProgressData = [
    { name: 'Mon', hours: 2.5 },
    { name: 'Tue', hours: 1.8 },
    { name: 'Wed', hours: 3.2 },
    { name: 'Thu', hours: 2.1 },
    { name: 'Fri', hours: 2.8 },
    { name: 'Sat', hours: 4.5 },
    { name: 'Sun', hours: 3.1 },
  ]

  if (loading) {
    return (
      <div className='space-y-6'>
        <DashboardCard
          title='Learning Progress'
          description='Track your course completion and study patterns'
          loading={true}
        >
          <div />
        </DashboardCard>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Progress Overview Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <DashboardCard size='sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>
                Average Progress
              </p>
              <p className='text-2xl font-bold'>
                {Math.round(stats.average_progress)}%
              </p>
              <p className='mt-1 flex items-center gap-1 text-xs text-green-600'>
                <TrendingUp className='h-3 w-3' />
                +5% this week
              </p>
            </div>
            <div className='rounded-full bg-blue-100 p-2'>
              <Target className='h-4 w-4 text-blue-600' />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard size='sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>
                Study Hours
              </p>
              <p className='text-2xl font-bold'>{stats.total_study_hours}h</p>
              <p className='text-muted-foreground mt-1 text-xs'>This month</p>
            </div>
            <div className='rounded-full bg-green-100 p-2'>
              <Clock className='h-4 w-4 text-green-600' />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard size='sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>
                Study Streak
              </p>
              <p className='text-2xl font-bold'>{stats.study_streak_days}</p>
              <p className='text-muted-foreground mt-1 text-xs'>
                days in a row
              </p>
            </div>
            <div className='rounded-full bg-orange-100 p-2'>
              <TrendingUp className='h-4 w-4 text-orange-600' />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard size='sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>
                Active Courses
              </p>
              <p className='text-2xl font-bold'>
                {stats.total_enrollments - stats.completed_courses}
              </p>
              <p className='text-muted-foreground mt-1 text-xs'>in progress</p>
            </div>
            <div className='rounded-full bg-purple-100 p-2'>
              <BookOpen className='h-4 w-4 text-purple-600' />
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Progress Charts */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Course Progress Chart */}
        <ChartWidget
          title='Course Progress'
          description='Progress across your enrolled courses'
          data={chartData}
          type='bar'
          height={300}
          xAxisKey='name'
          yAxisKey='progress'
          dataKeys={['progress']}
          colors={['#3b82f6']}
          emptyMessage='No course progress data available'
        />

        {/* Weekly Study Hours */}
        <ChartWidget
          title='Weekly Study Hours'
          description='Your study time over the past week'
          data={weeklyProgressData}
          type='area'
          height={300}
          xAxisKey='name'
          yAxisKey='hours'
          dataKeys={['hours']}
          colors={['#10b981']}
          emptyMessage='No study time data available'
        />
      </div>

      {/* Detailed Progress List */}
      <DashboardCard
        title='Course Progress Details'
        description='Detailed breakdown of your learning progress'
      >
        {progressData.length === 0 ? (
          <div className='py-8 text-center'>
            <BookOpen className='mx-auto mb-4 h-12 w-12 text-gray-400' />
            <p className='text-gray-500'>No progress data available</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {progressData.map((progress) => (
              <div key={progress.course_id} className='rounded-lg border p-4'>
                <div className='mb-3 flex items-center justify-between'>
                  <h3 className='font-medium'>{progress.course_title}</h3>
                  <span className='text-sm text-gray-500'>
                    {Math.round(progress.progress_percentage)}% complete
                  </span>
                </div>

                <Progress
                  value={progress.progress_percentage}
                  className='mb-3'
                />

                <div className='flex items-center justify-between text-sm text-gray-500'>
                  <span>
                    {progress.completed_lessons} of {progress.total_lessons}{' '}
                    lessons completed
                  </span>
                  <span>
                    Last accessed:{' '}
                    {new Date(progress.last_accessed).toLocaleDateString()}
                  </span>
                </div>

                {progress.estimated_completion && (
                  <div className='mt-2 text-xs text-blue-600'>
                    Estimated completion:{' '}
                    {new Date(
                      progress.estimated_completion
                    ).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </DashboardCard>
    </div>
  )
}
