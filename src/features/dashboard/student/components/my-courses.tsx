import { BookOpen, Clock, Play, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { DashboardCard } from '@/components/dashboard'
import type { Enrollment } from '../types'

interface MyCoursesProps {
  enrollments: Enrollment[]
  loading?: boolean
  onContinueCourse?: (courseId: number) => void
  onViewCertificate?: (courseId: number) => void
}

export function MyCourses({
  enrollments,
  loading = false,
  onContinueCourse,
  onViewCertificate,
}: MyCoursesProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`
    }
    return `${minutes}m`
  }

  if (loading) {
    return (
      <DashboardCard
        title='My Courses'
        description='Your enrolled courses and learning progress'
        loading={true}
      >
        <div />
      </DashboardCard>
    )
  }

  if (enrollments.length === 0) {
    return (
      <DashboardCard
        title='My Courses'
        description='Your enrolled courses and learning progress'
      >
        <div className='py-8 text-center'>
          <BookOpen className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
          <h3 className='mb-2 text-lg font-medium text-foreground'>
            No courses yet
          </h3>
          <p className='mb-4 text-muted-foreground'>
            Start your learning journey by enrolling in your first course.
          </p>
          <Button>Browse Courses</Button>
        </div>
      </DashboardCard>
    )
  }

  return (
    <DashboardCard
      title='My Courses'
      description={`${enrollments.length} enrolled course${enrollments.length !== 1 ? 's' : ''}`}
    >
      <div className='space-y-4'>
        {enrollments.map((enrollment) => (
          <div
            key={enrollment.id}
            className='rounded-lg border p-4 transition-shadow hover:shadow-md'
          >
            <div className='mb-3 flex items-start justify-between'>
              <div className='flex-1'>
                <div className='mb-2 flex items-center gap-2'>
                  <h3 className='text-lg font-semibold'>
                    {enrollment.course.title}
                  </h3>
                  <Badge className={getStatusColor(enrollment.status)}>
                    {enrollment.status}
                  </Badge>
                  {enrollment.course.difficulty_level && (
                    <Badge
                      variant='outline'
                      className={getDifficultyColor(
                        enrollment.course.difficulty_level
                      )}
                    >
                      {enrollment.course.difficulty_level}
                    </Badge>
                  )}
                </div>
                <p className='mb-3 line-clamp-2 text-sm text-muted-foreground'>
                  {enrollment.course.description}
                </p>
                <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-1'>
                    <Clock className='h-4 w-4' />
                    {formatDuration(enrollment.course.duration_minutes)}
                  </div>
                  <div className='flex items-center gap-1'>
                    <BookOpen className='h-4 w-4' />
                    {enrollment.course.enrollment_count} students
                  </div>
                </div>
              </div>
              {enrollment.course.thumbnail_url && (
                <img
                  src={enrollment.course.thumbnail_url}
                  alt={enrollment.course.title}
                  className='ml-4 h-20 w-20 rounded-lg object-cover'
                />
              )}
            </div>

            {/* Progress Bar */}
            <div className='mb-4'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-sm font-medium'>Progress</span>
                <span className='text-sm text-muted-foreground'>
                  {Math.round(enrollment.progress_percentage)}%
                </span>
              </div>
              <Progress
                value={enrollment.progress_percentage}
                className='h-2'
              />
            </div>

            {/* Action Buttons */}
            <div className='flex items-center justify-between'>
              <div className='text-xs text-muted-foreground'>
                Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString()}
              </div>
              <div className='flex gap-2'>
                {enrollment.status === 'completed' ? (
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => onViewCertificate?.(enrollment.course.id)}
                    className='flex items-center gap-1'
                  >
                    <CheckCircle className='h-4 w-4' />
                    View Certificate
                  </Button>
                ) : (
                  <Button
                    size='sm'
                    onClick={() => onContinueCourse?.(enrollment.course.id)}
                    className='flex items-center gap-1'
                  >
                    <Play className='h-4 w-4' />
                    {enrollment.progress_percentage > 0 ? 'Continue' : 'Start'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
